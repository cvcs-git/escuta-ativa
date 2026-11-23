import { Link } from "react-router-dom";
import licoes from "../dados/licoes.json";
import { Tela } from "../componentes/Tela";
import { IconeAvancar } from "../componentes/Icones";

/** T4 Lições (wf_09). As lições vêm de licoes.json e funcionam sem internet. */
export default function Licoes() {
  return (
    <Tela titulo="Lições" voltar="/">
      <p className="apoio">Escolha o que quer aprender. Todas funcionam sem internet.</p>
      <ul className="lista-licoes">
        {licoes.map((l) => (
          <li key={l.id}>
            <Link className="cartao licao-item" to={`/licoes/${l.id}`}>
              <span className="licao-item__texto">
                <span className="licao-item__titulo">{l.titulo}</span>
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
