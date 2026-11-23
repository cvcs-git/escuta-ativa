import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePreferencias } from "../contexto/Preferencias";

export const falaSuportada = typeof window !== "undefined" && "speechSynthesis" in window;

/* ---------- Escolha da voz ---------- */

/**
 * Pontua as vozes em português do aparelho. As vozes "neurais" (Microsoft Natural/Online,
 * Google, Apple aprimoradas) soam muito mais naturais que as vozes básicas do sistema.
 */
export function pontuarVoz(v: SpeechSynthesisVoice): number {
  const lang = v.lang.toLowerCase().replace("_", "-");
  if (!lang.startsWith("pt")) return -1;
  const nome = v.name.toLowerCase();
  let pontos = lang === "pt-br" ? 100 : 20;
  if (/natural|neural|online/.test(nome)) pontos += 60;
  if (nome.includes("google")) pontos += 40;
  if (/premium|enhanced|aprimorad|melhorad/.test(nome)) pontos += 35;
  if (/luciana|felipe|francisca|thalita|antonio/.test(nome)) pontos += 10;
  if (/compact|eloquence|espeak/.test(nome)) pontos -= 50;
  return pontos;
}

/** Nome curto e amigável para mostrar em Ajustes. */
export function nomeDaVoz(v: SpeechSynthesisVoice): string {
  return (
    v.name
      .replace(/^Microsoft\s+/i, "")
      .replace(/\s*Online\s*/i, " ")
      .replace(/\s*\(Natural\)\s*/i, "")
      .replace(/\s*[-–]\s*Portuguese.*$/i, "")
      .replace(/português do Brasil/i, "Brasil")
      .replace(/\s+/g, " ")
      .trim() || v.name
  );
}

function useVozesPortugues() {
  const [vozes, setVozes] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (!falaSuportada) return;
    // As vozes carregam depois da página: é preciso esperar o evento "voiceschanged".
    const carregar = () =>
      setVozes(
        window.speechSynthesis
          .getVoices()
          .filter((v) => pontuarVoz(v) >= 0)
          .sort((a, b) => pontuarVoz(b) - pontuarVoz(a)),
      );
    carregar();
    window.speechSynthesis.addEventListener("voiceschanged", carregar);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", carregar);
  }, []);
  return vozes;
}

/* ---------- Contexto de fala ---------- */

type EstadoFala = {
  /** Texto que está sendo lido agora (vazio quando nada é lido). */
  textoFalado: string;
  /** Posição, em caracteres, da palavra que está sendo lida. */
  indice: number;
};

type Contexto = EstadoFala & {
  falar: (texto: string, forcar?: boolean) => void;
  parar: () => void;
  falando: boolean;
  suportada: boolean;
  /** Vozes em português disponíveis, da mais natural para a menos natural. */
  vozes: SpeechSynthesisVoice[];
  vozAtual: SpeechSynthesisVoice | undefined;
};

const FalaContexto = createContext<Contexto | null>(null);

/** Tempo estimado de cada palavra, usado quando a voz do aparelho não informa a posição. */
const duracaoPalavra = (palavra: string, taxa: number) => (140 + palavra.length * 62) / taxa;

/** Divide o texto em frases, guardando onde cada uma começa. */
function dividirEmFrases(texto: string) {
  const frases: { texto: string; inicio: number }[] = [];
  for (const m of texto.matchAll(/[^.!?]+[.!?]*["”]?\s*/g)) {
    const trecho = m[0].trim();
    if (trecho) frases.push({ texto: trecho, inicio: (m.index ?? 0) + m[0].indexOf(trecho) });
  }
  return frases.length ? frases : [{ texto, inicio: 0 }];
}

/**
 * Texto para voz (Web Speech API) com acompanhamento palavra por palavra.
 * O texto é lido frase por frase: as pausas ficam mais naturais e evita-se o corte
 * que algumas vozes fazem em falas longas.
 */
export function FalaProvider({ children }: { children: ReactNode }) {
  const { vozLigada, velocidade, vozId } = usePreferencias();
  const vozes = useVozesPortugues();
  const vozAtual = vozes.find((v) => v.voiceURI === vozId) ?? vozes[0];

  const [estado, setEstado] = useState<EstadoFala>({ textoFalado: "", indice: -1 });
  // Os ajustes ficam em refs: assim falar() não muda a cada ajuste nem quando as vozes
  // terminam de carregar, e as telas não releem o texto sem motivo.
  const ajustes = useRef({ vozLigada, velocidade, vozAtual });
  ajustes.current = { vozLigada, velocidade, vozAtual };
  const temporizadores = useRef<number[]>([]);
  const sessao = useRef(0);

  const limparEstimativa = () => {
    temporizadores.current.forEach(clearTimeout);
    temporizadores.current = [];
  };

  const parar = useCallback(() => {
    sessao.current++;
    limparEstimativa();
    if (falaSuportada) window.speechSynthesis.cancel();
    setEstado({ textoFalado: "", indice: -1 });
  }, []);

  const falar = useCallback(
    (texto: string, forcar = false) => {
      const { vozLigada, velocidade, vozAtual } = ajustes.current;
      if (!falaSuportada || (!vozLigada && !forcar)) return;
      const minhaSessao = ++sessao.current;
      limparEstimativa();
      window.speechSynthesis.cancel();

      const taxa = velocidade === "devagar" ? 0.85 : 1;
      const frases = dividirEmFrases(texto);

      frases.forEach((frase, n) => {
        const fala = new SpeechSynthesisUtterance(frase.texto);
        fala.lang = vozAtual?.lang ?? "pt-BR";
        if (vozAtual) fala.voice = vozAtual;
        fala.rate = taxa;
        fala.pitch = 1;
        let recebeuPosicao = false;

        fala.onstart = () => {
          if (sessao.current !== minhaSessao) return;
          setEstado({ textoFalado: texto, indice: frase.inicio });
          // Plano B: se a voz não informar a posição em 400 ms, estima palavra por palavra.
          temporizadores.current.push(
            window.setTimeout(() => {
              if (recebeuPosicao || sessao.current !== minhaSessao) return;
              let tempo = 0;
              for (const m of frase.texto.matchAll(/\S+/g)) {
                const indice = frase.inicio + (m.index ?? 0);
                temporizadores.current.push(
                  window.setTimeout(() => sessao.current === minhaSessao && setEstado({ textoFalado: texto, indice }), tempo),
                );
                tempo += duracaoPalavra(m[0], taxa);
              }
            }, 400),
          );
        };
        fala.onboundary = (e) => {
          if ((e.name && e.name !== "word") || sessao.current !== minhaSessao) return;
          recebeuPosicao = true;
          limparEstimativa();
          setEstado({ textoFalado: texto, indice: frase.inicio + e.charIndex });
        };
        fala.onend = () => {
          limparEstimativa();
          if (n === frases.length - 1 && sessao.current === minhaSessao) setEstado({ textoFalado: "", indice: -1 });
        };
        fala.onerror = () => {
          limparEstimativa();
          if (sessao.current === minhaSessao) setEstado({ textoFalado: "", indice: -1 });
        };
        window.speechSynthesis.speak(fala);
      });
    },
    [],
  );

  useEffect(() => parar, [parar]);

  return (
    <FalaContexto.Provider
      value={{ ...estado, falar, parar, falando: estado.textoFalado !== "", suportada: falaSuportada, vozes, vozAtual }}
    >
      {children}
    </FalaContexto.Provider>
  );
}

export function useFala() {
  const ctx = useContext(FalaContexto);
  if (!ctx) throw new Error("useFala fora do FalaProvider");
  return ctx;
}

/**
 * Lê um texto em voz assim que a tela (ou etapa) aparece, se a leitura estiver ligada.
 * Passe null para não ler. A pequena espera deixa a troca de tela terminar antes.
 */
export function useLerAoAbrir(texto: string | null) {
  const { falar } = useFala();
  useEffect(() => {
    if (!texto) return;
    const id = window.setTimeout(() => falar(texto), 350);
    return () => clearTimeout(id);
  }, [texto, falar]);
}
