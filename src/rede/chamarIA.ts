import { ErroIA } from "../servicos/ia";

export const AVISO_PENSANDO_MS = 5_000;
export const LIMITE_RESPOSTA_MS = 10_000;
const ESPERA_NOVA_TENTATIVA_MS = 2_000;

/**
 * Chama o serviço de IA com as regras do item 4.4:
 * sem internet → erro imediato; limite de 10 s; uma nova tentativa automática
 * após 2 s quando o serviço está indisponível; erro de limite (429) sem nova tentativa.
 */
export async function chamarIA<T>(chamada: (sinal: AbortSignal) => Promise<T>): Promise<T> {
  if (!navigator.onLine) throw new ErroIA("sem_internet");

  const tentar = async () => {
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
  };

  try {
    return await tentar();
  } catch (erro) {
    if (erro instanceof ErroIA && erro.tipo === "indisponivel" && navigator.onLine) {
      await new Promise((r) => setTimeout(r, ESPERA_NOVA_TENTATIVA_MS));
      return tentar();
    }
    throw erro;
  }
}
