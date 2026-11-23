import { useCallback, useEffect, useRef, useState } from "react";

/* Tipos mínimos: a API ainda não faz parte dos tipos padrão do TypeScript. */
type Resultado = { isFinal: boolean; 0: { transcript: string } };
type EventoResultado = { resultIndex: number; results: ArrayLike<Resultado> };
type Reconhecedor = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: EventoResultado) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

const Construtor: (new () => Reconhecedor) | undefined =
  typeof window !== "undefined"
    ? ((window as unknown as Record<string, unknown>).SpeechRecognition ??
        (window as unknown as Record<string, unknown>).webkitSpeechRecognition) as (new () => Reconhecedor) | undefined
    : undefined;

export const reconhecimentoSuportado = Boolean(Construtor);

export type ErroVoz = "negado" | "sem_fala" | "outro";

/** Voz para texto (Web Speech API). O texto aparece enquanto a pessoa fala. */
export function useReconhecimento() {
  const [ouvindo, setOuvindo] = useState(false);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState<ErroVoz | null>(null);
  const ref = useRef<Reconhecedor | null>(null);
  const finalRef = useRef("");

  const iniciar = useCallback(() => {
    if (!Construtor) return;
    ref.current?.abort();
    const r = new Construtor();
    r.lang = "pt-BR";
    r.interimResults = true;
    r.continuous = false; // encerra sozinho após uma pausa na fala
    finalRef.current = "";
    setTexto("");
    setErro(null);
    r.onresult = (e) => {
      let parcial = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalRef.current += res[0].transcript;
        else parcial += res[0].transcript;
      }
      setTexto((finalRef.current + parcial).trim());
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setErro("negado");
      else if (e.error === "no-speech") setErro("sem_fala");
      else if (e.error !== "aborted") setErro("outro");
    };
    r.onend = () => setOuvindo(false);
    ref.current = r;
    try {
      r.start();
      setOuvindo(true);
    } catch {
      setErro("outro");
    }
  }, []);

  const parar = useCallback(() => ref.current?.stop(), []);
  const cancelar = useCallback(() => {
    ref.current?.abort();
    setOuvindo(false);
    setTexto("");
  }, []);

  useEffect(() => () => ref.current?.abort(), []);
  return { iniciar, parar, cancelar, ouvindo, texto, setTexto, erro, suportado: reconhecimentoSuportado };
}
