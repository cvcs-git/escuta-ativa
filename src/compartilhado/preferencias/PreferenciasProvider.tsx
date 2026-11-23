import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { lerPreferencias, salvarPreferencias, TAMANHO_LETRA_PX, type Preferencias } from "./preferencias";

type ContextoPreferencias = Preferencias & { atualizar: (mudancas: Partial<Preferencias>) => void };

const PreferenciasContexto = createContext<ContextoPreferencias | null>(null);

/**
 * Disponibiliza as preferências para todo o app e aplica o tamanho da letra.
 * Todas as medidas de texto usam `rem`, então mudar o tamanho da raiz ajusta o app inteiro.
 */
export function PreferenciasProvider({ children }: { children: ReactNode }) {
  const [preferencias, setPreferencias] = useState<Preferencias>(lerPreferencias);

  useEffect(() => {
    document.documentElement.style.fontSize = `${TAMANHO_LETRA_PX[preferencias.tamanhoLetra]}px`;
    salvarPreferencias(preferencias);
  }, [preferencias]);

  const atualizar = useCallback(
    (mudancas: Partial<Preferencias>) => setPreferencias((atuais) => ({ ...atuais, ...mudancas })),
    [],
  );

  const valor = useMemo(() => ({ ...preferencias, atualizar }), [preferencias, atualizar]);
  return <PreferenciasContexto.Provider value={valor}>{children}</PreferenciasContexto.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreferencias() {
  const contexto = useContext(PreferenciasContexto);
  if (!contexto) throw new Error("usePreferencias precisa estar dentro de <PreferenciasProvider>.");
  return contexto;
}
