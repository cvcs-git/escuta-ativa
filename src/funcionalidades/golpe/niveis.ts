/**
 * Como cada classificação aparece na tela.
 * O título, a cor e o ícone vêm do app, nunca da IA: assim "sem sinais" jamais vira "seguro".
 */
import { IconeAlerta, IconeAlertaContorno, IconeInfo } from "@/compartilhado/componentes/Icones";
import type { Classificacao, RespostaGolpe } from "@/servicos/ia";

export const NIVEIS: Record<Classificacao, { titulo: string; classe: string; Icone: typeof IconeAlerta }> = {
  provavel_golpe: { titulo: "PROVÁVEL GOLPE", classe: "resultado--golpe", Icone: IconeAlerta },
  suspeita: { titulo: "Mensagem suspeita", classe: "resultado--suspeita", Icone: IconeAlertaContorno },
  sem_sinais: {
    titulo: "Não encontrei sinais de golpe, mas fique atento",
    classe: "resultado--sem-sinais",
    Icone: IconeInfo,
  },
};

/** Texto lido em voz: título, motivo e orientação, na ordem em que aparecem. */
export const textoDoResultado = (resposta: RespostaGolpe) =>
  `${NIVEIS[resposta.classificacao].titulo}. ${resposta.motivo} ${resposta.orientacao}`;
