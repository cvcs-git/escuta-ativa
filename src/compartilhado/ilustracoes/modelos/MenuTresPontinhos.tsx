import type { EspecIlustracao } from "@/servicos/ia";
import { Cabecalho, GRAFITE, LARANJA, LINHA, Toque } from "../pecas";
import { curto } from "../auxiliares";

type Props = Extract<EspecIlustracao, { modelo: "menu" }>;

const TOPO = 66;
const ALTURA_ITEM = 38;

/** Menu dos três pontinhos aberto sobre a tela, com o item do passo destacado. */
export function MenuTresPontinhos({ titulo, itens, alvo }: Props) {
  return (
    <>
      <Cabecalho titulo={titulo} />
      <g fill={GRAFITE}>
        <circle cx="208" cy="49" r="2.4" />
        <circle cx="208" cy="56" r="2.4" />
        <circle cx="208" cy="63" r="2.4" />
      </g>
      <rect x="28" y="92" width="120" height="30" rx="10" fill="#fff" />
      <rect x="92" y="132" width="110" height="30" rx="10" fill="#dcedc8" />
      {/* Fundo escurecido: o menu fica por cima da tela. */}
      <rect x="15" y="74" width="210" height="235" fill="rgba(33,33,33,.18)" />
      <rect x="96" y={TOPO} width="122" height={itens.length * ALTURA_ITEM + 12} rx="12" fill="#fff" stroke={LINHA} />
      {itens.map((item, i) => (
        <text
          key={item + i}
          x="110"
          y={TOPO + 30 + i * ALTURA_ITEM}
          fontSize="12.5"
          fontWeight={i === alvo ? 700 : 400}
          fill={GRAFITE}
        >
          {curto(item, 15)}
        </text>
      ))}
      <rect
        x="100"
        y={TOPO + 8 + alvo * ALTURA_ITEM}
        width="114"
        height={ALTURA_ITEM - 4}
        rx="8"
        fill="none"
        stroke={LARANJA}
        strokeWidth="2"
      />
      <Toque x={204} y={TOPO + 25 + alvo * ALTURA_ITEM} />
    </>
  );
}
