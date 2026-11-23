import type { EspecIlustracao } from "@/servicos/ia";
import { Cabecalho, LinhaDeLista, Toque } from "../pecas";

type Props = Extract<EspecIlustracao, { modelo: "lista" }>;

/** Lista de opções (menus de configurações, contatos, conversas); o dedo fica à direita, sem cobrir o texto. */
export function ListaDeOpcoes({ titulo, itens, alvo }: Props) {
  return (
    <>
      <Cabecalho titulo={titulo} />
      {itens.map((item, i) => (
        <LinhaDeLista key={item + i} y={80 + i * 44} texto={item} destaque={i === alvo} />
      ))}
      <Toque x={196} y={80 + alvo * 44 + 22} />
    </>
  );
}
