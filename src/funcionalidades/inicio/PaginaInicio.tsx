/**
 * T2 Início (wf_01): no topo, centralizados, o símbolo do Escuta Ativa, o nome, a
 * pergunta "O que você quer fazer?" e os botões de ouvir e de silêncio. Embaixo, sobre a
 * folha de leitura, três cartões do mesmo tamanho. "Ouvir esta tela" lê a pergunta e as
 * opções, e cada cartão se destaca quando o nome dele é falado (ajuda quem não lê).
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
import simbolo from "@/compartilhado/marca/simbolo-escuta-ativa.webp";
import "./inicio.css";

const OPCOES = [
  { rota: "/perguntar", rotulo: "Perguntar falando", Icone: IconeMicrofone },
  { rota: "/licoes", rotulo: "Lições", Icone: IconeLivro },
  { rota: "/golpe", rotulo: "Isso é golpe?", Icone: IconeEscudo },
];
const PERGUNTA = "O que você quer fazer?";
const AJUSTES = "Ajustes de letra e voz";

export default function PaginaInicio() {
  const { configurado } = usePreferencias();
  const { falar, falando, parar } = useFala();

  // Primeiro acesso: vai para as boas-vindas.
  if (!configurado) return <Navigate to="/boas-vindas" replace />;

  const lerTela = () => falar([PERGUNTA, ...OPCOES.map((o) => `${o.rotulo}.`), `${AJUSTES}.`].join(" "), true);

  const cabecalho = (
    <header className="inicio__topo">
      {/* O nome vem em texto (não na imagem): fica nítido, centralizado e é lido pelo leitor de tela. */}
      <img className="inicio__simbolo" src={simbolo} alt="" width={500} height={255} />
      <p className="inicio__nome">Escuta Ativa</p>
      <h1 className="inicio__pergunta">
        <TextoLido texto={PERGUNTA} />
      </h1>
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
            <Link key={rota} className="cartao-opcao" to={rota}>
              <span className="cartao-opcao__icone">
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
