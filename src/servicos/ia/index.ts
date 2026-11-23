/**
 * Ponto de entrada do serviço de IA.
 *
 * `obterServicoIA()` é o único lugar onde se escolhe a implementação. Próxima etapa:
 * devolver o serviço do Gemini (Firebase AI Logic) e manter a simulação como reserva
 * quando a URL tiver `?simular=...`. As telas não mudam.
 */
import type { ServicoIA } from "./contrato";
import { criarServicoSimulado } from "./simulado/servicoSimulado";

export * from "./contrato";
export type { EspecIlustracao, ModeloIlustracao } from "./ilustracao";
export { chamarIA, tipoDoErro, AVISO_PENSANDO_MS } from "./chamarIA";

let instancia: ServicoIA | null = null;

export function obterServicoIA(): ServicoIA {
  instancia ??= criarServicoSimulado();
  return instancia;
}
