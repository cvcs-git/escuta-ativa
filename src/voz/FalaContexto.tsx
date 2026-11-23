import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePreferencias } from "../contexto/Preferencias";

export const falaSuportada = typeof window !== "undefined" && "speechSynthesis" in window;

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
};

const FalaContexto = createContext<Contexto | null>(null);

/** Tempo estimado de cada palavra, usado quando a voz do aparelho não informa a posição. */
const duracaoPalavra = (palavra: string, taxa: number) => (140 + palavra.length * 62) / taxa;

/**
 * Texto para voz (Web Speech API) com acompanhamento palavra por palavra.
 * O navegador informa qual palavra está sendo lida (evento "boundary"). Algumas vozes
 * não informam; nesse caso, a posição é estimada pela duração de cada palavra.
 */
export function FalaProvider({ children }: { children: ReactNode }) {
  const { vozLigada, velocidade } = usePreferencias();
  const [estado, setEstado] = useState<EstadoFala>({ textoFalado: "", indice: -1 });
  const estimativa = useRef<number[]>([]);
  const recebeuPosicao = useRef(false);

  const limparEstimativa = () => {
    estimativa.current.forEach(clearTimeout);
    estimativa.current = [];
  };

  const parar = useCallback(() => {
    limparEstimativa();
    if (falaSuportada) window.speechSynthesis.cancel();
    setEstado({ textoFalado: "", indice: -1 });
  }, []);

  const falar = useCallback(
    (texto: string, forcar = false) => {
      if (!falaSuportada || (!vozLigada && !forcar)) return;
      limparEstimativa();
      window.speechSynthesis.cancel();

      const taxa = velocidade === "devagar" ? 0.8 : 1;
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = "pt-BR";
      fala.rate = taxa;
      const vozBR = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("pt"));
      if (vozBR) fala.voice = vozBR;
      recebeuPosicao.current = false;

      fala.onstart = () => {
        setEstado({ textoFalado: texto, indice: 0 });
        // Plano B: se a voz não informar a posição em 400 ms, estima palavra por palavra.
        estimativa.current.push(
          window.setTimeout(() => {
            if (recebeuPosicao.current) return;
            let tempo = 0;
            for (const m of texto.matchAll(/\S+/g)) {
              const indice = m.index ?? 0;
              estimativa.current.push(window.setTimeout(() => setEstado({ textoFalado: texto, indice }), tempo));
              tempo += duracaoPalavra(m[0], taxa);
            }
          }, 400),
        );
      };
      fala.onboundary = (e) => {
        if (e.name && e.name !== "word") return;
        recebeuPosicao.current = true;
        limparEstimativa();
        setEstado({ textoFalado: texto, indice: e.charIndex });
      };
      const terminar = () => {
        limparEstimativa();
        setEstado((atual) => (atual.textoFalado === texto ? { textoFalado: "", indice: -1 } : atual));
      };
      fala.onend = terminar;
      fala.onerror = terminar;
      window.speechSynthesis.speak(fala);
    },
    [vozLigada, velocidade],
  );

  useEffect(() => parar, [parar]);

  return (
    <FalaContexto.Provider value={{ ...estado, falar, parar, falando: estado.textoFalado !== "", suportada: falaSuportada }}>
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
