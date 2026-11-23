import type { BalaoConversa, EspecIlustracao } from "@/servicos/ia/ilustracao";
import { APOIO, GRAFITE, LINHA, Toque, VERDE } from "../pecas";
import { curto } from "../auxiliares";

type Props = Extract<EspecIlustracao, { modelo: "conversa" }>;

/** Posição dos alvos da barra de digitação. */
const ALVOS_DA_BARRA = { emoji: [40, 279], clipe: [150, 279], camera: [169, 279], microfone: [204, 279] } as const;

const quebrarLinhas = (texto: string) => texto.match(/.{1,22}(\s|$)/g) ?? [texto];

/** Conversa de mensagens: balões (texto ou áudio) e a barra com emoji, clipe, câmera e microfone. */
type BalaoPosicionado = BalaoConversa & {
  x: number;
  topo: number;
  altura: number;
  linhas: string[];
  alvo: [number, number];
};

/** Calcula a posição de cada balão, um abaixo do outro (função pura, fora do render). */
function posicionarBaloes(baloes: BalaoConversa[]): BalaoPosicionado[] {
  let topo = 92;
  return baloes.map((balao) => {
    const x = balao.de === "eu" ? 92 : 26;
    const linhas = balao.tipo === "audio" ? [] : quebrarLinhas(balao.texto ?? "");
    const altura = balao.tipo === "audio" ? 38 : 18 + linhas.length * 15;
    const alvo: [number, number] = balao.tipo === "audio" ? [x + 20, topo + 19] : [x + 61, topo + altura / 2];
    const posicionado = { ...balao, x, topo, altura, linhas, alvo };
    topo += altura + 12;
    return posicionado;
  });
}

/** Conversa de mensagens: balões (texto ou áudio) e a barra com emoji, clipe, câmera e microfone. */
export function Conversa({ contato, baloes, alvo, segurar }: Props) {
  const posicionados = posicionarBaloes(baloes);
  const desenhoDosBaloes = posicionados.map(({ de, tipo, x, topo, altura, linhas }, i) => {
    const fundo = de === "eu" ? "#dcedc8" : "#fff";
    if (tipo === "audio") {
      return (
        <g key={i}>
          <rect x={x} y={topo} width="122" height={altura} rx="12" fill={fundo} />
          <circle cx={x + 20} cy={topo + 19} r="11" fill={VERDE} />
          <path d={`M${x + 16} ${topo + 12} l9 7 -9 7z`} fill="#fff" />
          {[6, 12, 8, 14, 10, 6, 12, 9, 5, 11].map((h, k) => (
            <rect key={k} x={x + 40 + k * 7} y={topo + 19 - h / 2} width="3" height={h} rx="1.5" fill={APOIO} />
          ))}
        </g>
      );
    }
    return (
      <g key={i}>
        <rect x={x} y={topo} width="122" height={altura} rx="12" fill={fundo} />
        {linhas.map((linha, k) => (
          <text key={k} x={x + 10} y={topo + 21 + k * 15} fontSize="11" fill={GRAFITE}>
            {linha.trim()}
          </text>
        ))}
      </g>
    );
  });

  const [ax, ay] = typeof alvo === "number" ? posicionados[alvo].alvo : ALVOS_DA_BARRA[alvo];

  return (
    <>
      {/* Cabeçalho da conversa: voltar, foto, nome, vídeo e ligação */}
      <rect x="15" y="38" width="210" height="40" fill="#fff" />
      <line x1="15" y1="78" x2="225" y2="78" stroke={LINHA} strokeWidth="1.5" />
      <path
        d="M30 52 L24 58 L30 64"
        fill="none"
        stroke={GRAFITE}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="58" r="12" fill="#a1887f" />
      <text x="68" y="63" fontSize="12.5" fontWeight="700" fill={GRAFITE}>
        {curto(contato, 14)}
      </text>
      <g fill="none" stroke={GRAFITE} strokeWidth="2" strokeLinejoin="round">
        <rect x="166" y="52" width="14" height="11" rx="2" />
        <path d="M180 55 l5 -2 v10 l-5 -2" />
        <path d="M198 51 h4 l2 4 -2 1.5 a9 9 0 0 0 4.5 4.5 l1.5 -2 4 1.5 v4 a2 2 0 0 1 -2 2 a14 14 0 0 1 -14 -14 a2 2 0 0 1 2 -2z" />
      </g>

      {desenhoDosBaloes}

      {/* Barra de digitação */}
      <rect x="22" y="262" width="160" height="34" rx="17" fill="#fff" stroke={LINHA} strokeWidth="1.5" />
      <circle cx="40" cy="279" r="8" fill="none" stroke={APOIO} strokeWidth="1.8" />
      <circle cx="37" cy="277" r="1.2" fill={APOIO} />
      <circle cx="43" cy="277" r="1.2" fill={APOIO} />
      <path d="M36.5 281.5 a4 4 0 0 0 7 0" fill="none" stroke={APOIO} strokeWidth="1.5" />
      <text x="54" y="283" fontSize="11" fill={APOIO}>
        Mensagem
      </text>
      <path
        d="M150 272 L143 280 a4 4 0 0 0 6 6 l8 -9 a2.5 2.5 0 0 0 -4 -4 l-7 8"
        fill="none"
        stroke={GRAFITE}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="163" y="274" width="13" height="10" rx="2" fill="none" stroke={GRAFITE} strokeWidth="2" />
      <circle cx="169.5" cy="279" r="2.5" fill="none" stroke={GRAFITE} strokeWidth="1.6" />
      <circle cx="204" cy="279" r="17" fill={VERDE} />
      <rect x="200" y="270" width="8" height="12" rx="4" fill="#fff" />
      <path d="M197 280 a7 7 0 0 0 14 0 M204 287 v3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />

      {segurar && (
        <g>
          <rect x="40" y="226" width="160" height="24" rx="12" fill={GRAFITE} />
          <text x="120" y="242" fontSize="11" fontWeight="700" textAnchor="middle" fill="#fff">
            Segure enquanto fala
          </text>
        </g>
      )}
      <Toque x={ax} y={ay} />
    </>
  );
}
