import { describe, expect, it } from "vitest";
import { classificarGolpe } from "./classificarGolpe";

describe("classificarGolpe (simulação)", () => {
  it("dois ou mais sinais: provável golpe", () => {
    expect(classificarGolpe("Sua conta foi bloqueada. Clique no link.").classificacao).toBe("provavel_golpe");
  });
  it("um sinal: suspeita", () => {
    expect(classificarGolpe("Oi, mãe, troquei de número").classificacao).toBe("suspeita");
  });
  it("nenhum sinal: sem sinais, nunca 'seguro'", () => {
    expect(classificarGolpe("Bom dia! Tudo bem por aí?").classificacao).toBe("sem_sinais");
  });
});
