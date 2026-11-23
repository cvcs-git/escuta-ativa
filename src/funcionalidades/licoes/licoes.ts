/**
 * Lições: conteúdo revisado pela equipe, guardado em dados/licoes.json.
 * Não usam IA, então funcionam sem internet (HU04 e HU07) e não correm o risco de
 * instruções incorretas.
 */
import dados from "./dados/licoes.json";

export type PassoDaLicao = {
  texto: string;
  /** Explicação alternativa, mostrada no botão "Não encontrei". */
  outroJeito: string;
};

export type Licao = {
  id: string;
  titulo: string;
  minutos: number;
  passos: PassoDaLicao[];
};

export const LICOES: readonly Licao[] = dados;

export const buscarLicao = (id: string | undefined) => LICOES.find((licao) => licao.id === id);
