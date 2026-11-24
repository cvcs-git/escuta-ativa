/**
 * Formato fixo das respostas do Gemini (JSON Schema enviado em `responseJsonSchema`).
 *
 * O esquema faz o modelo devolver sempre JSON com estes campos. Mesmo assim, toda
 * resposta passa depois pela validação do app (`validacao.ts` e `ilustracao.ts`),
 * que confere os limites de tamanho e a coerência das ilustrações.
 */
import { MAX_PASSOS } from "../validacao";

type Esquema = Record<string, unknown>;

const texto: Esquema = { type: "string" };
const logico: Esquema = { type: "boolean" };
const inteiro: Esquema = { type: "integer" };
const textos = (min: number, max: number): Esquema => ({ type: "array", items: texto, minItems: min, maxItems: max });
const opcao = (...valores: string[]): Esquema => ({ type: "string", enum: valores });
const objeto = (properties: Record<string, Esquema>, required: string[]): Esquema => ({
  type: "object",
  properties,
  required,
});

/** Um esquema para cada um dos 13 modelos de ilustração (espelha `ilustracao.ts`). */
const MODELOS: Esquema[] = [
  objeto({ modelo: opcao("apps"), apps: textos(2, 6), alvo: inteiro }, ["modelo", "apps", "alvo"]),
  objeto({ modelo: opcao("lista"), titulo: texto, itens: textos(2, 5), alvo: inteiro }, [
    "modelo",
    "titulo",
    "itens",
    "alvo",
  ]),
  objeto({ modelo: opcao("menu"), titulo: texto, itens: textos(2, 5), alvo: inteiro }, [
    "modelo",
    "titulo",
    "itens",
    "alvo",
  ]),
  objeto({ modelo: opcao("chave"), titulo: texto, rotulo: texto, outros: textos(0, 3), ligar: logico }, [
    "modelo",
    "titulo",
    "rotulo",
  ]),
  objeto({ modelo: opcao("barra"), titulo: texto, rotulo: texto, direcao: opcao("direita", "esquerda") }, [
    "modelo",
    "titulo",
    "rotulo",
  ]),
  objeto({ modelo: opcao("botoes"), titulo: texto, texto, botoes: textos(1, 3), alvo: inteiro }, [
    "modelo",
    "titulo",
    "texto",
    "botoes",
    "alvo",
  ]),
  objeto(
    {
      modelo: opcao("campo"),
      titulo: texto,
      campos: {
        type: "array",
        items: objeto({ rotulo: texto, exemplo: texto }, ["rotulo", "exemplo"]),
        minItems: 1,
        maxItems: 3,
      },
      alvo: inteiro,
      confirmar: texto,
    },
    ["modelo", "titulo", "campos"],
  ),
  objeto(
    { modelo: opcao("gesto"), gesto: opcao("deslizar_baixo", "deslizar_cima", "segurar"), sobre: opcao("app", "foto") },
    ["modelo", "gesto"],
  ),
  objeto(
    {
      modelo: opcao("conversa"),
      contato: texto,
      baloes: {
        type: "array",
        items: objeto({ de: opcao("eu", "outro"), tipo: opcao("texto", "audio"), texto }, ["de", "tipo"]),
        maxItems: 3,
      },
      alvo: { anyOf: [opcao("microfone", "clipe", "camera", "emoji"), inteiro] },
      segurar: logico,
    },
    ["modelo", "contato", "alvo"],
  ),
  objeto(
    {
      modelo: opcao("chamada"),
      contato: texto,
      tipo: opcao("recebida", "andamento"),
      video: logico,
      alvo: opcao("atender", "recusar", "mudo", "viva_voz", "desligar"),
    },
    ["modelo", "contato", "tipo", "alvo"],
  ),
  objeto(
    { modelo: opcao("camera"), modo: opcao("foto", "qrcode", "codigo_barras"), alvo: opcao("disparar", "virar") },
    ["modelo", "modo"],
  ),
  objeto({ modelo: opcao("teclado"), texto, alvo: texto, segurar: logico, opcoes: textos(0, 5) }, [
    "modelo",
    "texto",
    "alvo",
  ]),
  objeto(
    {
      modelo: opcao("aparelho"),
      botoes: { type: "array", items: opcao("ligar", "volume_mais", "volume_menos"), minItems: 1, maxItems: 2 },
      juntos: logico,
      segundos: inteiro,
    },
    ["modelo", "botoes"],
  ),
];

export const ESQUEMA_ASSISTENTE: Esquema = objeto(
  {
    dentroDoEscopo: logico,
    mensagem: texto,
    passos: {
      type: "array",
      maxItems: MAX_PASSOS,
      items: objeto({ texto, ilustracao: { anyOf: MODELOS } }, ["texto"]),
    },
    dica: texto,
  },
  ["dentroDoEscopo"],
);

export const ESQUEMA_OUTRO_JEITO: Esquema = objeto({ texto }, ["texto"]);

export const ESQUEMA_GOLPE: Esquema = objeto(
  { classificacao: opcao("provavel_golpe", "suspeita", "sem_sinais"), motivo: texto, orientacao: texto },
  ["classificacao", "motivo", "orientacao"],
);

/** Número de modelos no esquema; o teste confere que bate com o catálogo do app. */
export const TOTAL_DE_MODELOS = MODELOS.length;
