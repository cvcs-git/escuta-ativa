/**
 * Auxiliares das ilustrações (sem componentes): tipos de ícone, cores dos apps e
 * funções de texto. Ficam separados de pecas.tsx para manter aquele arquivo só com
 * componentes de desenho.
 */

export type Glifo = "engrenagem" | "camera" | "balao" | "telefone" | "banco" | "galeria";

export const CORES_APP: Record<Glifo, string> = {
  engrenagem: "#5f6b73",
  camera: "#4a4a4a",
  balao: "#2e7d32",
  telefone: "#1565c0",
  banco: "#6a1b9a",
  galeria: "#c2185b",
};

export const CORES_LETRA = ["#00796b", "#5d4037", "#455a64", "#ad1457", "#283593", "#ef6c00"];

/** Corta textos que não cabem no desenho: "Configurações do sistema" → "Configurações do…". */
/**
 * Abrevia textos que não cabem no desenho, cortando no fim de uma palavra quando dá:
 * "Enviar localização atual" (limite 20) → "Enviar localização…".
 */
export function curto(texto: string, limite: number) {
  const limpo = texto.trim();
  if (limpo.length <= limite) return limpo;
  const corte = limpo.slice(0, limite - 1);
  const ultimoEspaco = corte.lastIndexOf(" ");
  let base = ultimoEspaco >= limite / 2 ? corte.slice(0, ultimoEspaco) : corte;
  // Não termina em palavra de ligação: "Conexões e…" vira "Conexões…".
  base = base.replace(/(\s+(e|de|da|do|das|dos|a|o|com|em|no|na|para))+$/i, "");
  return `${base.replace(/[\s,.;:–-]+$/, "")}…`;
}

/** Reconhece apps comuns pelo nome; os demais ganham a inicial do nome (sem desenhar logos de marcas). */
export function glifoDoApp(nome: string): Glifo | null {
  const n = nome.toLowerCase();
  if (/config|ajuste/.test(n)) return "engrenagem";
  if (/câmera|camera/.test(n)) return "camera";
  if (/mensage|whats|conversa/.test(n)) return "balao";
  if (/telefone|ligaç/.test(n)) return "telefone";
  if (/banco/.test(n)) return "banco";
  if (/galeria|foto/.test(n)) return "galeria";
  return null;
}
