/**
 * Escolha da voz de leitura.
 *
 * O app não tem voz própria: usa as vozes instaladas no aparelho ou no navegador.
 * As vozes "neurais" (Microsoft Natural/Online, Google, Apple aprimoradas) soam muito
 * mais naturais que as básicas, por isso recebem mais pontos.
 */
import { useEffect, useState } from "react";

export const falaSuportada = typeof window !== "undefined" && "speechSynthesis" in window;

type VozComNome = Pick<SpeechSynthesisVoice, "name" | "lang">;

/** Pontua uma voz: -1 se não for português; quanto maior, mais natural. */
export function pontuarVoz(voz: VozComNome): number {
  const idioma = voz.lang.toLowerCase().replace("_", "-");
  if (!idioma.startsWith("pt")) return -1;
  const nome = voz.name.toLowerCase();
  let pontos = idioma === "pt-br" ? 100 : 20;
  if (/natural|neural|online/.test(nome)) pontos += 60;
  if (nome.includes("google")) pontos += 40;
  if (/premium|enhanced|aprimorad|melhorad/.test(nome)) pontos += 35;
  if (/luciana|felipe|francisca|thalita|antonio/.test(nome)) pontos += 10;
  if (/compact|eloquence|espeak/.test(nome)) pontos -= 50;
  return pontos;
}

/** Nome curto e amigável para mostrar em Ajustes: "Microsoft Francisca Online (Natural)..." → "Francisca". */
export function nomeDaVoz(voz: VozComNome): string {
  const curto = voz.name
    .replace(/^Microsoft\s+/i, "")
    .replace(/\s*Online\s*/i, " ")
    .replace(/\s*\(Natural\)\s*/i, "")
    .replace(/\s*[-–]\s*Portuguese.*$/i, "")
    .replace(/português do Brasil/i, "Brasil")
    .replace(/\s+/g, " ")
    .trim();
  return curto || voz.name;
}

/** Vozes em português do aparelho, da mais natural para a menos natural. */
export function useVozesPortugues() {
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
