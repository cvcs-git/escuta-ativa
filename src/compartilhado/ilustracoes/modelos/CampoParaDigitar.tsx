import type { EspecIlustracao } from "@/servicos/ia";
import { APOIO, BotaoNaTela, Cabecalho, GRAFITE, LARANJA, LINHA, Toque } from "../pecas";
import { curto } from "../auxiliares";

type Props = Extract<EspecIlustracao, { modelo: "campo" }>;

const ESPACO = 62;

/** Até 3 campos de texto; o campo do passo tem borda laranja e cursor. */
export function CampoParaDigitar({ titulo, campos, alvo, confirmar }: Props) {
  return (
    <>
      <Cabecalho titulo={titulo} />
      {campos.map(({ rotulo, exemplo }, i) => {
        const y = 92 + i * ESPACO;
        const ativo = i === alvo;
        const cursor = 40 + Math.min(exemplo.length, 24) * 6.1;
        return (
          <g key={rotulo + i}>
            <text x="30" y={y + 10} fontSize="12" fontWeight="700" fill={GRAFITE}>
              {curto(rotulo, 26)}
            </text>
            <rect
              x="28"
              y={y + 18}
              width="184"
              height="36"
              rx="8"
              fill="#fff"
              stroke={ativo ? LARANJA : LINHA}
              strokeWidth="2"
            />
            <text x="40" y={y + 41} fontSize="12" fill={APOIO}>
              {curto(exemplo, 24)}
            </text>
            {ativo && <line x1={cursor} y1={y + 27} x2={cursor} y2={y + 45} stroke={GRAFITE} strokeWidth="1.6" />}
          </g>
        );
      })}
      {confirmar && <BotaoNaTela x={28} y={262} w={184} texto={curto(confirmar, 24)} cor={LARANJA} />}
      <Toque x={188} y={92 + alvo * ESPACO + 36} />
    </>
  );
}
