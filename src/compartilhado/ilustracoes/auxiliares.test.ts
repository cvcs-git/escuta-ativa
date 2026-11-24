import { describe, expect, it } from "vitest";
import { curto } from "./auxiliares";

describe("curto", () => {
  it("mantém textos que cabem", () => expect(curto("Wi-Fi", 10)).toBe("Wi-Fi"));
  it("abrevia no fim de uma palavra", () => expect(curto("Enviar localização atual", 20)).toBe("Enviar localização…"));
  it("não termina em palavra de ligação", () => expect(curto("Conexões e compartilhamento", 20)).toBe("Conexões…"));
  it("corta a palavra quando não há espaço bom", () => expect(curto("Configurações", 8)).toBe("Configu…"));
});
