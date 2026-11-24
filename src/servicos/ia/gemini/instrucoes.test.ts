import { describe, expect, it } from "vitest";
import { validarIlustracao, type ModeloIlustracao } from "../ilustracao";
import { EXEMPLOS } from "./exemplos";
import { INSTRUCAO_ASSISTENTE } from "./instrucoes";

const MODELOS: ModeloIlustracao[] = [
  "apps",
  "lista",
  "menu",
  "chave",
  "barra",
  "botoes",
  "campo",
  "gesto",
  "conversa",
  "chamada",
  "camera",
  "teclado",
  "aparelho",
];

describe("documentação enviada ao Gemini", () => {
  it("tem um exemplo para cada um dos 13 modelos", () => {
    expect(EXEMPLOS.map((e) => e.ilustracao.modelo).sort()).toEqual([...MODELOS].sort());
  });

  it.each(EXEMPLOS)("o exemplo do modelo $ilustracao.modelo passa na validação do app", ({ texto, ilustracao }) => {
    expect(validarIlustracao(ilustracao, texto)).not.toBeNull();
  });

  it("descreve todos os modelos no catálogo", () => {
    for (const modelo of MODELOS) expect(INSTRUCAO_ASSISTENTE).toMatch(new RegExp(`\\d+\\. ${modelo} \\(`));
  });

  it("usa os mesmos limites da validação (sem números soltos divergentes)", () => {
    expect(INSTRUCAO_ASSISTENTE).toContain("aceitam até 40 caracteres");
    expect(INSTRUCAO_ASSISTENTE).toContain("apps [2 a 6 nomes]");
  });
});
