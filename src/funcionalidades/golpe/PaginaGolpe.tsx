/**
 * T6 Isso é golpe? (fluxo 3, HU05 e HU06): verifica uma mensagem recebida e orienta.
 * A lógica fica em useVerificacaoGolpe; esta tela só escolhe o que mostrar.
 */
import { EstadoErro } from "@/compartilhado/componentes/EstadoErro";
import { Ondas } from "@/compartilhado/componentes/Ondas";
import { Pensando } from "@/compartilhado/componentes/Pensando";
import { Tela } from "@/compartilhado/componentes/Tela";
import { EntradaDaMensagem } from "./componentes/EntradaDaMensagem";
import { ResultadoGolpe } from "./componentes/ResultadoGolpe";
import { useVerificacaoGolpe } from "./useVerificacaoGolpe";
import "./golpe.css";

export default function PaginaGolpe() {
  const golpe = useVerificacaoGolpe();
  const { etapa, mensagem } = golpe;

  return (
    <>
      <Ondas estado={golpe.estadoOndas} />
      <Tela titulo="Isso é golpe?" voltar="/" folha>
        {etapa.tipo === "entrada" && (
          <EntradaDaMensagem
            mensagem={mensagem}
            temSenha={etapa.temSenha}
            ditado={golpe.ditado}
            aoEditar={golpe.editar}
            aoVerificar={golpe.verificar}
          />
        )}

        {etapa.tipo === "pensando" && <Pensando texto="Verificando a mensagem" />}

        {etapa.tipo === "resultado" && (
          <ResultadoGolpe
            mensagem={mensagem}
            resposta={etapa.resposta}
            aoOuvirDeNovo={golpe.ouvirDeNovo}
            aoVerificarOutra={golpe.verificarOutra}
          />
        )}

        {etapa.tipo === "erro" && <EstadoErro tipo={etapa.erro} aoTentarDeNovo={golpe.verificar} />}
      </Tela>
    </>
  );
}
