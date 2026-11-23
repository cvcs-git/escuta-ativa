import { Link, Navigate } from "react-router-dom";
import { usePreferencias } from "../contexto/Preferencias";
import { Tela } from "../componentes/Tela";
import { IconeAjustes, IconeEscudo, IconeLivro, IconeMicrofone } from "../componentes/Icones";

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia!";
  if (hora < 18) return "Boa tarde!";
  return "Boa noite!";
}

/** T2 Início (wf_01) */
export default function Inicio() {
  const { configurado } = usePreferencias();
  if (!configurado) return <Navigate to="/boas-vindas" replace />;

  return (
    <Tela titulo="Escuta Ativa" voltar={false}>
      <h2 className="inicio__saudacao">
        {saudacao()}
        <br />O que você quer fazer?
      </h2>
      <nav className="inicio__opcoes" aria-label="Opções principais">
        <Link className="botao inicio__perguntar" to="/perguntar">
          <span className="inicio__mic"><IconeMicrofone /></span>
          Perguntar falando
        </Link>
        <Link className="botao" to="/licoes">
          <IconeLivro /> Lições
        </Link>
        <Link className="botao" to="/golpe">
          <IconeEscudo /> Isso é golpe?
        </Link>
      </nav>
      <div className="rodape">
        <Link className="botao botao--secundario" to="/ajustes">
          <IconeAjustes /> Ajustes de letra e voz
        </Link>
      </div>
    </Tela>
  );
}
