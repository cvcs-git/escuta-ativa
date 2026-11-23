/** Pergunta por escrito: alternativa à voz (sem suporte, microfone bloqueado ou preferência). */
import { Botao } from "@/compartilhado/componentes/Botao";
import { IconeMicrofone } from "@/compartilhado/componentes/Icones";
import { Rodape } from "@/compartilhado/componentes/Tela";
import { TextoLido } from "@/compartilhado/componentes/TextoLido";
import { TEXTOS } from "../textos";

type Props = {
  aviso?: string;
  pergunta: string;
  vozSuportada: boolean;
  aoEditar: (texto: string) => void;
  aoEnviar: () => void;
  aoFalar: () => void;
};

export function EscreverPergunta({ aviso, pergunta, vozSuportada, aoEditar, aoEnviar, aoFalar }: Props) {
  return (
    <section className="perguntar__digitar">
      {aviso && <TextoLido como="p" className="aviso aviso--neutro" texto={aviso} />}
      <label htmlFor="pergunta">
        <TextoLido como="h2" texto={TEXTOS.escrever} />
      </label>
      <textarea
        id="pergunta"
        className="campo"
        value={pergunta}
        onChange={(evento) => aoEditar(evento.target.value)}
        placeholder="Exemplo: Como faço um Pix?"
      />
      <Rodape>
        <Botao disabled={!pergunta.trim()} onClick={aoEnviar}>
          Enviar pergunta
        </Botao>
        {vozSuportada && (
          <Botao variante="secundario" onClick={aoFalar}>
            <IconeMicrofone /> Prefiro falar
          </Botao>
        )}
      </Rodape>
    </section>
  );
}
