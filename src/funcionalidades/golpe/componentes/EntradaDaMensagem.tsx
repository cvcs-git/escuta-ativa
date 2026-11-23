/** Entrada da mensagem: colar ou ditar, com alerta quando há senha ou código. */
import { Botao } from "@/compartilhado/componentes/Botao";
import { IconeAlerta, IconeMicrofone } from "@/compartilhado/componentes/Icones";
import { Rodape } from "@/compartilhado/componentes/Tela";
import { TextoLido } from "@/compartilhado/componentes/TextoLido";
import { TEXTOS } from "../textos";

type Props = {
  mensagem: string;
  temSenha: boolean;
  ditado: { suportado: boolean; ouvindo: boolean; negado: boolean; alternar: () => void };
  aoEditar: (texto: string) => void;
  aoVerificar: () => void;
};

export function EntradaDaMensagem({ mensagem, temSenha, ditado, aoEditar, aoVerificar }: Props) {
  return (
    <section className="golpe__entrada">
      <label htmlFor="mensagem">
        <TextoLido como="h2" texto={TEXTOS.instrucao} />
      </label>
      <TextoLido como="p" className="apoio" texto={TEXTOS.comoColar} />

      {temSenha && (
        <p className="aviso aviso--alerta" role="alert">
          <IconeAlerta />
          <TextoLido texto={TEXTOS.avisoSenha} />
        </p>
      )}

      <textarea
        id="mensagem"
        className="campo"
        value={mensagem}
        onChange={(evento) => aoEditar(evento.target.value)}
        placeholder="Exemplo: Sua conta foi bloqueada. Clique no link para liberar."
      />

      <Rodape>
        <Botao disabled={!mensagem.trim() || ditado.ouvindo} onClick={aoVerificar}>
          Verificar mensagem
        </Botao>
        {ditado.suportado && (
          <Botao variante="secundario" onClick={ditado.alternar}>
            <IconeMicrofone /> {ditado.ouvindo ? "Parar de ditar" : "Ditar a mensagem"}
          </Botao>
        )}
        {ditado.negado && <p className="apoio">{TEXTOS.microfoneNegado}</p>}
      </Rodape>
    </section>
  );
}
