/**
 * Escolha da voz de leitura. Aparece só quando o aparelho tem duas ou mais vozes
 * em português; a primeira da lista é a mais natural.
 */
import { Botao } from "@/compartilhado/componentes/Botao";
import { IconeConfere } from "@/compartilhado/componentes/Icones";
import { usePreferencias } from "@/compartilhado/preferencias/PreferenciasProvider";
import { nomeDaVoz } from "@/servicos/voz/escolhaDeVoz";
import { useFala } from "@/servicos/voz/FalaProvider";

const MAXIMO_DE_VOZES = 6;
export const FRASE_DE_EXEMPLO = "Olá! Assim fica a minha voz lendo para você.";

export function EscolhaVoz() {
  const { vozId, atualizar } = usePreferencias();
  const { vozes, vozAtual, falar } = useFala();
  if (vozes.length < 2) return null;

  const escolher = (voz: SpeechSynthesisVoice) => {
    atualizar({ vozId: voz.voiceURI });
    // Espera a preferência ser aplicada antes de falar com a voz nova.
    window.setTimeout(() => falar(FRASE_DE_EXEMPLO, true), 50);
  };

  return (
    <fieldset className="escolha">
      <legend>
        <p className="apoio">Escolha a voz</p>
      </legend>
      <div className="vozes">
        {vozes.slice(0, MAXIMO_DE_VOZES).map((voz, i) => {
          const ativa = voz.voiceURI === (vozId || vozAtual?.voiceURI);
          return (
            <Botao
              key={voz.voiceURI}
              variante={ativa ? "primario" : "secundario"}
              className="vozes__opcao"
              aria-pressed={ativa}
              onClick={() => escolher(voz)}
            >
              {ativa && <IconeConfere />}
              <span>
                {nomeDaVoz(voz)}
                {i === 0 && <span className="vozes__dica"> (mais natural)</span>}
              </span>
            </Botao>
          );
        })}
      </div>
    </fieldset>
  );
}
