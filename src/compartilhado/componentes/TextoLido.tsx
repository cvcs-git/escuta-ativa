/**
 * Texto que acompanha a leitura em voz: destaca a palavra que está sendo lida e
 * sublinha as já lidas. Assim, quem não lê com facilidade acompanha com os olhos.
 *
 * Funciona em qualquer parte da tela: basta o texto fazer parte da fala atual.
 * O componente procura a própria posição dentro do texto falado.
 */
import type { ElementType } from "react";
import { useFala } from "@/servicos/voz/FalaProvider";
import "./leitura.css";

type PropsTextoLido = { texto: string; como?: ElementType; className?: string };

export function TextoLido({ texto, como: Elemento = "span", className }: PropsTextoLido) {
  const { textoFalado, indice } = useFala();
  const inicio = textoFalado && texto ? textoFalado.indexOf(texto) : -1;
  const lendoEste = inicio >= 0 && indice >= inicio && indice < inicio + texto.length;

  if (!lendoEste) return <Elemento className={className}>{texto}</Elemento>;

  const posicao = indice - inicio;
  const partes = [...texto.matchAll(/\S+|\s+/g)];
  // A palavra atual é a última que começa antes da posição lida.
  const atual = partes.reduce(
    (ultima, parte, i) => (/\S/.test(parte[0]) && (parte.index ?? 0) <= posicao ? i : ultima),
    -1,
  );

  return (
    <Elemento className={[className, "texto-lido"].filter(Boolean).join(" ")} data-lendo="sim">
      {partes.map((parte, i) =>
        i === atual ? (
          <mark key={i} className="palavra-lida">
            {parte[0]}
          </mark>
        ) : (
          <span key={i} className={i < atual ? "palavra-ja-lida" : undefined}>
            {parte[0]}
          </span>
        ),
      )}
    </Elemento>
  );
}
