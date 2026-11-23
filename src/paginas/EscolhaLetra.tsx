import { TAMANHO_PX, usePreferencias, type TamanhoLetra } from "../contexto/Preferencias";
import { IconeConfere } from "../componentes/Icones";

const OPCOES: { valor: TamanhoLetra; nome: string }[] = [
  { valor: "normal", nome: "Normal" },
  { valor: "grande", nome: "Grande" },
  { valor: "maior", nome: "Maior" },
];

/** Três tamanhos de letra, com exemplo logo abaixo (usado em T1 e T7). */
export function EscolhaLetra({ legenda }: { legenda: string }) {
  const { tamanhoLetra, atualizar } = usePreferencias();
  return (
    <fieldset className="escolha">
      <legend><h2>{legenda}</h2></legend>
      <div className="escolha__letras">
        {OPCOES.map((o) => {
          const ativo = o.valor === tamanhoLetra;
          return (
            <button
              key={o.valor}
              className={`escolha__letra ${ativo ? "ativo" : ""}`}
              aria-pressed={ativo}
              onClick={() => atualizar({ tamanhoLetra: o.valor })}
            >
              <span className="escolha__a" style={{ fontSize: TAMANHO_PX[o.valor] * 1.3 }} aria-hidden="true">A</span>
              <span className="escolha__nome">{ativo && <IconeConfere />}{o.nome}</span>
            </button>
          );
        })}
      </div>
      <p className="cartao escolha__exemplo">Exemplo: assim fica o texto.</p>
    </fieldset>
  );
}
