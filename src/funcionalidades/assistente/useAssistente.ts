/**
 * Lógica da tela Perguntar: liga a máquina de estados ao microfone, à IA e à voz.
 * A tela (PaginaPerguntar) só desenha a etapa atual e chama as ações daqui.
 */
import { useCallback, useEffect, useReducer } from "react";
import { chamarIA, obterServicoIA, tipoDoErro } from "@/servicos/ia";
import { useFala } from "@/servicos/voz/FalaProvider";
import { useLerAoAbrir } from "@/servicos/voz/useLerAoAbrir";
import { useReconhecimento } from "@/servicos/voz/useReconhecimento";
import type { EstadoOndas } from "@/compartilhado/componentes/Ondas";
import { estadoInicial, maquinaDoAssistente } from "./maquinaDoAssistente";
import { TEXTOS } from "./textos";

export function useAssistente() {
  const voz = useReconhecimento();
  const { falar, falando } = useFala();
  const [{ etapa, pergunta }, despachar] = useReducer(maquinaDoAssistente, voz.suportado, estadoInicial);

  /* Fim da escuta: a fala terminou sozinha (pausa) ou pelo botão "Terminei". */
  useEffect(() => {
    if (etapa.tipo === "ouvindo" && !voz.ouvindo) {
      despachar({ tipo: "escuta_terminou", texto: voz.texto, erro: voz.erro });
    }
  }, [etapa.tipo, voz.ouvindo, voz.texto, voz.erro]);

  /* Ao abrir a tela (ou voltar ao começo dela), lê o que fazer. */
  useLerAoAbrir(
    etapa.tipo === "inicio"
      ? [etapa.aviso, TEXTOS.convite, TEXTOS.exemplo].filter(Boolean).join(" ")
      : etapa.tipo === "digitar"
        ? [etapa.aviso, TEXTOS.escrever].filter(Boolean).join(" ")
        : null,
  );

  /* Confirmação e recusa também são lidas em voz. */
  useEffect(() => {
    if (etapa.tipo === "confirmar") falar(TEXTOS.confirmar(pergunta));
    if (etapa.tipo === "fora") falar(etapa.mensagem);
  }, [etapa, pergunta, falar]);

  const servico = obterServicoIA();

  const enviar = useCallback(async () => {
    if (!pergunta.trim()) return;
    despachar({ tipo: "enviar" });
    try {
      const resposta = await chamarIA((sinal) => servico.perguntar(pergunta, sinal));
      despachar({ tipo: "respondeu", resposta });
    } catch (erro) {
      despachar({ tipo: "falhou", erro: tipoDoErro(erro) });
    }
  }, [pergunta, servico]);

  const explicarDeOutroJeito = useCallback(
    (passo: string) => chamarIA((sinal) => servico.explicarDeOutroJeito(pergunta, passo, sinal)),
    [pergunta, servico],
  );

  const escutar = () => {
    voz.iniciar();
    despachar({ tipo: "escutar" });
  };

  const cancelarEscuta = () => {
    voz.cancelar();
    despachar({ tipo: "cancelar_escuta" });
  };

  /** As ondas do fundo mostram o que o assistente está fazendo. */
  const estadoOndas: EstadoOndas =
    etapa.tipo === "ouvindo" ? "ouvindo" : etapa.tipo === "pensando" ? "pensando" : falando ? "falando" : "repouso";

  return {
    etapa,
    pergunta,
    estadoOndas,
    textoOuvido: voz.texto,
    vozSuportada: voz.suportado,
    escutar,
    terminarEscuta: voz.parar,
    cancelarEscuta,
    escrever: () => despachar({ tipo: "escrever" }),
    editar: (texto: string) => despachar({ tipo: "editar", pergunta: texto }),
    enviar,
    explicarDeOutroJeito,
    concluir: () => despachar({ tipo: "concluir" }),
    recomecar: () => despachar({ tipo: "recomecar", vozSuportada: voz.suportado }),
  };
}
