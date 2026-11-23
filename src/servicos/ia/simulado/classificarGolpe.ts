/**
 * Classificador de golpes da simulação: procura sinais típicos na mensagem.
 * Dois ou mais sinais: provável golpe. Um sinal: suspeita. Nenhum: sem sinais.
 * Na versão com IA real, quem classifica é o Gemini; este arquivo fica como reserva.
 */
import type { RespostaGolpe } from "../contrato";
import { juntarComE, normalizar } from "@/compartilhado/utilitarios/texto";

const SINAIS_DE_GOLPE: { termos: string[]; motivo: string }[] = [
  { termos: ["link", "clique", "clica", "acesse", "http", "www."], motivo: "pede para clicar em um link" },
  { termos: ["bloquead", "suspens", "cancelad", "irregular"], motivo: "fala em conta ou cartão bloqueado" },
  { termos: ["urgente", "agora", "hoje", "imediat", "ultimo aviso"], motivo: "pressiona para agir com pressa" },
  { termos: ["codigo", "senha", "token", "verificacao"], motivo: "pede código ou senha" },
  { termos: ["premio", "sorteio", "ganhou", "resgate"], motivo: "promete prêmio ou dinheiro" },
  { termos: ["pix", "deposito", "transfer", "emprest"], motivo: "pede dinheiro ou transferência" },
  { termos: ["troquei de numero", "numero novo", "meu novo numero"], motivo: "diz que trocou de número" },
];

export function classificarGolpe(mensagem: string): RespostaGolpe {
  const texto = normalizar(mensagem);
  const encontrados = SINAIS_DE_GOLPE.filter((s) => s.termos.some((t) => texto.includes(t)));
  const motivos = encontrados.map((s) => s.motivo);

  if (encontrados.length >= 2) {
    return {
      classificacao: "provavel_golpe",
      motivo: `A mensagem ${juntarComE(motivos.slice(0, 3))}.`,
      orientacao:
        "Não clique, não pague e não envie senhas ou códigos. Na dúvida, ligue para o banco pelo número do cartão.",
    };
  }
  if (encontrados.length === 1) {
    return {
      classificacao: "suspeita",
      motivo: `A mensagem ${motivos[0]}.`,
      orientacao: "Antes de responder, confirme com a pessoa ou a empresa por outro caminho, como uma ligação.",
    };
  }
  return {
    classificacao: "sem_sinais",
    motivo: "Não encontrei pedidos de dinheiro, links ou senhas.",
    orientacao: "Mesmo assim, desconfie se a conversa mudar de assunto e pedir algo.",
  };
}
