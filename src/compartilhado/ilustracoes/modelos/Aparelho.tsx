import type { BotaoDoAparelho, EspecIlustracao } from "@/servicos/ia/ilustracao";
import { AvisoNaTela, FUNDO_TELA, GRAFITE, LARANJA } from "../pecas";

type Props = Extract<EspecIlustracao, { modelo: "aparelho" }>;

/** Posição (y e altura) de cada botão físico, na lateral direita do celular. */
const BOTOES: Record<BotaoDoAparelho, { y: number; altura: number; nome: string }> = {
  ligar: { y: 64, altura: 34, nome: "Ligar" },
  volume_mais: { y: 116, altura: 26, nome: "Volume +" },
  volume_menos: { y: 146, altura: 26, nome: "Volume −" },
};
const LATERAL = 156;

/**
 * O celular visto de frente, com os botões físicos da lateral (print, reiniciar, desligar).
 * É o único modelo sem a moldura de tela, porque mostra o aparelho por fora.
 */
export function Aparelho({ botoes, juntos, segundos }: Props) {
  const mensagem = juntos
    ? "Aperte os dois ao mesmo tempo"
    : segundos
      ? `Segure por ${segundos} segundos`
      : "Aperte o botão";
  return (
    <>
      <rect x="46" y="26" width="108" height="226" rx="18" fill={GRAFITE} />
      <rect x="52" y="32" width="96" height="214" rx="13" fill={FUNDO_TELA} />
      <text x="100" y="130" fontSize="22" fontWeight="700" textAnchor="middle" fill={GRAFITE}>
        9:41
      </text>
      {(Object.keys(BOTOES) as BotaoDoAparelho[]).map((id) => {
        const { y, altura, nome } = BOTOES[id];
        const ativo = botoes.includes(id);
        const meio = y + altura / 2;
        return (
          <g key={id}>
            <rect x={LATERAL - 2} y={y} width="7" height={altura} rx="2" fill={ativo ? LARANJA : "#616161"} />
            {ativo && (
              <>
                <circle className="ilus-toque__pulso" cx={LATERAL + 2} cy={meio} r="16" />
                <circle cx={LATERAL + 2} cy={meio} r="16" fill="none" stroke={LARANJA} strokeWidth="3" />
                <text x={LATERAL + 22} y={meio + 4} fontSize="11.5" fontWeight="700" fill={GRAFITE}>
                  {nome}
                </text>
              </>
            )}
          </g>
        );
      })}
      <AvisoNaTela y={286} texto={mensagem} />
    </>
  );
}
