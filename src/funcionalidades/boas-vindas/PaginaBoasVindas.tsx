/**
 * T1 Boas-vindas (wf_08): aparece só no primeiro acesso (HU01).
 * A pessoa escolhe o tamanho da letra e se quer ouvir as respostas. Sem cadastro.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Botao, DuplaDeBotoes } from "@/compartilhado/componentes/Botao";
import { EscolhaLetra } from "@/compartilhado/componentes/EscolhaLetra";
import { IconeAltoFalante, IconeConfere } from "@/compartilhado/componentes/Icones";
import { Rodape, Tela } from "@/compartilhado/componentes/Tela";
import { TextoLido } from "@/compartilhado/componentes/TextoLido";
import { usePreferencias } from "@/compartilhado/preferencias/PreferenciasProvider";
import { useFala } from "@/servicos/voz/FalaProvider";
import "./boas-vindas.css";

const SAUDACAO = "Olá! Eu sou o Escuta Ativa.";
const APRESENTACAO = "Vou te ajudar a usar o celular com calma.";
const BOAS_VINDAS = `${SAUDACAO} ${APRESENTACAO}`;

export default function PaginaBoasVindas() {
  const { vozLigada, atualizar } = usePreferencias();
  const { falar, falando, suportada } = useFala();
  const navegar = useNavigate();

  // A boas-vindas é lida mesmo antes de a pessoa escolher a leitura em voz.
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
        <TextoLido como="h2" className="boas-vindas__ola" texto={SAUDACAO} />
        <TextoLido como="p" texto={APRESENTACAO} />
        <button type="button" className="boas-vindas__ouvir" onClick={() => falar(BOAS_VINDAS, true)}>
          <IconeAltoFalante /> {falando ? "Lendo em voz alta..." : "Ouvir de novo"}
        </button>
      </div>

      <EscolhaLetra legenda="1. Escolha o tamanho da letra" />

      <fieldset className="escolha">
        <legend>
          <h2>2. Quer ouvir as respostas?</h2>
        </legend>
        {suportada ? (
          <DuplaDeBotoes>
            <Botao
              variante={vozLigada ? "primario" : "secundario"}
              aria-pressed={vozLigada}
              onClick={() => atualizar({ vozLigada: true })}
            >
              {vozLigada && <IconeConfere />} Sim, em voz
            </Botao>
            <Botao
              variante={vozLigada ? "secundario" : "primario"}
              aria-pressed={!vozLigada}
              onClick={() => atualizar({ vozLigada: false })}
            >
              {!vozLigada && <IconeConfere />} Só texto
            </Botao>
          </DuplaDeBotoes>
        ) : (
          <p className="aviso aviso--neutro">Este celular não lê em voz alta. As respostas aparecerão em texto.</p>
        )}
      </fieldset>

      <Rodape>
        <Botao variante="confirmar" onClick={comecar}>
          Começar
        </Botao>
        <p className="apoio centro">Você pode mudar isso depois em Ajustes.</p>
      </Rodape>
    </Tela>
  );
}
