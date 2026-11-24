/**
 * T2 Início (wf_01): ondas sonoras em tela inteira e, por cima delas, a mesma folha de
 * leitura opaca do Perguntar e do Isso é golpe?, com três cartões do mesmo tamanho.
 * "Ouvir esta tela" lê as opções, e cada cartão se destaca quando o nome dele é falado
 * (ajuda quem não lê). Ao lado dele fica o botão de silêncio.
 */
import { Link, Navigate } from "react-router-dom";
import { BotaoLink } from "@/compartilhado/componentes/Botao";
import { BotaoSom } from "@/compartilhado/componentes/BotaoSom";
import {
  IconeAjustes,
  IconeAltoFalante,
  IconeEscudo,
  IconeLivro,
  IconeMicrofone,
} from "@/compartilhado/componentes/Icones";
import { Ondas } from "@/compartilhado/componentes/Ondas";
import { Rodape, Tela } from "@/compartilhado/componentes/Tela";
import { TextoLido } from "@/compartilhado/componentes/TextoLido";
import { usePreferencias } from "@/compartilhado/preferencias/PreferenciasProvider";
import { useFala } from "@/servicos/voz/FalaProvider";
import "./inicio.css";

const OPCOES = [
  { rota: "/perguntar", rotulo: "Perguntar falando", Icone: IconeMicrofone },
  { rota: "/licoes", rotulo: "Lições", Icone: IconeLivro },
  { rota: "/golpe", rotulo: "Isso é golpe?", Icone: IconeEscudo },
];
const PERGUNTA = "O que você quer fazer?";
const AJUSTES = "Ajustes de letra e voz";

function saudacaoDoHorario() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia!";
  if (hora < 18) return "Boa tarde!";
  return "Boa noite!";
}

export default function PaginaInicio() {
  const { configurado } = usePreferencias();
  const { falar, falando, parar } = useFala();

  // Primeiro acesso: vai para as boas-vindas.
  if (!configurado) return <Navigate to="/boas-vindas" replace />;

  const saudacao = saudacaoDoHorario();
  const lerTela = () =>
    falar([saudacao, PERGUNTA, ...OPCOES.map((o) => `${o.rotulo}.`), `${AJUSTES}.`].join(" "), true);

  const cabecalho = (
    <header className="inicio__topo">
      <p className="inicio__marca">
        <span className="inicio__ponto" aria-hidden="true" /> Escuta Ativa
      </p>
      <h1 className="inicio__saudacao">
        <TextoLido texto={saudacao} />
      </h1>
      <TextoLido como="p" className="inicio__pergunta" texto={PERGUNTA} />
      <div className="inicio__acoes">
        <button type="button" className="inicio__ouvir" onClick={falando ? parar : lerTela}>
          <IconeAltoFalante /> {falando ? "Parar a leitura" : "Ouvir esta tela"}
        </button>
        <BotaoSom />
      </div>
    </header>
  );

  return (
    <>
      <Ondas estado={falando ? "falando" : "repouso"} />
      <Tela titulo="Escuta Ativa" voltar={false} cabecalho={cabecalho} folha>
        <nav className="inicio__opcoes" aria-label="Opções principais">
          {OPCOES.map(({ rota, rotulo, Icone }) => (
            <Link key={rota} className="cartao-vidro" to={rota}>
              <span className="cartao-vidro__icone">
                <Icone />
              </span>
              <TextoLido texto={rotulo} />
            </Link>
          ))}
        </nav>
        <Rodape>
          <BotaoLink variante="secundario" to="/ajustes">
            <IconeAjustes /> <TextoLido texto={AJUSTES} />
          </BotaoLink>
        </Rodape>
      </Tela>
    </>
  );
}
