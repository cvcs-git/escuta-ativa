/**
 * Máquina de estados da tela Perguntar (fluxo 2 do fluxograma).
 *
 *   inicio ──escutar──► ouvindo ──escuta_terminou──► confirmar ──enviar──► pensando
 *     │                    │ (sem fala / negado)                              │
 *     └──escrever──► digitar ◄┘                         respondeu / falhou ◄──┘
 *                      └──enviar──► pensando      resposta → concluida | fora | erro
 *
 * É uma função pura (sem efeitos): fácil de testar e de ler. Os efeitos (microfone,
 * chamadas à IA, voz) ficam no hook useAssistente.
 */
import type { RespostaAssistente, TipoErroIA } from "@/servicos/ia";
import type { ErroVoz } from "@/servicos/voz/useReconhecimento";
import { TEXTOS } from "./textos";

export type Etapa =
  | { tipo: "inicio"; aviso?: string }
  | { tipo: "ouvindo" }
  | { tipo: "digitar"; aviso?: string }
  | { tipo: "confirmar" }
  | { tipo: "pensando" }
  | { tipo: "resposta"; passos: string[]; dica?: string }
  | { tipo: "concluida"; dica?: string }
  | { tipo: "fora"; mensagem: string }
  | { tipo: "erro"; erro: TipoErroIA };

export type EstadoAssistente = { etapa: Etapa; pergunta: string };

export type AcaoAssistente =
  | { tipo: "escutar" }
  | { tipo: "escuta_terminou"; texto: string; erro: ErroVoz | null }
  | { tipo: "cancelar_escuta" }
  | { tipo: "escrever" }
  | { tipo: "editar"; pergunta: string }
  | { tipo: "enviar" }
  | { tipo: "respondeu"; resposta: RespostaAssistente }
  | { tipo: "falhou"; erro: TipoErroIA }
  | { tipo: "concluir" }
  | { tipo: "recomecar"; vozSuportada: boolean };

export const estadoInicial = (vozSuportada: boolean): EstadoAssistente => ({
  pergunta: "",
  etapa: vozSuportada ? { tipo: "inicio" } : { tipo: "digitar", aviso: TEXTOS.semSuporteAVoz },
});

export function maquinaDoAssistente(estado: EstadoAssistente, acao: AcaoAssistente): EstadoAssistente {
  const { etapa } = estado;
  switch (acao.tipo) {
    case "escutar":
      return { ...estado, etapa: { tipo: "ouvindo" } };

    case "escuta_terminou": {
      if (etapa.tipo !== "ouvindo") return estado;
      if (acao.erro === "negado") return { ...estado, etapa: { tipo: "digitar", aviso: TEXTOS.microfoneNegado } };
      const texto = acao.texto.trim();
      if (!texto) return { ...estado, etapa: { tipo: "inicio", aviso: TEXTOS.naoOuvi } };
      return { pergunta: texto, etapa: { tipo: "confirmar" } };
    }

    case "cancelar_escuta":
      return { ...estado, etapa: { tipo: "inicio" } };

    case "escrever":
      return { ...estado, etapa: { tipo: "digitar" } };

    case "editar":
      return { ...estado, pergunta: acao.pergunta };

    case "enviar":
      return estado.pergunta.trim() ? { ...estado, etapa: { tipo: "pensando" } } : estado;

    case "respondeu":
      return {
        ...estado,
        etapa: acao.resposta.dentroDoEscopo
          ? { tipo: "resposta", passos: acao.resposta.passos, dica: acao.resposta.dica }
          : { tipo: "fora", mensagem: acao.resposta.mensagem },
      };

    case "falhou":
      return { ...estado, etapa: { tipo: "erro", erro: acao.erro } };

    case "concluir":
      return etapa.tipo === "resposta" ? { ...estado, etapa: { tipo: "concluida", dica: etapa.dica } } : estado;

    case "recomecar":
      return estadoInicial(acao.vozSuportada);
  }
}
