import type { ServicoIA } from "./servicoIA";
import { criarServicoSimulado } from "./servicoIASimulado";

export * from "./servicoIA";

/**
 * Ponto único de troca do serviço de IA.
 * Próxima etapa: retornar o serviço do Gemini (Firebase AI Logic) quando não houver
 * ?simular=... na URL, mantendo a simulação como reserva para a apresentação.
 */
export function obterServicoIA(): ServicoIA {
  return criarServicoSimulado();
}
