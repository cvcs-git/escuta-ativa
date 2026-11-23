import { describe, expect, it } from "vitest";
import { ESTADO_INICIAL, maquinaDoGolpe as m } from "./maquinaDoGolpe";

describe("máquina de estados do golpe", () => {
  it("editar a mensagem tira o alerta de senha", () => {
    const comAlerta = m({ ...ESTADO_INICIAL, mensagem: "código 1234" }, { tipo: "bloquear_senha" });
    expect(comAlerta.etapa).toEqual({ tipo: "entrada", temSenha: true });
    expect(m(comAlerta, { tipo: "editar", mensagem: "código" }).etapa).toEqual({ tipo: "entrada", temSenha: false });
  });

  it("guarda a mensagem ao mostrar o resultado", () => {
    const resposta = { classificacao: "suspeita" as const, motivo: "m", orientacao: "o" };
    const estado = m({ ...ESTADO_INICIAL, mensagem: "oi" }, { tipo: "respondeu", resposta });
    expect(estado).toEqual({ mensagem: "oi", etapa: { tipo: "resultado", resposta } });
  });

  it("verificar outra mensagem limpa tudo", () => {
    expect(m({ mensagem: "x", etapa: { tipo: "pensando" } }, { tipo: "recomecar" })).toBe(ESTADO_INICIAL);
  });
});
