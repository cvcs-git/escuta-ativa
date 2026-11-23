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

  it("descarta textos que não cabem no desenho", () => {
    expect(validarIlustracao({ ...lista, titulo: "Um título muito comprido para a tela" }, "Toque.")).toBeNull();
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
