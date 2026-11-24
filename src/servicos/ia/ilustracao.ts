/**
 * Ilustrações das respostas do assistente.
 *
 * A IA nunca desenha: ela escolhe um dos 13 modelos de tela e preenche os campos.
 * O app valida a descrição e desenha com as mesmas peças das lições.
 *
 * Regra de ouro: na dúvida, nenhuma imagem. Se a descrição vier fora do formato,
 * com um alvo inexistente ou sem relação com o texto do passo, o passo aparece só
 * com o texto, e a resposta continua valendo.
 */
import { normalizar } from "@/compartilhado/utilitarios/texto";

/* ---------- Modelos ---------- */

export type AlvoConversa = "microfone" | "clipe" | "camera" | "emoji";
export type BalaoConversa = { de: "eu" | "outro"; tipo: "texto" | "audio"; texto?: string };
export type CampoDeTexto = { rotulo: string; exemplo: string };
export type BotaoDoAparelho = "ligar" | "volume_mais" | "volume_menos";
export type Gesto = "deslizar_baixo" | "deslizar_cima" | "segurar";
export type AlvoChamada = "atender" | "recusar" | "mudo" | "viva_voz" | "desligar";
export type AlvoTeclado = "microfone" | "apagar" | "enviar" | string;

export type EspecIlustracao =
  | { modelo: "apps"; apps: string[]; alvo: number }
  | { modelo: "lista"; titulo: string; itens: string[]; alvo: number }
  | { modelo: "menu"; titulo: string; itens: string[]; alvo: number }
  | { modelo: "chave"; titulo: string; rotulo: string; outros: string[]; ligar: boolean }
  | { modelo: "barra"; titulo: string; rotulo: string; direcao: "direita" | "esquerda" }
  | { modelo: "botoes"; titulo: string; texto: string; botoes: string[]; alvo: number }
  | { modelo: "campo"; titulo: string; campos: CampoDeTexto[]; alvo: number; confirmar?: string }
  | { modelo: "gesto"; gesto: Gesto; sobre: "app" | "foto" }
  | { modelo: "conversa"; contato: string; baloes: BalaoConversa[]; alvo: AlvoConversa | number; segurar: boolean }
  | { modelo: "chamada"; contato: string; tipo: "recebida" | "andamento"; video: boolean; alvo: AlvoChamada }
  | { modelo: "camera"; modo: "foto" | "qrcode" | "codigo_barras"; alvo?: "disparar" | "virar" }
  | { modelo: "teclado"; texto: string; alvo: AlvoTeclado; segurar: boolean; opcoes: string[] }
  | { modelo: "aparelho"; botoes: BotaoDoAparelho[]; juntos: boolean; segundos?: number };

export type ModeloIlustracao = EspecIlustracao["modelo"];

/* ---------- Limites (para o texto caber no desenho) ---------- */

const LIMITE = { titulo: 24, item: 22, app: 14, texto: 90, contato: 18, botao: 16, exemplo: 26 } as const;

/* ---------- Leitura segura de campos ---------- */

type Dado = Record<string, unknown>;
const ehObjeto = (v: unknown): v is Dado => typeof v === "object" && v !== null && !Array.isArray(v);
const texto = (v: unknown, limite: number): string | null =>
  typeof v === "string" && v.trim() && v.trim().length <= limite ? v.trim() : null;
const lista = (v: unknown, min: number, max: number, limite: number): string[] | null => {
  if (!Array.isArray(v) || v.length < min || v.length > max) return null;
  const itens = v.map((item) => texto(item, limite));
  return itens.every((item): item is string => item !== null) ? itens : null;
};
const indice = (v: unknown, tamanho: number): number | null =>
  Number.isInteger(v) && (v as number) >= 0 && (v as number) < tamanho ? (v as number) : null;
const umDe = <T extends string>(v: unknown, opcoes: readonly T[]): T | null =>
  opcoes.includes(v as T) ? (v as T) : null;

/* ---------- Validação de cada modelo ---------- */

type Validador = (d: Dado) => EspecIlustracao | null;

const VALIDADORES: Record<ModeloIlustracao, Validador> = {
  apps(d) {
    const apps = lista(d.apps, 2, 6, LIMITE.app);
    const alvo = apps && indice(d.alvo, apps.length);
    return apps && alvo !== null ? { modelo: "apps", apps, alvo } : null;
  },
  lista(d) {
    const titulo = texto(d.titulo, LIMITE.titulo);
    const itens = lista(d.itens, 2, 5, LIMITE.item);
    const alvo = itens && indice(d.alvo, itens.length);
    return titulo && itens && alvo !== null ? { modelo: "lista", titulo, itens, alvo } : null;
  },
  menu(d) {
    const titulo = texto(d.titulo, LIMITE.titulo);
    const itens = lista(d.itens, 2, 5, 16);
    const alvo = itens && indice(d.alvo, itens.length);
    return titulo && itens && alvo !== null ? { modelo: "menu", titulo, itens, alvo } : null;
  },
  chave(d) {
    const titulo = texto(d.titulo, LIMITE.titulo);
    const rotulo = texto(d.rotulo, 18);
    const outros = d.outros === undefined ? [] : lista(d.outros, 0, 3, 18);
    const ligar = d.ligar === undefined ? true : typeof d.ligar === "boolean" ? d.ligar : null;
    return titulo && rotulo && outros && ligar !== null ? { modelo: "chave", titulo, rotulo, outros, ligar } : null;
  },
  barra(d) {
    const titulo = texto(d.titulo, LIMITE.titulo);
    const rotulo = texto(d.rotulo, LIMITE.titulo);
    const direcao = umDe(d.direcao ?? "direita", ["direita", "esquerda"] as const);
    return titulo && rotulo && direcao ? { modelo: "barra", titulo, rotulo, direcao } : null;
  },
  botoes(d) {
    const titulo = texto(d.titulo, LIMITE.titulo);
    const corpo = texto(d.texto, LIMITE.texto);
    const botoes = lista(d.botoes, 1, 3, LIMITE.botao);
    const alvo = botoes && indice(d.alvo, botoes.length);
    return titulo && corpo && botoes && alvo !== null ? { modelo: "botoes", titulo, texto: corpo, botoes, alvo } : null;
  },
  campo(d) {
    const titulo = texto(d.titulo, LIMITE.titulo);
    if (!Array.isArray(d.campos) || d.campos.length < 1 || d.campos.length > 3) return null;
    const campos = d.campos.map((c) =>
      ehObjeto(c) && texto(c.rotulo, LIMITE.exemplo) && texto(c.exemplo, LIMITE.exemplo)
        ? { rotulo: (c.rotulo as string).trim(), exemplo: (c.exemplo as string).trim() }
        : null,
    );
    if (!campos.every((c): c is CampoDeTexto => c !== null)) return null;
    const alvo = indice(d.alvo ?? 0, campos.length);
    const confirmar = d.confirmar === undefined ? undefined : texto(d.confirmar, LIMITE.botao);
    if (!titulo || alvo === null || confirmar === null) return null;
    return { modelo: "campo", titulo, campos, alvo, confirmar };
  },
  gesto(d) {
    const gesto = umDe(d.gesto, ["deslizar_baixo", "deslizar_cima", "segurar"] as const);
    const sobre = umDe(d.sobre ?? "app", ["app", "foto"] as const);
    return gesto && sobre ? { modelo: "gesto", gesto, sobre } : null;
  },
  conversa(d) {
    const contato = texto(d.contato, LIMITE.contato);
    const brutos = d.baloes ?? [];
    if (!Array.isArray(brutos) || brutos.length > 3) return null;
    const baloes: BalaoConversa[] = [];
    for (const b of brutos) {
      if (!ehObjeto(b)) return null;
      const de = umDe(b.de, ["eu", "outro"] as const);
      const tipo = umDe(b.tipo ?? "texto", ["texto", "audio"] as const);
      if (!de || !tipo) return null;
      if (tipo === "audio") {
        baloes.push({ de, tipo });
        continue;
      }
      const conteudo = texto(b.texto, 60);
      if (!conteudo) return null;
      baloes.push({ de, tipo, texto: conteudo });
    }
    const alvo =
      typeof d.alvo === "number"
        ? indice(d.alvo, baloes.length)
        : umDe(d.alvo, ["microfone", "clipe", "camera", "emoji"] as const);
    const segurar = d.segurar === true;
    return contato && alvo !== null ? { modelo: "conversa", contato, baloes, alvo, segurar } : null;
  },
  chamada(d) {
    const contato = texto(d.contato, LIMITE.contato);
    const tipo = umDe(d.tipo ?? "recebida", ["recebida", "andamento"] as const);
    const permitidos =
      tipo === "recebida" ? (["atender", "recusar"] as const) : (["mudo", "viva_voz", "desligar"] as const);
    const alvo = umDe<AlvoChamada>(d.alvo, permitidos);
    return contato && tipo && alvo ? { modelo: "chamada", contato, tipo, video: d.video === true, alvo } : null;
  },
  camera(d) {
    const modo = umDe(d.modo ?? "foto", ["foto", "qrcode", "codigo_barras"] as const);
    const alvo = d.alvo === undefined ? undefined : umDe(d.alvo, ["disparar", "virar"] as const);
    return modo && alvo !== null ? { modelo: "camera", modo, alvo } : null;
  },
  teclado(d) {
    const conteudo = typeof d.texto === "string" && d.texto.length <= 22 ? d.texto : null;
    const especiais = ["microfone", "apagar", "enviar"];
    const ehLetra = typeof d.alvo === "string" && /^[a-zç]$/.test(d.alvo);
    const alvo = typeof d.alvo === "string" && (especiais.includes(d.alvo) || ehLetra) ? d.alvo : null;
    const opcoes = d.opcoes === undefined ? [] : lista(d.opcoes, 1, 5, 2);
    return conteudo !== null && alvo && opcoes
      ? { modelo: "teclado", texto: conteudo, alvo, segurar: d.segurar === true, opcoes }
      : null;
  },
  aparelho(d) {
    if (!Array.isArray(d.botoes) || d.botoes.length < 1 || d.botoes.length > 2) return null;
    const botoes = d.botoes.map((b) => umDe(b, ["ligar", "volume_mais", "volume_menos"] as const));
    if (!botoes.every((b): b is BotaoDoAparelho => b !== null)) return null;
    const segundos =
      Number.isInteger(d.segundos) && (d.segundos as number) > 0 && (d.segundos as number) <= 15
        ? (d.segundos as number)
        : undefined;
    return { modelo: "aparelho", botoes, juntos: d.juntos === true && botoes.length === 2, segundos };
  },
};

/* ---------- Coerência com o texto do passo ---------- */

/** Nome do elemento que o dedo aponta, quando o modelo tem um rótulo escrito. */
export function rotuloDoAlvo(espec: EspecIlustracao): string | null {
  switch (espec.modelo) {
    case "apps":
      return espec.apps[espec.alvo];
    case "lista":
    case "menu":
      return espec.itens[espec.alvo];
    case "botoes":
      return espec.botoes[espec.alvo];
    case "chave":
      return espec.rotulo;
    case "campo":
      return espec.campos[espec.alvo].rotulo;
    default:
      return null;
  }
}

/** Termos entre aspas no texto do passo: Toque em “Bloquear número” → ["Bloquear número"]. */
const termosEntreAspas = (passo: string) => [...passo.matchAll(/[“"]([^”"]+)[”"]/g)].map((m) => normalizar(m[1]));

/**
 * O desenho combina com o passo? Se o passo cita um nome entre aspas, o elemento
 * apontado pelo dedo precisa ter esse nome. Evita, por exemplo, o passo dizer
 * “Bloquear” e o dedo apontar “Compartilhar”.
 */
export function combinaComOPasso(espec: EspecIlustracao, passo: string): boolean {
  const rotulo = rotuloDoAlvo(espec);
  const termos = termosEntreAspas(passo);
  if (!rotulo || termos.length === 0) return true;
  const alvo = normalizar(rotulo);
  return termos.some((termo) => alvo.includes(termo) || termo.includes(alvo));
}

/* ---------- Entrada pública ---------- */

/** Valida a descrição de uma ilustração. Devolve `null` (passo sem imagem) se algo não estiver certo. */
export function validarIlustracao(dado: unknown, passo: string): EspecIlustracao | null {
  const descartar = (motivo: string) => {
    // Registro para ajustar as instruções da IA (F12 > Console). Só contém o que a IA gerou.
    console.warn(`[Escuta Ativa] Ilustração descartada (${motivo}):`, { passo, ilustracao: dado });
    return null;
  };
  if (!ehObjeto(dado)) return descartar("não é um objeto");
  const validador = VALIDADORES[dado.modelo as ModeloIlustracao];
  if (!validador) return descartar("modelo desconhecido");
  const espec = validador(dado);
  if (!espec) return descartar("campos fora das regras ou dos limites de tamanho");
  if (!combinaComOPasso(espec, passo)) return descartar("o dedo aponta para algo diferente do texto do passo");
  return espec;
}
