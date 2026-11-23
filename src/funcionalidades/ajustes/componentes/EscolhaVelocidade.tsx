import { Botao, DuplaDeBotoes } from "@/compartilhado/componentes/Botao";
import { IconeConfere } from "@/compartilhado/componentes/Icones";
import type { Velocidade } from "@/compartilhado/preferencias/preferencias";
import { usePreferencias } from "@/compartilhado/preferencias/PreferenciasProvider";

const OPCOES: { valor: Velocidade; nome: string }[] = [
  { valor: "devagar", nome: "Devagar" },
  { valor: "normal", nome: "Normal" },
];

/** Velocidade da leitura em voz: devagar ajuda quem tem dificuldade de audição. */
export function EscolhaVelocidade() {
  const { velocidade, atualizar } = usePreferencias();
  return (
    <>
      <p className="apoio">Velocidade da voz</p>
      <DuplaDeBotoes>
        {OPCOES.map(({ valor, nome }) => {
          const ativa = velocidade === valor;
          return (
            <Botao
              key={valor}
              variante={ativa ? "primario" : "secundario"}
              aria-pressed={ativa}
              onClick={() => atualizar({ velocidade: valor })}
            >
              {ativa && <IconeConfere />} {nome}
            </Botao>
          );
        })}
      </DuplaDeBotoes>
    </>
  );
}
