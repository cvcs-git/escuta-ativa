/**
 * Estado de erro do serviço de IA (wf_07). Explica o que houve em linguagem simples,
 * lê a explicação em voz e oferece um caminho: tentar de novo ou ir para as lições,
 * que funcionam sem internet.
 */
import type { TipoErroIA } from "@/servicos/ia";
import { useLerAoAbrir } from "@/servicos/voz/useLerAoAbrir";
import { Botao, BotaoLink } from "./Botao";
import { IconeRepetir } from "./Icones";
import { Rodape } from "./Tela";
import { TextoLido } from "./TextoLido";
import "./espera-e-erro.css";

const MENSAGENS: Record<TipoErroIA, { titulo: string; texto: string }> = {
  timeout: {
    titulo: "A resposta está demorando",
    texto: "O assistente não respondeu a tempo. Isso acontece às vezes e não é culpa sua.",
  },
  indisponivel: {
    titulo: "O assistente está indisponível agora",
    texto: "Isso acontece às vezes e não é culpa sua. Seu celular está funcionando normalmente.",
  },
  formato: {
    titulo: "Não consegui entender a resposta",
    texto: "O assistente respondeu de um jeito que não consigo mostrar. Tente de novo.",
  },
  limite: {
    titulo: "Muitas perguntas seguidas",
    texto: "O assistente precisa de uma pausa. Espere um minuto antes de tentar de novo.",
  },
  sem_internet: {
    titulo: "Sem internet",
    texto: "Para usar o assistente, o celular precisa estar conectado. As lições funcionam sem internet.",
  },
};

type PropsEstadoErro = { tipo: TipoErroIA; aoTentarDeNovo: () => void };

export function EstadoErro({ tipo, aoTentarDeNovo }: PropsEstadoErro) {
  const { titulo, texto } = MENSAGENS[tipo];
  const podeTentarDeNovo = tipo !== "limite"; // erro 429: sem nova tentativa
  useLerAoAbrir(`${titulo}. ${texto}`);

  return (
    <section className="estado-erro" role="alert">
      <IconeRepetir className="estado-erro__icone" />
      <TextoLido como="h2" texto={titulo} />
      <TextoLido como="p" className="apoio" texto={texto} />
      <Rodape>
        {podeTentarDeNovo && <Botao onClick={aoTentarDeNovo}>Tentar de novo</Botao>}
        <BotaoLink variante="secundario" to="/licoes">
          Ver as lições
        </BotaoLink>
        <p className="apoio centro">As lições funcionam mesmo sem internet.</p>
      </Rodape>
    </section>
  );
}
