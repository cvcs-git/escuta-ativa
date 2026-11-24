import type { EspecIlustracao } from "@/servicos/ia";
import { ROTULOS_GALERIA } from "@/servicos/ia/ilustracao";
import { APOIO, Cabecalho, GRAFITE, LARANJA, Toque } from "../pecas";

type Props = Extract<EspecIlustracao, { modelo: "galeria" }>;

const CORES = ["#90caf9", "#a5d6a7", "#ffcc80", "#ce93d8", "#80cbc4", "#ef9a9a", "#b0bec5", "#fff59d", "#bcaaa4"];
const LADO = 62;
const posicao = (i: number) => ({ x: 22 + (i % 3) * (LADO + 4), y: 80 + Math.floor(i / 3) * (LADO + 4) });
const ACOES = ["compartilhar", "editar", "apagar"] as const;
const X_ACAO = { compartilhar: 58, editar: 120, apagar: 182 } as const;

function IconeAcao({ acao, cx, cy, cor }: { acao: (typeof ACOES)[number]; cx: number; cy: number; cor: string }) {
  const s = {
    fill: "none",
    stroke: cor,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (acao === "compartilhar") {
    return (
      <g {...s}>
        <circle cx={cx + 6} cy={cy - 6} r="2.6" />
        <circle cx={cx - 6} cy={cy} r="2.6" />
        <circle cx={cx + 6} cy={cy + 6} r="2.6" />
        <path d={`M${cx - 3.6} ${cy - 1.2} l7.2 -3.6 M${cx - 3.6} ${cy + 1.2} l7.2 3.6`} />
      </g>
    );
  }
  if (acao === "editar") return <path {...s} d={`M${cx - 7} ${cy + 7} l2 -6 9 -9 4 4 -9 9 z`} />;
  return <path {...s} d={`M${cx - 6} ${cy - 5} h12 M${cx - 2} ${cy - 8} h4 M${cx - 5} ${cy - 5} l1 12 h8 l1 -12`} />;
}

/** Galeria em grade: tocar numa foto, ou selecionar e usar Compartilhar, Editar ou Apagar. */
export function GaleriaDeFotos({ alvo, foto, varias }: Props) {
  const selecionando = alvo !== "foto";
  const selecionadas = new Set(selecionando ? (varias ? [foto, (foto + 1) % 9, (foto + 3) % 9] : [foto]) : []);
  const destino = posicao(foto);
  return (
    <>
      <Cabecalho
        titulo={selecionando ? `${selecionadas.size} selecionada${selecionadas.size > 1 ? "s" : ""}` : "Galeria"}
        voltar={false}
      />
      {CORES.map((cor, i) => {
        const p = posicao(i);
        const marcada = selecionadas.has(i);
        return (
          <g key={i}>
            <rect x={p.x} y={p.y} width={LADO} height={LADO} fill={cor} />
            {marcada && (
              <>
                <rect x={p.x} y={p.y} width={LADO} height={LADO} fill="none" stroke={LARANJA} strokeWidth="3" />
                <circle cx={p.x + 50} cy={p.y + 12} r="8" fill={LARANJA} />
                <path
                  d={`M${p.x + 46} ${p.y + 12} l3 3 5 -6`}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </>
            )}
          </g>
        );
      })}
      {selecionando && (
        <>
          <rect x="15" y="262" width="210" height="47" fill="#fff" />
          {ACOES.map((acao) => (
            <g key={acao}>
              {/* Nome acima do ícone: o dedo aponta o ícone e não cobre o nome. */}
              <text
                x={X_ACAO[acao]}
                y={271}
                fontSize="9.5"
                fontWeight={acao === alvo ? 700 : 400}
                textAnchor="middle"
                fill={acao === alvo ? LARANJA : APOIO}
              >
                {ROTULOS_GALERIA[acao]}
              </text>
              <IconeAcao acao={acao} cx={X_ACAO[acao]} cy={298} cor={acao === alvo ? LARANJA : GRAFITE} />
            </g>
          ))}
          <Toque x={X_ACAO[alvo]} y={298} />
        </>
      )}
      {!selecionando && <Toque x={destino.x + LADO / 2} y={destino.y + LADO / 2} />}
    </>
  );
}
