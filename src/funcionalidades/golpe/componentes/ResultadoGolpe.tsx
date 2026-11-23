/** Resultado da verificação (wf_04): classificação, motivo, orientação e próximos passos. */
import { Botao, BotaoAncora } from "@/compartilhado/componentes/Botao";
import { IconeAltoFalante, IconeTelefone } from "@/compartilhado/componentes/Icones";
import { IndicadorLeitura } from "@/compartilhado/componentes/IndicadorLeitura";
import { Rodape } from "@/compartilhado/componentes/Tela";
import { TextoLido } from "@/compartilhado/componentes/TextoLido";
import { encurtar } from "@/compartilhado/utilitarios/texto";
import type { RespostaGolpe } from "@/servicos/ia";
import { NIVEIS } from "../niveis";

const LIMITE_CITACAO = 180;

type Props = {
  mensagem: string;
  resposta: RespostaGolpe;
  aoOuvirDeNovo: () => void;
  aoVerificarOutra: () => void;
};

export function ResultadoGolpe({ mensagem, resposta, aoOuvirDeNovo, aoVerificarOutra }: Props) {
  const { titulo, classe, Icone } = NIVEIS[resposta.classificacao];

  return (
    <>
      <div className="cartao">
        <p className="rotulo">Mensagem recebida:</p>
        <p className="golpe__citacao">“{encurtar(mensagem, LIMITE_CITACAO)}”</p>
      </div>

      <section className={`resultado ${classe}`} role="alert">
        <h2 className="resultado__titulo">
          <Icone className="resultado__icone" />
          <TextoLido texto={titulo} />
        </h2>
        <div className="resultado__corpo">
          <TextoLido como="p" texto={resposta.motivo} />
          <TextoLido como="p" className="resultado__orientacao" texto={resposta.orientacao} />
          <IndicadorLeitura />
        </div>
      </section>

      <Rodape>
        <Botao variante="secundario" onClick={aoOuvirDeNovo}>
          <IconeAltoFalante /> Ouvir de novo
        </Botao>
        {/* "tel:" abre o discador do celular para a pessoa escolher o contato. */}
        <BotaoAncora href="tel:">
          <IconeTelefone /> Ligar para minha família
        </BotaoAncora>
        <Botao variante="secundario" onClick={aoVerificarOutra}>
          Verificar outra mensagem
        </Botao>
      </Rodape>
    </>
  );
}
