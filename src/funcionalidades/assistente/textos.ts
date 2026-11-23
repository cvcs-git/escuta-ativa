/** Textos da tela Perguntar. Ficam juntos para facilitar a revisão da linguagem. */
export const TEXTOS = {
  convite: "Toque no microfone e faça sua pergunta.",
  exemplo: "Por exemplo: “Como faço um Pix?” ou “Como mando uma foto pelo WhatsApp?”",
  escrever: "Escreva a sua pergunta.",
  semSuporteAVoz: "Este navegador não reconhece a fala. Escreva a sua pergunta.",
  microfoneNegado:
    "O microfone não está liberado. Para falar, permita o microfone nas configurações do navegador. Por enquanto, escreva a sua pergunta.",
  naoOuvi: "Não ouvi nada. Toque no microfone e fale perto do celular.",
  confirmar: (pergunta: string) => `Entendi assim: ${pergunta}. Está certo?`,
} as const;
