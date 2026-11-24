import { describe, expect, it } from "vitest";
import { mascararDadosSensiveis, temDadoSensivel } from "./dadosSensiveis";

describe("temDadoSensivel", () => {
  it("detecta código de 6 dígitos", () => expect(temDadoSensivel("Seu código é 482913")).toBe(true));
  it("detecta código com espaço", () => expect(temDadoSensivel("Código: 482 913")).toBe(true));
  it("não acusa telefone completo", () => expect(temDadoSensivel("Ligue para 81 99876-5432")).toBe(false));
  it("não acusa mensagem comum", () => expect(temDadoSensivel("Sua conta foi bloqueada. Clique no link.")).toBe(false));
});

describe("mascararDadosSensiveis", () => {
  it("esconde CPF e cartão", () => {
    expect(mascararDadosSensiveis("Meu CPF é 123.456.789-00")).toBe("Meu CPF é ••••");
    expect(mascararDadosSensiveis("Cartão 4111 1111 1111 1111 vence")).toBe("Cartão •••• vence");
  });
  it("esconde o valor da senha, mas mantém a palavra", () => {
    expect(mascararDadosSensiveis("Minha senha é abc123, como entro?")).toBe("Minha senha é ••••, como entro?");
  });
  it("não confunde a palavra código com um código", () => {
    expect(mascararDadosSensiveis("Qual é o código do meu banco?")).toBe("Qual é o código do meu banco?");
    expect(mascararDadosSensiveis("A senha: banana")).toBe("A senha: ••••");
  });
  it("mantém a pergunta compreensível", () => {
    expect(mascararDadosSensiveis("Como faço um Pix de 1500 reais?")).toBe("Como faço um Pix de •••• reais?");
    expect(mascararDadosSensiveis("Como mando foto pelo WhatsApp?")).toBe("Como mando foto pelo WhatsApp?");
  });
  it("não mexe em valores curtos", () => {
    expect(mascararDadosSensiveis("Pix de 800 reais")).toBe("Pix de 800 reais");
  });
});
