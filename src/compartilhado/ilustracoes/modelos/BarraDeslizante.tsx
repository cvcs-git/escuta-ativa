import type { EspecIlustracao } from "@/servicos/ia";
import { APOIO, Cabecalho, GRAFITE, LARANJA, LINHA, Toque } from "../pecas";
import { curto } from "../auxiliares";

type Props = Extract<EspecIlustracao, { modelo: "barra" }>;

/** Barra deslizante (volume, brilho, tamanho da letra) com seta indicando para onde arrastar. */
export function BarraDeslizante({ titulo, rotulo, direcao }: Props) {
  const paraDireita = direcao === "direita";
  const bolinha = paraDireita ? 150 : 90;
  return (
    <>
      <Cabecalho titulo={titulo} />
      <text x="30" y="106" fontSize="13" fontWeight="700" fill={GRAFITE}>
        {curto(rotulo, 24)}
      </text>
      <line x1="40" y1="146" x2="200" y2="146" stroke={LINHA} strokeWidth="5" strokeLinecap="round" />
      <line x1="40" y1="146" x2={bolinha} y2="146" stroke={LARANJA} strokeWidth="5" strokeLinecap="round" />
      <path
        d={paraDireita ? "M86 172 H140 M132 165 l8 7 -8 7" : "M154 172 H100 M108 165 l-8 7 8 7"}
        fill="none"
        stroke={LARANJA}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="30" y="244" fontSize="11" fill={APOIO}>
        {paraDireita ? "Arraste para a direita para aumentar." : "Arraste para a esquerda para diminuir."}
      </text>
      <circle cx={bolinha} cy="146" r="10" fill="#fff" stroke={LARANJA} strokeWidth="3" />
      <Toque x={bolinha} y={146} />
    </>
  );
}
