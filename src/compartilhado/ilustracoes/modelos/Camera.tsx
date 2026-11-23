import type { EspecIlustracao } from "@/servicos/ia";
import { GRAFITE, LARANJA, Toque } from "../pecas";

type Props = Extract<EspecIlustracao, { modelo: "camera" }>;

const DICAS = {
  foto: "Toque no botão branco",
  qrcode: "Aponte para o QR Code",
  codigo_barras: "Aponte para o código de barras",
} as const;

/** Moldura laranja nos cantos de uma área (onde posicionar o código). */
function Cantos({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const d = `M${x1} ${y1 + 10} v-10 h12 M${x2 - 12} ${y1} h12 v10 M${x2} ${y2 - 10} v10 h-12 M${x1 + 12} ${y2} h-12 v-10`;
  return <path d={d} fill="none" stroke={LARANJA} strokeWidth="4" strokeLinecap="round" />;
}

/** Câmera: tirar foto, virar para selfie, ler QR Code ou código de barras. */
export function Camera({ modo, alvo }: Props) {
  const dica = alvo === "virar" ? "Toque nas setas para virar" : DICAS[modo];
  return (
    <>
      <rect x="15" y="11" width="210" height="298" rx="22" fill="#263238" />
      <rect x="40" y="40" width="160" height="26" rx="13" fill="rgba(0,0,0,.55)" />
      <text x="120" y="57" fontSize="11" fontWeight="700" textAnchor="middle" fill="#fff">
        {dica}
      </text>

      {modo === "codigo_barras" && (
        <>
          <rect x="36" y="122" width="168" height="80" rx="6" fill="#fff" />
          {Array.from({ length: 30 }, (_, k) => (
            <rect key={k} x={46 + k * 5} y="132" width={k % 3 === 0 ? 3 : 1.6} height="54" fill={GRAFITE} />
          ))}
          <Cantos x1={30} y1={102} x2={210} y2={212} />
          <line x1="36" y1="162" x2="204" y2="162" stroke={LARANJA} strokeWidth="2" />
        </>
      )}

      {modo === "qrcode" && (
        <>
          <rect x="70" y="100" width="100" height="100" fill="#fff" />
          {[
            [78, 108],
            [138, 108],
            [78, 168],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="24" height="24" fill="none" stroke={GRAFITE} strokeWidth="5" />
          ))}
          {[
            [112, 112],
            [120, 124],
            [112, 140],
            [132, 146],
            [146, 140],
            [120, 160],
            [140, 166],
            [154, 178],
            [128, 182],
            [112, 176],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill={GRAFITE} />
          ))}
          <Cantos x1={60} y1={90} x2={180} y2={210} />
        </>
      )}

      {modo === "foto" && (
        <>
          <circle cx="120" cy="140" r="40" fill="#a1887f" opacity=".85" />
          <path d="M60 250 a60 46 0 0 1 120 0" fill="#a1887f" opacity=".85" />
        </>
      )}

      {/* Botão de tirar foto e setas para virar a câmera */}
      <circle cx="120" cy="268" r="22" fill="#fff" stroke="#9e9e9e" strokeWidth="3" />
      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <path d="M178 262 a9 9 0 0 1 15 -3 M196 274 a9 9 0 0 1 -15 3" />
        <path d="M193 255 v5 h-5 M181 281 v-5 h5" />
      </g>
      {alvo === "disparar" && <Toque x={120} y={268} />}
      {alvo === "virar" && <Toque x={187} y={268} />}
    </>
  );
}
