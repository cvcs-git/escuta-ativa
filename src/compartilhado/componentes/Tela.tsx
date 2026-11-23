/**
 * Estrutura comum das telas: botão "Voltar" com texto, título e aviso de conexão.
 *
 * - `voltar`: `true` volta no histórico; uma rota (ex.: "/") vai direto para ela;
 *   `false` esconde o botão (telas de primeiro nível).
 * - `cabecalho`: substitui o cabeçalho padrão (usado na tela inicial).
 * - `folha`: coloca o conteúdo sobre uma "folha de leitura" opaca, para as ondas do
 *   fundo não cruzarem o texto.
 */
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AvisoConexao } from "./AvisoConexao";
import { Botao } from "./Botao";
import { IconeVoltar } from "./Icones";

type PropsTela = {
  titulo: string;
  voltar?: boolean | string;
  cabecalho?: ReactNode;
  folha?: boolean;
  children: ReactNode;
};

export function Tela({ titulo, voltar = true, cabecalho, folha = false, children }: PropsTela) {
  const navegar = useNavigate();
  const aoVoltar = () => (typeof voltar === "string" ? navegar(voltar) : navegar(-1));

  return (
    <div className={folha ? "tela tela--folha" : "tela"}>
      {cabecalho ?? (
        <header className={voltar ? "cabecalho" : "cabecalho cabecalho--sem-voltar"}>
          {voltar && (
            <Botao variante="secundario" className="botao-voltar" onClick={aoVoltar}>
              <IconeVoltar /> Voltar
            </Botao>
          )}
          <h1>{titulo}</h1>
        </header>
      )}
      <AvisoConexao />
      <main className="conteudo">{children}</main>
    </div>
  );
}

/** Grupo de botões no pé da tela, sempre com o mesmo espaçamento entre eles. */
export function Rodape({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rodape ${className}`.trim()}>{children}</div>;
}
