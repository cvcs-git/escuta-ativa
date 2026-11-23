/**
 * Desenha a ilustração descrita pela IA, escolhendo o modelo certo.
 *
 * A descrição já chega validada (servicos/ia/ilustracao.ts). Aqui só se escolhe o
 * desenho; todos os modelos usam as mesmas peças das lições (pecas.tsx).
 */
import type { ComponentType } from "react";
import type { EspecIlustracao, ModeloIlustracao } from "@/servicos/ia";
import { Aparelho } from "./modelos/Aparelho";
import { BarraDeslizante } from "./modelos/BarraDeslizante";
import { BotoesNaTela } from "./modelos/BotoesNaTela";
import { Camera } from "./modelos/Camera";
import { CampoParaDigitar } from "./modelos/CampoParaDigitar";
import { Chamada } from "./modelos/Chamada";
import { ChaveLigaDesliga } from "./modelos/ChaveLigaDesliga";
import { Conversa } from "./modelos/Conversa";
import { GestoNaTela } from "./modelos/GestoNaTela";
import { ListaDeOpcoes } from "./modelos/ListaDeOpcoes";
import { MenuTresPontinhos } from "./modelos/MenuTresPontinhos";
import { TelaDeApps } from "./modelos/TelaDeApps";
import { Teclado } from "./modelos/Teclado";
import { Celular } from "./pecas";

// Cada modelo recebe a própria descrição; o tipo é garantido pela validação.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODELOS: Record<ModeloIlustracao, ComponentType<any>> = {
  apps: TelaDeApps,
  lista: ListaDeOpcoes,
  menu: MenuTresPontinhos,
  chave: ChaveLigaDesliga,
  barra: BarraDeslizante,
  botoes: BotoesNaTela,
  campo: CampoParaDigitar,
  gesto: GestoNaTela,
  conversa: Conversa,
  chamada: Chamada,
  camera: Camera,
  teclado: Teclado,
  aparelho: Aparelho,
};

type Props = {
  espec: EspecIlustracao;
  /** Texto do passo: descreve a imagem para leitores de tela. */
  descricao: string;
};

export function Ilustracao({ espec, descricao }: Props) {
  const Modelo = MODELOS[espec.modelo];

  // O aparelho é desenhado por fora, sem a moldura de tela.
  if (espec.modelo === "aparelho") {
    return (
      <svg className="ilustracao" viewBox="0 0 240 320" role="img" aria-label={descricao}>
        <Modelo {...espec} />
      </svg>
    );
  }

  return (
    <Celular descricao={descricao}>
      <Modelo {...espec} />
    </Celular>
  );
}
