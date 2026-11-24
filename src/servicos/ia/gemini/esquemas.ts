/**
 * Formato fixo das respostas do Gemini (JSON Schema enviado em `responseJsonSchema`).
 *
 * Esquemas simples, sem limites de tamanho: o Gemini recusa esquemas muito complexos.
 * Os limites (número de passos, tamanho dos textos) ficam na validação do app.
 */

type Esquema = Record<string, unknown>;

const texto: Esquema = { type: "string" };
const opcao = (...valores: string[]): Esquema => ({ type: "string", enum: valores });
const objeto = (properties: Record<string, Esquema>, required: string[]): Esquema => ({
  type: "object",
  properties,
  required,
});

/**
 * Assistente: sem esquema. Um esquema com os 13 modelos de ilustração passa do limite
 * de complexidade do Gemini (erro 400 "too many states"). A resposta vem em modo JSON,
 * as regras de cada modelo estão nas instruções (`instrucoes.ts`) e a validação do app
 * (`validacao.ts` e `ilustracao.ts`) confere tudo; ilustração inválida é só descartada.
 */
export const ESQUEMA_ASSISTENTE = null;

export const ESQUEMA_OUTRO_JEITO: Esquema = objeto({ texto }, ["texto"]);

export const ESQUEMA_GOLPE: Esquema = objeto(
  { classificacao: opcao("provavel_golpe", "suspeita", "sem_sinais"), motivo: texto, orientacao: texto },
  ["classificacao", "motivo", "orientacao"],
);
