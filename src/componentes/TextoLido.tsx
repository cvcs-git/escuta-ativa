import type { ElementType } from "react";
import { useFala } from "../voz/FalaContexto";

type Props = { texto: string; como?: ElementType; className?: string };

/**
 * Mostra um texto e destaca, palavra por palavra, o trecho que está sendo lido em voz.
 * Assim, quem não lê com facilidade acompanha com os olhos o que está ouvindo.
 * Funciona para qualquer parte da tela: basta o texto fazer parte da fala atual.
 */
export function TextoLido({ texto, como: Tag = "span", className = "" }: Props) {
  const { textoFalado, indice } = useFala();
  const inicio = textoFalado && texto ? textoFalado.indexOf(texto) : -1;
  const lendoEste = inicio >= 0 && indice >= inicio && indice < inicio + texto.length;

  if (!lendoEste) return <Tag className={className}>{texto}</Tag>;

  const posicao = indice - inicio;
  const partes = [...texto.matchAll(/\S+|\s+/g)];
  let atual = -1;
  partes.forEach((p, i) => {
    if (/\S/.test(p[0]) && (p.index ?? 0) <= posicao) atual = i;
  });

  return (
    <Tag className={`${className} texto-lido`} data-lendo="sim">
      {partes.map((p, i) =>
        i === atual ? (
          <mark key={i} className="palavra-lida">{p[0]}</mark>
        ) : (
          <span key={i} className={i < atual ? "palavra-ja-lida" : undefined}>{p[0]}</span>
        ),
      )}
    </Tag>
  );
}
