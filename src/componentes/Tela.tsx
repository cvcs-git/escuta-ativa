import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IconeVoltar } from "./Icones";
import { AvisoConexao } from "./AvisoConexao";

type Props = { titulo: string; voltar?: boolean | string; cabecalho?: ReactNode; children: ReactNode };

/** Estrutura comum: botão "Voltar" com texto (88 px), título e aviso de conexão. */
export function Tela({ titulo, voltar = true, cabecalho, children }: Props) {
  const navegar = useNavigate();
  const aoVoltar = () => (typeof voltar === "string" ? navegar(voltar) : navegar(-1));
  return (
    <div className="tela">
      {cabecalho ?? (
      <header className={`cabecalho ${voltar ? "" : "cabecalho--sem-voltar"}`}>
        {voltar && (
          <button className="botao botao--secundario botao-voltar" onClick={aoVoltar}>
            <IconeVoltar /> Voltar
          </button>
        )}
        <h1>{titulo}</h1>
      </header>
      )}
      <AvisoConexao />
      <main className="conteudo">{children}</main>
    </div>
  );
}
