import { describe, expect, it } from "vitest";
import { ErroIA, validarAssistente, validarGolpe } from "../servicos/ia/servicoIA";
import { temDadoSensivel } from "../seguranca/dadosSensiveis";

describe("validação da resposta do assistente", () => {
  it("aceita resposta no formato", () => {
    const r = validarAssistente({ dentroDoEscopo: true, passos: ["Abra o aplicativo do banco."] });
    expect(r.dentroDoEscopo).toBe(true);
  });
  it("recusa mais de 5 passos", () => {
    expect(() => validarAssistente({ dentroDoEscopo: true, passos: Array(6).fill("Passo curto.") })).toThrow(ErroIA);
  });
  it("recusa passo com mais de 20 palavras", () => {
    const longo = Array(21).fill("palavra").join(" ");
    expect(() => validarAssistente({ dentroDoEscopo: true, passos: [longo] })).toThrow(ErroIA);
  });
  it("aceita recusa fora do escopo com mensagem", () => {
    expect(validarAssistente({ dentroDoEscopo: false, mensagem: "Eu ajudo com o celular." }).dentroDoEscopo).toBe(false);
  });
  it("recusa texto solto", () => {
    expect(() => validarAssistente({ resposta: "texto" })).toThrow(ErroIA);
  });
});

describe("validação da resposta de golpe", () => {
  it("aceita as três classificações", () => {
    for (const c of ["provavel_golpe", "suspeita", "sem_sinais"]) {
      expect(validarGolpe({ classificacao: c, motivo: "m", orientacao: "o" }).classificacao).toBe(c);
    }
  });
  it("recusa classificação desconhecida, como 'seguro'", () => {
    expect(() => validarGolpe({ classificacao: "seguro", motivo: "m", orientacao: "o" })).toThrow(ErroIA);
  });
});

describe("detecção de senha ou código", () => {
  it("detecta código de 6 dígitos", () => expect(temDadoSensivel("Seu código é 482913")).toBe(true));
  it("detecta código com espaço", () => expect(temDadoSensivel("Código: 482 913")).toBe(true));
  it("não acusa telefone completo", () => expect(temDadoSensivel("Ligue para 81 99876-5432")).toBe(false));
  it("não acusa mensagem comum", () => expect(temDadoSensivel("Sua conta foi bloqueada. Clique no link.")).toBe(false));
});
