/**
 * Passo a passo (wf_02 e wf_03): mostra um passo por vez, lê em voz e oferece
 * Repetir, Próximo e "Não encontrei" (outra explicação para o mesmo passo).
 *
 * É usado nas lições (explicação alternativa revisada pela equipe) e nas respostas
 * do assistente (explicação alternativa pedida à IA). Quem usa decide de onde vem a
 * explicação, pela função `outroJeito`.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFala } from "@/servicos/voz/FalaProvider";
import { Botao, DuplaDeBotoes } from "./Botao";
import { IconeAvancar, IconeRepetir } from "./Icones";
import { IndicadorLeitura } from "./IndicadorLeitura";
import { Rodape } from "./Tela";
import { TextoLido } from "./TextoLido";
import "./passo-a-passo.css";

type PropsPassoAPasso = {
  passos: string[];
  /** Devolve outra explicação para o passo indicado ("Não encontrei"). */
  outroJeito: (indice: number) => Promise<string> | string;
  aoConcluir: () => void;
  rotuloConcluir?: string;
  /** Ilustração de cada passo (opcional): a tela do celular com o ponto de toque. */
  ilustracoes?: (ReactNode | undefined)[];
};

const FALHA_OUTRO_JEITO = "Não consegui outra explicação agora. Toque em Repetir para ouvir o passo de novo.";

export function PassoAPasso({
  passos,
  outroJeito,
  aoConcluir,
  rotuloConcluir = "Concluir",
  ilustracoes,
}: PropsPassoAPasso) {
  const [indice, setIndice] = useState(0);
  const [alternativa, setAlternativa] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);
  const { falar } = useFala();
  const contador = useRef<HTMLParagraphElement>(null);

  const passo = passos[indice];
  const ultimo = indice === passos.length - 1;
  const ilustracao = ilustracoes?.[indice];

  // A cada novo passo: lê em voz e leva o foco ao contador (para leitores de tela).
  useEffect(() => {
    falar(`Passo ${indice + 1}. ${passos[indice]}`);
    contador.current?.focus();
  }, [indice, passos, falar]);

  const avancar = () => {
    setAlternativa(null);
    setIndice(indice + 1);
  };

  const naoEncontrei = async () => {
    setBuscando(true);
    try {
      const texto = await outroJeito(indice);
      setAlternativa(texto);
      falar(texto);
    } catch {
      setAlternativa(FALHA_OUTRO_JEITO);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <section className="passos" aria-label="Passo a passo">
      <div className="passos__topo">
        <p className="passos__contador" ref={contador} tabIndex={-1} aria-live="polite">
          Passo {indice + 1} de {passos.length}
        </p>
        <ol className="passos__trilha" aria-hidden="true">
          {passos.map((_, i) => (
            <li key={i} className={i < indice ? "feito" : i === indice ? "atual" : undefined} />
          ))}
        </ol>
      </div>

      {ilustracao && <figure className="passos__figura">{ilustracao}</figure>}

      <div className="cartao passos__cartao">
        <span className="passos__numero" aria-hidden="true">
          {indice + 1}
        </span>
        <TextoLido como="p" className="passos__texto" texto={passo} />
        <IndicadorLeitura />
      </div>

      {alternativa && (
        <div className="passos__alternativa" role="status">
          <p className="passos__alternativa-titulo">Outro jeito de explicar</p>
          <TextoLido como="p" texto={alternativa} />
        </div>
      )}

      <Rodape>
        <DuplaDeBotoes>
          <Botao variante="secundario" onClick={() => falar(alternativa ?? passo, true)}>
            <IconeRepetir /> Repetir
          </Botao>
          {ultimo ? (
            <Botao variante="confirmar" onClick={aoConcluir}>
              {rotuloConcluir}
            </Botao>
          ) : (
            <Botao onClick={avancar}>
              Próximo <IconeAvancar />
            </Botao>
          )}
        </DuplaDeBotoes>
        <Botao variante="secundario" onClick={naoEncontrei} disabled={buscando}>
          {buscando ? "Procurando outro jeito..." : "Não encontrei"}
        </Botao>
      </Rodape>
    </section>
  );
}
