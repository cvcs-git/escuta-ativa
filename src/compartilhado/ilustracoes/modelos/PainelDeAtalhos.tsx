import type { EspecIlustracao } from "@/servicos/ia";
import { normalizar } from "@/compartilhado/utilitarios/texto";
import { APOIO, GRAFITE, LARANJA, LINHA, Toque } from "../pecas";
import { curto } from "../auxiliares";

type Props = Extract<EspecIlustracao, { modelo: "atalhos" }>;

const LARGURA = 96;
const ALTURA = 44;
const posicao = (i: number) => ({ x: 22 + (i % 2) * (LARGURA + 8), y: 92 + Math.floor(i / 2) * (ALTURA + 10) });
/** Ícone à direita do quadradinho: o dedo aponta para ele e não cobre o nome. */
const X_ICONE = LARGURA - 14;
/** Por linha: o quadradinho apontado tem menos espaço, por causa do círculo do dedo. */
const LETRAS = { alvo: 8, outros: 10 };

/** Nome em até duas linhas ("Modo / avião"), abreviando só o que ainda não couber. */
function linhasDoNome(nome: string, letras: number): string[] {
  const limpo = nome.trim();
  if (limpo.length <= letras) return [limpo];
  const espaco = limpo.indexOf(" ");
  if (espaco < 0) return [curto(limpo, letras)];
  return [curto(limpo.slice(0, espaco), letras), curto(limpo.slice(espaco + 1), letras)];
}

/** Ícone simples reconhecido pelo nome do atalho (Wi-Fi, lanterna, avião...); os demais ganham a inicial. */
function IconeDoAtalho({ nome, cx, cy, cor }: { nome: string; cx: number; cy: number; cor: string }) {
  const n = normalizar(nome);
  const s = {
    fill: "none",
    stroke: cor,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (n.includes("wi")) {
    return (
      <g {...s}>
        <path d={`M${cx - 8} ${cy - 2} a11 11 0 0 1 16 0`} />
        <path d={`M${cx - 4.5} ${cy + 2} a6 6 0 0 1 9 0`} />
        <circle cx={cx} cy={cy + 6} r="1.3" fill={cor} />
      </g>
    );
  }
  if (n.includes("lanterna")) {
    return <path {...s} d={`M${cx - 4} ${cy - 8} h8 v4 l-2 4 v8 h-4 v-8 l-2 -4 z`} />;
  }
  if (n.includes("aviao")) {
    return <path {...s} d={`M${cx} ${cy - 9} v18 M${cx - 9} ${cy + 1} l9 -4 9 4 M${cx - 4} ${cy + 8} l4 -2 4 2`} />;
  }
  if (n.includes("bluetooth")) {
    return <path {...s} d={`M${cx - 5} ${cy - 4} l10 8 -5 4 v-16 l5 4 -10 8`} />;
  }
  if (n.includes("silencio") || n.includes("som") || n.includes("vibra")) {
    return <path {...s} d={`M${cx - 6} ${cy + 4} h12 l-2 -3 v-4 a4 4 0 0 0 -8 0 v4 z M${cx - 1.5} ${cy + 7} h3`} />;
  }
  if (n.includes("gir") || n.includes("rota")) {
    return <path {...s} d={`M${cx + 7} ${cy - 1} a7 7 0 1 0 -2 5 M${cx + 7} ${cy - 7} v6 h-6`} />;
  }
  if (n.includes("local")) {
    return <path {...s} d={`M${cx} ${cy + 9} c-6 -6 -7 -9 -7 -12 a7 7 0 0 1 14 0 c0 3 -1 6 -7 12 z`} />;
  }
  return (
    <text x={cx} y={cy + 5} fontSize="13" fontWeight="700" textAnchor="middle" fill={cor}>
      {nome.trim()[0]?.toUpperCase()}
    </text>
  );
}

/** Painel de atalhos (desliza do alto da tela): quadradinhos de Wi-Fi, lanterna, modo avião... */
export function PainelDeAtalhos({ atalhos, alvo, ligar }: Props) {
  const { x, y } = posicao(alvo);
  return (
    <>
      <rect x="15" y="40" width="210" height="34" fill="#fff" />
      <rect x="30" y="52" width="180" height="10" rx="5" fill={LINHA} />
      <rect x="30" y="52" width="110" height="10" rx="5" fill="#bdb8ad" />
      {atalhos.map((nome, i) => {
        const p = posicao(i);
        // Só o atalho do passo aparece no estado atual (antes do toque); os outros ficam desligados.
        const aceso = i === alvo && !ligar;
        const cor = aceso ? "#fff" : GRAFITE;
        return (
          <g key={nome + i}>
            <rect
              x={p.x}
              y={p.y}
              width={LARGURA}
              height={ALTURA}
              rx="22"
              fill={aceso ? LARANJA : "#fff"}
              stroke={i === alvo ? LARANJA : LINHA}
              strokeWidth={i === alvo ? 2.5 : 1.5}
            />
            <IconeDoAtalho nome={nome} cx={p.x + X_ICONE} cy={p.y + ALTURA / 2} cor={cor} />
            {linhasDoNome(nome, i === alvo ? LETRAS.alvo : LETRAS.outros).map((linha, n, todas) => (
              <text
                key={n}
                x={p.x + 14}
                y={p.y + (todas.length === 1 ? 27 : 20 + n * 13)}
                fontSize="10.5"
                fontWeight={i === alvo ? 700 : 400}
                fill={cor}
              >
                {linha}
              </text>
            ))}
          </g>
        );
      })}
      <text x="120" y="300" fontSize="11" textAnchor="middle" fill={APOIO}>
        {ligar ? "Toque no atalho para ligar." : "Toque no atalho para desligar."}
      </text>
      <Toque x={x + X_ICONE} y={y + ALTURA / 2} />
    </>
  );
}
