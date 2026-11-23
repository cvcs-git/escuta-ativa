import type { EspecIlustracao } from "@/servicos/ia";
import { GlifoApp, Toque, VERMELHO } from "../pecas";
import { curto } from "../auxiliares";

type Props = Extract<EspecIlustracao, { modelo: "chamada" }>;

/** Telefone "desligar": o mesmo desenho do botão vermelho em todas as chamadas. */
const caminhoDesligar = (cx: number, cy: number) =>
  `M${cx - 12} ${cy + 2} a16 8 0 0 1 24 0 l-3 4 -5 -2 v-3 a14 14 0 0 0 -8 0 v3 l-5 2z`;

/** Ligação recebida (atender/recusar) ou em andamento (mudo, viva-voz, desligar). */
export function Chamada({ contato, tipo, video, alvo }: Props) {
  const recebida = tipo === "recebida";
  const posicoes: Record<string, [number, number]> = recebida
    ? { recusar: [70, 262], atender: [170, 262] }
    : { mudo: [62, 252], viva_voz: [120, 252], desligar: [178, 252] };

  return (
    <>
      <rect x="15" y="11" width="210" height="298" rx="22" fill="#37474f" />
      <circle cx="120" cy="104" r="34" fill="#a1887f" />
      <text x="120" y="166" fontSize="15" fontWeight="700" textAnchor="middle" fill="#fff">
        {curto(contato, 18)}
      </text>
      <text x="120" y="186" fontSize="11" textAnchor="middle" fill="#cfd8dc">
        {recebida ? (video ? "Chamada de vídeo recebida" : "Chamada recebida") : "Em ligação · 01:24"}
      </text>

      {recebida ? (
        <>
          <circle cx="70" cy="262" r="22" fill={VERMELHO} />
          <path d={caminhoDesligar(70, 262)} fill="#fff" />
          <text x="70" y="298" fontSize="10.5" textAnchor="middle" fill="#fff">
            Recusar
          </text>
          <circle cx="170" cy="262" r="22" fill="#2e7d32" />
          {video ? (
            <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round">
              <rect x="159" y="256" width="15" height="12" rx="2" />
              <path d="M174 259 l6 -3 v12 l-6 -3" />
            </g>
          ) : (
            <GlifoApp tipo="telefone" cx={171} cy={263} />
          )}
          <text x="170" y="298" fontSize="10.5" textAnchor="middle" fill="#fff">
            Atender
          </text>
        </>
      ) : (
        <>
          {(
            [
              ["Mudo", 62, "#546e7a"],
              ["Viva-voz", 120, "#546e7a"],
              ["Desligar", 178, VERMELHO],
            ] as const
          ).map(([rotulo, x, cor]) => (
            <g key={rotulo}>
              <circle cx={x} cy="252" r="22" fill={cor} />
              <text x={x} y="290" fontSize="10.5" textAnchor="middle" fill="#fff">
                {rotulo}
              </text>
            </g>
          ))}
          <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <rect x="58" y="242" width="8" height="13" rx="4" />
            <path d="M54 251 a8 8 0 0 0 16 0 M52 240 l20 22" />
          </g>
          <path d="M112 247 h4 l6 -5 v20 l-6 -5 h-4z" fill="#fff" />
          <path d="M126 246 a7 7 0 0 1 0 12" fill="none" stroke="#fff" strokeWidth="2" />
          <path d={caminhoDesligar(178, 252)} fill="#fff" />
        </>
      )}
      <Toque x={posicoes[alvo][0]} y={posicoes[alvo][1]} />
    </>
  );
}
