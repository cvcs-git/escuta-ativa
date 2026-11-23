import type { EspecIlustracao } from "@/servicos/ia";
import { APOIO, Cabecalho, GRAFITE, LINHA, Toque, VERDE } from "../pecas";
import { curto } from "../auxiliares";

type Props = Extract<EspecIlustracao, { modelo: "chave" }>;

function LinhaComChave({
  y,
  texto,
  ligada,
  destaque,
}: {
  y: number;
  texto: string;
  ligada: boolean;
  destaque: boolean;
}) {
  return (
    <g>
      <rect x="15" y={y} width="210" height="48" fill="#fff" />
      <line x1="30" y1={y + 48} x2="225" y2={y + 48} stroke={LINHA} strokeWidth="1.2" />
      <text x="30" y={y + 29} fontSize="13" fontWeight={destaque ? 700 : 400} fill={GRAFITE}>
        {curto(texto, 18)}
      </text>
      <rect x="168" y={y + 13} width="40" height="22" rx="11" fill={ligada ? VERDE : "#bdbdbd"} />
      <circle cx={ligada ? 197 : 179} cy={y + 24} r="8" fill="#fff" />
    </g>
  );
}

/** Ajuste com chave liga/desliga. A chave aparece no estado atual, antes do toque. */
export function ChaveLigaDesliga({ titulo, rotulo, outros, ligar }: Props) {
  return (
    <>
      <Cabecalho titulo={titulo} />
      <LinhaComChave y={80} texto={rotulo} ligada={!ligar} destaque />
      {outros.map((texto, i) => (
        <LinhaComChave key={texto + i} y={128 + i * 48} texto={texto} ligada={false} destaque={false} />
      ))}
      <text x="30" y={150 + outros.length * 48} fontSize="11" fill={APOIO}>
        {ligar ? "Toque na chave para ligar." : "Toque na chave para desligar."}
      </text>
      <Toque x={188} y={104} />
    </>
  );
}
