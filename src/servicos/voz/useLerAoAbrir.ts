import { useEffect } from "react";
import { useFala } from "./FalaProvider";

/** Espera para a troca de tela terminar antes de começar a ler. */
const ESPERA_ABERTURA_MS = 350;

/**
 * Lê um texto em voz assim que a tela (ou uma etapa dela) aparece, se a leitura
 * estiver ligada. Passe `null` para não ler nada.
 */
export function useLerAoAbrir(texto: string | null) {
  const { falar } = useFala();
  useEffect(() => {
    if (!texto) return;
    const id = window.setTimeout(() => falar(texto), ESPERA_ABERTURA_MS);
    return () => clearTimeout(id);
  }, [texto, falar]);
}
