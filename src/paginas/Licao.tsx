import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import licoes from "../dados/licoes.json";
import { Tela } from "../componentes/Tela";
import { PassoAPasso } from "../componentes/PassoAPasso";
import { IconeConfere } from "../componentes/Icones";

/** T5 Lição (wf_03). "Não encontrei" usa o texto revisado pela equipe, sem IA. */
export default function Licao() {
  const { id } = useParams();
  const licao = licoes.find((l) => l.id === id);
  const [concluida, setConcluida] = useState(false);
  const passos = useMemo(() => licao?.passos.map((p) => p.texto) ?? [], [licao]);

  if (!licao) {
    return (
      <Tela titulo="Lição" voltar="/licoes">
        <h2>Não encontrei essa lição.</h2>
        <Link className="botao" to="/licoes">Ver todas as lições</Link>
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
        <section className="conclusao" role="status">
          <span className="conclusao__selo"><IconeConfere /></span>
          <h2>Muito bem! Você concluiu a lição.</h2>
          <p>Pode repetir quando quiser. Treinar ajuda a lembrar.</p>
          <div className="rodape">
            <Link className="botao" to="/licoes">Escolher outra lição</Link>
            <Link className="botao botao--secundario" to="/">Voltar ao início</Link>
          </div>
        </section>
      ) : (
        <PassoAPasso
          passos={passos}
          outroJeito={(i) => licao.passos[i].outroJeito}
          aoConcluir={() => setConcluida(true)}
        />
      )}
    </Tela>
  );
}
