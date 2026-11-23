/**
 * Escolha do tamanho da letra, com exemplo logo abaixo.
 * Usada na tela de boas-vindas (T1) e em Ajustes (T7).
 */
import { TAMANHO_LETRA_PX, type TamanhoLetra } from "@/compartilhado/preferencias/preferencias";
import { usePreferencias } from "@/compartilhado/preferencias/PreferenciasProvider";
import { IconeConfere } from "./Icones";
import "./escolha-letra.css";

const OPCOES: { valor: TamanhoLetra; nome: string }[] = [
  { valor: "normal", nome: "Normal" },
  { valor: "grande", nome: "Grande" },
  { valor: "maior", nome: "Maior" },
];

export function EscolhaLetra({ legenda }: { legenda: string }) {
  const { tamanhoLetra, atualizar } = usePreferencias();

  return (
    <fieldset className="escolha">
      <legend>
        <h2>{legenda}</h2>
      </legend>
      <div className="escolha__letras">
        {OPCOES.map(({ valor, nome }) => {
          const ativo = valor === tamanhoLetra;
          return (
            <button
              type="button"
              key={valor}
              className={ativo ? "escolha__letra ativo" : "escolha__letra"}
              aria-pressed={ativo}
              onClick={() => atualizar({ tamanhoLetra: valor })}
            >
              {/* O "A" mostra o tamanho real de cada opção. */}
              <span className="escolha__a" style={{ fontSize: TAMANHO_LETRA_PX[valor] * 1.3 }} aria-hidden="true">
                A
              </span>
              <span className="escolha__nome">
                {ativo && <IconeConfere />}
                {nome}
              </span>
            </button>
          );
        })}
      </div>
      <p className="cartao escolha__exemplo">Exemplo: assim fica o texto.</p>
    </fieldset>
  );
}
