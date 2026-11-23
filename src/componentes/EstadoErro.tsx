import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useFala } from "../voz/FalaContexto";
import { TextoLido } from "./TextoLido";
import type { TipoErroIA } from "../servicos/ia";
import { IconeRepetir } from "./Icones";

const TEXTOS: Record<TipoErroIA, { titulo: string; texto: string }> = {
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

/** Estado de erro do serviço de IA (wf_07). */
export function EstadoErro({ tipo, aoTentarDeNovo }: { tipo: TipoErroIA; aoTentarDeNovo: () => void }) {
  const { titulo, texto } = TEXTOS[tipo];
  const podeTentar = tipo !== "limite";
  const { falar } = useFala();
  useEffect(() => {
    falar(`${titulo}. ${texto}`);
  }, [falar, titulo, texto]);
  return (
    <section className="estado-erro" role="alert">
      <IconeRepetir className="estado-erro__icone" />
      <TextoLido como="h2" texto={titulo} />
      <TextoLido como="p" className="apoio" texto={texto} />
      <div className="rodape">
        {podeTentar && (
          <button className="botao" onClick={aoTentarDeNovo}>
            Tentar de novo
          </button>
        )}
        <Link className="botao botao--secundario" to="/licoes">
          Ver as lições
        </Link>
        <p className="apoio centro">As lições funcionam mesmo sem internet.</p>
      </div>
    </section>
  );
}
