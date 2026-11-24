/**
 * Lógica da tela "Isso é golpe?": ditado, bloqueio de senhas, chamada à IA e leitura
 * do resultado. A tela (PaginaGolpe) só desenha a etapa atual.
 */
import { useCallback, useEffect, useReducer } from "react";
import type { EstadoOndas } from "@/compartilhado/componentes/Ondas";
import { chamarIA, obterServicoIA, prepararServicoIA, tipoDoErro } from "@/servicos/ia";
import { temDadoSensivel } from "@/servicos/seguranca/dadosSensiveis";
import { useFala } from "@/servicos/voz/FalaProvider";
import { useLerAoAbrir } from "@/servicos/voz/useLerAoAbrir";
import { useReconhecimento } from "@/servicos/voz/useReconhecimento";
import { ESTADO_INICIAL, maquinaDoGolpe } from "./maquinaDoGolpe";
import { textoDoResultado } from "./niveis";
import { TEXTOS } from "./textos";

export function useVerificacaoGolpe() {
  const [{ etapa, mensagem }, despachar] = useReducer(maquinaDoGolpe, ESTADO_INICIAL);
  const ditado = useReconhecimento();
  const { falar, falando } = useFala();

  /* Prepara a conexão com a IA enquanto a pessoa ainda está colando ou ditando. */
  useEffect(() => prepararServicoIA(), []);

  useLerAoAbrir(etapa.tipo === "entrada" && !etapa.temSenha ? `${TEXTOS.instrucao} ${TEXTOS.comoColar}` : null);

  /* Ditado: o texto falado vai direto para o campo. */
  useEffect(() => {
    if (ditado.ouvindo && ditado.texto) despachar({ tipo: "editar", mensagem: ditado.texto });
  }, [ditado.ouvindo, ditado.texto]);

  /* O resultado é lido em voz assim que aparece. */
  useEffect(() => {
    if (etapa.tipo === "resultado") falar(textoDoResultado(etapa.resposta));
  }, [etapa, falar]);

  const verificar = useCallback(async () => {
    // Caso de borda: senha ou código na mensagem. Nada é enviado nem guardado.
    if (temDadoSensivel(mensagem)) {
      despachar({ tipo: "bloquear_senha" });
      falar(TEXTOS.avisoSenha, true);
      return;
    }
    despachar({ tipo: "enviar" });
    try {
      const resposta = await chamarIA((sinal) => obterServicoIA().verificarGolpe(mensagem, sinal));
      despachar({ tipo: "respondeu", resposta });
    } catch (erro) {
      despachar({ tipo: "falhou", erro: tipoDoErro(erro) });
    }
  }, [mensagem, falar]);

  const estadoOndas: EstadoOndas =
    etapa.tipo === "pensando" ? "pensando" : ditado.ouvindo ? "ouvindo" : falando ? "falando" : "repouso";

  return {
    etapa,
    mensagem,
    estadoOndas,
    ditado: {
      suportado: ditado.suportado,
      ouvindo: ditado.ouvindo,
      negado: ditado.erro === "negado",
      alternar: ditado.ouvindo ? ditado.parar : ditado.iniciar,
    },
    editar: (texto: string) => despachar({ tipo: "editar", mensagem: texto }),
    verificar,
    ouvirDeNovo: () => etapa.tipo === "resultado" && falar(textoDoResultado(etapa.resposta), true),
    verificarOutra: () => despachar({ tipo: "recomecar" }),
  };
}
