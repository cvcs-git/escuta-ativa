/**
 * Peças de desenho das ilustrações: moldura do celular, dedo com círculo pulsando,
 * cabeçalhos, ícones de apps, listas, conversas e botões.
 *
 * Todas as ilustrações do app (lições e, em breve, respostas do assistente) são
 * montadas com estas peças, para manter uma estética única. São desenhos genéricos,
 * sem marcas, porque cada celular e cada aplicativo mostra telas um pouco diferentes.
 *
 * Coordenadas: todas as telas usam a área de 240 × 320 definida em <Celular>.
 */
import type { ReactNode } from "react";
import { CORES_APP, CORES_LETRA, curto, glifoDoApp, type Glifo } from "./auxiliares";
import "./ilustracoes.css";

export const GRAFITE = "#212121";
export const APOIO = "#6b6b6b";
export const LINHA = "#d6d6d6";
export const FUNDO_TELA = "#f7f6f2";
export const VERDE = "#1b5e20";
export const VERMELHO = "#d50000";
export const AZUL = "#1a56b8";
export const LARANJA = "#bf360c";

/** Contorno do dedo indicador (ponta em 4, 0). Usado nas ilustrações e no convite para falar. */
export const CAMINHO_DO_DEDO =
  "M0 4 C0 -3 10 -3 10 4 V20 C10 14 19 14 19 20 V22 C19 16 28 16 28 22 V24 C28 18 37 18 37 24 V40 C37 54 28 62 17 62 H13 C5 62 1 57 -3 50 L-11 35 C-14 29 -7 25 -3 29 L0 33 Z";

export function Celular({ descricao, children }: { descricao: string; children: ReactNode }) {
  return (
    <svg className="ilustracao" viewBox="0 0 240 320" role="img" aria-label={descricao}>
      <rect x="8" y="4" width="224" height="312" rx="28" fill={GRAFITE} />
      <rect x="15" y="11" width="210" height="298" rx="22" fill={FUNDO_TELA} />
      <text x="34" y="30" fontSize="11" fill={APOIO} fontWeight="700">
        9:41
      </text>
      <rect x="182" y="22" width="22" height="10" rx="3" fill="none" stroke={APOIO} strokeWidth="1.5" />
      <rect x="184" y="24" width="14" height="6" rx="1.5" fill={APOIO} />
      {children}
    </svg>
  );
}

/** Círculo pulsando e dedo apontando para o ponto de toque (x, y). */
export function Toque({ x, y }: { x: number; y: number }) {
  return (
    <g className="ilus-toque">
      <circle className="ilus-toque__pulso" cx={x} cy={y} r="20" />
      <circle cx={x} cy={y} r="20" fill="none" stroke={LARANJA} strokeWidth="4" />
      <g transform={`translate(${x - 5} ${y + 2})`}>
        <path d={CAMINHO_DO_DEDO} fill="#fff" stroke={GRAFITE} strokeWidth="3" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** Marca de proibido: "não toque aqui". */
export function NaoToque({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="17" fill={VERMELHO} />
      <path
        d={`M${x - 7} ${y - 7} L${x + 7} ${y + 7} M${x + 7} ${y - 7} L${x - 7} ${y + 7}`}
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

export function Cabecalho({ titulo, voltar = true }: { titulo: string; voltar?: boolean }) {
  return (
    <g>
      <rect x="15" y="38" width="210" height="36" fill="#fff" />
      <line x1="15" y1="74" x2="225" y2="74" stroke={LINHA} strokeWidth="1.5" />
      {voltar && (
        <path
          d="M34 50 L27 56 L34 62"
          fill="none"
          stroke={GRAFITE}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <text x={voltar ? 44 : 30} y="61" fontSize="14" fontWeight="700" fill={GRAFITE}>
        {curto(titulo, voltar ? 22 : 24)}
      </text>
    </g>
  );
}

/* ---------- Ícones de aplicativos genéricos ---------- */

export function GlifoApp({ tipo, cx, cy }: { tipo: Glifo; cx: number; cy: number }) {
  const s = {
    fill: "none",
    stroke: "#fff",
    strokeWidth: 2.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (tipo) {
    case "engrenagem":
      return (
        <g>
          {[0, 45, 90, 135].map((a) => (
            <rect
              key={a}
              x={cx - 3}
              y={cy - 13}
              width="6"
              height="26"
              rx="2"
              fill="#fff"
              transform={`rotate(${a} ${cx} ${cy})`}
            />
          ))}
          <circle cx={cx} cy={cy} r="9" fill="#fff" />
          <circle cx={cx} cy={cy} r="4" fill="#5f6b73" />
        </g>
      );
    case "camera":
      return (
        <g {...s}>
          <rect x={cx - 12} y={cy - 7} width="24" height="16" rx="3" />
          <circle cx={cx} cy={cy + 1} r="5" />
          <path d={`M${cx - 5} ${cy - 7} l2 -4 h6 l2 4`} />
        </g>
      );
    case "balao":
      return (
        <path
          {...s}
          d={`M${cx - 11} ${cy - 8} h22 a3 3 0 0 1 3 3 v11 a3 3 0 0 1 -3 3 h-12 l-6 5 v-5 h-4 a3 3 0 0 1 -3 -3 v-11 a3 3 0 0 1 3 -3z`}
        />
      );
    case "telefone":
      return (
        <path
          {...s}
          d={`M${cx - 9} ${cy - 11} h5 l2 6 -3 2 a14 14 0 0 0 8 8 l2 -3 6 2 v5 a2 2 0 0 1 -2 2 a20 20 0 0 1 -20 -20 a2 2 0 0 1 2 -2z`}
        />
      );
    case "banco":
      return (
        <g {...s}>
          <path d={`M${cx - 12} ${cy - 4} L${cx} ${cy - 12} L${cx + 12} ${cy - 4} Z`} />
          <path
            d={`M${cx - 8} ${cy - 1} v10 M${cx} ${cy - 1} v10 M${cx + 8} ${cy - 1} v10 M${cx - 13} ${cy + 11} h26`}
          />
        </g>
      );
    case "galeria":
      return (
        <g {...s}>
          <rect x={cx - 12} y={cy - 10} width="24" height="20" rx="3" />
          <path d={`M${cx - 12} ${cy + 6} l7 -7 6 6 4 -4 7 7`} />
          <circle cx={cx + 5} cy={cy - 4} r="2.5" />
        </g>
      );
  }
}

export function IconeApp({ x, y, tipo, nome }: { x: number; y: number; tipo: Glifo; nome: string }) {
  return (
    <g>
      <rect x={x - 24} y={y - 24} width="48" height="48" rx="13" fill={CORES_APP[tipo]} />
      <GlifoApp tipo={tipo} cx={x} cy={y} />
      <text x={x} y={y + 40} fontSize="10" textAnchor="middle" fill={GRAFITE}>
        {nome}
      </text>
    </g>
  );
}

export function TelaInicial({ alvo }: { alvo: Glifo }) {
  const apps: { tipo: Glifo; nome: string }[] = [
    { tipo: "telefone", nome: "Telefone" },
    { tipo: "balao", nome: "Mensagens" },
    { tipo: "camera", nome: "Câmera" },
    { tipo: "galeria", nome: "Galeria" },
    { tipo: "banco", nome: "Banco" },
    { tipo: "engrenagem", nome: "Configurações" },
  ];
  const pos = (i: number) => ({ x: 52 + (i % 3) * 68, y: 92 + Math.floor(i / 3) * 84 });
  const iAlvo = apps.findIndex((a) => a.tipo === alvo);
  return (
    <>
      {apps.map((a, i) => (
        <IconeApp key={a.nome} {...pos(i)} {...a} />
      ))}
      <rect x="40" y="262" width="160" height="30" rx="15" fill="#fff" stroke={LINHA} strokeWidth="1.5" />
      <text x="58" y="282" fontSize="11" fill={APOIO}>
        Pesquisar
      </text>
      <Toque {...pos(iAlvo)} />
    </>
  );
}

export function Lista({ y0, itens, alvo }: { y0: number; itens: string[]; alvo?: number }) {
  return (
    <>
      {itens.map((t, i) => {
        const y = y0 + i * 44;
        return (
          <g key={t}>
            <rect x="15" y={y} width="210" height="44" fill="#fff" />
            <line x1="30" y1={y + 44} x2="225" y2={y + 44} stroke={LINHA} strokeWidth="1.2" />
            <circle cx="38" cy={y + 22} r="9" fill={i === alvo ? LARANJA : "#c9c9c9"} opacity={i === alvo ? 0.85 : 1} />
            <text x="56" y={y + 27} fontSize="13" fontWeight={i === alvo ? 700 : 400} fill={GRAFITE}>
              {t}
            </text>
            <path d={`M206 ${y + 16} l6 6 -6 6`} fill="none" stroke={APOIO} strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      })}
      {alvo !== undefined && <Toque x={170} y={y0 + alvo * 44 + 22} />}
    </>
  );
}

export function Conversas({ alvo }: { alvo: number }) {
  const nomes = ["Maria", "Meu filho João", "Grupo da família", "Dona Lúcia"];
  return (
    <>
      <Cabecalho titulo="Conversas" voltar={false} />
      {nomes.map((n, i) => {
        const y = 78 + i * 52;
        return (
          <g key={n}>
            <circle cx="42" cy={y + 24} r="17" fill={["#90a4ae", "#a1887f", "#81c784", "#ce93d8"][i]} />
            <text x="68" y={y + 21} fontSize="13" fontWeight="700" fill={GRAFITE}>
              {n}
            </text>
            <text x="68" y={y + 37} fontSize="10.5" fill={APOIO}>
              Mensagem de áudio
            </text>
            <line x1="68" y1={y + 50} x2="225" y2={y + 50} stroke={LINHA} strokeWidth="1.2" />
          </g>
        );
      })}
      <Toque x={190} y={78 + alvo * 52 + 24} />
    </>
  );
}

export function ConversaAberta({ children }: { children?: ReactNode }) {
  return (
    <>
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
        João
      </text>
      <rect x="28" y="92" width="130" height="34" rx="10" fill="#fff" />
      <text x="38" y="113" fontSize="11" fill={GRAFITE}>
        Oi, mãe! Tudo bem?
      </text>
      <rect x="96" y="136" width="114" height="34" rx="10" fill="#dcedc8" />
      <text x="106" y="157" fontSize="11" fill={GRAFITE}>
        Tudo ótimo, filho!
      </text>
      {children}
    </>
  );
}

export function BarraDigitar() {
  return (
    <g>
      <rect x="22" y="262" width="160" height="34" rx="17" fill="#fff" stroke={LINHA} strokeWidth="1.5" />
      <text x="36" y="283" fontSize="11" fill={APOIO}>
        Mensagem
      </text>
      <g transform="translate(152 270)">
        <path
          d="M10 2 L3 10 a4 4 0 0 0 6 6 l8 -9 a2.5 2.5 0 0 0 -4 -4 l-7 8"
          fill="none"
          stroke={GRAFITE}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
      <circle cx="204" cy="279" r="17" fill={VERDE} />
      <rect x="200" y="270" width="8" height="12" rx="4" fill="#fff" />
      <path d="M197 280 a7 7 0 0 0 14 0 M204 287 v3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

export function Bolha({ y, linhas, destaques = [] }: { y: number; linhas: string[]; destaques?: string[] }) {
  const altura = 16 + linhas.length * 17;
  return (
    <g>
      <rect x="24" y={y} width="180" height={altura} rx="12" fill="#fff" stroke={LINHA} strokeWidth="1.2" />
      {linhas.map((l, i) => (
        <text
          key={i}
          x="36"
          y={y + 22 + i * 17}
          fontSize="12"
          fill={destaques.includes(l) ? AZUL : GRAFITE}
          textDecoration={destaques.includes(l) ? "underline" : undefined}
        >
          {l}
        </text>
      ))}
    </g>
  );
}

export function Remetente({ texto }: { texto: string }) {
  return (
    <>
      <rect x="15" y="38" width="210" height="40" fill="#fff" />
      <line x1="15" y1="78" x2="225" y2="78" stroke={LINHA} strokeWidth="1.5" />
      <circle cx="38" cy="58" r="12" fill="#bdbdbd" />
      <text x="34" y="63" fontSize="13" fontWeight="700" fill="#fff">
        ?
      </text>
      <text x="58" y="63" fontSize="12.5" fontWeight="700" fill={GRAFITE}>
        {texto}
      </text>
    </>
  );
}

export function BotaoNaTela({
  x,
  y,
  w,
  texto,
  cor = LARANJA,
  contorno = false,
  recuo = 0,
}: {
  x: number;
  y: number;
  w: number;
  texto: string;
  cor?: string;
  contorno?: boolean;
  /** Espaço reservado à direita (para o dedo); o texto fica centralizado no restante. */
  recuo?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="36" rx="18" fill={contorno ? "#fff" : cor} stroke={cor} strokeWidth="2" />
      <text
        x={x + (w - recuo) / 2}
        y={y + 23}
        fontSize="12.5"
        fontWeight="700"
        textAnchor="middle"
        fill={contorno ? GRAFITE : "#fff"}
      >
        {texto}
      </text>
    </g>
  );
}

/* ---------- Peças genéricas (modelos do assistente) ---------- */

/** Ícone de app a partir do nome: desenho próprio para apps comuns, inicial para os outros. */
export function IconeAppPorNome({ x, y, nome, posicao }: { x: number; y: number; nome: string; posicao: number }) {
  const glifo = glifoDoApp(nome);
  return (
    <g>
      <rect
        x={x - 24}
        y={y - 24}
        width="48"
        height="48"
        rx="13"
        fill={glifo ? CORES_APP[glifo] : CORES_LETRA[posicao % CORES_LETRA.length]}
      />
      {glifo ? (
        <GlifoApp tipo={glifo} cx={x} cy={y} />
      ) : (
        <text x={x} y={y + 8} fontSize="22" fontWeight="700" fill="#fff" textAnchor="middle">
          {nome.trim()[0]?.toUpperCase()}
        </text>
      )}
      <text x={x} y={y + 40} fontSize="10" textAnchor="middle" fill={GRAFITE}>
        {curto(nome, 13)}
      </text>
    </g>
  );
}

/** Uma linha de lista de opções (bolinha, texto e seta). */
export function LinhaDeLista({ y, texto, destaque }: { y: number; texto: string; destaque: boolean }) {
  return (
    <g>
      <rect x="15" y={y} width="210" height="44" fill="#fff" />
      <line x1="30" y1={y + 44} x2="225" y2={y + 44} stroke={LINHA} strokeWidth="1.2" />
      <circle cx="38" cy={y + 22} r="9" fill={destaque ? LARANJA : "#c9c9c9"} opacity={destaque ? 0.85 : 1} />
      <text x="56" y={y + 27} fontSize="13" fontWeight={destaque ? 700 : 400} fill={GRAFITE}>
        {curto(texto, 20)}
      </text>
      <path d={`M206 ${y + 16} l6 6 -6 6`} fill="none" stroke={APOIO} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/** Aviso curto em laranja, centralizado (ex.: "Segure o dedo por 2 segundos"). */
export function AvisoNaTela({ y, texto }: { y: number; texto: string }) {
  return (
    <text x="120" y={y} fontSize="12.5" fontWeight="700" textAnchor="middle" fill={LARANJA}>
      {texto}
    </text>
  );
}
