import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePreferencias } from "../contexto/Preferencias";
import { Tela } from "../componentes/Tela";
import { IconeAltoFalante, IconeConfere } from "../componentes/Icones";
import { useFala } from "../voz/useFala";
import { EscolhaLetra } from "./EscolhaLetra";
import { TextoLido } from "../componentes/TextoLido";

const BOAS_VINDAS = "Olá! Eu sou o Escuta Ativa. Vou te ajudar a usar o celular com calma.";

/** T1 Boas-vindas (wf_08): só no primeiro acesso. */
export default function BoasVindas() {
  const { vozLigada, atualizar } = usePreferencias();
  const { falar, falando, suportada } = useFala();
  const navegar = useNavigate();

  useEffect(() => {
    falar(BOAS_VINDAS, true);
  }, [falar]);

  const comecar = () => {
    atualizar({ configurado: true });
    navegar("/", { replace: true });
  };

  return (
    <Tela titulo="Boas-vindas" voltar={false}>
      <div className="boas-vindas__intro">
        <TextoLido como="h2" className="boas-vindas__ola" texto="Olá! Eu sou o Escuta Ativa." />
        <TextoLido como="p" texto="Vou te ajudar a usar o celular com calma." />
        <button className="lendo lendo--botao" onClick={() => falar(BOAS_VINDAS, true)}>
          <IconeAltoFalante /> {falando ? "Lendo em voz alta..." : "Ouvir de novo"}
        </button>
      </div>

      <EscolhaLetra legenda="1. Escolha o tamanho da letra" />

      <fieldset className="escolha">
        <legend><h2>2. Quer ouvir as respostas?</h2></legend>
        {suportada ? (
          <div className="dupla">
            <button
              className={`botao ${vozLigada ? "" : "botao--secundario"}`}
              aria-pressed={vozLigada}
              onClick={() => atualizar({ vozLigada: true })}
            >
              {vozLigada && <IconeConfere />} Sim, em voz
            </button>
            <button
              className={`botao ${vozLigada ? "botao--secundario" : ""}`}
              aria-pressed={!vozLigada}
              onClick={() => atualizar({ vozLigada: false })}
            >
              {!vozLigada && <IconeConfere />} Só texto
            </button>
          </div>
        ) : (
          <p className="aviso aviso--neutro">Este celular não lê em voz alta. As respostas aparecerão em texto.</p>
        )}
      </fieldset>

      <div className="rodape">
        <button className="botao botao--confirmar" onClick={comecar}>
          Começar
        </button>
        <p className="apoio centro">Você pode mudar isso depois em Ajustes.</p>
      </div>
    </Tela>
  );
}
