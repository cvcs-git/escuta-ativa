import { describe, expect, it } from "vitest";
import { combinaComOPasso, validarIlustracao } from "./ilustracao";

const lista = { modelo: "lista", titulo: "Detalhes do contato", itens: ["Ligar", "Bloquear número"], alvo: 1 };

describe("validarIlustracao", () => {
  it("aceita uma descrição válida", () => {
    expect(validarIlustracao(lista, "Toque em “Bloquear número”.")).toEqual(lista);
  });

  it("descarta modelo desconhecido", () => {
    expect(validarIlustracao({ modelo: "holograma" }, "Toque.")).toBeNull();
  });

  it("descarta alvo que não existe", () => {
    expect(validarIlustracao({ ...lista, alvo: 5 }, "Toque.")).toBeNull();
  });

  it("descarta textos acima de 40 caracteres (até 40, o desenho abrevia)", () => {
    expect(validarIlustracao({ ...lista, titulo: "Um título muito comprido para a tela" }, "Toque.")).not.toBeNull();
    expect(
      validarIlustracao({ ...lista, titulo: "Um título comprido demais até para ser abreviado" }, "Toque."),
    ).toBeNull();
  });

  it("descarta quando o dedo aponta outra coisa que não a citada no passo", () => {
    expect(validarIlustracao({ ...lista, alvo: 0 }, "Toque em “Bloquear número”.")).toBeNull();
  });

  it("aceita passo sem nome entre aspas", () => {
    expect(combinaComOPasso(validarIlustracao(lista, "Toque na opção de bloquear.")!, "Toque na opção.")).toBe(true);
  });

  it("valida conversas com balão de áudio como alvo", () => {
    const conversa = {
      modelo: "conversa",
      contato: "Maria",
      baloes: [{ de: "outro", tipo: "audio" }],
      alvo: 0,
    };
    expect(validarIlustracao(conversa, "Toque no triângulo verde.")).toMatchObject({ modelo: "conversa", alvo: 0 });
  });

  it("só aceita alvos de chamada compatíveis com o tipo", () => {
    const chamada = { modelo: "chamada", contato: "João", tipo: "recebida", alvo: "desligar" };
    expect(validarIlustracao(chamada, "Toque.")).toBeNull();
  });

  it("aceita letra ou tecla especial no teclado", () => {
    expect(validarIlustracao({ modelo: "teclado", texto: "", alvo: "microfone" }, "Toque.")).not.toBeNull();
    expect(validarIlustracao({ modelo: "teclado", texto: "", alvo: "tecla mágica" }, "Toque.")).toBeNull();
  });
});

describe("nomes longos", () => {
  it("aceita o nome real de um botão longo (o desenho abrevia)", () => {
    const espec = validarIlustracao(
      { modelo: "botoes", titulo: "Localização", texto: "Compartilhar", botoes: ["Enviar localização atual"], alvo: 0 },
      "Toque em “Enviar localização atual”.",
    );
    expect(espec).not.toBeNull();
  });
  it("recusa nomes com mais de 40 caracteres", () => {
    const longo = "Um nome de botão muito comprido que não serve";
    expect(
      validarIlustracao({ modelo: "botoes", titulo: "T", texto: "x", botoes: [longo], alvo: 0 }, "Toque."),
    ).toBeNull();
  });
});

describe("modelos novos", () => {
  it("painel de atalhos: aceita e confere o nome citado no passo", () => {
    const atalhos = { modelo: "atalhos", atalhos: ["Wi-Fi", "Lanterna", "Modo avião"], alvo: 1 };
    expect(validarIlustracao(atalhos, "Toque em “Lanterna”.")).toMatchObject({ ligar: true });
    expect(validarIlustracao(atalhos, "Toque em “Wi-Fi”.")).toBeNull();
    expect(validarIlustracao({ ...atalhos, atalhos: ["Wi-Fi"] }, "Toque.")).toBeNull();
  });
  it("navegação: só aceita voltar, início ou aplicativos abertos", () => {
    expect(validarIlustracao({ modelo: "navegacao", alvo: "voltar" }, "Toque em “Voltar”.")).not.toBeNull();
    expect(validarIlustracao({ modelo: "navegacao", alvo: "menu" }, "Toque.")).toBeNull();
    expect(validarIlustracao({ modelo: "navegacao", alvo: "inicio" }, "Toque em “Voltar”.")).toBeNull();
  });
  it("galeria: foto entre 0 e 8 e ação conhecida", () => {
    expect(validarIlustracao({ modelo: "galeria", alvo: "foto" }, "Toque na foto.")).toMatchObject({ foto: 4 });
    expect(
      validarIlustracao({ modelo: "galeria", alvo: "apagar", foto: 2, varias: true }, "Toque em “Apagar”."),
    ).not.toBeNull();
    expect(validarIlustracao({ modelo: "galeria", alvo: "foto", foto: 9 }, "Toque.")).toBeNull();
    expect(validarIlustracao({ modelo: "galeria", alvo: "imprimir" }, "Toque.")).toBeNull();
  });
});
