/**
 * Regras de chamada ao serviço de IA (item 4.4 da documentação):
 * - sem internet: erro imediato, sem tentar;
 * - limite de 10 s por tentativa (o aviso "Estou pensando" aparece aos 5 s, na tela);
 * - serviço indisponível: uma nova tentativa automática após 2 s;
 * - limite de uso (429) e formato inválido: sem nova tentativa.
 */
import { ErroIA } from "./contrato";

export const AVISO_PENSANDO_MS = 5_000;
export const LIMITE_RESPOSTA_MS = 10_000;
export const ESPERA_NOVA_TENTATIVA_MS = 2_000;

type Chamada<T> = (sinal: AbortSignal) => Promise<T>;

async function tentarUmaVez<T>(chamada: Chamada<T>): Promise<T> {
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), LIMITE_RESPOSTA_MS);
  try {
    return await chamada(controle.signal);
  } catch (erro) {
    if (controle.signal.aborted) throw new ErroIA("timeout");
    throw erro instanceof ErroIA ? erro : new ErroIA("indisponivel");
  } finally {
    clearTimeout(relogio);
  }
}

export async function chamarIA<T>(chamada: Chamada<T>): Promise<T> {
  if (!navigator.onLine) throw new ErroIA("sem_internet");
  try {
    return await tentarUmaVez(chamada);
  } catch (erro) {
    const podeTentarDeNovo = erro instanceof ErroIA && erro.tipo === "indisponivel" && navigator.onLine;
    if (!podeTentarDeNovo) throw erro;
    await new Promise((resolver) => setTimeout(resolver, ESPERA_NOVA_TENTATIVA_MS));
    return tentarUmaVez(chamada);
  }
}

/** Converte qualquer falha no tipo de erro mostrado na tela. */
export const tipoDoErro = (erro: unknown) => (erro instanceof ErroIA ? erro.tipo : "indisponivel");
