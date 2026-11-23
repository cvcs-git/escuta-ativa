import { describe, expect, it } from "vitest";
import { nomeDaVoz, pontuarVoz } from "../voz/FalaContexto";

const voz = (name: string, lang: string) => ({ name, lang }) as SpeechSynthesisVoice;

describe("escolha da voz", () => {
  it("prefere voz neural em português do Brasil", () => {
    const vozes = [
      voz("Microsoft Daniel - Portuguese (Brazil)", "pt-BR"),
      voz("Microsoft Francisca Online (Natural) - Portuguese (Brazil)", "pt-BR"),
      voz("Joana", "pt-PT"),
      voz("Google português do Brasil", "pt-BR"),
    ];
    const ordem = [...vozes].sort((a, b) => pontuarVoz(b) - pontuarVoz(a)).map((v) => v.name);
    expect(ordem[0]).toContain("Francisca");
    expect(ordem[1]).toContain("Google");
    expect(ordem[3]).toBe("Joana");
  });
  it("ignora vozes de outros idiomas", () => expect(pontuarVoz(voz("Samantha", "en-US"))).toBe(-1));
  it("simplifica o nome", () => expect(nomeDaVoz(voz("Microsoft Francisca Online (Natural) - Portuguese (Brazil)", "pt-BR"))).toBe("Francisca"));
});
