/**
 * Base de respostas do assistente simulado.
 *
 * Cada tema tem palavras-chave (sem acento, em minúsculas) e um passo a passo no
 * mesmo formato que o Gemini devolve: texto, ilustração opcional e uma explicação
 * alternativa para o botão "Não encontrei". As ilustrações passam pela mesma
 * validação das respostas reais.
 */

export type PassoSimulado = {
  texto: string;
  /** Descrição da tela, no formato de servicos/ia/ilustracao.ts. */
  ilustracao?: Record<string, unknown>;
  outroJeito: string;
};

export type RespostaSimulada = {
  chaves: string[];
  passos: PassoSimulado[];
  dica?: string;
};

/* Telas que se repetem em vários temas */
const APPS = ["Telefone", "Mensagens", "Câmera", "Galeria", "Banco", "Configurações"];
const tocarApp = (nome: string) => ({ modelo: "apps", apps: APPS, alvo: APPS.indexOf(nome) });
const CONVERSAS = ["Maria", "Meu filho João", "Grupo da família", "Dona Lúcia"];
const abrirConversa = (indice: number) => ({ modelo: "lista", titulo: "Conversas", itens: CONVERSAS, alvo: indice });

export const RESPOSTAS: RespostaSimulada[] = [
  {
    chaves: ["pix"],
    passos: [
      {
        texto: "Abra o aplicativo do seu banco.",
        ilustracao: tocarApp("Banco"),
        outroJeito: "Procure o ícone do seu banco entre os aplicativos e toque nele uma vez.",
      },
      {
        texto: "Toque em “Pix” na tela inicial do aplicativo.",
        ilustracao: { modelo: "lista", titulo: "Meu banco", itens: ["Pix", "Pagar", "Transferir", "Cartões"], alvo: 0 },
        outroJeito: "O Pix costuma ter um desenho de losango. Ele também pode estar no menu “Transferências”.",
      },
      {
        texto: "Escolha “Pagar” ou “Transferir”.",
        ilustracao: { modelo: "lista", titulo: "Pix", itens: ["Pagar", "Transferir", "Receber"], alvo: 1 },
        outroJeito: "Se aparecerem várias opções, escolha a que fala em enviar dinheiro.",
      },
      {
        texto: "Digite a chave Pix de quem vai receber.",
        ilustracao: {
          modelo: "campo",
          titulo: "Transferir",
          campos: [{ rotulo: "Chave Pix", exemplo: "Telefone, CPF ou e-mail" }],
          alvo: 0,
        },
        outroJeito: "A chave pode ser o telefone, o CPF ou o e-mail da pessoa. Peça a ela.",
      },
      {
        texto: "Confira o nome e o valor antes de confirmar.",
        ilustracao: {
          modelo: "botoes",
          titulo: "Confira os dados",
          texto: "Maria da Silva vai receber R$ 50,00.",
          botoes: ["Cancelar", "Confirmar"],
          alvo: 1,
        },
        outroJeito: "Leia com calma o nome que aparece. Se não for a pessoa certa, cancele.",
      },
    ],
    dica: "Desconfie se alguém pedir um Pix com pressa.",
  },
  {
    chaves: ["foto", "imagem", "whatsapp", "zap", "mandar foto", "enviar foto"],
    passos: [
      {
        texto: "Abra a conversa da pessoa no WhatsApp.",
        ilustracao: abrirConversa(1),
        outroJeito: "Na lista de conversas, toque no nome ou na foto da pessoa.",
      },
      {
        texto: "Toque no clipe de papel, ao lado de onde se escreve.",
        ilustracao: {
          modelo: "conversa",
          contato: "Meu filho João",
          baloes: [{ de: "outro", tipo: "texto", texto: "Oi, mãe! Tudo bem?" }],
          alvo: "clipe",
        },
        outroJeito:
          "Embaixo, perto do espaço para escrever, há um desenho de clipe. Em alguns celulares é um sinal de mais.",
      },
      {
        texto: "Toque em “Galeria”.",
        ilustracao: { modelo: "apps", apps: ["Galeria", "Câmera", "Documento"], alvo: 0 },
        outroJeito: "Galeria é onde ficam as fotos que você tirou.",
      },
      {
        texto: "Toque na foto que quer mandar.",
        outroJeito: "Toque uma vez na foto. Ela vai aparecer grande na tela.",
      },
      {
        texto: "Toque na seta verde para enviar.",
        outroJeito: "A seta fica no canto de baixo, à direita.",
      },
    ],
  },
  {
    chaves: ["letra", "fonte", "ler melhor", "aumentar o texto", "texto maior"],
    passos: [
      {
        texto: "Abra as Configurações do celular.",
        ilustracao: tocarApp("Configurações"),
        outroJeito: "Configurações é o ícone de engrenagem, entre os aplicativos.",
      },
      {
        texto: "Toque em “Tela” ou “Visor”.",
        ilustracao: {
          modelo: "lista",
          titulo: "Configurações",
          itens: ["Wi-Fi", "Bluetooth", "Tela", "Som", "Bateria"],
          alvo: 2,
        },
        outroJeito: "Desça a tela devagar até encontrar a palavra “Tela”.",
      },
      {
        texto: "Toque em “Tamanho da fonte”.",
        ilustracao: { modelo: "lista", titulo: "Tela", itens: ["Brilho", "Modo escuro", "Tamanho da fonte"], alvo: 2 },
        outroJeito: "Pode estar escrito “Fonte” ou “Tamanho do texto”.",
      },
      {
        texto: "Arraste a bolinha para a direita até ficar bom para ler.",
        ilustracao: { modelo: "barra", titulo: "Tamanho da fonte", rotulo: "Tamanho do texto", direcao: "direita" },
        outroJeito: "Quanto mais para a direita, maior a letra.",
      },
    ],
  },
  {
    chaves: ["chamada de video", "videochamada", "ligar por video", "ligacao de video"],
    passos: [
      {
        texto: "Abra a conversa da pessoa no WhatsApp.",
        ilustracao: abrirConversa(1),
        outroJeito: "Na lista de conversas, toque no nome da pessoa.",
      },
      {
        texto: "Toque no desenho de câmera, no alto da tela.",
        outroJeito: "No alto, à direita, há uma câmera pequena. Toque nela.",
      },
      {
        texto: "Espere a pessoa atender e segure o celular na frente do rosto.",
        outroJeito: "Enquanto chama, aparece o nome da pessoa no meio da tela.",
      },
      {
        texto: "Para desligar, toque no botão vermelho.",
        ilustracao: { modelo: "chamada", contato: "Meu filho João", tipo: "andamento", alvo: "desligar" },
        outroJeito: "O botão vermelho fica embaixo, à direita.",
      },
    ],
  },
  {
    chaves: ["atend", "chamada de video", "videochamada"],
    passos: [
      {
        texto: "Quando o celular tocar, veja o nome de quem está ligando.",
        outroJeito: "O nome aparece no meio da tela, com a foto da pessoa.",
      },
      {
        texto: "Toque no botão verde “Atender”.",
        ilustracao: { modelo: "chamada", contato: "Meu filho João", tipo: "recebida", video: true, alvo: "atender" },
        outroJeito: "Em alguns celulares, é preciso arrastar o botão verde para cima.",
      },
      {
        texto: "Segure o celular na frente do rosto para a pessoa ver você.",
        outroJeito: "Deixe o celular na altura dos olhos, a um braço de distância.",
      },
    ],
  },
  {
    chaves: ["viva-voz", "viva voz", "alto-falante", "alto falante"],
    passos: [
      {
        texto: "Durante a ligação, afaste o celular do rosto para ver a tela.",
        outroJeito: "A tela acende quando você afasta o celular do ouvido.",
      },
      {
        texto: "Toque em “Viva-voz”, o botão com o alto-falante.",
        ilustracao: { modelo: "chamada", contato: "Dona Lúcia", tipo: "andamento", alvo: "viva_voz" },
        outroJeito: "É o botão do meio, com o desenho de uma caixa de som.",
      },
    ],
  },
  {
    chaves: ["bloque"],
    passos: [
      {
        texto: "Abra o aplicativo Telefone.",
        ilustracao: tocarApp("Telefone"),
        outroJeito: "É o ícone azul com o desenho de um telefone.",
      },
      {
        texto: "Toque em “Recentes” e escolha o número.",
        ilustracao: { modelo: "lista", titulo: "Telefone", itens: ["Favoritos", "Recentes", "Contatos"], alvo: 1 },
        outroJeito: "Recentes mostra as últimas ligações. Toque no número que quer bloquear.",
      },
      {
        texto: "Toque em “Bloquear número”.",
        ilustracao: {
          modelo: "lista",
          titulo: "Detalhes do contato",
          itens: ["Ligar", "Enviar mensagem", "Bloquear número", "Compartilhar"],
          alvo: 2,
        },
        outroJeito: "Se não aparecer, toque nos três pontinhos no alto da tela.",
      },
      {
        texto: "Toque em “Bloquear” para confirmar.",
        ilustracao: {
          modelo: "botoes",
          titulo: "Bloquear número",
          texto: "Você não vai mais receber ligações nem mensagens deste número.",
          botoes: ["Cancelar", "Bloquear"],
          alvo: 1,
        },
        outroJeito: "O botão “Bloquear” fica embaixo, à direita.",
      },
    ],
    dica: "Bloquear não avisa a pessoa. Você pode desbloquear quando quiser.",
  },
  {
    chaves: ["wi-fi", "wifi", "internet sem fio", "ligar a internet"],
    passos: [
      {
        texto: "Abra as Configurações do celular.",
        ilustracao: tocarApp("Configurações"),
        outroJeito: "Configurações é o ícone de engrenagem, entre os aplicativos.",
      },
      {
        texto: "Toque em “Conexões” ou “Wi-Fi”.",
        ilustracao: {
          modelo: "lista",
          titulo: "Configurações",
          itens: ["Conexões", "Sons", "Tela", "Bateria"],
          alvo: 0,
        },
        outroJeito: "Costuma ser a primeira opção da lista.",
      },
      {
        texto: "Toque na chave ao lado de “Wi-Fi” para ligar.",
        ilustracao: {
          modelo: "chave",
          titulo: "Conexões",
          rotulo: "Wi-Fi",
          outros: ["Bluetooth", "Modo avião"],
          ligar: true,
        },
        outroJeito: "A chave fica à direita do nome. Ligada, ela fica colorida.",
      },
    ],
  },
  {
    chaves: ["senha do wi", "senha da internet", "senha do wifi", "conectar no wi", "conectar na internet"],
    passos: [
      {
        texto: "Nas Configurações, toque em “Wi-Fi”.",
        ilustracao: { modelo: "lista", titulo: "Conexões", itens: ["Wi-Fi", "Bluetooth", "Modo avião"], alvo: 0 },
        outroJeito: "Configurações é o ícone de engrenagem. O Wi-Fi fica em “Conexões”.",
      },
      {
        texto: "Toque no nome da internet da sua casa.",
        ilustracao: { modelo: "lista", titulo: "Wi-Fi", itens: ["Casa da Maria", "Vizinho 5G", "Padaria"], alvo: 0 },
        outroJeito: "O nome costuma estar escrito no aparelho da internet, embaixo dele.",
      },
      {
        texto: "Toque no quadro “Senha” e digite a senha.",
        ilustracao: {
          modelo: "campo",
          titulo: "Casa da Maria",
          campos: [{ rotulo: "Senha", exemplo: "Digite a senha" }],
          confirmar: "Conectar",
        },
        outroJeito: "A senha também fica escrita no aparelho da internet. Letras maiúsculas fazem diferença.",
      },
      {
        texto: "Toque em “Conectar”.",
        ilustracao: {
          modelo: "botoes",
          titulo: "Casa da Maria",
          texto: "Senha digitada. Toque para entrar na internet.",
          botoes: ["Cancelar", "Conectar"],
          alvo: 1,
        },
        outroJeito: "O botão fica embaixo do quadro da senha.",
      },
    ],
  },
  {
    chaves: ["volume", "aumentar o som", "som da ligac", "som das ligac", "ouvir melhor"],
    passos: [
      {
        texto: "Nas Configurações, toque em “Sons”.",
        ilustracao: {
          modelo: "lista",
          titulo: "Configurações",
          itens: ["Conexões", "Sons", "Tela", "Bateria"],
          alvo: 1,
        },
        outroJeito: "Pode estar escrito “Sons e vibração”.",
      },
      {
        texto: "Arraste a bolinha de “Volume das chamadas” para a direita.",
        ilustracao: { modelo: "barra", titulo: "Sons", rotulo: "Volume das chamadas", direcao: "direita" },
        outroJeito: "Você também pode apertar o botão de cima, na lateral do celular, durante a ligação.",
      },
    ],
  },
  {
    chaves: ["atualiza"],
    passos: [
      {
        texto: "Ligue o celular no carregador e no Wi-Fi.",
        outroJeito: "A atualização demora e gasta bateria. Por isso é melhor deixar carregando.",
      },
      {
        texto: "Toque em “Instalar”.",
        ilustracao: {
          modelo: "botoes",
          titulo: "Atualização",
          texto: "Há uma nova versão do sistema para o seu celular.",
          botoes: ["Agora não", "Instalar"],
          alvo: 1,
        },
        outroJeito: "Se não aparecer o aviso, procure “Atualização de software” nas Configurações.",
      },
      {
        texto: "Espere o celular reiniciar sozinho. Não desligue.",
        outroJeito: "A tela pode apagar e acender algumas vezes. Isso é normal.",
      },
    ],
    dica: "Atualizar deixa o celular mais seguro contra golpes.",
  },
  {
    chaves: ["contato", "salvar numero", "salvar um numero", "salvo um numero", "adicionar numero"],
    passos: [
      {
        texto: "Abra o aplicativo Telefone e toque em “Contatos”.",
        ilustracao: { modelo: "lista", titulo: "Telefone", itens: ["Favoritos", "Recentes", "Contatos"], alvo: 2 },
        outroJeito: "O aplicativo Telefone é o ícone azul com um telefone.",
      },
      {
        texto: "Toque em “Criar contato”.",
        ilustracao: {
          modelo: "botoes",
          titulo: "Contatos",
          texto: "Você tem 48 contatos salvos.",
          botoes: ["Criar contato"],
          alvo: 0,
        },
        outroJeito: "Em alguns celulares, é um sinal de mais no alto da tela.",
      },
      {
        texto: "Digite o nome e o telefone da pessoa.",
        ilustracao: {
          modelo: "campo",
          titulo: "Novo contato",
          campos: [
            { rotulo: "Nome", exemplo: "Dona Lúcia" },
            { rotulo: "Telefone", exemplo: "(81) 9" },
          ],
          alvo: 1,
        },
        outroJeito: "Toque em cada quadro antes de digitar. O teclado aparece sozinho.",
      },
      {
        texto: "Toque em “Salvar”.",
        ilustracao: {
          modelo: "botoes",
          titulo: "Novo contato",
          texto: "Dona Lúcia, (81) 98765-4321",
          botoes: ["Cancelar", "Salvar"],
          alvo: 1,
        },
        outroJeito: "O botão “Salvar” fica no alto ou embaixo da tela, conforme o celular.",
      },
    ],
  },
  {
    chaves: ["notifica", "avisos", "aviso que chegou"],
    passos: [
      {
        texto: "Deslize o dedo do alto da tela para baixo.",
        ilustracao: { modelo: "gesto", gesto: "deslizar_baixo" },
        outroJeito: "Encoste o dedo bem na beirada de cima da tela e puxe devagar para baixo.",
      },
      {
        texto: "Toque no aviso que quer abrir.",
        outroJeito: "Cada aviso mostra o nome do aplicativo. Toque uma vez no que quer ver.",
      },
    ],
  },
  {
    chaves: ["apag", "exclu", "foto"],
    passos: [
      {
        texto: "Abra a “Galeria” do celular.",
        ilustracao: tocarApp("Galeria"),
        outroJeito: "A Galeria é onde ficam as suas fotos. Pode se chamar “Fotos”.",
      },
      {
        texto: "Segure o dedo sobre a foto por 2 segundos.",
        ilustracao: { modelo: "gesto", gesto: "segurar", sobre: "foto" },
        outroJeito: "Encoste o dedo na foto e não solte até aparecer um sinal de marcado.",
      },
      {
        texto: "Toque em “Apagar” e confirme.",
        ilustracao: {
          modelo: "botoes",
          titulo: "Galeria",
          texto: "Apagar 1 foto? Ela vai para a lixeira.",
          botoes: ["Cancelar", "Apagar"],
          alvo: 1,
        },
        outroJeito: "Pode aparecer o desenho de uma lixeira em vez da palavra.",
      },
    ],
  },
  {
    chaves: ["apag", "exclu", "conversa"],
    passos: [
      {
        texto: "Abra a conversa que quer apagar.",
        ilustracao: abrirConversa(0),
        outroJeito: "Na lista de conversas, toque no nome da pessoa.",
      },
      {
        texto: "Toque nos três pontinhos e escolha “Apagar conversa”.",
        ilustracao: {
          modelo: "menu",
          titulo: "Maria",
          itens: ["Ver contato", "Pesquisar", "Apagar conversa", "Silenciar"],
          alvo: 2,
        },
        outroJeito: "Os três pontinhos ficam no canto de cima, à direita.",
      },
      {
        texto: "Toque em “Apagar” para confirmar.",
        ilustracao: {
          modelo: "botoes",
          titulo: "Apagar conversa",
          texto: "As mensagens vão sumir deste celular.",
          botoes: ["Cancelar", "Apagar"],
          alvo: 1,
        },
        outroJeito: "A conversa some só do seu celular. A outra pessoa continua com ela.",
      },
    ],
  },
  {
    chaves: [
      "audio",
      "mandar audio",
      "mando um audio",
      "mando audio",
      "enviar audio",
      "envio um audio",
      "gravar audio",
      "mensagem de voz",
    ],
    passos: [
      {
        texto: "Abra a conversa da pessoa no WhatsApp.",
        ilustracao: abrirConversa(1),
        outroJeito: "Na lista de conversas, toque no nome da pessoa.",
      },
      {
        texto: "Segure o microfone verde enquanto fala.",
        ilustracao: {
          modelo: "conversa",
          contato: "Meu filho João",
          baloes: [{ de: "outro", tipo: "texto", texto: "Oi, mãe! Me manda um áudio?" }],
          alvo: "microfone",
          segurar: true,
        },
        outroJeito: "O microfone fica no canto de baixo, à direita. Não solte enquanto estiver falando.",
      },
      {
        texto: "Solte o dedo para enviar o áudio.",
        outroJeito: "Se quiser desistir, arraste o dedo para a esquerda antes de soltar.",
      },
    ],
  },
  {
    chaves: ["audio", "ouvir", "escut", "ouco"],
    passos: [
      {
        texto: "Abra a conversa onde chegou o áudio.",
        ilustracao: abrirConversa(0),
        outroJeito: "Na lista de conversas, toque no nome da pessoa que mandou.",
      },
      {
        texto: "Toque no triângulo verde ao lado do áudio.",
        ilustracao: {
          modelo: "conversa",
          contato: "Maria",
          baloes: [
            { de: "outro", tipo: "texto", texto: "Escuta o que eu te mandei" },
            { de: "outro", tipo: "audio" },
          ],
          alvo: 1,
        },
        outroJeito: "O áudio aparece como um balão com risquinhos. O triângulo fica no começo dele.",
      },
      {
        texto: "Para ouvir mais alto, encoste o celular no ouvido.",
        outroJeito: "Você também pode aumentar o volume no botão da lateral do celular.",
      },
    ],
  },
  {
    chaves: ["boleto", "codigo de barras", "pagar uma conta", "pagar conta"],
    passos: [
      {
        texto: "Abra o aplicativo do seu banco.",
        ilustracao: tocarApp("Banco"),
        outroJeito: "Procure o ícone do seu banco entre os aplicativos.",
      },
      {
        texto: "Toque em “Pagar” e depois em “Ler código de barras”.",
        ilustracao: {
          modelo: "lista",
          titulo: "Pagar",
          itens: ["Ler código de barras", "Digitar código", "Pix"],
          alvo: 0,
        },
        outroJeito: "Pode estar escrito “Pagar conta” ou “Boletos”.",
      },
      {
        texto: "Aponte a câmera para o código de barras do boleto, de lado.",
        ilustracao: { modelo: "camera", modo: "codigo_barras" },
        outroJeito: "Deixe o boleto num lugar iluminado e o celular parado, até apitar.",
      },
      {
        texto: "Confira o valor e toque em “Pagar”.",
        ilustracao: {
          modelo: "botoes",
          titulo: "Pagamento",
          texto: "Conta de luz: R$ 87,40. Vence em 10/12.",
          botoes: ["Cancelar", "Pagar"],
          alvo: 1,
        },
        outroJeito: "Se o valor estiver diferente do boleto, cancele e confira com calma.",
      },
    ],
    dica: "Desconfie de boletos que chegam por mensagem. Na dúvida, confira com a empresa.",
  },
  {
    chaves: ["selfie", "foto de mim", "minha foto", "virar a camera"],
    passos: [
      {
        texto: "Abra a “Câmera” do celular.",
        ilustracao: tocarApp("Câmera"),
        outroJeito: "É o ícone com o desenho de uma máquina fotográfica.",
      },
      {
        texto: "Toque nas setas para virar a câmera para você.",
        ilustracao: { modelo: "camera", modo: "foto", alvo: "virar" },
        outroJeito: "As setas formam um círculo e ficam ao lado do botão branco.",
      },
      {
        texto: "Toque no botão branco para tirar a foto.",
        ilustracao: { modelo: "camera", modo: "foto", alvo: "disparar" },
        outroJeito: "O botão branco grande fica embaixo, no meio da tela.",
      },
    ],
  },
  {
    chaves: [
      "escrever falando",
      "escrevo falando",
      "ditar",
      "digitar falando",
      "escrever com a voz",
      "escrever por voz",
    ],
    passos: [
      {
        texto: "Toque no espaço onde se escreve a mensagem.",
        outroJeito: "Quando você toca no espaço para escrever, o teclado aparece embaixo.",
      },
      {
        texto: "No teclado, toque no microfone e fale.",
        ilustracao: { modelo: "teclado", texto: "", alvo: "microfone" },
        outroJeito: "O microfone fica na fileira de baixo do teclado, perto do espaço.",
      },
      {
        texto: "Quando terminar, toque na seta para enviar.",
        ilustracao: { modelo: "teclado", texto: "Bom dia, filho", alvo: "enviar" },
        outroJeito: "Antes de enviar, leia o texto. Às vezes o celular entende uma palavra errada.",
      },
    ],
  },
  {
    chaves: ["acento", "til", "cedilha"],
    passos: [
      {
        texto: "Segure a letra que precisa de acento, como o “a”.",
        ilustracao: {
          modelo: "teclado",
          texto: "Bom dia, mam",
          alvo: "a",
          segurar: true,
          opcoes: ["á", "à", "â", "ã"],
        },
        outroJeito: "Encoste o dedo na letra e não solte. As opções aparecem logo acima.",
      },
      {
        texto: "Arraste o dedo até o acento que quer e solte.",
        outroJeito: "Sem tirar o dedo da tela, deslize até a letra com acento.",
      },
    ],
  },
  {
    chaves: ["print", "captura de tela", "foto da tela"],
    passos: [
      {
        texto: "Abra a tela que você quer guardar.",
        outroJeito: "O print guarda uma foto exatamente do que está aparecendo na tela.",
      },
      {
        texto: "Aperte o botão de ligar e o de baixar o volume juntos.",
        ilustracao: { modelo: "aparelho", botoes: ["ligar", "volume_menos"], juntos: true },
        outroJeito: "Os dois botões ficam na lateral do celular. Aperte ao mesmo tempo e solte logo.",
      },
      {
        texto: "A imagem fica guardada na “Galeria”.",
        ilustracao: tocarApp("Galeria"),
        outroJeito: "Abra a Galeria e procure a pasta “Capturas de tela”.",
      },
    ],
  },
];

/** Palavras que indicam uma pergunta sobre o celular, mesmo sem tema na base. */
export const TEMAS_DO_CELULAR = [
  "celular",
  "aplicativo",
  "app",
  "tela",
  "senha",
  "internet",
  "banco",
  "mensagem",
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
