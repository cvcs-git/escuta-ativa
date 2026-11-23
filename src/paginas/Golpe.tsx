import { useEffect, useState } from "react";
import { Tela } from "../componentes/Tela";
import { Pensando } from "../componentes/Pensando";
import { EstadoErro } from "../componentes/EstadoErro";
import { IconeAlerta, IconeAlertaContorno, IconeAltoFalante, IconeInfo, IconeMicrofone, IconeTelefone } from "../componentes/Icones";
import { chamarIA } from "../rede/chamarIA";
import { temDadoSensivel } from "../seguranca/dadosSensiveis";
import { ErroIA, obterServicoIA, type Classificacao, type RespostaGolpe, type TipoErroIA } from "../servicos/ia";
import { useFala } from "../voz/useFala";
import { useReconhecimento } from "../voz/useReconhecimento";
import { TextoLido } from "../componentes/TextoLido";
import { IndicadorLeitura } from "../componentes/IndicadorLeitura";
import { Ondas } from "../componentes/Ondas";
import { useLerAoAbrir } from "../voz/FalaContexto";

type Etapa =
  | { tipo: "entrada"; sensivel?: boolean }
  | { tipo: "pensando" }
  | { tipo: "resultado"; resposta: RespostaGolpe }
  | { tipo: "erro"; erro: TipoErroIA };

/** O título, a cor e o ícone vêm do app, nunca da IA: assim "sem sinais" jamais vira "seguro". */
const NIVEIS: Record<Classificacao, { titulo: string; classe: string; Icone: typeof IconeAlerta }> = {
  provavel_golpe: { titulo: "PROVÁVEL GOLPE", classe: "resultado--golpe", Icone: IconeAlerta },
  suspeita: { titulo: "Mensagem suspeita", classe: "resultado--suspeita", Icone: IconeAlertaContorno },
  sem_sinais: { titulo: "Não encontrei sinais de golpe, mas fique atento", classe: "resultado--sem-sinais", Icone: IconeInfo },
};

const servico = obterServicoIA();

const textoDoResultado = (r: RespostaGolpe) => `${NIVEIS[r.classificacao].titulo}. ${r.motivo} ${r.orientacao}`;
const INTRO_TITULO = "Cole ou dite a mensagem que você recebeu.";
const INTRO_COLAR = "Para colar: toque e segure dentro do quadro e escolha “Colar”.";
const AVISO_SENHA = "Nunca compartilhe senhas ou códigos. Esta mensagem parece ter números assim. Apague esses números e verifique de novo. Nada foi enviado nem guardado.";

/** T6 Isso é golpe? (wf_04, com wf_07 em caso de erro) */
export default function Golpe() {
  const [mensagem, setMensagem] = useState("");
  const [etapa, setEtapa] = useState<Etapa>({ tipo: "entrada" });
  const voz = useReconhecimento();
  const { falar, falando } = useFala();
  useLerAoAbrir(etapa.tipo === "entrada" && !etapa.sensivel ? `${INTRO_TITULO} ${INTRO_COLAR}` : null);

  /* Ditado: o texto falado vai para o campo. */
  useEffect(() => {
    if (voz.ouvindo && voz.texto) setMensagem(voz.texto);
  }, [voz.ouvindo, voz.texto]);

  useEffect(() => {
    if (etapa.tipo === "resultado") falar(textoDoResultado(etapa.resposta));
  }, [etapa, falar]);

  const verificar = async () => {
    // Caso de borda: senha ou código na mensagem. Nada é enviado nem guardado.
    if (temDadoSensivel(mensagem)) {
      setEtapa({ tipo: "entrada", sensivel: true });
      falar(AVISO_SENHA, true);
      return;
    }
    setEtapa({ tipo: "pensando" });
    try {
      const resposta = await chamarIA((sinal) => servico.verificarGolpe(mensagem, sinal));
      setEtapa({ tipo: "resultado", resposta });
    } catch (e) {
      setEtapa({ tipo: "erro", erro: e instanceof ErroIA ? e.tipo : "indisponivel" });
    }
  };

  const outraMensagem = () => {
    setMensagem("");
    setEtapa({ tipo: "entrada" });
  };

  return (
    <>
    <Ondas estado={etapa.tipo === "pensando" ? "pensando" : voz.ouvindo ? "ouvindo" : falando ? "falando" : "repouso"} />
    <Tela titulo="Isso é golpe?" voltar="/">
      {etapa.tipo === "entrada" && (
        <section className="golpe__entrada">
          <label htmlFor="mensagem">
            <TextoLido como="h2" texto={INTRO_TITULO} />
          </label>
          <TextoLido como="p" className="apoio" texto={INTRO_COLAR} />

          {etapa.sensivel && (
            <p className="aviso aviso--alerta" role="alert">
              <IconeAlerta />
              <TextoLido texto={AVISO_SENHA} />
            </p>
          )}

          <textarea
            id="mensagem"
            className="campo"
            value={mensagem}
            onChange={(e) => {
              setMensagem(e.target.value);
              if (etapa.sensivel) setEtapa({ tipo: "entrada" });
            }}
            placeholder="Exemplo: Sua conta foi bloqueada. Clique no link para liberar."
          />

          <div className="rodape">
            <button className="botao" disabled={!mensagem.trim() || voz.ouvindo} onClick={verificar}>
              Verificar mensagem
            </button>
            {voz.suportado && (
              <button className="botao botao--secundario" onClick={voz.ouvindo ? voz.parar : voz.iniciar}>
                <IconeMicrofone /> {voz.ouvindo ? "Parar de ditar" : "Ditar a mensagem"}
              </button>
            )}
            {voz.erro === "negado" && (
              <p className="apoio">O microfone não está liberado. Permita o microfone nas configurações do navegador ou cole a mensagem.</p>
            )}
          </div>
        </section>
      )}

      {etapa.tipo === "pensando" && <Pensando texto="Verificando a mensagem" />}

      {etapa.tipo === "resultado" && <Resultado mensagem={mensagem} resposta={etapa.resposta} aoVerificarOutra={outraMensagem} />}

      {etapa.tipo === "erro" && <EstadoErro tipo={etapa.erro} aoTentarDeNovo={verificar} />}
    </Tela>
    </>
  );
}

function Resultado({ mensagem, resposta, aoVerificarOutra }: { mensagem: string; resposta: RespostaGolpe; aoVerificarOutra: () => void }) {
  const { titulo, classe, Icone } = NIVEIS[resposta.classificacao];
  const { falar } = useFala();
  return (
    <>
      <div className="cartao">
        <p className="rotulo">Mensagem recebida:</p>
        <p className="golpe__citacao">“{mensagem.length > 180 ? `${mensagem.slice(0, 180)}...` : mensagem}”</p>
      </div>
      <section className={`resultado ${classe}`} role="alert">
        <h2 className="resultado__titulo">
          <Icone className="resultado__icone" />
          <TextoLido texto={titulo} />
        </h2>
        <div className="resultado__corpo">
          <TextoLido como="p" texto={resposta.motivo} />
          <TextoLido como="p" className="resultado__orientacao" texto={resposta.orientacao} />
          <IndicadorLeitura />
        </div>
      </section>
      <button className="botao botao--secundario" onClick={() => falar(textoDoResultado(resposta), true)}>
        <IconeAltoFalante /> Ouvir de novo
      </button>
      <div className="rodape">
        <a className="botao" href="tel:">
          <IconeTelefone /> Ligar para minha família
        </a>
        <button className="botao botao--secundario" onClick={aoVerificarOutra}>
          Verificar outra mensagem
        </button>
      </div>
    </>
  );
}
