/** Escuta (wf_05): microfone pulsando e o texto aparecendo enquanto a pessoa fala. */
import { Botao } from "@/compartilhado/componentes/Botao";
import { IconeMicrofone } from "@/compartilhado/componentes/Icones";
import { Rodape } from "@/compartilhado/componentes/Tela";

type Props = { texto: string; aoTerminar: () => void; aoCancelar: () => void };

export function Escutando({ texto, aoTerminar, aoCancelar }: Props) {
  return (
    <section className="perguntar__ouvindo" aria-live="polite">
      <div className="centro">
        <h2>Estou ouvindo...</h2>
        <p className="apoio">Fale perto do celular</p>
      </div>

      <div className="microfone-ativo" aria-hidden="true">
        <span className="microfone-ativo__onda" />
        <span className="microfone-ativo__onda microfone-ativo__onda--2" />
        <span className="microfone-ativo__disco">
          <IconeMicrofone />
        </span>
      </div>

      <div className="cartao">
        <p className="rotulo">Você está dizendo:</p>
        <p className="perguntar__transcricao">
          {texto || <span className="apoio">O texto aparece enquanto você fala</span>}
          <span className="cursor" aria-hidden="true" />
        </p>
      </div>

      <Rodape className="dupla">
        <Botao variante="secundario" onClick={aoCancelar}>
          Cancelar
        </Botao>
        <Botao onClick={aoTerminar}>Terminei</Botao>
      </Rodape>
    </section>
  );
}
