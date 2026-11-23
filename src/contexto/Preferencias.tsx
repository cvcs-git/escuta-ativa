import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type TamanhoLetra = "normal" | "grande" | "maior";
export type Velocidade = "devagar" | "normal";

export type Preferencias = {
  configurado: boolean;
  tamanhoLetra: TamanhoLetra;
  vozLigada: boolean;
  velocidade: Velocidade;
  /** Voz escolhida em Ajustes (identificador do navegador). Vazio: o app escolhe a melhor. */
  vozId: string;
};

const PADRAO: Preferencias = { configurado: false, tamanhoLetra: "grande", vozLigada: true, velocidade: "normal", vozId: "" };
const CHAVE = "escuta-ativa:preferencias";

/** Tamanho base da letra, em px. O mínimo (normal) já é 20 px. */
export const TAMANHO_PX: Record<TamanhoLetra, number> = { normal: 20, grande: 23, maior: 26 };

type Contexto = Preferencias & { atualizar: (p: Partial<Preferencias>) => void };
const PreferenciasContexto = createContext<Contexto | null>(null);

function ler(): Preferencias {
  try {
    const salvo = localStorage.getItem(CHAVE);
    return salvo ? { ...PADRAO, ...JSON.parse(salvo) } : PADRAO;
  } catch {
    return PADRAO;
  }
}

/** Guarda os ajustes só neste aparelho: sem cadastro e sem senha. */
export function PreferenciasProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferencias>(ler);

  useEffect(() => {
    document.documentElement.style.fontSize = `${TAMANHO_PX[prefs.tamanhoLetra]}px`;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(prefs));
    } catch {
      /* sem armazenamento: os ajustes valem só nesta visita */
    }
  }, [prefs]);

  const atualizar = (p: Partial<Preferencias>) => setPrefs((atual) => ({ ...atual, ...p }));
  return <PreferenciasContexto.Provider value={{ ...prefs, atualizar }}>{children}</PreferenciasContexto.Provider>;
}

export function usePreferencias() {
  const ctx = useContext(PreferenciasContexto);
  if (!ctx) throw new Error("usePreferencias fora do PreferenciasProvider");
  return ctx;
}
