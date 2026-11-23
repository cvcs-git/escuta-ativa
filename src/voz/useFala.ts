import { useCallback, useEffect, useState } from "react";
import { usePreferencias } from "../contexto/Preferencias";

export const falaSuportada = typeof window !== "undefined" && "speechSynthesis" in window;

/** Texto para voz (Web Speech API). Respeita os ajustes de voz e velocidade. */
export function useFala() {
  const { vozLigada, velocidade } = usePreferencias();
  const [falando, setFalando] = useState(false);

  const parar = useCallback(() => {
    if (!falaSuportada) return;
    window.speechSynthesis.cancel();
    setFalando(false);
  }, []);

  const falar = useCallback(
    (texto: string, forcar = false) => {
      if (!falaSuportada || (!vozLigada && !forcar)) return;
      window.speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = "pt-BR";
      fala.rate = velocidade === "devagar" ? 0.8 : 1;
      const vozBR = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("pt"));
      if (vozBR) fala.voice = vozBR;
      fala.onstart = () => setFalando(true);
      fala.onend = () => setFalando(false);
      fala.onerror = () => setFalando(false);
      window.speechSynthesis.speak(fala);
    },
    [vozLigada, velocidade],
  );

  useEffect(() => parar, [parar]);
  return { falar, parar, falando, suportada: falaSuportada };
}
