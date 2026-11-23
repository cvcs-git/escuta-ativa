/**
 * T5 Lição (wf_03): passo a passo com ilustração de cada tela.
 * "Não encontrei" usa a explicação alternativa revisada pela equipe, sem IA.
 */
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BotaoLink } from "@/compartilhado/componentes/Botao";
import { Conclusao } from "@/compartilhado/componentes/Conclusao";
import { PassoAPasso } from "@/compartilhado/componentes/PassoAPasso";
import { Tela } from "@/compartilhado/componentes/Tela";
import { ILUSTRACOES_DAS_LICOES } from "./ilustracoesDasLicoes";
import { buscarLicao } from "./licoes";
import "./licoes.css";

export default function PaginaLicao() {
  const { id } = useParams();
  const licao = buscarLicao(id);
  const [concluida, setConcluida] = useState(false);

  const passos = useMemo(() => licao?.passos.map((passo) => passo.texto) ?? [], [licao]);
  const ilustracoes = useMemo(() => passos.map((_, i) => ILUSTRACOES_DAS_LICOES[`${id}-${i + 1}`]), [passos, id]);

  if (!licao) {
    return (
      <Tela titulo="Lição" voltar="/licoes">
        <h2>Não encontrei essa lição.</h2>
        <BotaoLink to="/licoes">Ver todas as lições</BotaoLink>
      </Tela>
    );
  }

  return (
    <Tela titulo="Lição" voltar="/licoes">
      <div>
        <h2 className="licao__titulo">{licao.titulo}</h2>
        <p className="apoio">Cerca de {licao.minutos} minutos. Faça cada passo no seu próprio celular.</p>
      </div>

      {concluida ? (
        <Conclusao
          titulo="Muito bem! Você concluiu a lição."
          acoes={
            <>
              <BotaoLink to="/licoes">Escolher outra lição</BotaoLink>
              <BotaoLink variante="secundario" to="/">
                Voltar ao início
              </BotaoLink>
            </>
          }
        >
          <p>Pode repetir quando quiser. Treinar ajuda a lembrar.</p>
        </Conclusao>
      ) : (
        <PassoAPasso
          passos={passos}
          ilustracoes={ilustracoes}
          outroJeito={(i) => licao.passos[i].outroJeito}
          aoConcluir={() => setConcluida(true)}
        />
      )}
    </Tela>
  );
}
