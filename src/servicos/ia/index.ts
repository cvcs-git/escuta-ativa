/**
 * Ponto de entrada do serviço de IA.
 *
 * `obterServicoIA()` é o único lugar onde se escolhe a implementação:
 * - Gemini (Firebase AI Logic), quando o App Check está configurado;
 * - simulação, quando a URL tem `?simular=...` (demonstração dos estados de erro) ou
 *   enquanto a chave do App Check não foi cadastrada.
 * A escolha é feita a cada chamada, então `?simular=` vale assim que entra na URL.
 * As telas não mudam.
 */
import type { ServicoIA } from "./contrato";
import { geminiConfigurado } from "./gemini/configuracao";
import { criarGeradorFirebase } from "./gemini/conexaoFirebase";
import { criarServicoGemini } from "./gemini/servicoGemini";
import { criarServicoSimulado, lerSimulacao } from "./simulado/servicoSimulado";

export * from "./contrato";
export type { EspecIlustracao, ModeloIlustracao } from "./ilustracao";
export { chamarIA, tipoDoErro, AVISO_PENSANDO_MS } from "./chamarIA";

let simulado: ServicoIA | null = null;
let gemini: ServicoIA | null = null;

function escolherServico(): ServicoIA {
  if (lerSimulacao() || !geminiConfigurado()) return (simulado ??= criarServicoSimulado());
  return (gemini ??= criarServicoGemini(criarGeradorFirebase()));
}

/** Serviço que decide, a cada pedido, entre o Gemini e a simulação. */
const servico: ServicoIA = {
  perguntar: (pergunta, sinal) => escolherServico().perguntar(pergunta, sinal),
  explicarDeOutroJeito: (pergunta, passo, sinal) => escolherServico().explicarDeOutroJeito(pergunta, passo, sinal),
  verificarGolpe: (mensagem, sinal) => escolherServico().verificarGolpe(mensagem, sinal),
};

export function obterServicoIA(): ServicoIA {
  return servico;
}
