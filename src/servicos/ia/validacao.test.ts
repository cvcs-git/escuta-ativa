import { describe, expect, it } from "vitest";
import { ErroIA } from "./contrato";
import { validarAssistente, validarGolpe } from "./validacao";

describe("validarAssistente", () => {
  it("aceita resposta no formato", () => {
    expect(validarAssistente({ dentroDoEscopo: true, passos: ["Abra o aplicativo do banco."] }).dentroDoEscopo).toBe(
      true,
    );
  });
  it("recusa mais de 5 passos", () => {
    expect(() => validarAssistente({ dentroDoEscopo: true, passos: Array(6).fill("Passo curto.") })).toThrow(ErroIA);
  });
  it("recusa passo com mais de 20 palavras", () => {
    const longo = Array(21).fill("palavra").join(" ");
    expect(() => validarAssistente({ dentroDoEscopo: true, passos: [longo] })).toThrow(ErroIA);
  });
  it("aceita recusa fora do escopo com mensagem", () => {
    expect(validarAssistente({ dentroDoEscopo: false, mensagem: "Eu ajudo com o celular." }).dentroDoEscopo).toBe(
      false,
    );
  });
  it("recusa texto solto", () => {
    expect(() => validarAssistente({ resposta: "texto" })).toThrow(ErroIA);
  });
});

describe("validarGolpe", () => {
  it("aceita as três classificações", () => {
    for (const classificacao of ["provavel_golpe", "suspeita", "sem_sinais"]) {
      expect(validarGolpe({ classificacao, motivo: "m", orientacao: "o" }).classificacao).toBe(classificacao);
    }
  });
  it("recusa classificação desconhecida, como 'seguro'", () => {
    expect(() => validarGolpe({ classificacao: "seguro", motivo: "m", orientacao: "o" })).toThrow(ErroIA);
  });
});
