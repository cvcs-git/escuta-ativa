import { describe, expect, it } from "vitest";
import { temDadoSensivel } from "./dadosSensiveis";

describe("temDadoSensivel", () => {
  it("detecta código de 6 dígitos", () => expect(temDadoSensivel("Seu código é 482913")).toBe(true));
  it("detecta código com espaço", () => expect(temDadoSensivel("Código: 482 913")).toBe(true));
  it("não acusa telefone completo", () => expect(temDadoSensivel("Ligue para 81 99876-5432")).toBe(false));
  it("não acusa mensagem comum", () => expect(temDadoSensivel("Sua conta foi bloqueada. Clique no link.")).toBe(false));
});
