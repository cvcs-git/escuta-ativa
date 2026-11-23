/**
 * Caso de borda: o usuário cola uma mensagem com senha ou código.
 * Detecta sequências de 4 a 8 dígitos e palavras como "senha" seguidas de valor.
 * O texto nunca é guardado nem enviado quando há dados sensíveis.
 */
export function temDadoSensivel(texto: string): boolean {
  const semEspacosEntreDigitos = texto.replace(/(\d)[\s.-](?=\d)/g, "$1");
  const sequencias = semEspacosEntreDigitos.match(/\d+/g) ?? [];
  if (sequencias.some((s) => s.length >= 4 && s.length <= 8)) return true;
  return /\b(senha|c[oó]digo|token)\s*(é|e|:)?\s*\S+\d/i.test(texto);
}
