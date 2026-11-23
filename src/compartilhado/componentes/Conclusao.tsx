import type { ReactNode } from "react";
import { IconeConfere } from "./Icones";
import { Rodape } from "./Tela";
import "./conclusao.css";

type PropsConclusao = { titulo: string; children?: ReactNode; acoes: ReactNode };

/** Tela de conclusão (selo verde), ao terminar uma lição ou um passo a passo. */
export function Conclusao({ titulo, children, acoes }: PropsConclusao) {
  return (
    <section className="conclusao" role="status">
      <span className="conclusao__selo">
        <IconeConfere />
      </span>
      <h2>{titulo}</h2>
      {children}
      <Rodape>{acoes}</Rodape>
    </section>
  );
}
