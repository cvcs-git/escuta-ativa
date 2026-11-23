/**
 * Reconhecimento de fala (voz para texto) com a Web Speech API.
 * O texto aparece enquanto a pessoa fala, e a escuta encerra sozinha após uma pausa.
 */
import { useCallback, useEffect, useRef, useState } from "react";

const Reconhecedor =
  typeof window !== "undefined" ? (window.SpeechRecognition ?? window.webkitSpeechRecognition) : undefined;

export const reconhecimentoSuportado = Boolean(Reconhecedor);

/** negado: microfone bloqueado; sem_fala: não ouviu nada; outro: falha do navegador. */
export type ErroVoz = "negado" | "sem_fala" | "outro";

export function useReconhecimento() {
  const [ouvindo, setOuvindo] = useState(false);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState<ErroVoz | null>(null);
  const reconhecedor = useRef<ReconhecedorDeFala | null>(null);
  const textoFinal = useRef("");

  const iniciar = useCallback(() => {
    if (!Reconhecedor) return;
    reconhecedor.current?.abort();
    const r = new Reconhecedor();
    r.lang = "pt-BR";
    r.interimResults = true; // mostra o texto enquanto a pessoa fala
    r.continuous = false; // encerra sozinho após uma pausa
    textoFinal.current = "";
    setTexto("");
    setErro(null);

    r.onresult = (evento) => {
      let parcial = "";
      for (let i = evento.resultIndex; i < evento.results.length; i++) {
        const resultado = evento.results[i];
        if (resultado.isFinal) textoFinal.current += resultado[0].transcript;
        else parcial += resultado[0].transcript;
      }
      setTexto((textoFinal.current + parcial).trim());
    };
    r.onerror = (evento) => {
      if (evento.error === "not-allowed" || evento.error === "service-not-allowed") setErro("negado");
      else if (evento.error === "no-speech") setErro("sem_fala");
      else if (evento.error !== "aborted") setErro("outro");
    };
    r.onend = () => setOuvindo(false);

    reconhecedor.current = r;
    try {
      r.start();
      setOuvindo(true);
    } catch {
      setErro("outro");
    }
  }, []);

  const parar = useCallback(() => reconhecedor.current?.stop(), []);

  const cancelar = useCallback(() => {
    reconhecedor.current?.abort();
    setOuvindo(false);
    setTexto("");
  }, []);

  useEffect(() => () => reconhecedor.current?.abort(), []);

  return { iniciar, parar, cancelar, ouvindo, texto, erro, suportado: reconhecimentoSuportado };
}
