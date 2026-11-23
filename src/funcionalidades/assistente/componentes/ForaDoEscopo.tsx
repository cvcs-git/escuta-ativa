/** Recusa gentil para perguntas fora do escopo do app, com sugestão de lição. */
import { Botao, BotaoLink } from "@/compartilhado/componentes/Botao";
import { IndicadorLeitura } from "@/compartilhado/componentes/IndicadorLeitura";
import { Rodape } from "@/compartilhado/componentes/Tela";
import { TextoLido } from "@/compartilhado/componentes/TextoLido";

type Props = { mensagem: string; aoPerguntarOutraCoisa: () => void };

export function ForaDoEscopo({ mensagem, aoPerguntarOutraCoisa }: Props) {
  return (
    <section className="perguntar__fora">
      <h2>Essa pergunta eu não sei responder</h2>
      <TextoLido como="p" texto={mensagem} />
      <IndicadorLeitura />
      <Rodape>
        <BotaoLink to="/licoes">Ver as lições</BotaoLink>
        <Botao variante="secundario" onClick={aoPerguntarOutraCoisa}>
          Perguntar outra coisa
        </Botao>
      </Rodape>
    </section>
  );
}
