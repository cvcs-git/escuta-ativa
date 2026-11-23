/** T4 Lições (wf_09): lista das lições, que pode ser ouvida em voz. */
import { Link } from "react-router-dom";
import { Botao } from "@/compartilhado/componentes/Botao";
import { IconeAltoFalante, IconeAvancar } from "@/compartilhado/componentes/Icones";
import { Tela } from "@/compartilhado/componentes/Tela";
import { TextoLido } from "@/compartilhado/componentes/TextoLido";
import { useFala } from "@/servicos/voz/FalaProvider";
import { useLerAoAbrir } from "@/servicos/voz/useLerAoAbrir";
import { LICOES } from "./licoes";
import "./licoes.css";

const INTRODUCAO = "Escolha o que quer aprender. Todas funcionam sem internet.";
const TEXTO_DA_TELA = [INTRODUCAO, ...LICOES.map((licao) => `${licao.titulo}.`)].join(" ");

export default function PaginaLicoes() {
  const { falar, falando, parar } = useFala();
  useLerAoAbrir(TEXTO_DA_TELA);

  return (
    <Tela titulo="Lições" voltar="/">
      <TextoLido como="p" className="apoio" texto={INTRODUCAO} />
      <Botao variante="secundario" onClick={falando ? parar : () => falar(TEXTO_DA_TELA, true)}>
        <IconeAltoFalante /> {falando ? "Parar a leitura" : "Ouvir as lições"}
      </Botao>

      <ul className="lista-licoes">
        {LICOES.map((licao) => (
          <li key={licao.id}>
            <Link className="cartao licao-item" to={`/licoes/${licao.id}`}>
              <span className="licao-item__texto">
                <TextoLido className="licao-item__titulo" texto={licao.titulo} />
                <span className="apoio">
                  {licao.passos.length} passos, cerca de {licao.minutos} minutos
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
