import type { EspecIlustracao } from "@/servicos/ia";
import { APOIO, Cabecalho, GRAFITE, LARANJA, LINHA, Toque, VERDE } from "../pecas";

type Props = Extract<EspecIlustracao, { modelo: "teclado" }>;

const LINHAS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const LARGURA_TECLA = 19.5;
const ESPACO_TECLA = 1.5;
const DESTAQUE = "#fde3d8";

/** Teclado com uma tecla em destaque: microfone, apagar, enviar ou uma letra (com opções de acento). */
export function Teclado({ texto, alvo, segurar, opcoes }: Props) {
  const posicoes: Record<string, [number, number]> = {
    apagar: [204, 247],
    microfone: [71, 280],
    enviar: [203, 280],
  };
  const tecla = (id: string) => ({
    fill: alvo === id ? DESTAQUE : "#bdb8ad",
    stroke: alvo === id ? LARANJA : "none",
    strokeWidth: 2,
  });

  const letras = LINHAS.flatMap((linha, li) => {
    const x0 = 18 + (li === 1 ? 10 : li === 2 ? 30 : 0);
    return [...linha].map((letra, k) => {
      const x = x0 + k * (LARGURA_TECLA + ESPACO_TECLA);
      const y = 174 + li * 30;
      posicoes[letra] = [x + LARGURA_TECLA / 2, y + 13];
      const ativa = letra === alvo;
      return (
        <g key={letra}>
          <rect
            x={x}
            y={y}
            width={LARGURA_TECLA}
            height="26"
            rx="4"
            fill={ativa ? DESTAQUE : "#fff"}
            stroke={ativa ? LARANJA : "none"}
            strokeWidth="2"
          />
          <text x={x + LARGURA_TECLA / 2} y={y + 17} fontSize="11" textAnchor="middle" fill={GRAFITE}>
            {letra}
          </text>
        </g>
      );
    });
  });

  const [ax, ay] = posicoes[alvo] ?? posicoes.microfone;
  const larguraOpcoes = opcoes.length * 24 + 8;
  const xOpcoes = Math.min(Math.max(ax - larguraOpcoes / 2, 20), 220 - larguraOpcoes);
  const cursor = 42 + texto.length * 6.4;

  return (
    <>
      <Cabecalho titulo="Mensagem" />
      <rect x="28" y="92" width="184" height="40" rx="10" fill="#fff" stroke={LINHA} strokeWidth="1.5" />
      <text x="40" y="117" fontSize="12.5" fill={GRAFITE}>
        {texto}
      </text>
      <line x1={cursor} y1="104" x2={cursor} y2="122" stroke={GRAFITE} strokeWidth="1.6" />
      <rect x="15" y="168" width="210" height="141" fill="#dcd8ce" />

      {letras}

      <rect x="186" y="234" width="36" height="26" rx="4" {...tecla("apagar")} />
      <path
        d="M198 247 l5 -6 h12 v12 h-12z M206 244 l5 6 M211 244 l-5 6"
        fill="none"
        stroke={GRAFITE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="18" y="266" width="34" height="28" rx="4" fill="#bdb8ad" />
      <text x="35" y="284" fontSize="10" textAnchor="middle" fill={GRAFITE}>
        123
      </text>
      <rect x="56" y="266" width="30" height="28" rx="4" {...tecla("microfone")} />
      <rect x="67.5" y="272" width="7" height="10" rx="3.5" fill={GRAFITE} />
      <path d="M65 279 a6 6 0 0 0 12 0 M71 285 v3" fill="none" stroke={GRAFITE} strokeWidth="1.6" />
      <rect x="90" y="266" width="90" height="28" rx="4" fill="#fff" />
      <text x="135" y="284" fontSize="10" textAnchor="middle" fill={APOIO}>
        espaço
      </text>
      <rect
        x="184"
        y="266"
        width="38"
        height="28"
        rx="4"
        fill={alvo === "enviar" ? DESTAQUE : VERDE}
        stroke={alvo === "enviar" ? LARANJA : "none"}
        strokeWidth="2"
      />
      <path d="M196 274 l14 6 -14 6 2 -6z" fill={alvo === "enviar" ? GRAFITE : "#fff"} />

      {opcoes.length > 0 && (
        <g>
          <rect
            x={xOpcoes}
            y="138"
            width={larguraOpcoes}
            height="30"
            rx="8"
            fill="#fff"
            stroke={LARANJA}
            strokeWidth="2"
          />
          {opcoes.map((opcao, k) => (
            <text
              key={opcao}
              x={xOpcoes + 16 + k * 24}
              y="158"
              fontSize="14"
              fontWeight="700"
              textAnchor="middle"
              fill={GRAFITE}
            >
              {opcao}
            </text>
          ))}
        </g>
      )}
      {segurar && opcoes.length === 0 && (
        <text x="120" y="160" fontSize="11.5" fontWeight="700" textAnchor="middle" fill={LARANJA}>
          Segure a tecla
        </text>
      )}
      <Toque x={ax} y={ay} />
    </>
  );
}
