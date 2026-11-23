/**
 * Ilustrações fixas das lições: uma por passo, identificadas por "<id-da-lição>-<número do passo>".
 * Montadas com as peças comuns de @/compartilhado/ilustracoes/pecas.
 */
import type { ReactNode } from "react";
import {
  APOIO,
  IconeApp,
  BarraDigitar,
  Bolha,
  BotaoNaTela,
  Cabecalho,
  Celular,
  ConversaAberta,
  Conversas,
  GRAFITE,
  GlifoApp,
  LARANJA,
  LINHA,
  Lista,
  NaoToque,
  Remetente,
  TelaInicial,
  Toque,
  VERDE,
  VERMELHO,
  type Glifo,
} from "@/compartilhado/ilustracoes/pecas";

export const ILUSTRACOES_DAS_LICOES: Record<string, ReactNode> = {
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
      <text x="30" y="104" fontSize="13" fontWeight="700" fill={GRAFITE}>
        Tamanho da fonte
      </text>
      <text x="30" y="150" fontSize="11" fontWeight="700" fill={GRAFITE}>
        A
      </text>
      <text x="196" y="153" fontSize="20" fontWeight="700" fill={GRAFITE}>
        A
      </text>
      <line x1="48" y1="146" x2="188" y2="146" stroke={LINHA} strokeWidth="5" strokeLinecap="round" />
      <line x1="48" y1="146" x2="150" y2="146" stroke={LARANJA} strokeWidth="5" strokeLinecap="round" />
      <path
        d="M86 172 H140 M132 165 l8 7 -8 7"
        fill="none"
        stroke={LARANJA}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="28" y="200" width="184" height="70" rx="10" fill="#fff" stroke={LINHA} />
      <text x="40" y="228" fontSize="15" fill={GRAFITE}>
        Assim fica
      </text>
      <text x="40" y="252" fontSize="15" fill={GRAFITE}>
        a letra maior.
      </text>
      <circle cx="150" cy="146" r="10" fill="#fff" stroke={LARANJA} strokeWidth="3" />
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
        <IconeApp key={g} x={62 + i * 58} y={220} tipo={g} nome={["Galeria", "Câmera", "Documento"][i]} />
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
      <text x="38" y="279" fontSize="11" fill="#cfcfcf">
        Escreva uma legenda
      </text>
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
      <text x="30" y="66" fontSize="12" fill="#fff">
        Olá, Maria
      </text>
      <text x="30" y="92" fontSize="11" fill="#e1bee7">
        Saldo disponível
      </text>
      <text x="30" y="116" fontSize="16" fontWeight="700" fill="#fff">
        R$ ••••••
      </text>
      {["Pix", "Pagar", "Transferir", "Cartões"].map((t, i) => {
        const x = 46 + i * 50;
        return (
          <g key={t}>
            <circle cx={x} cy="174" r="20" fill="#fff" stroke={LINHA} strokeWidth="1.5" />
            {i === 0 ? (
              <path
                d={`M${x} 162 L${x + 12} 174 L${x} 186 L${x - 12} 174 Z`}
                fill="none"
                stroke="#6a1b9a"
                strokeWidth="2.5"
              />
            ) : (
              <rect x={x - 8} y="167" width="16" height="14" rx="3" fill="none" stroke={APOIO} strokeWidth="2" />
            )}
            <text x={x} y="210" fontSize="10.5" textAnchor="middle" fill={GRAFITE}>
              {t}
            </text>
          </g>
        );
      })}
      <rect x="28" y="230" width="184" height="56" rx="10" fill="#fff" stroke={LINHA} />
      <text x="40" y="262" fontSize="11" fill={APOIO}>
        Últimas movimentações
      </text>
      <Toque x={46} y={174} />
    </Celular>
  ),
  "pix-seguranca-3": (
    <Celular descricao="Tela do Pix. A opção Transferir está aberta e o dedo toca no campo para digitar a chave Pix.">
      <Cabecalho titulo="Pix" />
      <BotaoNaTela x={28} y={88} w={84} texto="Pagar" cor="#6a1b9a" contorno />
      <BotaoNaTela x={124} y={88} w={88} texto="Transferir" cor="#6a1b9a" />
      <text x="30" y="152" fontSize="12" fontWeight="700" fill={GRAFITE}>
        Chave Pix de quem vai receber
      </text>
      <rect x="28" y="162" width="184" height="40" rx="8" fill="#fff" stroke={LARANJA} strokeWidth="2" />
      <text x="40" y="187" fontSize="12" fill={APOIO}>
        Telefone, CPF ou e-mail
      </text>
      <text x="30" y="232" fontSize="10.5" fill={APOIO}>
        Peça a chave à pessoa.
      </text>
      <Toque x={170} y={182} />
    </Celular>
  ),
  "pix-seguranca-4": (
    <Celular descricao="Tela de conferência com o nome de quem vai receber em destaque. O dedo aponta para o nome.">
      <Cabecalho titulo="Confira os dados" />
      <text x="30" y="106" fontSize="11" fill={APOIO}>
        Você vai transferir para:
      </text>
      <rect x="24" y="116" width="192" height="44" rx="8" fill="#fff3e0" stroke={LARANJA} strokeWidth="2" />
      <text x="36" y="144" fontSize="14" fontWeight="700" fill={GRAFITE}>
        MARIA DA SILVA
      </text>
      <text x="30" y="184" fontSize="11" fill={APOIO}>
        Banco: Banco do Exemplo
      </text>
      <BotaoNaTela x={28} y={236} w={84} texto="Cancelar" cor={GRAFITE} contorno />
      <BotaoNaTela x={124} y={236} w={88} texto="Continuar" cor="#6a1b9a" />
      <Toque x={180} y={138} />
    </Celular>
  ),
  "pix-seguranca-5": (
    <Celular descricao="Tela do valor, com R$ 50,00 digitado. O dedo toca em Confirmar.">
      <Cabecalho titulo="Valor" />
      <text x="30" y="108" fontSize="11" fill={APOIO}>
        Quanto você vai enviar?
      </text>
      <text x="30" y="148" fontSize="28" fontWeight="700" fill={GRAFITE}>
        R$ 50,00
      </text>
      <line x1="30" y1="160" x2="210" y2="160" stroke={LARANJA} strokeWidth="2" />
      <text x="30" y="190" fontSize="11" fill={APOIO}>
        Para: Maria da Silva
      </text>
      <BotaoNaTela x={28} y={244} w={184} texto="Confirmar" cor="#6a1b9a" />
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
      <text x="120" y="210" fontSize="13" fontWeight="700" textAnchor="middle" fill={VERMELHO}>
        Pressa é sinal de golpe
      </text>
    </Celular>
  ),
  "golpe-mensagem-2": (
    <Celular descricao="Mensagem com um link azul. Um X vermelho mostra que não se deve tocar no link.">
      <Remetente texto="+55 21 9••••-••••" />
      <Bolha y={100} linhas={["Libere sua conta aqui:", "www.libera-conta.net"]} destaques={["www.libera-conta.net"]} />
      <NaoToque x={196} y={150} />
      <text x="120" y="210" fontSize="13" fontWeight="700" textAnchor="middle" fill={VERMELHO}>
        Não toque no link
      </text>
    </Celular>
  ),
  "golpe-mensagem-3": (
    <Celular descricao="Mensagem pedindo o código que chegou por SMS. Um X vermelho mostra que não se deve enviar o código.">
      <Remetente texto="Número novo do seu filho" />
      <Bolha y={100} linhas={["Mãe, me passa o código", "que chegou aí no SMS?"]} />
      <rect x="110" y="160" width="100" height="34" rx="10" fill="#dcedc8" />
      <text x="122" y="182" fontSize="12" fill={GRAFITE}>
        Código: ••••••
      </text>
      <NaoToque x={204} y={160} />
      <text x="120" y="230" fontSize="13" fontWeight="700" textAnchor="middle" fill={VERMELHO}>
        Nunca envie códigos
      </text>
    </Celular>
  ),
  "golpe-mensagem-4": (
    <Celular descricao="Agenda de contatos com o contato do filho. O dedo toca no botão verde de ligar.">
      <Cabecalho titulo="Contato salvo" />
      <circle cx="120" cy="120" r="30" fill="#a1887f" />
      <text x="120" y="174" fontSize="14" fontWeight="700" textAnchor="middle" fill={GRAFITE}>
        Meu filho João
      </text>
      <text x="120" y="194" fontSize="11" textAnchor="middle" fill={APOIO}>
        Número que você já conhece
      </text>
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
      <text x="120" y="44" fontSize="12" fontWeight="700" textAnchor="middle" fill="#fff">
        João
      </text>
      <circle cx="120" cy="272" r="22" fill={VERMELHO} />
      <path d="M108 274 a16 8 0 0 1 24 0 l-3 4 -5 -2 v-3 a14 14 0 0 0 -8 0 v3 l-5 2z" fill="#fff" />
      <Toque x={120} y={272} />
    </Celular>
  ),
};
