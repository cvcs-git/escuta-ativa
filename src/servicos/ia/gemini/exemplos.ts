/**
 * Um exemplo de passo ilustrado para cada um dos 16 modelos.
 *
 * Vão para a IA junto com o catálogo: exemplos ensinam o formato melhor que regras.
 * O teste `instrucoes.test.ts` passa cada exemplo pela mesma validação das respostas
 * reais, então um exemplo nunca ensina algo que o app recusaria.
 */
import type { ModeloIlustracao } from "../ilustracao";

export type ExemploDePasso = { texto: string; ilustracao: Record<string, unknown> & { modelo: ModeloIlustracao } };

export const EXEMPLOS: ExemploDePasso[] = [
  {
    texto: "Na tela inicial, toque em “Configurações”.",
    ilustracao: { modelo: "apps", apps: ["Telefone", "WhatsApp", "Câmera", "Configurações"], alvo: 3 },
  },
  {
    texto: "Toque em “Tela”.",
    ilustracao: { modelo: "lista", titulo: "Configurações", itens: ["Wi-Fi", "Tela", "Som"], alvo: 1 },
  },
  {
    texto: "Toque nos três pontinhos e depois em “Encaminhar”.",
    ilustracao: { modelo: "menu", titulo: "Conversa", itens: ["Responder", "Encaminhar", "Apagar"], alvo: 1 },
  },
  {
    texto: "Toque na chave ao lado de “Lanterna” para ligar.",
    ilustracao: { modelo: "chave", titulo: "Atalhos", rotulo: "Lanterna", outros: ["Wi-Fi"], ligar: true },
  },
  {
    texto: "Arraste a bolinha de “Tamanho da letra” para a direita.",
    ilustracao: { modelo: "barra", titulo: "Tela", rotulo: "Tamanho da letra", direcao: "direita" },
  },
  {
    texto: "Toque em “Apagar” para confirmar.",
    ilustracao: {
      modelo: "botoes",
      titulo: "Apagar foto?",
      texto: "A foto vai para a lixeira.",
      botoes: ["Cancelar", "Apagar"],
      alvo: 1,
    },
  },
  {
    texto: "Toque em “Nome” e escreva o nome da pessoa.",
    ilustracao: {
      modelo: "campo",
      titulo: "Novo contato",
      campos: [
        { rotulo: "Nome", exemplo: "Maria Souza" },
        { rotulo: "Telefone", exemplo: "(81) 9 9999-0000" },
      ],
      alvo: 0,
      confirmar: "Salvar",
    },
  },
  {
    texto: "Deslize o dedo do alto da tela para baixo.",
    ilustracao: { modelo: "gesto", gesto: "deslizar_baixo", sobre: "app" },
  },
  {
    texto: "Segure o microfone enquanto fala e solte para enviar.",
    ilustracao: {
      modelo: "conversa",
      contato: "Filha",
      baloes: [{ de: "outro", tipo: "texto", texto: "Mãe, manda um áudio?" }],
      alvo: "microfone",
      segurar: true,
    },
  },
  {
    texto: "Durante a ligação, toque no alto-falante para usar o viva-voz.",
    ilustracao: { modelo: "chamada", contato: "Filho", tipo: "andamento", video: false, alvo: "viva_voz" },
  },
  {
    texto: "Aponte a câmera para o QR code e espere ler.",
    ilustracao: { modelo: "camera", modo: "qrcode" },
  },
  {
    texto: "No teclado, toque no microfone e fale a mensagem.",
    ilustracao: { modelo: "teclado", texto: "", alvo: "microfone", segurar: false, opcoes: [] },
  },
  {
    texto: "Aperte ao mesmo tempo o botão de ligar e o de abaixar o volume.",
    ilustracao: { modelo: "aparelho", botoes: ["ligar", "volume_menos"], juntos: true },
  },
  {
    texto: "Toque em “Lanterna” para acender.",
    ilustracao: { modelo: "atalhos", atalhos: ["Wi-Fi", "Lanterna", "Modo avião", "Bluetooth"], alvo: 1, ligar: true },
  },
  {
    texto: "Toque em “Voltar”, o triângulo na parte de baixo da tela.",
    ilustracao: { modelo: "navegacao", alvo: "voltar" },
  },
  {
    texto: "Com a foto marcada, toque em “Compartilhar”.",
    ilustracao: { modelo: "galeria", alvo: "compartilhar", foto: 0, varias: false },
  },
];
