import { describe, expect, it } from "vitest";
import { estadoInicial, maquinaDoAssistente as m } from "./maquinaDoAssistente";
import { TEXTOS } from "./textos";

const ouvindo = m(estadoInicial(true), { tipo: "escutar" });

describe("máquina de estados do assistente", () => {
  it("começa no convite quando há voz e na escrita quando não há", () => {
    expect(estadoInicial(true).etapa.tipo).toBe("inicio");
    expect(estadoInicial(false).etapa).toEqual({ tipo: "digitar", aviso: TEXTOS.semSuporteAVoz });
  });

  it("após a fala, pede confirmação do texto entendido", () => {
    const estado = m(ouvindo, { tipo: "escuta_terminou", texto: " Como faço um Pix? ", erro: null });
    expect(estado).toEqual({ pergunta: "Como faço um Pix?", etapa: { tipo: "confirmar" } });
  });

  it("sem fala, volta ao convite com aviso", () => {
    expect(m(ouvindo, { tipo: "escuta_terminou", texto: "", erro: null }).etapa).toEqual({
      tipo: "inicio",
      aviso: TEXTOS.naoOuvi,
    });
  });

  it("microfone negado: oferece escrever", () => {
    expect(m(ouvindo, { tipo: "escuta_terminou", texto: "", erro: "negado" }).etapa).toEqual({
      tipo: "digitar",
      aviso: TEXTOS.microfoneNegado,
    });
  });

  it("não envia pergunta vazia", () => {
    const vazia = m(estadoInicial(true), { tipo: "escrever" });
    expect(m(vazia, { tipo: "enviar" })).toBe(vazia);
  });

  it("resposta fora do escopo leva à recusa", () => {
    const pensando = { pergunta: "Qual a capital da França?", etapa: { tipo: "pensando" as const } };
    const estado = m(pensando, { tipo: "respondeu", resposta: { dentroDoEscopo: false, mensagem: "Não sei." } });
    expect(estado.etapa).toEqual({ tipo: "fora", mensagem: "Não sei." });
  });

  it("concluir guarda a dica da resposta", () => {
    const resposta = {
      pergunta: "Pix",
      etapa: { tipo: "resposta" as const, passos: ["Abra o banco."], dica: "Calma." },
    };
    expect(m(resposta, { tipo: "concluir" }).etapa).toEqual({ tipo: "concluida", dica: "Calma." });
  });
});
