import { describe, expect, it } from "vitest";
import { validarAssistente } from "../validacao";
import { RESPOSTAS } from "./respostas";
import { buscarResposta } from "./servicoSimulado";

describe("respostas simuladas", () => {
  it.each(RESPOSTAS.map((r) => [r.chaves[0], r] as const))(
    "o tema “%s” passa na validação, com todas as ilustrações",
    (_, resposta) => {
      const validada = validarAssistente({ dentroDoEscopo: true, passos: resposta.passos, dica: resposta.dica });
      if (!validada.dentroDoEscopo) throw new Error("deveria estar dentro do escopo");
      const esperadas = resposta.passos.map((p) => Boolean(p.ilustracao));
      // Nenhuma ilustração da base pode ser descartada pela validação.
      expect(validada.ilustracoes.map(Boolean)).toEqual(esperadas);
      // Cada passo tem uma explicação alternativa.
      expect(resposta.passos.every((p) => p.outroJeito.length > 0)).toBe(true);
    },
  );

  it.each([
    ["Como faço um Pix?", "pix"],
    ["Como mando uma foto pelo WhatsApp?", "foto"],
    ["Como apago uma foto?", "apag"],
    ["Como apago uma conversa?", "apag"],
    ["Como mando um áudio?", "audio"],
    ["Como escuto o áudio que me mandaram?", "audio"],
    ["Como faço uma chamada de vídeo?", "chamada de video"],
    ["Como atendo a chamada de vídeo?", "atend"],
    ["Onde digito a senha do Wi-Fi?", "senha do wi"],
    ["Como ligo o Wi-Fi?", "wi-fi"],
    ["Como tiro uma selfie?", "selfie"],
    ["Como tiro um print?", "print"],
  ])("“%s” encontra o tema certo", (pergunta, primeiraChave) => {
    expect(buscarResposta(pergunta)?.chaves[0]).toBe(primeiraChave);
  });

  it("distingue apagar foto de apagar conversa", () => {
    expect(buscarResposta("Como apago uma foto?")?.chaves).toContain("foto");
    expect(buscarResposta("Como apago uma conversa?")?.chaves).toContain("conversa");
  });

  it("distingue mandar de ouvir um áudio", () => {
    expect(buscarResposta("Como mando um áudio?")?.chaves).toContain("mando um audio");
    expect(buscarResposta("Como escuto o áudio?")?.chaves).toContain("escut");
  });
});
