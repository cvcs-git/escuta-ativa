import { usePreferencias } from "../contexto/Preferencias";
import { Tela } from "../componentes/Tela";
import { IconeAltoFalante, IconeConfere } from "../componentes/Icones";
import { useFala } from "../voz/useFala";
import { EscolhaLetra } from "./EscolhaLetra";
import { nomeDaVoz, useFala as useFalaContexto, useLerAoAbrir } from "../voz/FalaContexto";

/** T7 Ajustes (wf_10) */
export default function Ajustes() {
  const { vozLigada, velocidade, vozId, atualizar } = usePreferencias();
  const { vozes, vozAtual } = useFalaContexto();
  const { falar, suportada } = useFala();
  useLerAoAbrir("Ajustes. Escolha o tamanho da letra e se quer ouvir as respostas em voz.");

  return (
    <Tela titulo="Ajustes">
      <EscolhaLetra legenda="Tamanho da letra" />

      <section className="ajustes__voz">
        <h2>Leitura em voz</h2>
        {suportada ? (
          <>
            <button
              className="cartao chave"
              role="switch"
              aria-checked={vozLigada}
              onClick={() => atualizar({ vozLigada: !vozLigada })}
            >
              <span>Ler as respostas em voz alta</span>
              <span className={`chave__trilho ${vozLigada ? "ligada" : ""}`} aria-hidden="true">
                <span className="chave__bolinha" />
              </span>
              <span className="chave__estado">{vozLigada ? "Ligado" : "Desligado"}</span>
            </button>

            <p className="apoio">Velocidade da voz</p>
            <div className="dupla">
              {(["devagar", "normal"] as const).map((v) => (
                <button
                  key={v}
                  className={`botao ${velocidade === v ? "" : "botao--secundario"}`}
                  aria-pressed={velocidade === v}
                  onClick={() => atualizar({ velocidade: v })}
                >
                  {velocidade === v && <IconeConfere />} {v === "devagar" ? "Devagar" : "Normal"}
                </button>
              ))}
            </div>
            {vozes.length > 1 && (
              <fieldset className="escolha">
                <legend><p className="apoio">Escolha a voz</p></legend>
                <div className="vozes">
                  {vozes.slice(0, 6).map((v, i) => {
                    const ativa = v.voiceURI === (vozId || vozAtual?.voiceURI);
                    return (
                      <button
                        key={v.voiceURI}
                        className={`botao ${ativa ? "" : "botao--secundario"} vozes__opcao`}
                        aria-pressed={ativa}
                        onClick={() => {
                          atualizar({ vozId: v.voiceURI });
                          window.setTimeout(() => falar("Olá! Assim fica a minha voz lendo para você.", true), 50);
                        }}
                      >
                        {ativa && <IconeConfere />}
                        <span>
                          {nomeDaVoz(v)}
                          {i === 0 && <span className="vozes__dica"> (mais natural)</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}
            <button className="botao botao--secundario" onClick={() => falar("Olá! Assim fica a minha voz lendo para você.", true)}>
              <IconeAltoFalante /> Ouvir um exemplo
            </button>
          </>
        ) : (
          <p className="aviso aviso--neutro">Este celular não lê em voz alta. As respostas aparecem em texto.</p>
        )}
      </section>

      <p className="apoio ajustes__privacidade">
        Seus ajustes ficam guardados só neste celular. Não pedimos senha nem cadastro.
      </p>
    </Tela>
  );
}
