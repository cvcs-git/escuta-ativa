/** Funções puras de texto usadas em várias partes do app. */

/** Minúsculas e sem acentos: "Câmera" → "camera". Útil para comparar palavras-chave. */
export const normalizar = (texto: string) => texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Junta itens em português: ["a", "b", "c"] → "a, b e c". */
export const juntarComE = (itens: string[]) =>
  itens.length > 1 ? `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}` : (itens[0] ?? "");

/** Corta textos longos para exibição: "mensagem muito longa..." */
export const encurtar = (texto: string, limite: number) =>
  texto.length > limite ? `${texto.slice(0, limite).trimEnd()}...` : texto;

/** Divide um texto em frases, guardando a posição em que cada uma começa. */
export function dividirEmFrases(texto: string) {
  const frases: { texto: string; inicio: number }[] = [];
  for (const m of texto.matchAll(/[^.!?]+[.!?]*["”]?\s*/g)) {
    const trecho = m[0].trim();
    if (trecho) frases.push({ texto: trecho, inicio: (m.index ?? 0) + m[0].indexOf(trecho) });
  }
  return frases.length ? frases : [{ texto, inicio: 0 }];
}
