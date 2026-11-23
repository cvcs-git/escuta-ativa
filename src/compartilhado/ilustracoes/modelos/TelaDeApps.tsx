import type { EspecIlustracao } from "@/servicos/ia";
import { APOIO, IconeAppPorNome, LINHA, Toque } from "../pecas";

type Props = Extract<EspecIlustracao, { modelo: "apps" }>;

const posicao = (i: number) => ({ x: 52 + (i % 3) * 68, y: 92 + Math.floor(i / 3) * 84 });

/** Tela inicial com até 6 aplicativos; o dedo aponta o app do passo. */
export function TelaDeApps({ apps, alvo }: Props) {
  // Desloca o dedo para o canto do ícone, deixando parte do nome visível.
  const { x, y } = posicao(alvo);
  return (
    <>
      {apps.map((nome, i) => (
        <IconeAppPorNome key={nome + i} {...posicao(i)} nome={nome} posicao={i} />
      ))}
      <rect x="40" y="262" width="160" height="30" rx="15" fill="#fff" stroke={LINHA} strokeWidth="1.5" />
      <text x="58" y="282" fontSize="11" fill={APOIO}>
        Pesquisar
      </text>
      <Toque x={x + 8} y={y - 6} />
    </>
  );
}
