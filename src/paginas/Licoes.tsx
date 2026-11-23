import { Link } from "react-router-dom";
import licoes from "../dados/licoes.json";
import { Tela } from "../componentes/Tela";
import { IconeAltoFalante, IconeAvancar } from "../componentes/Icones";
import { TextoLido } from "../componentes/TextoLido";
import { useFala, useLerAoAbrir } from "../voz/FalaContexto";

const INTRO = "Escolha o que quer aprender. Todas funcionam sem internet.";

/** T4 Lições (wf_09). As lições vêm de licoes.json e funcionam sem internet. */
export default function Licoes() {
  const { falar, falando, parar } = useFala();
  const textoDaTela = [INTRO, ...licoes.map((l) => `${l.titulo}.`)].join(" ");
  const lerLista = () => falar(textoDaTela, true);
  useLerAoAbrir(textoDaTela);
  return (
    <Tela titulo="Lições" voltar="/">
      <TextoLido como="p" className="apoio" texto={INTRO} />
      <button className="botao botao--secundario" onClick={falando ? parar : lerLista}>
        <IconeAltoFalante /> {falando ? "Parar a leitura" : "Ouvir as lições"}
      </button>
      <ul className="lista-licoes">
        {licoes.map((l) => (
          <li key={l.id}>
            <Link className="cartao licao-item" to={`/licoes/${l.id}`}>
              <span className="licao-item__texto">
                <TextoLido className="licao-item__titulo" texto={l.titulo} />
                <span className="apoio">
                  {l.passos.length} passos, cerca de {l.minutos} minutos
                </span>
              </span>
              <IconeAvancar className="licao-item__seta" />
            </Link>
          </li>
        ))}
      </ul>
    </Tela>
  );
}
