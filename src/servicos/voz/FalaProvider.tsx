/**
 * Leitura em voz alta (texto para voz) com acompanhamento palavra por palavra.
 *
 * - O texto é lido frase por frase: as pausas ficam naturais e evita-se o corte que
 *   algumas vozes do Google fazem em falas longas.
 * - O navegador informa qual palavra está sendo lida (evento "boundary"). Algumas vozes
 *   não informam; nesse caso, a posição é estimada pela duração de cada palavra.
 * - O estado (`textoFalado` e `indice`) alimenta o <TextoLido>, que destaca a palavra.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePreferencias } from "@/compartilhado/preferencias/PreferenciasProvider";
import { dividirEmFrases } from "@/compartilhado/utilitarios/texto";
import { falaSuportada, useVozesPortugues } from "./escolhaDeVoz";

type EstadoFala = {
  /** Texto que está sendo lido agora (vazio quando nada é lido). */
  textoFalado: string;
  /** Posição, em caracteres, da palavra que está sendo lida. */
  indice: number;
};

type ContextoFala = EstadoFala & {
  /** Lê um texto. `forcar` lê mesmo com a leitura desligada (ex.: "Ouvir de novo"). */
  falar: (texto: string, forcar?: boolean) => void;
  parar: () => void;
  falando: boolean;
  suportada: boolean;
  /** Vozes em português disponíveis, da mais natural para a menos natural. */
  vozes: SpeechSynthesisVoice[];
  vozAtual: SpeechSynthesisVoice | undefined;
};

const FalaContexto = createContext<ContextoFala | null>(null);
const SEM_FALA: EstadoFala = { textoFalado: "", indice: -1 };
const ESPERA_POSICAO_MS = 400;

/** Tempo estimado de cada palavra, usado quando a voz do aparelho não informa a posição. */
const duracaoPalavra = (palavra: string, taxa: number) => (140 + palavra.length * 62) / taxa;

export function FalaProvider({ children }: { children: ReactNode }) {
  const { vozLigada, velocidade, vozId } = usePreferencias();
  const vozes = useVozesPortugues();
  const vozAtual = vozes.find((v) => v.voiceURI === vozId) ?? vozes[0];

  const [estado, setEstado] = useState<EstadoFala>(SEM_FALA);
  const temporizadores = useRef<number[]>([]);
  /** Cada fala tem um número; eventos de falas antigas (já canceladas) são ignorados. */
  const sessao = useRef(0);

  // Os ajustes ficam numa ref: assim `falar` não muda a cada ajuste nem quando as vozes
  // terminam de carregar, e as telas não releem o texto sem motivo.
  const ajustes = useRef({ vozLigada, velocidade, vozAtual });
  useEffect(() => {
    ajustes.current = { vozLigada, velocidade, vozAtual };
  }, [vozLigada, velocidade, vozAtual]);

  const limparEstimativa = () => {
    temporizadores.current.forEach(clearTimeout);
    temporizadores.current = [];
  };

  const parar = useCallback(() => {
    sessao.current++;
    limparEstimativa();
    if (falaSuportada) window.speechSynthesis.cancel();
    setEstado(SEM_FALA);
  }, []);

  const falar = useCallback((texto: string, forcar = false) => {
    const { vozLigada, velocidade, vozAtual } = ajustes.current;
    if (!falaSuportada || (!vozLigada && !forcar)) return;

    const minhaSessao = ++sessao.current;
    const ativa = () => sessao.current === minhaSessao;
    limparEstimativa();
    window.speechSynthesis.cancel();

    const taxa = velocidade === "devagar" ? 0.85 : 1;
    const frases = dividirEmFrases(texto);

    frases.forEach((frase, n) => {
      const fala = new SpeechSynthesisUtterance(frase.texto);
      fala.lang = vozAtual?.lang ?? "pt-BR";
      if (vozAtual) fala.voice = vozAtual;
      fala.rate = taxa;
      let recebeuPosicao = false;

      fala.onstart = () => {
        if (!ativa()) return;
        setEstado({ textoFalado: texto, indice: frase.inicio });
        // Plano B: se a voz não informar a posição a tempo, estima palavra por palavra.
        const id = window.setTimeout(() => {
          if (recebeuPosicao || !ativa()) return;
          let tempo = 0;
          for (const m of frase.texto.matchAll(/\S+/g)) {
            const indice = frase.inicio + (m.index ?? 0);
            temporizadores.current.push(
              window.setTimeout(() => ativa() && setEstado({ textoFalado: texto, indice }), tempo),
            );
            tempo += duracaoPalavra(m[0], taxa);
          }
        }, ESPERA_POSICAO_MS);
        temporizadores.current.push(id);
      };
      fala.onboundary = (evento) => {
        if ((evento.name && evento.name !== "word") || !ativa()) return;
        recebeuPosicao = true;
        limparEstimativa();
        setEstado({ textoFalado: texto, indice: frase.inicio + evento.charIndex });
      };
      fala.onend = () => {
        limparEstimativa();
        if (n === frases.length - 1 && ativa()) setEstado(SEM_FALA);
      };
      fala.onerror = () => {
        limparEstimativa();
        if (ativa()) setEstado(SEM_FALA);
      };
      window.speechSynthesis.speak(fala);
    });
  }, []);

  useEffect(() => parar, [parar]);

  const valor = useMemo<ContextoFala>(
    () => ({ ...estado, falar, parar, falando: estado.textoFalado !== "", suportada: falaSuportada, vozes, vozAtual }),
    [estado, falar, parar, vozes, vozAtual],
  );
  return <FalaContexto.Provider value={valor}>{children}</FalaContexto.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFala() {
  const contexto = useContext(FalaContexto);
  if (!contexto) throw new Error("useFala precisa estar dentro de <FalaProvider>.");
  return contexto;
}
