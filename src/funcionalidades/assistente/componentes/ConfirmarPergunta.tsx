/**
 * Confirmação (wf_06): "Entendi assim... Está certo?". Nenhuma pergunta é enviada à
 * IA sem a confirmação da pessoa (caso de borda: erro no reconhecimento de voz).
 */
import { Botao } from "@/compartilhado/componentes/Botao";
import { IconeConfere } from "@/compartilhado/componentes/Icones";
import { IndicadorLeitura } from "@/compartilhado/componentes/IndicadorLeitura";
import { Rodape } from "@/compartilhado/componentes/Tela";
import { TextoLido } from "@/compartilhado/componentes/TextoLido";

type Props = { pergunta: string; aoConfirmar: () => void; aoFalarDeNovo: () => void };

export function ConfirmarPergunta({ pergunta, aoConfirmar, aoFalarDeNovo }: Props) {
  return (
    <section className="perguntar__confirmar">
      <TextoLido como="h2" className="centro" texto="Entendi assim:" />
      <TextoLido como="p" className="cartao perguntar__entendido" texto={pergunta} />
      <TextoLido como="h2" className="centro" texto="Está certo?" />
      <IndicadorLeitura />
      <Rodape>
        <Botao variante="confirmar" onClick={aoConfirmar}>
          <IconeConfere /> Sim, está certo
        </Botao>
        <Botao variante="secundario" onClick={aoFalarDeNovo}>
          Falar de novo
        </Botao>
      </Rodape>
    </section>
  );
}
