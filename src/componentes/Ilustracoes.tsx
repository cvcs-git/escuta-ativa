import type { ReactNode } from "react";

/*
 * Ilustrações dos passos das lições: telas de celular simplificadas, com um dedo
 * e um círculo pulsando sobre o ponto onde a pessoa deve tocar.
 * São desenhos genéricos (sem marcas), porque cada celular e cada aplicativo
 * mostra telas um pouco diferentes.
 */

const GRAFITE = "#212121";
const APOIO = "#6b6b6b";
const LINHA = "#d6d6d6";
const FUNDO_TELA = "#f7f6f2";
const VERDE = "#1b5e20";
const VERMELHO = "#d50000";
const AZUL = "#1a56b8";

function Celular({ descricao, children }: { descricao: string; children: ReactNode }) {
  return (
    <svg className="ilustracao" viewBox="0 0 240 320" role="img" aria-label={descricao}>
      <rect x="8" y="4" width="224" height="312" rx="28" fill={GRAFITE} />
      <rect x="15" y="11" width="210" height="298" rx="22" fill={FUNDO_TELA} />
      <text x="34" y="30" fontSize="11" fill={APOIO} fontWeight="700">9:41</text>
      <rect x="182" y="22" width="22" height="10" rx="3" fill="none" stroke={APOIO} strokeWidth="1.5" />
      <rect x="184" y="24" width="14" height="6" rx="1.5" fill={APOIO} />
      {children}
    </svg>
  );
}

/** Círculo pulsando e dedo apontando para o ponto de toque (x, y). */
function Toque({ x, y }: { x: number; y: number }) {
  return (
    <g className="ilus-toque">
      <circle className="ilus-toque__pulso" cx={x} cy={y} r="20" />
      <circle cx={x} cy={y} r="20" fill="none" stroke="#bf360c" strokeWidth="4" />
      <g transform={`translate(${x - 5} ${y + 2})`}>
        <path
          d="M0 4 C0 -3 10 -3 10 4 V20 C10 14 19 14 19 20 V22 C19 16 28 16 28 22 V24 C28 18 37 18 37 24 V40 C37 54 28 62 17 62 H13 C5 62 1 57 -3 50 L-11 35 C-14 29 -7 25 -3 29 L0 33 Z"
          fill="#fff"
          stroke={GRAFITE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}

/** Marca de proibido: "não toque aqui". */
function NaoToque({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="17" fill={VERMELHO} />
      <path d={`M${x - 7} ${y - 7} L${x + 7} ${y + 7} M${x + 7} ${y - 7} L${x - 7} ${y + 7}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

function Cabecalho({ titulo, voltar = true }: { titulo: string; voltar?: boolean }) {
  return (
    <g>
      <rect x="15" y="38" width="210" height="36" fill="#fff" />
      <line x1="15" y1="74" x2="225" y2="74" stroke={LINHA} strokeWidth="1.5" />
      {voltar && <path d="M34 50 L27 56 L34 62" fill="none" stroke={GRAFITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      <text x={voltar ? 44 : 30} y="61" fontSize="14" fontWeight="700" fill={GRAFITE}>{titulo}</text>
    </g>
  );
}

/* ---------- Ícones de aplicativos genéricos ---------- */

type Glifo = "engrenagem" | "camera" | "balao" | "telefone" | "banco" | "galeria";

function GlifoApp({ tipo, cx, cy }: { tipo: Glifo; cx: number; cy: number }) {
  const s = { fill: "none", stroke: "#fff", strokeWidth: 2.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (tipo) {
    case "engrenagem":
      return (
        <g>
          {[0, 45, 90, 135].map((a) => (
            <rect key={a} x={cx - 3} y={cy - 13} width="6" height="26" rx="2" fill="#fff" transform={`rotate(${a} ${cx} ${cy})`} />
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
      return <path {...s} d={`M${cx - 11} ${cy - 8} h22 a3 3 0 0 1 3 3 v11 a3 3 0 0 1 -3 3 h-12 l-6 5 v-5 h-4 a3 3 0 0 1 -3 -3 v-11 a3 3 0 0 1 3 -3z`} />;
    case "telefone":
      return <path {...s} d={`M${cx - 9} ${cy - 11} h5 l2 6 -3 2 a14 14 0 0 0 8 8 l2 -3 6 2 v5 a2 2 0 0 1 -2 2 a20 20 0 0 1 -20 -20 a2 2 0 0 1 2 -2z`} />;
    case "banco":
      return (
        <g {...s}>
          <path d={`M${cx - 12} ${cy - 4} L${cx} ${cy - 12} L${cx + 12} ${cy - 4} Z`} />
          <path d={`M${cx - 8} ${cy - 1} v10 M${cx} ${cy - 1} v10 M${cx + 8} ${cy - 1} v10 M${cx - 13} ${cy + 11} h26`} />
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

const CORES_APP: Record<Glifo, string> = {
  engrenagem: "#5f6b73",
  camera: "#4a4a4a",
  balao: "#2e7d32",
  telefone: "#1565c0",
  banco: "#6a1b9a",
  galeria: "#c2185b",
};

function App({ x, y, tipo, nome }: { x: number; y: number; tipo: Glifo; nome: string }) {
  return (
    <g>
      <rect x={x - 24} y={y - 24} width="48" height="48" rx="13" fill={CORES_APP[tipo]} />
      <GlifoApp tipo={tipo} cx={x} cy={y} />
      <text x={x} y={y + 40} fontSize="10" textAnchor="middle" fill={GRAFITE}>{nome}</text>
    </g>
  );
}

function TelaInicial({ alvo }: { alvo: Glifo }) {
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
      {apps.map((a, i) => <App key={a.nome} {...pos(i)} {...a} />)}
      <rect x="40" y="262" width="160" height="30" rx="15" fill="#fff" stroke={LINHA} strokeWidth="1.5" />
      <text x="58" y="282" fontSize="11" fill={APOIO}>Pesquisar</text>
      <Toque {...pos(iAlvo)} />
    </>
  );
}

function Lista({ y0, itens, alvo }: { y0: number; itens: string[]; alvo?: number }) {
  return (
    <>
      {itens.map((t, i) => {
        const y = y0 + i * 44;
        return (
          <g key={t}>
            <rect x="15" y={y} width="210" height="44" fill="#fff" />
            <line x1="30" y1={y + 44} x2="225" y2={y + 44} stroke={LINHA} strokeWidth="1.2" />
            <circle cx="38" cy={y + 22} r="9" fill={i === alvo ? "#bf360c" : "#c9c9c9"} opacity={i === alvo ? 0.85 : 1} />
            <text x="56" y={y + 27} fontSize="13" fontWeight={i === alvo ? 700 : 400} fill={GRAFITE}>{t}</text>
            <path d={`M206 ${y + 16} l6 6 -6 6`} fill="none" stroke={APOIO} strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      })}
      {alvo !== undefined && <Toque x={170} y={y0 + alvo * 44 + 22} />}
    </>
  );
}

function Conversas({ alvo }: { alvo: number }) {
  const nomes = ["Maria", "Meu filho João", "Grupo da família", "Dona Lúcia"];
  return (
    <>
      <Cabecalho titulo="Conversas" voltar={false} />
      {nomes.map((n, i) => {
        const y = 78 + i * 52;
        return (
          <g key={n}>
            <circle cx="42" cy={y + 24} r="17" fill={["#90a4ae", "#a1887f", "#81c784", "#ce93d8"][i]} />
            <text x="68" y={y + 21} fontSize="13" fontWeight="700" fill={GRAFITE}>{n}</text>
            <text x="68" y={y + 37} fontSize="10.5" fill={APOIO}>Mensagem de áudio</text>
            <line x1="68" y1={y + 50} x2="225" y2={y + 50} stroke={LINHA} strokeWidth="1.2" />
          </g>
        );
      })}
      <Toque x={190} y={78 + alvo * 52 + 24} />
    </>
  );
}

function ConversaAberta({ children }: { children?: ReactNode }) {
  return (
    <>
      <rect x="15" y="38" width="210" height="40" fill="#fff" />
      <line x1="15" y1="78" x2="225" y2="78" stroke={LINHA} strokeWidth="1.5" />
      <path d="M30 52 L24 58 L30 64" fill="none" stroke={GRAFITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="58" r="12" fill="#a1887f" />
      <text x="68" y="63" fontSize="12.5" fontWeight="700" fill={GRAFITE}>João</text>
      <rect x="28" y="92" width="130" height="34" rx="10" fill="#fff" />
      <text x="38" y="113" fontSize="11" fill={GRAFITE}>Oi, mãe! Tudo bem?</text>
      <rect x="96" y="136" width="114" height="34" rx="10" fill="#dcedc8" />
      <text x="106" y="157" fontSize="11" fill={GRAFITE}>Tudo ótimo, filho!</text>
      {children}
    </>
  );
}

function BarraDigitar() {
  return (
    <g>
      <rect x="22" y="262" width="160" height="34" rx="17" fill="#fff" stroke={LINHA} strokeWidth="1.5" />
      <text x="36" y="283" fontSize="11" fill={APOIO}>Mensagem</text>
      <g transform="translate(152 270)">
        <path d="M10 2 L3 10 a4 4 0 0 0 6 6 l8 -9 a2.5 2.5 0 0 0 -4 -4 l-7 8" fill="none" stroke={GRAFITE} strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <circle cx="204" cy="279" r="17" fill={VERDE} />
      <rect x="200" y="270" width="8" height="12" rx="4" fill="#fff" />
      <path d="M197 280 a7 7 0 0 0 14 0 M204 287 v3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Bolha({ y, linhas, destaques = [] }: { y: number; linhas: string[]; destaques?: string[] }) {
  const altura = 16 + linhas.length * 17;
  return (
    <g>
      <rect x="24" y={y} width="180" height={altura} rx="12" fill="#fff" stroke={LINHA} strokeWidth="1.2" />
      {linhas.map((l, i) => (
        <text key={i} x="36" y={y + 22 + i * 17} fontSize="12" fill={destaques.includes(l) ? AZUL : GRAFITE} textDecoration={destaques.includes(l) ? "underline" : undefined}>
          {l}
        </text>
      ))}
    </g>
  );
}

function Remetente({ texto }: { texto: string }) {
  return (
    <>
      <rect x="15" y="38" width="210" height="40" fill="#fff" />
      <line x1="15" y1="78" x2="225" y2="78" stroke={LINHA} strokeWidth="1.5" />
      <circle cx="38" cy="58" r="12" fill="#bdbdbd" />
      <text x="34" y="63" fontSize="13" fontWeight="700" fill="#fff">?</text>
      <text x="58" y="63" fontSize="12.5" fontWeight="700" fill={GRAFITE}>{texto}</text>
    </>
  );
}

function Botao({ x, y, w, texto, cor = "#bf360c", contorno = false }: { x: number; y: number; w: number; texto: string; cor?: string; contorno?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="36" rx="18" fill={contorno ? "#fff" : cor} stroke={cor} strokeWidth="2" />
      <text x={x + w / 2} y={y + 23} fontSize="12.5" fontWeight="700" textAnchor="middle" fill={contorno ? GRAFITE : "#fff"}>{texto}</text>
    </g>
  );
}

/* ---------- Ilustração de cada passo ---------- */

export const ILUSTRACOES: Record<string, ReactNode> = {
  /* Aumentar o tamanho da letra */
  "aumentar-letra-1": (
    <Celular descricao="Tela inicial do celular. O dedo toca no ícone de engrenagem, chamado Configurações.">
      <TelaInicial alvo="engrenagem" />
    </Celular>
  ),
  "aumentar-letra-2": (
    <Celular descricao="Lista das Configurações. O dedo toca na opção Tela.">
      <Cabecalho titulo="Configurações" />
      <Lista y0={80} itens={["Wi-Fi", "Bluetooth", "Tela", "Som", "Bateria"]} alvo={2} />
    </Celular>
  ),
  "aumentar-letra-3": (
    <Celular descricao="Tela com a régua Tamanho da fonte. O dedo arrasta a bolinha para a direita.">
      <Cabecalho titulo="Tela" />
      <text x="30" y="104" fontSize="13" fontWeight="700" fill={GRAFITE}>Tamanho da fonte</text>
      <text x="30" y="150" fontSize="11" fontWeight="700" fill={GRAFITE}>A</text>
      <text x="196" y="153" fontSize="20" fontWeight="700" fill={GRAFITE}>A</text>
      <line x1="48" y1="146" x2="188" y2="146" stroke={LINHA} strokeWidth="5" strokeLinecap="round" />
      <line x1="48" y1="146" x2="150" y2="146" stroke="#bf360c" strokeWidth="5" strokeLinecap="round" />
      <path d="M86 172 H140 M132 165 l8 7 -8 7" fill="none" stroke="#bf360c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="28" y="200" width="184" height="70" rx="10" fill="#fff" stroke={LINHA} />
      <text x="40" y="228" fontSize="15" fill={GRAFITE}>Assim fica</text>
      <text x="40" y="252" fontSize="15" fill={GRAFITE}>a letra maior.</text>
      <circle cx="150" cy="146" r="10" fill="#fff" stroke="#bf360c" strokeWidth="3" />
      <Toque x={150} y={146} />
    </Celular>
  ),

  /* Mandar uma foto */
  "foto-whatsapp-1": (
    <Celular descricao="Lista de conversas do aplicativo de mensagens. O dedo toca na conversa do filho João.">
      <Conversas alvo={1} />
    </Celular>
  ),
  "foto-whatsapp-2": (
    <Celular descricao="Conversa aberta. O dedo toca no clipe de papel, ao lado do espaço para escrever.">
      <ConversaAberta>
        <BarraDigitar />
        <Toque x={162} y={279} />
      </ConversaAberta>
    </Celular>
  ),
  "foto-whatsapp-3": (
    <Celular descricao="Menu de anexos aberto. O dedo toca em Galeria.">
      <ConversaAberta />
      <rect x="15" y="176" width="210" height="133" rx="18" fill="#fff" stroke={LINHA} />
      {(["galeria", "camera", "balao"] as Glifo[]).map((g, i) => (
        <App key={g} x={62 + i * 58} y={220} tipo={g} nome={["Galeria", "Câmera", "Documento"][i]} />
      ))}
      <Toque x={62} y={220} />
    </Celular>
  ),
  "foto-whatsapp-4": (
    <Celular descricao="Foto escolhida, em tamanho grande. O dedo toca na seta verde para enviar.">
      <rect x="15" y="38" width="210" height="271" fill="#2b2b2b" />
      <rect x="30" y="66" width="180" height="170" rx="6" fill="#90caf9" />
      <circle cx="170" cy="100" r="16" fill="#fff59d" />
      <path d="M30 236 L90 150 L130 200 L160 170 L210 236 Z" fill="#66bb6a" />
      <rect x="24" y="258" width="150" height="34" rx="17" fill="#3a3a3a" />
      <text x="38" y="279" fontSize="11" fill="#cfcfcf">Escreva uma legenda</text>
      <circle cx="202" cy="275" r="18" fill={VERDE} />
      <path d="M195 268 L211 275 L195 282 L198 275 Z" fill="#fff" />
      <Toque x={202} y={275} />
    </Celular>
  ),

  /* Pix com segurança */
  "pix-seguranca-1": (
    <Celular descricao="Tela inicial do celular. O dedo toca no aplicativo do banco.">
      <TelaInicial alvo="banco" />
    </Celular>
  ),
  "pix-seguranca-2": (
    <Celular descricao="Tela inicial do aplicativo do banco. O dedo toca no botão Pix, com desenho de losango.">
      <rect x="15" y="38" width="210" height="96" fill="#6a1b9a" />
      <text x="30" y="66" fontSize="12" fill="#fff">Olá, Maria</text>
      <text x="30" y="92" fontSize="11" fill="#e1bee7">Saldo disponível</text>
      <text x="30" y="116" fontSize="16" fontWeight="700" fill="#fff">R$ ••••••</text>
      {["Pix", "Pagar", "Transferir", "Cartões"].map((t, i) => {
        const x = 46 + i * 50;
        return (
          <g key={t}>
            <circle cx={x} cy="174" r="20" fill="#fff" stroke={LINHA} strokeWidth="1.5" />
            {i === 0 ? (
              <path d={`M${x} 162 L${x + 12} 174 L${x} 186 L${x - 12} 174 Z`} fill="none" stroke="#6a1b9a" strokeWidth="2.5" />
            ) : (
              <rect x={x - 8} y="167" width="16" height="14" rx="3" fill="none" stroke={APOIO} strokeWidth="2" />
            )}
            <text x={x} y="210" fontSize="10.5" textAnchor="middle" fill={GRAFITE}>{t}</text>
          </g>
        );
      })}
      <rect x="28" y="230" width="184" height="56" rx="10" fill="#fff" stroke={LINHA} />
      <text x="40" y="262" fontSize="11" fill={APOIO}>Últimas movimentações</text>
      <Toque x={46} y={174} />
    </Celular>
  ),
  "pix-seguranca-3": (
    <Celular descricao="Tela do Pix. A opção Transferir está aberta e o dedo toca no campo para digitar a chave Pix.">
      <Cabecalho titulo="Pix" />
      <Botao x={28} y={88} w={84} texto="Pagar" cor="#6a1b9a" contorno />
      <Botao x={124} y={88} w={88} texto="Transferir" cor="#6a1b9a" />
      <text x="30" y="152" fontSize="12" fontWeight="700" fill={GRAFITE}>Chave Pix de quem vai receber</text>
      <rect x="28" y="162" width="184" height="40" rx="8" fill="#fff" stroke="#bf360c" strokeWidth="2" />
      <text x="40" y="187" fontSize="12" fill={APOIO}>Telefone, CPF ou e-mail</text>
      <text x="30" y="232" fontSize="10.5" fill={APOIO}>Peça a chave à pessoa.</text>
      <Toque x={170} y={182} />
    </Celular>
  ),
  "pix-seguranca-4": (
    <Celular descricao="Tela de conferência com o nome de quem vai receber em destaque. O dedo aponta para o nome.">
      <Cabecalho titulo="Confira os dados" />
      <text x="30" y="106" fontSize="11" fill={APOIO}>Você vai transferir para:</text>
      <rect x="24" y="116" width="192" height="44" rx="8" fill="#fff3e0" stroke="#bf360c" strokeWidth="2" />
      <text x="36" y="144" fontSize="14" fontWeight="700" fill={GRAFITE}>MARIA DA SILVA</text>
      <text x="30" y="184" fontSize="11" fill={APOIO}>Banco: Banco do Exemplo</text>
      <Botao x={28} y={236} w={84} texto="Cancelar" cor={GRAFITE} contorno />
      <Botao x={124} y={236} w={88} texto="Continuar" cor="#6a1b9a" />
      <Toque x={180} y={138} />
    </Celular>
  ),
  "pix-seguranca-5": (
    <Celular descricao="Tela do valor, com R$ 50,00 digitado. O dedo toca em Confirmar.">
      <Cabecalho titulo="Valor" />
      <text x="30" y="108" fontSize="11" fill={APOIO}>Quanto você vai enviar?</text>
      <text x="30" y="148" fontSize="28" fontWeight="700" fill={GRAFITE}>R$ 50,00</text>
      <line x1="30" y1="160" x2="210" y2="160" stroke="#bf360c" strokeWidth="2" />
      <text x="30" y="190" fontSize="11" fill={APOIO}>Para: Maria da Silva</text>
      <Botao x={28} y={244} w={184} texto="Confirmar" cor="#6a1b9a" />
      <Toque x={120} y={262} />
    </Celular>
  ),

  /* Golpe por mensagem */
  "golpe-mensagem-1": (
    <Celular descricao="Mensagem de número desconhecido dizendo URGENTE, sua conta será bloqueada hoje. Um sinal de alerta vermelho aparece ao lado.">
      <Remetente texto="+55 11 9••••-••••" />
      <Bolha y={100} linhas={["URGENTE! Sua conta", "será bloqueada HOJE.", "Responda agora."]} />
      <circle cx="200" cy="100" r="17" fill={VERMELHO} />
      <path d="M200 91 v11" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="200" cy="108" r="2.2" fill="#fff" />
      <text x="120" y="210" fontSize="13" fontWeight="700" textAnchor="middle" fill={VERMELHO}>Pressa é sinal de golpe</text>
    </Celular>
  ),
  "golpe-mensagem-2": (
    <Celular descricao="Mensagem com um link azul. Um X vermelho mostra que não se deve tocar no link.">
      <Remetente texto="+55 21 9••••-••••" />
      <Bolha y={100} linhas={["Libere sua conta aqui:", "www.libera-conta.net"]} destaques={["www.libera-conta.net"]} />
      <NaoToque x={196} y={150} />
      <text x="120" y="210" fontSize="13" fontWeight="700" textAnchor="middle" fill={VERMELHO}>Não toque no link</text>
    </Celular>
  ),
  "golpe-mensagem-3": (
    <Celular descricao="Mensagem pedindo o código que chegou por SMS. Um X vermelho mostra que não se deve enviar o código.">
      <Remetente texto="Número novo do seu filho" />
      <Bolha y={100} linhas={["Mãe, me passa o código", "que chegou aí no SMS?"]} />
      <rect x="110" y="160" width="100" height="34" rx="10" fill="#dcedc8" />
      <text x="122" y="182" fontSize="12" fill={GRAFITE}>Código: ••••••</text>
      <NaoToque x={204} y={160} />
      <text x="120" y="230" fontSize="13" fontWeight="700" textAnchor="middle" fill={VERMELHO}>Nunca envie códigos</text>
    </Celular>
  ),
  "golpe-mensagem-4": (
    <Celular descricao="Agenda de contatos com o contato do filho. O dedo toca no botão verde de ligar.">
      <Cabecalho titulo="Contato salvo" />
      <circle cx="120" cy="120" r="30" fill="#a1887f" />
      <text x="120" y="174" fontSize="14" fontWeight="700" textAnchor="middle" fill={GRAFITE}>Meu filho João</text>
      <text x="120" y="194" fontSize="11" textAnchor="middle" fill={APOIO}>Número que você já conhece</text>
      <circle cx="120" cy="250" r="24" fill={VERDE} />
      <GlifoApp tipo="telefone" cx={121} cy={251} />
      <Toque x={120} y={250} />
    </Celular>
  ),

  /* Chamada de vídeo */
  "chamada-video-1": (
    <Celular descricao="Lista de conversas. O dedo toca na conversa do filho João.">
      <Conversas alvo={1} />
    </Celular>
  ),
  "chamada-video-2": (
    <Celular descricao="Conversa aberta. O dedo toca no desenho de câmera, no alto da tela, à direita.">
      <ConversaAberta>
        <g fill="none" stroke={GRAFITE} strokeWidth="2.2" strokeLinejoin="round">
          <rect x="160" y="51" width="16" height="13" rx="2.5" />
          <path d="M176 55 l6 -3 v12 l-6 -3" />
          <path d="M197 50 h4 l2 5 -2.5 1.5 a10 10 0 0 0 5 5 l1.5 -2.5 5 2 v4 a2 2 0 0 1 -2 2 a16 16 0 0 1 -15 -15 a2 2 0 0 1 2 -2z" />
        </g>
        <BarraDigitar />
        <Toque x={170} y={58} />
      </ConversaAberta>
    </Celular>
  ),
  "chamada-video-3": (
    <Celular descricao="Chamada de vídeo em andamento. O dedo toca no botão vermelho, embaixo, para desligar.">
      <rect x="15" y="11" width="210" height="298" rx="22" fill="#37474f" />
      <circle cx="120" cy="120" r="44" fill="#a1887f" />
      <path d="M58 230 a62 50 0 0 1 124 0" fill="#a1887f" />
      <rect x="160" y="40" width="50" height="66" rx="8" fill="#90a4ae" stroke="#fff" strokeWidth="2" />
      <text x="120" y="44" fontSize="12" fontWeight="700" textAnchor="middle" fill="#fff">João</text>
      <circle cx="120" cy="272" r="22" fill={VERMELHO} />
      <path d="M108 274 a16 8 0 0 1 24 0 l-3 4 -5 -2 v-3 a14 14 0 0 0 -8 0 v3 l-5 2z" fill="#fff" />
      <Toque x={120} y={272} />
    </Celular>
  ),
};
