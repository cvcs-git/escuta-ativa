/**
 * Serviço de IA simulado.
 *
 * Devolve exatamente o mesmo JSON que o Gemini devolverá, com atraso realista, e
 * passa pela mesma validação. Serve para desenvolver e para a demonstração.
 *
 * Para demonstrar os estados de erro, acrescente à URL:
 *   ?simular=timeout | indisponivel | formato | limite | lento
 * Exemplo: .../#/perguntar?simular=timeout
 */
import { ErroIA, type ServicoIA } from "../contrato";
import { validarAssistente, validarGolpe } from "../validacao";
import { normalizar } from "@/compartilhado/utilitarios/texto";
import { classificarGolpe } from "./classificarGolpe";
import {
  DICA_GENERICA,
  OUTRO_JEITO_GENERICO,
  PASSOS_GENERICOS,
  RECUSA_FORA_DO_ESCOPO,
  RESPOSTAS,
  TEMAS_DO_CELULAR,
} from "./respostas";

const SIMULACOES = ["timeout", "indisponivel", "formato", "limite", "lento"] as const;
type Simulacao = (typeof SIMULACOES)[number];

/** Lê `?simular=` tanto do hash (#/rota?simular=) quanto da URL normal. */
export function lerSimulacao(): Simulacao | null {
  const consulta = window.location.hash.split("?")[1] ?? window.location.search.slice(1);
  const valor = new URLSearchParams(consulta).get("simular");
  return SIMULACOES.includes(valor as Simulacao) ? (valor as Simulacao) : null;
}

function esperar(ms: number, sinal: AbortSignal) {
  return new Promise<void>((resolver, rejeitar) => {
    const id = setTimeout(resolver, ms);
    sinal.addEventListener("abort", () => {
      clearTimeout(id);
      rejeitar(new ErroIA("timeout"));
    });
  });
}

/** Aplica a simulação de erro escolhida na URL e espera o tempo de uma resposta real. */
async function simularRede(sinal: AbortSignal): Promise<Simulacao | null> {
  const simulacao = lerSimulacao();
  switch (simulacao) {
    case "timeout":
      await esperar(60_000, sinal); // nunca responde: o app encerra em 10 s
      break;
    case "indisponivel":
      await esperar(1_000, sinal);
      throw new ErroIA("indisponivel");
    case "limite":
      await esperar(800, sinal);
      throw new ErroIA("limite");
  }
  await esperar(simulacao === "lento" ? 7_000 : 1_200 + Math.random() * 800, sinal);
  return simulacao;
}

/**
 * Escolhe o tema que melhor combina com a pergunta: soma o tamanho das palavras-chave
 * encontradas (chaves mais longas e específicas pesam mais). Em empate, vale o primeiro.
 */
export function buscarResposta(pergunta: string) {
  const texto = normalizar(pergunta);
  let melhor: (typeof RESPOSTAS)[number] | undefined;
  let melhorPontuacao = 0;
  for (const resposta of RESPOSTAS) {
    const pontuacao = resposta.chaves.reduce((soma, chave) => (texto.includes(chave) ? soma + chave.length : soma), 0);
    if (pontuacao > melhorPontuacao) {
      melhor = resposta;
      melhorPontuacao = pontuacao;
    }
  }
  return melhor;
}

/** Monta a resposta no mesmo formato JSON que o Gemini devolve (antes da validação). */
function responder(pergunta: string): unknown {
  const achada = buscarResposta(pergunta);
  if (achada) {
    return {
      dentroDoEscopo: true,
      passos: achada.passos.map(({ texto, ilustracao }) => ({ texto, ilustracao })),
      dica: achada.dica,
    };
  }

  const sobreOCelular = TEMAS_DO_CELULAR.some((tema) => normalizar(pergunta).includes(tema));
  if (sobreOCelular) return { dentroDoEscopo: true, passos: PASSOS_GENERICOS, dica: DICA_GENERICA };

  return { dentroDoEscopo: false, mensagem: RECUSA_FORA_DO_ESCOPO };
}

export function criarServicoSimulado(): ServicoIA {
  return {
    async perguntar(pergunta, sinal) {
      const simulacao = await simularRede(sinal);
      if (simulacao === "formato") return validarAssistente({ resposta: "texto solto, fora do formato" });
      return validarAssistente(responder(pergunta));
    },

    async explicarDeOutroJeito(pergunta, passo, sinal) {
      await simularRede(sinal);
      const achado = buscarResposta(pergunta)?.passos.find((p) => p.texto === passo);
      return achado?.outroJeito ?? OUTRO_JEITO_GENERICO;
    },

    async verificarGolpe(mensagem, sinal) {
      const simulacao = await simularRede(sinal);
      if (simulacao === "formato") return validarGolpe({ classificacao: "talvez" });
      return validarGolpe(classificarGolpe(mensagem));
    },
  };
}
