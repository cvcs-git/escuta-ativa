import { describe, expect, it } from "vitest";
import { dividirEmFrases, encurtar, juntarComE, normalizar } from "./texto";

describe("utilitários de texto", () => {
  it("normaliza acentos e maiúsculas", () => expect(normalizar("Câmera ÉÇ")).toBe("camera ec"));
  it("junta itens em português", () => {
    expect(juntarComE(["a"])).toBe("a");
    expect(juntarComE(["a", "b", "c"])).toBe("a, b e c");
  });
  it("encurta textos longos", () => expect(encurtar("abcdef", 3)).toBe("abc..."));
  it("divide em frases guardando a posição", () => {
    const texto = "Olá! Tudo bem? Sim.";
    const frases = dividirEmFrases(texto);
    expect(frases.map((f) => f.texto)).toEqual(["Olá!", "Tudo bem?", "Sim."]);
    expect(frases.every((f) => texto.slice(f.inicio).startsWith(f.texto))).toBe(true);
  });
});
