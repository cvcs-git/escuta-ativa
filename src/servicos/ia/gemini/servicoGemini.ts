/**
 * Serviço de IA com o Gemini.
 *
 * Esta parte não conhece o Firebase: recebe uma função `gerar` que manda instrução,
 * esquema e texto ao modelo e devolve o JSON em texto. Assim a lógica (montar o
 * pedido, interpretar a resposta, converter erros) é testada sem rede, e a conexão
 * real fica isolada em `conexaoFirebase.ts`.
 */
import { ErroIA, type ServicoIA } from "../contrato";
import { validarAssistente, validarGolpe } from "../validacao";
import { ESQUEMA_ASSISTENTE, ESQUEMA_GOLPE, ESQUEMA_OUTRO_JEITO } from "./esquemas";
import {
  INSTRUCAO_ASSISTENTE,
  INSTRUCAO_GOLPE,
  INSTRUCAO_OUTRO_JEITO,
  mensagemParaAnalise,
  pedidoOutroJeito,
} from "./instrucoes";

export type PedidoGemini = {
  instrucao: string;
  esquema: Record<string, unknown>;
  texto: string;
};

/** Envia o pedido ao modelo e devolve o texto da resposta (JSON). */
export type GerarJSON = (pedido: PedidoGemini, sinal: AbortSignal) => Promise<string>;

const MAX_PALAVRAS_OUTRO_JEITO = 45;

/**
 * Converte falhas da rede ou do Firebase nos tipos de erro que o app sabe mostrar.
 * Cancelamentos passam adiante: `chamarIA` já os trata como tempo esgotado.
 */
export function converterErro(erro: unknown): unknown {
  if (erro instanceof ErroIA) return erro;
  if (erro instanceof DOMException && erro.name === "AbortError") return erro;
  const dados = erro as { customErrorData?: { status?: number }; message?: string } | null;
  const status = dados?.customErrorData?.status;
  const mensagem = dados?.message ?? "";
  if (status === 429 || /429|RESOURCE_EXHAUSTED|quota/i.test(mensagem)) return new ErroIA("limite");
  return new ErroIA("indisponivel");
}

/** Lê o JSON devolvido pelo modelo; texto fora do formato vira erro de formato. */
export function lerJSON(texto: string): unknown {
  try {
    return JSON.parse(texto);
  } catch {
    throw new ErroIA("formato");
  }
}

export function criarServicoGemini(gerar: GerarJSON): ServicoIA {
  const pedir = async (pedido: PedidoGemini, sinal: AbortSignal) => {
    try {
      return lerJSON(await gerar(pedido, sinal));
    } catch (erro) {
      throw converterErro(erro);
    }
  };

  return {
    async perguntar(pergunta, sinal) {
      const dado = await pedir(
        { instrucao: INSTRUCAO_ASSISTENTE, esquema: ESQUEMA_ASSISTENTE, texto: pergunta },
        sinal,
      );
      return validarAssistente(dado);
    },

    async explicarDeOutroJeito(pergunta, passo, sinal) {
      const dado = await pedir(
        { instrucao: INSTRUCAO_OUTRO_JEITO, esquema: ESQUEMA_OUTRO_JEITO, texto: pedidoOutroJeito(pergunta, passo) },
        sinal,
      );
      const texto = (dado as { texto?: unknown } | null)?.texto;
      const valido =
        typeof texto === "string" &&
        texto.trim().length > 0 &&
        texto.trim().split(/\s+/).length <= MAX_PALAVRAS_OUTRO_JEITO;
      if (!valido) throw new ErroIA("formato");
      return texto.trim();
    },

    async verificarGolpe(mensagem, sinal) {
      const dado = await pedir(
        { instrucao: INSTRUCAO_GOLPE, esquema: ESQUEMA_GOLPE, texto: mensagemParaAnalise(mensagem) },
        sinal,
      );
      return validarGolpe(dado);
    },
  };
}
