import { Link, Navigate } from "react-router-dom";
import { usePreferencias } from "../contexto/Preferencias";
import { Tela } from "../componentes/Tela";
import { TextoLido } from "../componentes/TextoLido";
import { Ondas } from "../componentes/Ondas";
import { IconeAjustes, IconeAltoFalante, IconeEscudo, IconeLivro, IconeMicrofone } from "../componentes/Icones";
import { useFala } from "../voz/FalaContexto";

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia!";
  if (hora < 18) return "Boa tarde!";
  return "Boa noite!";
}

const OPCOES = [
  { rota: "/perguntar", rotulo: "Perguntar falando", Icone: IconeMicrofone },
  { rota: "/licoes", rotulo: "Lições", Icone: IconeLivro },
  { rota: "/golpe", rotulo: "Isso é golpe?", Icone: IconeEscudo },
];
const PERGUNTA = "O que você quer fazer?";
const AJUSTES = "Ajustes de letra e voz";

/** T2 Início (wf_01): ondas sonoras em tela inteira atrás de cartões de vidro. */
export default function Inicio() {
  const { configurado } = usePreferencias();
  const { falar, falando, parar } = useFala();
  if (!configurado) return <Navigate to="/boas-vindas" replace />;

  const ola = saudacao();
  // Lê a tela inteira: cada cartão se destaca quando o nome dele é falado.
  const lerTela = () => falar([ola, PERGUNTA, ...OPCOES.map((o) => `${o.rotulo}.`), `${AJUSTES}.`].join(" "), true);

  const cabecalho = (
    <header className="inicio__topo">
      <p className="inicio__marca"><span className="inicio__ponto" aria-hidden="true" /> Escuta Ativa</p>
      <h1 className="inicio__saudacao"><TextoLido texto={ola} /></h1>
      <TextoLido como="p" className="inicio__pergunta" texto={PERGUNTA} />
      <button className="inicio__ouvir" onClick={falando ? parar : lerTela}>
        <IconeAltoFalante /> {falando ? "Parar a leitura" : "Ouvir esta tela"}
      </button>
    </header>
  );

  return (
    <>
      <Ondas estado={falando ? "falando" : "repouso"} />
      <Tela titulo="Escuta Ativa" voltar={false} cabecalho={cabecalho}>
        <nav className="inicio__opcoes" aria-label="Opções principais">
          {OPCOES.map(({ rota, rotulo, Icone }) => (
            <Link key={rota} className="cartao-vidro" to={rota}>
              <span className="cartao-vidro__icone"><Icone /></span>
              <TextoLido texto={rotulo} />
            </Link>
          ))}
        </nav>
        <div className="rodape">
          <Link className="botao botao--secundario" to="/ajustes">
            <IconeAjustes /> <TextoLido texto={AJUSTES} />
          </Link>
        </div>
      </Tela>
    </>
  );
}
