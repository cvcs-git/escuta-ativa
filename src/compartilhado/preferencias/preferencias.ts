/**
 * Preferências do usuário: tamanho da letra e leitura em voz.
 * Ficam guardadas só neste aparelho (localStorage): sem cadastro e sem senha.
 */

export type TamanhoLetra = "normal" | "grande" | "maior";
export type Velocidade = "devagar" | "normal";

export type Preferencias = {
  /** Se a pessoa já passou pela tela de boas-vindas. */
  configurado: boolean;
  tamanhoLetra: TamanhoLetra;
  vozLigada: boolean;
  velocidade: Velocidade;
  /** Voz escolhida em Ajustes (identificador do navegador). Vazio: o app escolhe a melhor. */
  vozId: string;
};

export const PREFERENCIAS_PADRAO: Preferencias = {
  configurado: false,
  tamanhoLetra: "grande",
  vozLigada: true,
  velocidade: "normal",
  vozId: "",
};

/** Tamanho base da letra, em px. O mínimo ("normal") já é 20 px. */
export const TAMANHO_LETRA_PX: Record<TamanhoLetra, number> = { normal: 20, grande: 23, maior: 26 };

const CHAVE_ARMAZENAMENTO = "escuta-ativa:preferencias";

/** Lê as preferências salvas. Em navegação anônima ou sem armazenamento, usa o padrão. */
export function lerPreferencias(): Preferencias {
  try {
    const salvo = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    return salvo ? { ...PREFERENCIAS_PADRAO, ...JSON.parse(salvo) } : PREFERENCIAS_PADRAO;
  } catch {
    return PREFERENCIAS_PADRAO;
  }
}

export function salvarPreferencias(preferencias: Preferencias) {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(preferencias));
  } catch {
    // Sem armazenamento: os ajustes valem só nesta visita.
  }
}
