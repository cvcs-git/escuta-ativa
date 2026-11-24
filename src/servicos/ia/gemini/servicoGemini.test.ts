import { describe, expect, it } from "vitest";
import { ErroIA } from "../contrato";
import { ESQUEMA_ASSISTENTE, ESQUEMA_GOLPE, TOTAL_DE_MODELOS } from "./esquemas";
import { INSTRUCAO_ASSISTENTE, INSTRUCAO_GOLPE } from "./instrucoes";
import { converterErro, criarServicoGemini, type GerarJSON, type PedidoGemini } from "./servicoGemini";

const sinal = new AbortController().signal;

/** Gerador falso: devolve o texto pedido e guarda o último pedido para conferência. */
function geradorFalso(resposta: string | (() => never)) {
  const pedidos: PedidoGemini[] = [];
  const gerar: GerarJSON = async (pedido) => {
    pedidos.push(pedido);
    return typeof resposta === "string" ? resposta : resposta();
  };
  return { gerar, pedidos };
}

const tipo = async (promessa: Promise<unknown>) => {
  try {
    await promessa;
    return "sem erro";
  } catch (erro) {
    return erro instanceof ErroIA ? erro.tipo : "outro";
  }
};

describe("servicoGemini: perguntar", () => {
  it("manda a pergunta com a instrução e o esquema do assistente", async () => {
    const { gerar, pedidos } = geradorFalso('{"dentroDoEscopo":true,"passos":[{"texto":"Abra o WhatsApp."}]}');
    await criarServicoGemini(gerar).perguntar("Como mando foto?", sinal);
    expect(pedidos[0]).toEqual({
      instrucao: INSTRUCAO_ASSISTENTE,
      esquema: ESQUEMA_ASSISTENTE,
      texto: "Como mando foto?",
    });
  });

  it("aceita passos com ilustração válida e descarta só a ilustração inválida", async () => {
    const json = JSON.stringify({
      dentroDoEscopo: true,
      passos: [
        { texto: "Toque em “WhatsApp”.", ilustracao: { modelo: "apps", apps: ["Telefone", "WhatsApp"], alvo: 1 } },
        { texto: "Toque em “Câmera”.", ilustracao: { modelo: "apps", apps: ["Telefone", "WhatsApp"], alvo: 0 } },
      ],
    });
    const resposta = await criarServicoGemini(geradorFalso(json).gerar).perguntar("foto", sinal);
    expect(resposta.dentroDoEscopo && resposta.ilustracoes.map(Boolean)).toEqual([true, false]);
  });

  it("texto que não é JSON vira erro de formato", async () => {
    expect(await tipo(criarServicoGemini(geradorFalso("Claro! Veja os passos").gerar).perguntar("x", sinal))).toBe(
      "formato",
    );
  });

  it("JSON fora das regras (6 passos) vira erro de formato", async () => {
    const json = JSON.stringify({ dentroDoEscopo: true, passos: Array(6).fill({ texto: "Passo." }) });
    expect(await tipo(criarServicoGemini(geradorFalso(json).gerar).perguntar("x", sinal))).toBe("formato");
  });
});

describe("servicoGemini: privacidade", () => {
  it("nunca envia CPF ou senha ao modelo", async () => {
    const { gerar, pedidos } = geradorFalso('{"dentroDoEscopo":true,"passos":[{"texto":"Abra o banco."}]}');
    await criarServicoGemini(gerar).perguntar("Meu CPF é 123.456.789-00 e a senha é abc123", sinal);
    expect(pedidos[0].texto).toBe("Meu CPF é •••• e a senha é ••••");
  });
});

describe("servicoGemini: golpe e outro jeito", () => {
  it("coloca a mensagem entre marcas, separada das instruções", async () => {
    const { gerar, pedidos } = geradorFalso(
      '{"classificacao":"provavel_golpe","motivo":"Pede Pix com urgência.","orientacao":"Não pague."}',
    );
    const resposta = await criarServicoGemini(gerar).verificarGolpe("Mãe, troquei de número", sinal);
    expect(resposta.classificacao).toBe("provavel_golpe");
    expect(pedidos[0].instrucao).toBe(INSTRUCAO_GOLPE);
    expect(pedidos[0].esquema).toBe(ESQUEMA_GOLPE);
    expect(pedidos[0].texto).toBe("<mensagem>\nMãe, troquei de número\n</mensagem>");
  });

  it("classificação inexistente vira erro de formato", async () => {
    const json = '{"classificacao":"segura","motivo":"a","orientacao":"b"}';
    expect(await tipo(criarServicoGemini(geradorFalso(json).gerar).verificarGolpe("oi", sinal))).toBe("formato");
  });

  it("outro jeito devolve o texto e recusa texto vazio", async () => {
    const servico = criarServicoGemini(geradorFalso('{"texto":"Procure o desenho de engrenagem."}').gerar);
    expect(await servico.explicarDeOutroJeito("p", "passo", sinal)).toBe("Procure o desenho de engrenagem.");
    const vazio = criarServicoGemini(geradorFalso('{"texto":"  "}').gerar);
    expect(await tipo(vazio.explicarDeOutroJeito("p", "passo", sinal))).toBe("formato");
  });
});

describe("converterErro", () => {
  it("limite de uso (429) vira erro de limite", () => {
    expect(converterErro({ customErrorData: { status: 429 }, message: "" })).toEqual(new ErroIA("limite"));
    expect(converterErro(new Error("RESOURCE_EXHAUSTED: quota"))).toEqual(new ErroIA("limite"));
  });
  it("outras falhas viram serviço indisponível", () => {
    expect(converterErro(new Error("App Check token is invalid"))).toEqual(new ErroIA("indisponivel"));
  });
  it("cancelamento passa adiante (o app trata como tempo esgotado)", () => {
    const cancelado = new DOMException("Aborted", "AbortError");
    expect(converterErro(cancelado)).toBe(cancelado);
  });
  it("gerador que falha com 429 chega à tela como limite", async () => {
    const falha = () => {
      throw { customErrorData: { status: 429 } };
    };
    expect(await tipo(criarServicoGemini(geradorFalso(falha).gerar).perguntar("x", sinal))).toBe("limite");
  });
});

describe("esquemas", () => {
  it("descrevem os 13 modelos de ilustração", () => {
    expect(TOTAL_DE_MODELOS).toBe(13);
  });
});
