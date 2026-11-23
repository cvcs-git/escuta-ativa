import { useEffect, useRef, useState } from "react";
import { useFala } from "../voz/useFala";
import { IconeAltoFalante, IconeAvancar, IconeRepetir } from "./Icones";

type Props = {
  passos: string[];
  /** Devolve outra explicação para o passo atual ("Não encontrei"). */
  outroJeito: (indice: number) => Promise<string> | string;
  aoConcluir: () => void;
  rotuloConcluir?: string;
};

/** Um passo por vez, lido em voz, com Repetir, Próximo e Não encontrei (wf_02 e wf_03). */
export function PassoAPasso({ passos, outroJeito, aoConcluir, rotuloConcluir = "Concluir" }: Props) {
  const [indice, setIndice] = useState(0);
  const [alternativa, setAlternativa] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);
  const { falar, falando, suportada } = useFala();
  const titulo = useRef<HTMLParagraphElement>(null);

  const ultimo = indice === passos.length - 1;
  const passo = passos[indice];

  useEffect(() => {
    setAlternativa(null);
    falar(`Passo ${indice + 1}. ${passos[indice]}`);
    titulo.current?.focus();
  }, [indice, passos, falar]);

  const naoEncontrei = async () => {
    setBuscando(true);
    try {
      const texto = await outroJeito(indice);
      setAlternativa(texto);
      falar(texto);
    } catch {
      setAlternativa("Não consegui outra explicação agora. Toque em Repetir para ouvir o passo de novo.");
    } finally {
      setBuscando(false);
    }
  };

  return (
    <section className="passos" aria-label="Passo a passo">
      <div className="passos__topo">
        <p className="passos__contador" ref={titulo} tabIndex={-1} aria-live="polite">
          Passo {indice + 1} de {passos.length}
        </p>
        <ol className="passos__trilha" aria-hidden="true">
          {passos.map((_, i) => (
            <li key={i} className={i < indice ? "feito" : i === indice ? "atual" : ""} />
          ))}
        </ol>
      </div>

      <div className="cartao passos__cartao">
        <span className="passos__numero" aria-hidden="true">{indice + 1}</span>
        <p className="passos__texto">{passo}</p>
        {suportada && falando && (
          <p className="lendo"><IconeAltoFalante /> Lendo em voz alta...</p>
        )}
      </div>

      {alternativa && (
        <div className="passos__alternativa" role="status">
          <p className="passos__alternativa-titulo">Outro jeito de explicar</p>
          <p>{alternativa}</p>
        </div>
      )}

      <div className="rodape">
        <div className="dupla">
          <button className="botao botao--secundario" onClick={() => falar(alternativa ?? passo, true)}>
            <IconeRepetir /> Repetir
          </button>
          {ultimo ? (
            <button className="botao botao--confirmar" onClick={aoConcluir}>
              {rotuloConcluir}
            </button>
          ) : (
            <button className="botao" onClick={() => setIndice(indice + 1)}>
              Próximo <IconeAvancar />
            </button>
          )}
        </div>
        <button className="botao botao--secundario" onClick={naoEncontrei} disabled={buscando}>
          {buscando ? "Procurando outro jeito..." : "Não encontrei"}
        </button>
      </div>
    </section>
  );
}
