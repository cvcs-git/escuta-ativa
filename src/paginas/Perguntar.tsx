import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tela } from "../componentes/Tela";
import { PassoAPasso } from "../componentes/PassoAPasso";
import { Pensando } from "../componentes/Pensando";
import { EstadoErro } from "../componentes/EstadoErro";
import { IconeConfere, IconeMicrofone } from "../componentes/Icones";
import { chamarIA } from "../rede/chamarIA";
import { ErroIA, obterServicoIA, type TipoErroIA } from "../servicos/ia";
import { useFala } from "../voz/useFala";
import { useReconhecimento } from "../voz/useReconhecimento";

type Etapa =
  | { tipo: "inicio"; aviso?: string }
  | { tipo: "ouvindo" }
  | { tipo: "digitar"; aviso?: string }
  | { tipo: "confirmar" }
  | { tipo: "pensando" }
  | { tipo: "resposta"; passos: string[]; dica?: string }
  | { tipo: "concluida"; dica?: string }
  | { tipo: "fora"; mensagem: string }
  | { tipo: "erro"; erro: TipoErroIA };

const servico = obterServicoIA();

/** T3 Assistente por voz (wf_05 → wf_06 → wf_02, com wf_07 em caso de erro). */
export default function Perguntar() {
  const voz = useReconhecimento();
  const { falar } = useFala();
  const [etapa, setEtapa] = useState<Etapa>(
    voz.suportado ? { tipo: "inicio" } : { tipo: "digitar", aviso: "Este navegador não reconhece a fala. Escreva a sua pergunta." },
  );
  const [pergunta, setPergunta] = useState("");

  /* Fim da escuta: a fala terminou sozinha (pausa) ou pelo botão "Terminei". */
  useEffect(() => {
    if (etapa.tipo !== "ouvindo") return;
    if (voz.ouvindo) return;
    if (voz.erro === "negado") {
      setEtapa({ tipo: "digitar", aviso: "O microfone não está liberado. Para falar, permita o microfone nas configurações do navegador. Por enquanto, escreva a sua pergunta." });
    } else if (voz.texto.trim()) {
      setPergunta(voz.texto.trim());
      setEtapa({ tipo: "confirmar" });
    } else {
      setEtapa({ tipo: "inicio", aviso: "Não ouvi nada. Toque no microfone e fale perto do celular." });
    }
  }, [etapa.tipo, voz.ouvindo, voz.texto, voz.erro]);

  useEffect(() => {
    if (etapa.tipo === "confirmar") falar(`Entendi assim: ${pergunta}. Está certo?`);
    if (etapa.tipo === "fora") falar(etapa.mensagem);
  }, [etapa, pergunta, falar]);

  const comecarEscuta = () => {
    voz.iniciar();
    setEtapa({ tipo: "ouvindo" });
  };

  const enviar = async (texto = pergunta) => {
    setEtapa({ tipo: "pensando" });
    try {
      const r = await chamarIA((sinal) => servico.perguntar(texto, sinal));
      setEtapa(r.dentroDoEscopo ? { tipo: "resposta", passos: r.passos, dica: r.dica } : { tipo: "fora", mensagem: r.mensagem });
    } catch (e) {
      setEtapa({ tipo: "erro", erro: e instanceof ErroIA ? e.tipo : "indisponivel" });
    }
  };

  const recomecar = () => {
    setPergunta("");
    setEtapa(voz.suportado ? { tipo: "inicio" } : { tipo: "digitar" });
  };

  return (
    <Tela titulo="Perguntar" voltar="/">
      {etapa.tipo === "inicio" && (
        <section className="perguntar__inicio">
          <h2>Toque no microfone e faça sua pergunta</h2>
          <p className="apoio">Por exemplo: “Como faço um Pix?” ou “Como mando uma foto pelo WhatsApp?”</p>
          {etapa.aviso && <p className="aviso aviso--neutro" role="status">{etapa.aviso}</p>}
          <button className="microfone" onClick={comecarEscuta}>
            <span className="microfone__disco"><IconeMicrofone /></span>
            <span className="microfone__rotulo">Tocar e falar</span>
          </button>
          <div className="rodape">
            <button className="botao botao--secundario" onClick={() => setEtapa({ tipo: "digitar" })}>
              Prefiro escrever
            </button>
          </div>
        </section>
      )}

      {etapa.tipo === "ouvindo" && (
        <section className="perguntar__ouvindo" aria-live="polite">
          <div className="centro">
            <h2>Estou ouvindo...</h2>
            <p className="apoio">Fale perto do celular</p>
          </div>
          <div className="microfone microfone--ativo" aria-hidden="true">
            <span className="microfone__onda" />
            <span className="microfone__onda microfone__onda--2" />
            <span className="microfone__disco"><IconeMicrofone /></span>
          </div>
          <div className="cartao">
            <p className="rotulo">Você está dizendo:</p>
            <p className="perguntar__transcricao">
              {voz.texto || <span className="apoio">O texto aparece enquanto você fala</span>}
              <span className="cursor" aria-hidden="true" />
            </p>
          </div>
          <div className="rodape dupla">
            <button className="botao botao--secundario" onClick={() => { voz.cancelar(); setEtapa({ tipo: "inicio" }); }}>
              Cancelar
            </button>
            <button className="botao" onClick={voz.parar}>Terminei</button>
          </div>
        </section>
      )}

      {etapa.tipo === "digitar" && (
        <section className="perguntar__digitar">
          {etapa.aviso && <p className="aviso aviso--neutro" role="status">{etapa.aviso}</p>}
          <label htmlFor="pergunta"><h2>Escreva a sua pergunta</h2></label>
          <textarea
            id="pergunta"
            className="campo"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            placeholder="Exemplo: Como faço um Pix?"
          />
          <div className="rodape">
            <button className="botao" disabled={!pergunta.trim()} onClick={() => enviar()}>
              Enviar pergunta
            </button>
            {voz.suportado && (
              <button className="botao botao--secundario" onClick={comecarEscuta}>
                <IconeMicrofone /> Prefiro falar
              </button>
            )}
          </div>
        </section>
      )}

      {etapa.tipo === "confirmar" && (
        <section className="perguntar__confirmar">
          <h2 className="centro">Entendi assim:</h2>
          <p className="cartao perguntar__entendido">{pergunta}</p>
          <h2 className="centro">Está certo?</h2>
          <div className="rodape">
            <button className="botao botao--confirmar" onClick={() => enviar()}>
              <IconeConfere /> Sim, está certo
            </button>
            <button className="botao botao--secundario" onClick={comecarEscuta}>Falar de novo</button>
            <p className="apoio centro">Esta pergunta também é lida em voz alta.</p>
          </div>
        </section>
      )}

      {etapa.tipo === "pensando" && <Pensando />}

      {etapa.tipo === "resposta" && (
        <>
          <div className="cartao">
            <p className="rotulo">Você perguntou:</p>
            <p className="perguntar__voce">{pergunta}</p>
          </div>
          <PassoAPasso
            passos={etapa.passos}
            rotuloConcluir="Terminei"
            outroJeito={(i) => chamarIA((sinal) => servico.explicarDeOutroJeito(pergunta, etapa.passos[i], sinal))}
            aoConcluir={() => setEtapa({ tipo: "concluida", dica: etapa.dica })}
          />
        </>
      )}

      {etapa.tipo === "concluida" && (
        <section className="conclusao" role="status">
          <span className="conclusao__selo"><IconeConfere /></span>
          <h2>Pronto! Você seguiu todos os passos.</h2>
          {etapa.dica && <p className="cartao"><strong>Dica:</strong> {etapa.dica}</p>}
          <div className="rodape">
            <button className="botao" onClick={recomecar}>Fazer outra pergunta</button>
            <Link className="botao botao--secundario" to="/">Voltar ao início</Link>
          </div>
        </section>
      )}

      {etapa.tipo === "fora" && (
        <section className="perguntar__fora">
          <h2>Essa pergunta eu não sei responder</h2>
          <p>{etapa.mensagem}</p>
          <div className="rodape">
            <Link className="botao" to="/licoes">Ver as lições</Link>
            <button className="botao botao--secundario" onClick={recomecar}>Perguntar outra coisa</button>
          </div>
        </section>
      )}

      {etapa.tipo === "erro" && <EstadoErro tipo={etapa.erro} aoTentarDeNovo={() => enviar()} />}
    </Tela>
  );
}
