import { useEffect, useState } from "react";

/** Informa se o aparelho está com internet. O navegador avisa quando a conexão cai ou volta. */
export function useConexao() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const ligar = () => setOnline(true);
    const desligar = () => setOnline(false);
    window.addEventListener("online", ligar);
    window.addEventListener("offline", desligar);
    return () => {
      window.removeEventListener("online", ligar);
      window.removeEventListener("offline", desligar);
    };
  }, []);
  return online;
}
