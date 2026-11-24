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

/** Sequências de 4 ou mais dígitos, mesmo separadas por espaço, ponto, barra ou hífen (CPF, cartão, conta, códigos). */
const NUMEROS_LONGOS = /\d(?:[\s./-]?\d){3,}/g;
/**
 * Valor de senha ou código: depois de "é" ou ":" ("senha: banana") ou qualquer palavra com
 * número ("senha abc123"). Assim "Qual o código do banco?" continua intacto.
 */
const VALOR_DE_SENHA = /\b(senha|c[oó]digo|token|pin)(\s*(?:é|:)\s*[^\s,.;!?]+|\s+[^\s,.;!?]*\d[^\s,.;!?]*)/gi;

/**
 * Proteção extra antes de qualquer envio à IA: troca números longos e valores de
 * senha por "••••". A pergunta continua compreensível ("Como faço um Pix de •••• reais?"),
 * mas CPF, cartão, conta, senha ou código nunca saem do aparelho.
 */
export function mascararDadosSensiveis(texto: string): string {
  return texto
    .replace(NUMEROS_LONGOS, "••••")
    .replace(
      VALOR_DE_SENHA,
      (_, palavra: string, resto: string) => `${palavra}${resto.match(/^\s*(?:é|:)?\s*/)?.[0] ?? " "}••••`,
    );
}
