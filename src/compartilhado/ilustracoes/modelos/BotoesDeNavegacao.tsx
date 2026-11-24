import type { EspecIlustracao } from "@/servicos/ia";
import { ROTULOS_NAVEGACAO } from "@/servicos/ia/ilustracao";
import { AvisoNaTela, Cabecalho, GRAFITE, LARANJA, LINHA, Toque } from "../pecas";

type Props = Extract<EspecIlustracao, { modelo: "navegacao" }>;

const X = { voltar: 60, inicio: 120, recentes: 180 } as const;
const Y_BARRA = 284;

/** Barra de navegação do Android (Voltar, Início, Aplicativos abertos) sobre um aplicativo qualquer. */
export function BotoesDeNavegacao({ alvo }: Props) {
  const estilo = (id: keyof typeof X) => ({
    fill: "none",
    stroke: id === alvo ? LARANJA : GRAFITE,
    strokeWidth: id === alvo ? 3 : 2.4,
    strokeLinejoin: "round" as const,
  });
  return (
    <>
      <Cabecalho titulo="Aplicativo" />
      {[96, 122, 148, 174].map((y, i) => (
        <rect key={y} x="30" y={y} width={i % 2 ? 130 : 170} height="10" rx="5" fill={LINHA} />
      ))}
      <AvisoNaTela y={224} texto={ROTULOS_NAVEGACAO[alvo]} />
      <rect x="15" y={Y_BARRA - 22} width="210" height="44" fill="#fff" />
      <line x1="15" y1={Y_BARRA - 22} x2="225" y2={Y_BARRA - 22} stroke={LINHA} strokeWidth="1.5" />
      <path
        {...estilo("voltar")}
        d={`M${X.voltar + 6} ${Y_BARRA - 8} L${X.voltar - 7} ${Y_BARRA} L${X.voltar + 6} ${Y_BARRA + 8} Z`}
      />
      <circle {...estilo("inicio")} cx={X.inicio} cy={Y_BARRA} r="8" />
      <rect {...estilo("recentes")} x={X.recentes - 7} y={Y_BARRA - 7} width="14" height="14" rx="2" />
      <Toque x={X[alvo]} y={Y_BARRA} />
    </>
  );
}
