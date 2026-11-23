/**
 * Contrato do serviço de IA.
 *
 * As telas conhecem apenas estes tipos e a interface `ServicoIA`: não sabem se a
 * resposta veio do Gemini ou da simulação. Trocar de serviço não exige mudar telas.
 */

/** Resposta do assistente: um passo a passo ou a recusa de uma pergunta fora do escopo. */
export type RespostaAssistente =
  { dentroDoEscopo: true; passos: string[]; dica?: string } | { dentroDoEscopo: false; mensagem: string };

/** Classificação de uma mensagem. Nunca existe "seguro": no máximo, "sem sinais". */
export type Classificacao = "provavel_golpe" | "suspeita" | "sem_sinais";

export type RespostaGolpe = {
  classificacao: Classificacao;
  motivo: string;
  orientacao: string;
};

/** Falhas tratadas pelo app (item 4.4 da documentação). */
export type TipoErroIA = "timeout" | "indisponivel" | "formato" | "limite" | "sem_internet";

export class ErroIA extends Error {
  constructor(public readonly tipo: TipoErroIA) {
    super(`Falha no serviço de IA: ${tipo}`);
    this.name = "ErroIA";
  }
}

/** Operações que qualquer implementação (simulada ou real) precisa oferecer. */
export interface ServicoIA {
  perguntar(pergunta: string, sinal: AbortSignal): Promise<RespostaAssistente>;
  explicarDeOutroJeito(pergunta: string, passo: string, sinal: AbortSignal): Promise<string>;
  verificarGolpe(mensagem: string, sinal: AbortSignal): Promise<RespostaGolpe>;
}
