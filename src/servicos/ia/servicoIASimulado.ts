/**
 * Serviço de IA simulado.
 * Devolve exatamente o mesmo JSON que o Gemini devolverá, com atraso realista.
 * Para demonstrar os estados de erro, acrescente à URL:
 *   ?simular=timeout | indisponivel | formato | limite | lento
 * Exemplo: .../#/perguntar?simular=timeout
 */
import {
  ErroIA,
  validarAssistente,
  validarGolpe,
  type RespostaAssistente,
  type RespostaGolpe,
  type ServicoIA,
} from "./servicoIA";

type Simulacao = "timeout" | "indisponivel" | "formato" | "limite" | "lento" | null;

export function lerSimulacao(): Simulacao {
  const consulta = window.location.hash.split("?")[1] ?? window.location.search.slice(1);
  const valor = new URLSearchParams(consulta).get("simular");
  const validos = ["timeout", "indisponivel", "formato", "limite", "lento"];
  return validos.includes(valor ?? "") ? (valor as Simulacao) : null;
}

function esperar(ms: number, sinal: AbortSignal) {
  return new Promise<void>((resolver, rejeitar) => {
    const id = setTimeout(resolver, ms);
    sinal.addEventListener("abort", () => {
      clearTimeout(id);
      rejeitar(new ErroIA("timeout"));
    });
  });
}

/** Aplica a simulação de erro escolhida e devolve o atraso da resposta. */
async function aplicarSimulacao(sinal: AbortSignal) {
  const sim = lerSimulacao();
  if (sim === "timeout") {
    await esperar(60_000, sinal); // nunca responde: o app encerra em 10 s
  }
  if (sim === "indisponivel") {
    await esperar(1_000, sinal);
    throw new ErroIA("indisponivel");
  }
  if (sim === "limite") {
    await esperar(800, sinal);
    throw new ErroIA("limite");
  }
  await esperar(sim === "lento" ? 7_000 : 1_200 + Math.random() * 800, sinal);
  return sim;
}

const normalizar = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/* ---------- Base de respostas do assistente ---------- */

const RESPOSTAS: { chaves: string[]; passos: string[]; dica?: string; outroJeito: string[] }[] = [
  {
    chaves: ["pix"],
    passos: [
      "Abra o aplicativo do seu banco.",
      "Toque em “Pix” na tela inicial do aplicativo.",
      "Escolha “Pagar” ou “Transferir”.",
      "Digite a chave Pix de quem vai receber.",
      "Confira o nome e o valor antes de confirmar.",
    ],
    dica: "Desconfie se alguém pedir um Pix com pressa.",
    outroJeito: [
      "Procure o ícone do seu banco entre os aplicativos e toque nele uma vez.",
      "O Pix costuma aparecer como um losango, perto do topo da tela. Ele também pode estar no menu “Transferências”.",
      "Se aparecerem várias opções, escolha a que fala em enviar dinheiro.",
      "A chave pode ser o telefone, o CPF ou o e-mail da pessoa. Peça a ela.",
      "Leia com calma o nome que aparece. Se não for a pessoa certa, cancele.",
    ],
  },
  {
    chaves: ["foto", "imagem", "whatsapp", "zap"],
    passos: [
      "Abra a conversa da pessoa no WhatsApp.",
      "Toque no clipe de papel ao lado de onde se escreve.",
      "Toque em “Galeria”.",
      "Toque na foto que quer mandar.",
      "Toque na seta verde para enviar.",
    ],
    outroJeito: [
      "Na lista de conversas, toque no nome ou na foto da pessoa.",
      "Embaixo, perto do espaço para escrever, há um desenho de clipe. Em alguns celulares é um sinal de mais.",
      "Galeria é onde ficam as fotos que você tirou.",
      "Toque uma vez na foto. Ela vai aparecer grande na tela.",
      "A seta fica no canto de baixo, à direita.",
    ],
  },
  {
    chaves: ["letra", "fonte", "ler melhor", "aumentar"],
    passos: [
      "Abra as Configurações do celular.",
      "Toque em “Tela” ou “Visor”.",
      "Toque em “Tamanho da fonte”.",
      "Arraste a bolinha para a direita até ficar bom para ler.",
    ],
    outroJeito: [
      "Configurações é o ícone de engrenagem, entre os aplicativos.",
      "Desça a tela devagar até encontrar a palavra “Tela”.",
      "Pode estar escrito “Fonte” ou “Tamanho do texto”.",
      "Quanto mais para a direita, maior a letra.",
    ],
  },
  {
    chaves: ["video", "chamada", "ligar"],
    passos: [
      "Abra a conversa da pessoa no WhatsApp.",
      "Toque no desenho de câmera no alto da tela.",
      "Espere a pessoa atender.",
      "Para desligar, toque no botão vermelho.",
    ],
    outroJeito: [
      "Na lista de conversas, toque no nome da pessoa.",
      "No alto, à direita, há uma câmera pequena. Toque nela.",
      "Segure o celular na frente do rosto enquanto chama.",
      "O botão vermelho fica embaixo, no meio da tela.",
    ],
  },
];

const TEMAS_DO_CELULAR = ["celular", "aplicativo", "app", "tela", "senha", "internet", "wifi", "banco", "mensagem", "audio", "contato"];

/* ---------- Classificação de golpe ---------- */

const SINAIS_DE_GOLPE: { termos: string[]; motivo: string }[] = [
  { termos: ["link", "clique", "clica", "acesse", "http", "www."], motivo: "pede para clicar em um link" },
  { termos: ["bloquead", "suspens", "cancelad", "irregular"], motivo: "fala em conta ou cartão bloqueado" },
  { termos: ["urgente", "agora", "hoje", "imediat", "ultimo aviso"], motivo: "pressiona para agir com pressa" },
  { termos: ["codigo", "senha", "token", "verificacao"], motivo: "pede código ou senha" },
  { termos: ["premio", "sorteio", "ganhou", "resgate"], motivo: "promete prêmio ou dinheiro" },
  { termos: ["pix", "deposito", "transfer", "emprest"], motivo: "pede dinheiro ou transferência" },
  { termos: ["troquei de numero", "numero novo", "meu novo numero"], motivo: "diz que trocou de número" },
];

function classificar(mensagem: string): RespostaGolpe {
  const texto = normalizar(mensagem);
  const encontrados = SINAIS_DE_GOLPE.filter((s) => s.termos.some((t) => texto.includes(t)));
  const motivos = encontrados.map((s) => s.motivo);
  const juntar = (lista: string[]) =>
    lista.length > 1 ? `${lista.slice(0, -1).join(", ")} e ${lista[lista.length - 1]}` : lista[0];

  if (encontrados.length >= 2) {
    return {
      classificacao: "provavel_golpe",
      motivo: `A mensagem ${juntar(motivos.slice(0, 3))}.`,
      orientacao: "Não clique, não pague e não envie senhas ou códigos. Na dúvida, ligue para o banco pelo número do cartão.",
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

/* ---------- Serviço ---------- */

export function criarServicoSimulado(): ServicoIA {
  return {
    async perguntar(pergunta, sinal) {
      const sim = await aplicarSimulacao(sinal);
      if (sim === "formato") return validarAssistente({ resposta: "texto solto, fora do formato" });

      const texto = normalizar(pergunta);
      const achada = RESPOSTAS.find((r) => r.chaves.some((c) => texto.includes(c)));
      let resposta: RespostaAssistente;
      if (achada) {
        resposta = { dentroDoEscopo: true, passos: achada.passos, dica: achada.dica };
      } else if (TEMAS_DO_CELULAR.some((t) => texto.includes(t))) {
        resposta = {
          dentroDoEscopo: true,
          passos: [
            "Abra o aplicativo que você quer usar.",
            "Procure um botão com o nome do que deseja fazer.",
            "Se não encontrar, toque nos três pontinhos no canto da tela.",
            "Leia as opções com calma antes de tocar.",
          ],
          dica: "Se puder, diga o nome do aplicativo na pergunta. Assim a explicação fica mais exata.",
        };
      } else {
        resposta = {
          dentroDoEscopo: false,
          mensagem: "Eu ajudo com o uso do celular, como mensagens, fotos, Pix e segurança. Que tal fazer uma das lições?",
        };
      }
      return validarAssistente(resposta);
    },

    async explicarDeOutroJeito(pergunta, passo, sinal) {
      await aplicarSimulacao(sinal);
      const texto = normalizar(pergunta);
      const achada = RESPOSTAS.find((r) => r.chaves.some((c) => texto.includes(c)));
      const indice = achada?.passos.indexOf(passo) ?? -1;
      if (achada && indice >= 0) return achada.outroJeito[indice];
      return "Procure esse nome escrito na tela. Ele pode estar um pouco mais abaixo: deslize o dedo para cima devagar.";
    },

    async verificarGolpe(mensagem, sinal) {
      const sim = await aplicarSimulacao(sinal);
      if (sim === "formato") return validarGolpe({ classificacao: "talvez" });
      return validarGolpe(classificar(mensagem));
    },
  };
}
