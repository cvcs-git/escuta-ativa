import { useEffect, useState } from "react";
import { Tela } from "../componentes/Tela";
import { Pensando } from "../componentes/Pensando";
import { EstadoErro } from "../componentes/EstadoErro";
import { IconeAlerta, IconeAlertaContorno, IconeInfo, IconeMicrofone, IconeTelefone } from "../componentes/Icones";
import { chamarIA } from "../rede/chamarIA";
import { temDadoSensivel } from "../seguranca/dadosSensiveis";
import { ErroIA, obterServicoIA, type Classificacao, type RespostaGolpe, type TipoErroIA } from "../servicos/ia";
import { useFala } from "../voz/useFala";
import { useReconhecimento } from "../voz/useReconhecimento";

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

/** T6 Isso é golpe? (wf_04, com wf_07 em caso de erro) */
export default function Golpe() {
  const [mensagem, setMensagem] = useState("");
  const [etapa, setEtapa] = useState<Etapa>({ tipo: "entrada" });
  const voz = useReconhecimento();
  const { falar } = useFala();

  /* Ditado: o texto falado vai para o campo. */
  useEffect(() => {
    if (voz.ouvindo && voz.texto) setMensagem(voz.texto);
  }, [voz.ouvindo, voz.texto]);

  useEffect(() => {
    if (etapa.tipo !== "resultado") return;
    const { resposta } = etapa;
    falar(`${NIVEIS[resposta.classificacao].titulo}. ${resposta.motivo} ${resposta.orientacao}`);
  }, [etapa, falar]);

  const verificar = async () => {
    // Caso de borda: senha ou código na mensagem. Nada é enviado nem guardado.
    if (temDadoSensivel(mensagem)) {
      setEtapa({ tipo: "entrada", sensivel: true });
      falar("Atenção. Nunca compartilhe senhas ou códigos. Apague esses números e verifique de novo.", true);
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
    <Tela titulo="Isso é golpe?" voltar="/">
      {etapa.tipo === "entrada" && (
        <section className="golpe__entrada">
          <label htmlFor="mensagem">
            <h2>Cole ou dite a mensagem que você recebeu</h2>
          </label>
          <p className="apoio">Para colar: toque e segure dentro do quadro e escolha “Colar”.</p>

          {etapa.sensivel && (
            <p className="aviso aviso--alerta" role="alert">
              <IconeAlerta />
              <span>Nunca compartilhe senhas ou códigos. Esta mensagem parece ter números assim. Apague esses números e verifique de novo. Nada foi enviado nem guardado.</span>
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
  );
}

function Resultado({ mensagem, resposta, aoVerificarOutra }: { mensagem: string; resposta: RespostaGolpe; aoVerificarOutra: () => void }) {
  const { titulo, classe, Icone } = NIVEIS[resposta.classificacao];
  return (
    <>
      <div className="cartao">
        <p className="rotulo">Mensagem recebida:</p>
        <p className="golpe__citacao">“{mensagem.length > 180 ? `${mensagem.slice(0, 180)}...` : mensagem}”</p>
      </div>
      <section className={`resultado ${classe}`} role="alert">
        <h2 className="resultado__titulo">
          <Icone className="resultado__icone" />
          {titulo}
        </h2>
        <div className="resultado__corpo">
          <p>{resposta.motivo}</p>
          <p><strong>{resposta.orientacao}</strong></p>
        </div>
      </section>
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
