/**
 * Contrato do serviço de IA.
 * As telas só conhecem este contrato: não sabem se a resposta veio do Gemini
 * ou da simulação. Para trocar de serviço, altere apenas obterServicoIA().
 */

export type RespostaAssistente =
  | { dentroDoEscopo: true; passos: string[]; dica?: string }
  | { dentroDoEscopo: false; mensagem: string };

export type Classificacao = "provavel_golpe" | "suspeita" | "sem_sinais";

export type RespostaGolpe = {
  classificacao: Classificacao;
  motivo: string;
  orientacao: string;
};

export type TipoErroIA = "timeout" | "indisponivel" | "formato" | "limite" | "sem_internet";

export class ErroIA extends Error {
  constructor(public tipo: TipoErroIA) {
    super(tipo);
  }
}

export interface ServicoIA {
  perguntar(pergunta: string, sinal: AbortSignal): Promise<RespostaAssistente>;
  explicarDeOutroJeito(pergunta: string, passo: string, sinal: AbortSignal): Promise<string>;
  verificarGolpe(mensagem: string, sinal: AbortSignal): Promise<RespostaGolpe>;
}

/* ---------- Validação do formato (caso de borda: resposta fora do formato) ---------- */

const MAX_PASSOS = 5;
const MAX_PALAVRAS = 20;

const contarPalavras = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

export function validarAssistente(dado: unknown): RespostaAssistente {
  const d = dado as Record<string, unknown>;
  if (!d || typeof d !== "object" || typeof d.dentroDoEscopo !== "boolean") throw new ErroIA("formato");
  if (d.dentroDoEscopo === false) {
    if (typeof d.mensagem !== "string" || !d.mensagem.trim()) throw new ErroIA("formato");
    return { dentroDoEscopo: false, mensagem: d.mensagem };
  }
  const passos = d.passos;
  if (!Array.isArray(passos) || passos.length === 0 || passos.length > MAX_PASSOS) throw new ErroIA("formato");
  if (!passos.every((p) => typeof p === "string" && p.trim() && contarPalavras(p) <= MAX_PALAVRAS)) {
    throw new ErroIA("formato");
  }
  const dica = typeof d.dica === "string" && d.dica.trim() ? d.dica : undefined;
  return { dentroDoEscopo: true, passos: passos as string[], dica };
}

const CLASSIFICACOES: Classificacao[] = ["provavel_golpe", "suspeita", "sem_sinais"];

export function validarGolpe(dado: unknown): RespostaGolpe {
  const d = dado as Record<string, unknown>;
  if (!d || typeof d !== "object") throw new ErroIA("formato");
  if (!CLASSIFICACOES.includes(d.classificacao as Classificacao)) throw new ErroIA("formato");
  if (typeof d.motivo !== "string" || typeof d.orientacao !== "string") throw new ErroIA("formato");
  return { classificacao: d.classificacao as Classificacao, motivo: d.motivo, orientacao: d.orientacao };
}
