/**
 * Convite para falar (etapa "inicio"): microfone grande com balão "Toque aqui e fale",
 * círculos pulsando e um dedo mostrando o gesto, o mesmo recurso das ilustrações.
 */
import { Botao } from "@/compartilhado/componentes/Botao";
import { IconeMicrofone } from "@/compartilhado/componentes/Icones";
import { Rodape } from "@/compartilhado/componentes/Tela";
import { TextoLido } from "@/compartilhado/componentes/TextoLido";
import { CAMINHO_DO_DEDO } from "@/compartilhado/ilustracoes/pecas";
import { TEXTOS } from "../textos";

type Props = { aviso?: string; aoFalar: () => void; aoEscrever: () => void };

export function ConviteParaFalar({ aviso, aoFalar, aoEscrever }: Props) {
  return (
    <section className="perguntar__inicio">
      <TextoLido como="h2" texto={TEXTOS.convite} />
      <TextoLido como="p" className="apoio" texto={TEXTOS.exemplo} />
      {aviso && <TextoLido como="p" className="aviso aviso--neutro" texto={aviso} />}

      <div className="convite">
        <span className="convite__balao" aria-hidden="true">
          Toque aqui e fale
        </span>
        <button type="button" className="convite__disco" onClick={aoFalar} aria-label="Tocar e falar">
          <span className="convite__pulso" aria-hidden="true" />
          <span className="convite__pulso convite__pulso--2" aria-hidden="true" />
          <IconeMicrofone />
        </button>
        <svg className="convite__dedo" viewBox="-14 -6 56 72" aria-hidden="true">
          <path d={CAMINHO_DO_DEDO} fill="#fff" stroke="#212121" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>

      <Rodape>
        <Botao variante="secundario" onClick={aoEscrever}>
          Prefiro escrever
        </Botao>
      </Rodape>
    </section>
  );
}
