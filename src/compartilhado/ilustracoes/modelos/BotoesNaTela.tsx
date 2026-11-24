import type { EspecIlustracao } from "@/servicos/ia";
import { BotaoNaTela, Cabecalho, GRAFITE, LARANJA, LINHA, Toque } from "../pecas";
import { curto } from "../auxiliares";

type Props = Extract<EspecIlustracao, { modelo: "botoes" }>;

/** Quebra o texto em linhas de até `largura` caracteres, sem cortar palavras. */
const quebrarLinhas = (texto: string, largura: number) =>
  texto.match(new RegExp(`.{1,${largura}}(\\s|$)`, "g")) ?? [texto];

/** Aviso com 1 a 3 botões (confirmar, instalar, apagar...); o botão do passo fica em laranja. */
export function BotoesNaTela({ titulo, texto, botoes, alvo }: Props) {
  const largura = botoes.length === 1 ? 184 : botoes.length === 2 ? 88 : 56;
  const xs = botoes.map((_, i) => 28 + i * (largura + 8));
  const linhas = quebrarLinhas(texto, 28).slice(0, 4);
  return (
    <>
      <Cabecalho titulo={titulo} />
      <rect x="28" y="96" width="184" height={30 + linhas.length * 17} rx="12" fill="#fff" stroke={LINHA} />
      {linhas.map((linha, i) => (
        <text key={i} x="40" y={120 + i * 17} fontSize="12" fill={GRAFITE}>
          {linha.trim()}
        </text>
      ))}
      {botoes.map((rotulo, i) => {
        // Botão único e largo: reserva a ponta direita para o dedo não cobrir o texto.
        const recuo = botoes.length === 1 ? 34 : 0;
        const espacoParaTexto = largura - recuo;
        return (
          <BotaoNaTela
            key={rotulo + i}
            x={xs[i]}
            y={236}
            w={largura}
            texto={curto(rotulo, Math.floor(espacoParaTexto / 7.5))}
            recuo={recuo}
            cor={LARANJA}
            contorno={i !== alvo}
          />
        );
      })}
      <Toque x={xs[alvo] + largura - 16} y={254} />
    </>
  );
}
