/**
 * T3 Assistente por voz (fluxo 2): convite → escuta (wf_05) → confirmação (wf_06) →
 * resposta passo a passo (wf_02), com recusa fora do escopo e erro de IA (wf_07).
 *
 * A lógica fica em useAssistente; esta tela só escolhe o que mostrar em cada etapa.
 */
import { Botao, BotaoLink } from "@/compartilhado/componentes/Botao";
import { Conclusao } from "@/compartilhado/componentes/Conclusao";
import { EstadoErro } from "@/compartilhado/componentes/EstadoErro";
import { Ondas } from "@/compartilhado/componentes/Ondas";
import { PassoAPasso } from "@/compartilhado/componentes/PassoAPasso";
import { Pensando } from "@/compartilhado/componentes/Pensando";
import { Tela } from "@/compartilhado/componentes/Tela";
import { Ilustracao } from "@/compartilhado/ilustracoes/Ilustracao";
import { ConfirmarPergunta } from "./componentes/ConfirmarPergunta";
import { ConviteParaFalar } from "./componentes/ConviteParaFalar";
import { EscreverPergunta } from "./componentes/EscreverPergunta";
import { Escutando } from "./componentes/Escutando";
import { ForaDoEscopo } from "./componentes/ForaDoEscopo";
import { useAssistente } from "./useAssistente";
import "./assistente.css";

export default function PaginaPerguntar() {
  const assistente = useAssistente();
  const { etapa, pergunta } = assistente;

  return (
    <>
      <Ondas estado={assistente.estadoOndas} />
      <Tela titulo="Perguntar" voltar="/" folha>
        {etapa.tipo === "inicio" && (
          <ConviteParaFalar aviso={etapa.aviso} aoFalar={assistente.escutar} aoEscrever={assistente.escrever} />
        )}

        {etapa.tipo === "ouvindo" && (
          <Escutando
            texto={assistente.textoOuvido}
            aoTerminar={assistente.terminarEscuta}
            aoCancelar={assistente.cancelarEscuta}
          />
        )}

        {etapa.tipo === "digitar" && (
          <EscreverPergunta
            aviso={etapa.aviso}
            pergunta={pergunta}
            vozSuportada={assistente.vozSuportada}
            aoEditar={assistente.editar}
            aoEnviar={assistente.enviar}
            aoFalar={assistente.escutar}
          />
        )}

        {etapa.tipo === "confirmar" && (
          <ConfirmarPergunta pergunta={pergunta} aoConfirmar={assistente.enviar} aoFalarDeNovo={assistente.escutar} />
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
              ilustracoes={etapa.ilustracoes.map((espec, i) =>
                espec ? <Ilustracao espec={espec} descricao={etapa.passos[i]} /> : undefined,
              )}
              rotuloConcluir="Terminei"
              outroJeito={(i) => assistente.explicarDeOutroJeito(etapa.passos[i])}
              aoConcluir={assistente.concluir}
            />
          </>
        )}

        {etapa.tipo === "concluida" && (
          <Conclusao
            titulo="Pronto! Você seguiu todos os passos."
            acoes={
              <>
                <Botao onClick={assistente.recomecar}>Fazer outra pergunta</Botao>
                <BotaoLink variante="secundario" to="/">
                  Voltar ao início
                </BotaoLink>
              </>
            }
          >
            {etapa.dica && (
              <p className="cartao">
                <strong>Dica:</strong> {etapa.dica}
              </p>
            )}
          </Conclusao>
        )}

        {etapa.tipo === "fora" && (
          <ForaDoEscopo mensagem={etapa.mensagem} aoPerguntarOutraCoisa={assistente.recomecar} />
        )}

        {etapa.tipo === "erro" && <EstadoErro tipo={etapa.erro} aoTentarDeNovo={assistente.enviar} />}
      </Tela>
    </>
  );
}
