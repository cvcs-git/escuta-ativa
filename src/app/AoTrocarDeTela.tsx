import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFala } from "@/servicos/voz/FalaProvider";

/** Ao trocar de tela: volta ao topo e interrompe a leitura da tela anterior. */
export function AoTrocarDeTela() {
  const { pathname } = useLocation();
  const { parar } = useFala();

  useEffect(() => {
    window.scrollTo(0, 0);
    parar();
  }, [pathname, parar]);

  return null;
}
