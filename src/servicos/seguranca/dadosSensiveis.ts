/**
 * Caso de borda: o usuário cola uma mensagem com senha ou código.
 *
 * Detecta sequências de 4 a 8 dígitos (também separadas por espaço, ponto ou hífen,
 * como "482 913") e expressões como "senha: abc123". Quando há dados sensíveis, a tela
 * mostra um alerta e o texto não é enviado nem guardado.
 */
export function temDadoSensivel(texto: string): boolean {
  const digitosJuntos = texto.replace(/(\d)[\s.-](?=\d)/g, "$1");
  const sequencias = digitosJuntos.match(/\d+/g) ?? [];
  if (sequencias.some((s) => s.length >= 4 && s.length <= 8)) return true;
  return /\b(senha|c[oó]digo|token)\s*(é|e|:)?\s*\S+\d/i.test(texto);
}
