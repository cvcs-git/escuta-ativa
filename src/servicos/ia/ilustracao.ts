/**
 * Ilustrações das respostas do assistente.
 *
 * A IA nunca desenha: ela escolhe um dos 16 modelos de tela e preenche os campos.
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
export type AlvoNavegacao = "voltar" | "inicio" | "recentes";
export type AlvoGaleria = "foto" | "compartilhar" | "editar" | "apagar";

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
  | { modelo: "aparelho"; botoes: BotaoDoAparelho[]; juntos: boolean; segundos?: number }
  | { modelo: "atalhos"; atalhos: string[]; alvo: number; ligar: boolean }
  | { modelo: "navegacao"; alvo: AlvoNavegacao }
  | { modelo: "galeria"; alvo: AlvoGaleria; foto: number; varias: boolean };

export type ModeloIlustracao = EspecIlustracao["modelo"];

/* ---------- Limites (para o texto caber no desenho) ---------- */

/**
 * Fonte única dos limites: a validação abaixo e o catálogo enviado à IA
 * (`gemini/instrucoes.ts`) usam estes mesmos números, então nunca divergem.
 *
 * Nomes de botões, itens, títulos e contatos aceitam até `rotulo` caracteres: o que não
 * cabe no desenho é abreviado no fim de uma palavra ("Enviar localização…"). Listas
 * contam itens; textos corridos (aviso, balão) são quebrados em linhas.
 */
export const LIMITES = {
  rotulo: 40,
  apps: { min: 2, max: 6 },
  lista: { min: 2, max: 5 },
  menu: { min: 2, max: 5 },
  chave: { outrosMax: 3 },
  botoes: { texto: 90, min: 1, max: 3 },
  campo: { min: 1, max: 3 },
  conversa: { baloesMax: 3, balao: 60 },
  teclado: { texto: 22, opcoesMax: 5, opcao: 2 },
  aparelho: { segundosMax: 15 },
  atalhos: { min: 2, max: 8 },
  galeria: { fotos: 9 },
} as const;

const R = LIMITES.rotulo;

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
    const apps = lista(d.apps, LIMITES.apps.min, LIMITES.apps.max, R);
    const alvo = apps && indice(d.alvo, apps.length);
    return apps && alvo !== null ? { modelo: "apps", apps, alvo } : null;
  },
  lista(d) {
    const titulo = texto(d.titulo, R);
    const itens = lista(d.itens, LIMITES.lista.min, LIMITES.lista.max, R);
    const alvo = itens && indice(d.alvo, itens.length);
    return titulo && itens && alvo !== null ? { modelo: "lista", titulo, itens, alvo } : null;
  },
  menu(d) {
    const titulo = texto(d.titulo, R);
    const itens = lista(d.itens, LIMITES.menu.min, LIMITES.menu.max, R);
    const alvo = itens && indice(d.alvo, itens.length);
    return titulo && itens && alvo !== null ? { modelo: "menu", titulo, itens, alvo } : null;
  },
  chave(d) {
    const titulo = texto(d.titulo, R);
    const rotulo = texto(d.rotulo, R);
    const outros = d.outros === undefined ? [] : lista(d.outros, 0, LIMITES.chave.outrosMax, R);
    const ligar = d.ligar === undefined ? true : typeof d.ligar === "boolean" ? d.ligar : null;
    return titulo && rotulo && outros && ligar !== null ? { modelo: "chave", titulo, rotulo, outros, ligar } : null;
  },
  barra(d) {
    const titulo = texto(d.titulo, R);
    const rotulo = texto(d.rotulo, R);
    const direcao = umDe(d.direcao ?? "direita", ["direita", "esquerda"] as const);
    return titulo && rotulo && direcao ? { modelo: "barra", titulo, rotulo, direcao } : null;
  },
  botoes(d) {
    const titulo = texto(d.titulo, R);
    const corpo = texto(d.texto, LIMITES.botoes.texto);
    const botoes = lista(d.botoes, LIMITES.botoes.min, LIMITES.botoes.max, R);
    const alvo = botoes && indice(d.alvo, botoes.length);
    return titulo && corpo && botoes && alvo !== null ? { modelo: "botoes", titulo, texto: corpo, botoes, alvo } : null;
  },
  campo(d) {
    const titulo = texto(d.titulo, R);
    const { min, max } = LIMITES.campo;
    if (!Array.isArray(d.campos) || d.campos.length < min || d.campos.length > max) return null;
    const campos = d.campos.map((c) =>
      ehObjeto(c) && texto(c.rotulo, R) && texto(c.exemplo, R)
        ? { rotulo: (c.rotulo as string).trim(), exemplo: (c.exemplo as string).trim() }
        : null,
    );
    if (!campos.every((c): c is CampoDeTexto => c !== null)) return null;
    const alvo = indice(d.alvo ?? 0, campos.length);
    const confirmar = d.confirmar === undefined ? undefined : texto(d.confirmar, R);
    if (!titulo || alvo === null || confirmar === null) return null;
    return { modelo: "campo", titulo, campos, alvo, confirmar };
  },
  gesto(d) {
    const gesto = umDe(d.gesto, ["deslizar_baixo", "deslizar_cima", "segurar"] as const);
    const sobre = umDe(d.sobre ?? "app", ["app", "foto"] as const);
    return gesto && sobre ? { modelo: "gesto", gesto, sobre } : null;
  },
  conversa(d) {
    const contato = texto(d.contato, R);
    const brutos = d.baloes ?? [];
    if (!Array.isArray(brutos) || brutos.length > LIMITES.conversa.baloesMax) return null;
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
      const conteudo = texto(b.texto, LIMITES.conversa.balao);
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
    const contato = texto(d.contato, R);
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
    const conteudo = typeof d.texto === "string" && d.texto.length <= LIMITES.teclado.texto ? d.texto : null;
    const especiais = ["microfone", "apagar", "enviar"];
    // Só letras que existem no teclado desenhado (sem "ç": a tecla não aparece no desenho).
    const ehLetra = typeof d.alvo === "string" && /^[a-z]$/.test(d.alvo);
    const alvo = typeof d.alvo === "string" && (especiais.includes(d.alvo) || ehLetra) ? d.alvo : null;
    const opcoes = d.opcoes === undefined ? [] : lista(d.opcoes, 0, LIMITES.teclado.opcoesMax, LIMITES.teclado.opcao);
    return conteudo !== null && alvo && opcoes
      ? { modelo: "teclado", texto: conteudo, alvo, segurar: d.segurar === true, opcoes }
      : null;
  },
  aparelho(d) {
    if (!Array.isArray(d.botoes) || d.botoes.length < 1 || d.botoes.length > 2) return null;
    const botoes = d.botoes.map((b) => umDe(b, ["ligar", "volume_mais", "volume_menos"] as const));
    if (!botoes.every((b): b is BotaoDoAparelho => b !== null)) return null;
    const segundos =
      Number.isInteger(d.segundos) &&
      (d.segundos as number) > 0 &&
      (d.segundos as number) <= LIMITES.aparelho.segundosMax
        ? (d.segundos as number)
        : undefined;
    return { modelo: "aparelho", botoes, juntos: d.juntos === true && botoes.length === 2, segundos };
  },
  atalhos(d) {
    const atalhos = lista(d.atalhos, LIMITES.atalhos.min, LIMITES.atalhos.max, R);
    const alvo = atalhos && indice(d.alvo, atalhos.length);
    const ligar = d.ligar === undefined ? true : typeof d.ligar === "boolean" ? d.ligar : null;
    return atalhos && alvo !== null && ligar !== null ? { modelo: "atalhos", atalhos, alvo, ligar } : null;
  },
  navegacao(d) {
    const alvo = umDe(d.alvo, ["voltar", "inicio", "recentes"] as const);
    return alvo ? { modelo: "navegacao", alvo } : null;
  },
  galeria(d) {
    const alvo = umDe(d.alvo ?? "foto", ["foto", "compartilhar", "editar", "apagar"] as const);
    const foto = d.foto === undefined ? 4 : indice(d.foto, LIMITES.galeria.fotos);
    return alvo && foto !== null ? { modelo: "galeria", alvo, foto, varias: d.varias === true } : null;
  },
};

/* ---------- Coerência com o texto do passo ---------- */

/** Nomes que aparecem escritos nos desenhos de navegação e da galeria. */
export const ROTULOS_NAVEGACAO: Record<AlvoNavegacao, string> = {
  voltar: "Voltar",
  inicio: "Início",
  recentes: "Aplicativos abertos",
};
export const ROTULOS_GALERIA: Record<Exclude<AlvoGaleria, "foto">, string> = {
  compartilhar: "Compartilhar",
  editar: "Editar",
  apagar: "Apagar",
};

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
    case "atalhos":
      return espec.atalhos[espec.alvo];
    case "navegacao":
      return ROTULOS_NAVEGACAO[espec.alvo];
    case "galeria":
      return espec.alvo === "foto" ? null : ROTULOS_GALERIA[espec.alvo];
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
