/**
 * Base de respostas do assistente simulado.
 * Cada tema tem palavras-chave, o passo a passo e uma explicação alternativa por passo
 * (usada no botão "Não encontrei").
 */

export type RespostaSimulada = {
  chaves: string[];
  passos: string[];
  dica?: string;
  outroJeito: string[];
};

export const RESPOSTAS: RespostaSimulada[] = [
  {
    chaves: ["pix"],
    passos: [
      "Abra o aplicativo do seu banco.",
      "Toque em “Pix” na tela inicial do aplicativo.",
      "Escolha “Pagar” ou “Transferir”.",
      "Digite a chave Pix de quem vai receber.",
      "Confira o nome e o valor antes de confirmar.",
    ],
    dica: "Desconfie se alguém pedir um Pix com pressa.",
    outroJeito: [
      "Procure o ícone do seu banco entre os aplicativos e toque nele uma vez.",
      "O Pix costuma aparecer como um losango, perto do topo da tela. Ele também pode estar no menu “Transferências”.",
      "Se aparecerem várias opções, escolha a que fala em enviar dinheiro.",
      "A chave pode ser o telefone, o CPF ou o e-mail da pessoa. Peça a ela.",
      "Leia com calma o nome que aparece. Se não for a pessoa certa, cancele.",
    ],
  },
  {
    chaves: ["foto", "imagem", "whatsapp", "zap"],
    passos: [
      "Abra a conversa da pessoa no WhatsApp.",
      "Toque no clipe de papel ao lado de onde se escreve.",
      "Toque em “Galeria”.",
      "Toque na foto que quer mandar.",
      "Toque na seta verde para enviar.",
    ],
    outroJeito: [
      "Na lista de conversas, toque no nome ou na foto da pessoa.",
      "Embaixo, perto do espaço para escrever, há um desenho de clipe. Em alguns celulares é um sinal de mais.",
      "Galeria é onde ficam as fotos que você tirou.",
      "Toque uma vez na foto. Ela vai aparecer grande na tela.",
      "A seta fica no canto de baixo, à direita.",
    ],
  },
  {
    chaves: ["letra", "fonte", "ler melhor", "aumentar"],
    passos: [
      "Abra as Configurações do celular.",
      "Toque em “Tela” ou “Visor”.",
      "Toque em “Tamanho da fonte”.",
      "Arraste a bolinha para a direita até ficar bom para ler.",
    ],
    outroJeito: [
      "Configurações é o ícone de engrenagem, entre os aplicativos.",
      "Desça a tela devagar até encontrar a palavra “Tela”.",
      "Pode estar escrito “Fonte” ou “Tamanho do texto”.",
      "Quanto mais para a direita, maior a letra.",
    ],
  },
  {
    chaves: ["video", "chamada", "ligar"],
    passos: [
      "Abra a conversa da pessoa no WhatsApp.",
      "Toque no desenho de câmera no alto da tela.",
      "Espere a pessoa atender.",
      "Para desligar, toque no botão vermelho.",
    ],
    outroJeito: [
      "Na lista de conversas, toque no nome da pessoa.",
      "No alto, à direita, há uma câmera pequena. Toque nela.",
      "Segure o celular na frente do rosto enquanto chama.",
      "O botão vermelho fica embaixo, no meio da tela.",
    ],
  },
];

export const TEMAS_DO_CELULAR = [
  "celular",
  "aplicativo",
  "app",
  "tela",
  "senha",
  "internet",
  "wifi",
  "banco",
  "mensagem",
  "audio",
  "contato",
];

/** Resposta genérica para perguntas sobre o celular que não estão na base. */
export const PASSOS_GENERICOS = [
  "Abra o aplicativo que você quer usar.",
  "Procure um botão com o nome do que deseja fazer.",
  "Se não encontrar, toque nos três pontinhos no canto da tela.",
  "Leia as opções com calma antes de tocar.",
];

export const DICA_GENERICA = "Se puder, diga o nome do aplicativo na pergunta. Assim a explicação fica mais exata.";

export const RECUSA_FORA_DO_ESCOPO =
  "Eu ajudo com o uso do celular, como mensagens, fotos, Pix e segurança. Que tal fazer uma das lições?";

export const OUTRO_JEITO_GENERICO =
  "Procure esse nome escrito na tela. Ele pode estar um pouco mais abaixo: deslize o dedo para cima devagar.";
