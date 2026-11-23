/**
 * Validação das respostas da IA (caso de borda: resposta fora do formato).
 *
 * Toda resposta passa por aqui antes de chegar à tela. Se algo estiver fora do
 * combinado, a resposta é descartada com `ErroIA("formato")` e o app mostra o
 * estado de erro, em vez de exibir um conteúdo imprevisível para a pessoa idosa.
 */
import { ErroIA, type Classificacao, type RespostaAssistente, type RespostaGolpe } from "./contrato";

export const MAX_PASSOS = 5;
export const MAX_PALAVRAS_POR_PASSO = 20;

const CLASSIFICACOES: readonly Classificacao[] = ["provavel_golpe", "suspeita", "sem_sinais"];

const ehTexto = (valor: unknown): valor is string => typeof valor === "string" && valor.trim().length > 0;
const contarPalavras = (texto: string) => texto.trim().split(/\s+/).filter(Boolean).length;
const ehObjeto = (valor: unknown): valor is Record<string, unknown> => typeof valor === "object" && valor !== null;

export function validarAssistente(dado: unknown): RespostaAssistente {
  if (!ehObjeto(dado) || typeof dado.dentroDoEscopo !== "boolean") throw new ErroIA("formato");

  if (dado.dentroDoEscopo === false) {
    if (!ehTexto(dado.mensagem)) throw new ErroIA("formato");
    return { dentroDoEscopo: false, mensagem: dado.mensagem };
  }

  const { passos } = dado;
  const passosValidos =
    Array.isArray(passos) &&
    passos.length > 0 &&
    passos.length <= MAX_PASSOS &&
    passos.every((p) => ehTexto(p) && contarPalavras(p) <= MAX_PALAVRAS_POR_PASSO);
  if (!passosValidos) throw new ErroIA("formato");

  return { dentroDoEscopo: true, passos: passos as string[], dica: ehTexto(dado.dica) ? dado.dica : undefined };
}

export function validarGolpe(dado: unknown): RespostaGolpe {
  if (!ehObjeto(dado)) throw new ErroIA("formato");
  if (!CLASSIFICACOES.includes(dado.classificacao as Classificacao)) throw new ErroIA("formato");
  if (!ehTexto(dado.motivo) || !ehTexto(dado.orientacao)) throw new ErroIA("formato");
  return { classificacao: dado.classificacao as Classificacao, motivo: dado.motivo, orientacao: dado.orientacao };
}
