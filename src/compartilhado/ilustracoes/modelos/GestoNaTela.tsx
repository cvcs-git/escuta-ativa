import type { EspecIlustracao } from "@/servicos/ia";
import { AvisoNaTela, Cabecalho, GlifoApp, LARANJA, Toque } from "../pecas";
import { CORES_APP } from "../auxiliares";

type Props = Extract<EspecIlustracao, { modelo: "gesto" }>;

const CORES_FOTOS = ["#90caf9", "#a5d6a7", "#ffcc80", "#ce93d8", "#80cbc4", "#ef9a9a", "#b0bec5", "#fff59d", "#bcaaa4"];

/** Ícones neutros ao fundo, para o gesto ser o destaque. */
function IconesNeutros() {
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={i}
          x={28 + (i % 3) * 68}
          y={70 + Math.floor(i / 3) * 84}
          width="48"
          height="48"
          rx="13"
          fill="#cfcac0"
        />
      ))}
    </>
  );
}

/** Gestos: deslizar de cima para baixo, de baixo para cima ou segurar (sobre um app ou uma foto). */
export function GestoNaTela({ gesto, sobre }: Props) {
  if (gesto === "segurar" && sobre === "foto") {
    return (
      <>
        <Cabecalho titulo="Galeria" voltar={false} />
        {CORES_FOTOS.map((cor, i) => (
          <rect key={i} x={22 + (i % 3) * 66} y={82 + Math.floor(i / 3) * 66} width="62" height="62" fill={cor} />
        ))}
        <rect
          x="88"
          y="148"
          width="62"
          height="62"
          fill="none"
          stroke={LARANJA}
          strokeWidth="3"
          strokeDasharray="5 4"
        />
        <AvisoNaTela y={296} texto="Segure o dedo por 2 segundos" />
        <Toque x={119} y={179} />
      </>
    );
  }

  if (gesto === "segurar") {
    return (
      <>
        <IconesNeutros />
        <rect x="96" y="70" width="48" height="48" rx="13" fill={CORES_APP.galeria} />
        <GlifoApp tipo="galeria" cx={120} cy={94} />
        <circle cx="120" cy="94" r="32" fill="none" stroke={LARANJA} strokeWidth="3" strokeDasharray="5 5" />
        <AvisoNaTela y={232} texto="Segure o dedo por 2 segundos" />
        <Toque x={120} y={94} />
      </>
    );
  }

  const deCima = gesto === "deslizar_baixo";
  return (
    <>
      <IconesNeutros />
      {deCima && <rect x="15" y="11" width="210" height="40" fill="rgba(191,54,12,.12)" />}
      <g className="ilustracao__seta-gesto">
        <path d={`M78 ${deCima ? 50 : 250} V150`} stroke={LARANJA} strokeWidth="4" strokeLinecap="round" />
        <path
          d={deCima ? "M66 138 L78 152 L90 138" : "M66 162 L78 148 L90 162"}
          fill="none"
          stroke={LARANJA}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <AvisoNaTela y={272} texto={deCima ? "Deslize de cima para baixo" : "Deslize de baixo para cima"} />
      <Toque x={120} y={deCima ? 40 : 240} />
    </>
  );
}
