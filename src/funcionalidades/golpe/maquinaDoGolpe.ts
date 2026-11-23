/**
 * Máquina de estados da tela "Isso é golpe?" (fluxo 3 do fluxograma).
 *
 *   entrada ──verificar──► (tem senha ou código?) ── sim ──► entrada com alerta
 *                                                 └─ não ──► pensando ──► resultado | erro
 *
 * Função pura, testável. Os efeitos (IA, voz, microfone) ficam em useVerificacaoGolpe.
 */
import type { RespostaGolpe, TipoErroIA } from "@/servicos/ia";

export type EtapaGolpe =
  | { tipo: "entrada"; temSenha: boolean }
  | { tipo: "pensando" }
  | { tipo: "resultado"; resposta: RespostaGolpe }
  | { tipo: "erro"; erro: TipoErroIA };

export type EstadoGolpe = { etapa: EtapaGolpe; mensagem: string };

export type AcaoGolpe =
  | { tipo: "editar"; mensagem: string }
  | { tipo: "bloquear_senha" }
  | { tipo: "enviar" }
  | { tipo: "respondeu"; resposta: RespostaGolpe }
  | { tipo: "falhou"; erro: TipoErroIA }
  | { tipo: "recomecar" };

export const ESTADO_INICIAL: EstadoGolpe = { mensagem: "", etapa: { tipo: "entrada", temSenha: false } };

export function maquinaDoGolpe(estado: EstadoGolpe, acao: AcaoGolpe): EstadoGolpe {
  switch (acao.tipo) {
    case "editar":
      // Ao editar, o alerta de senha some: a pessoa pode ter apagado os números.
      return { mensagem: acao.mensagem, etapa: { tipo: "entrada", temSenha: false } };
    case "bloquear_senha":
      return { ...estado, etapa: { tipo: "entrada", temSenha: true } };
    case "enviar":
      return { ...estado, etapa: { tipo: "pensando" } };
    case "respondeu":
      return { ...estado, etapa: { tipo: "resultado", resposta: acao.resposta } };
    case "falhou":
      return { ...estado, etapa: { tipo: "erro", erro: acao.erro } };
    case "recomecar":
      return ESTADO_INICIAL;
  }
}
