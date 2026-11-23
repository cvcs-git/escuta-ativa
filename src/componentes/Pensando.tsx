import { useEffect, useState } from "react";
import { AVISO_PENSANDO_MS } from "../rede/chamarIA";

/** Espera da resposta (as ondas verdes ao fundo mostram que o app está pensando). Após 5 s, avisa que ainda está trabalhando. */
export function Pensando({ texto = "Preparando a resposta" }: { texto?: string }) {
  const [demorando, setDemorando] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setDemorando(true), AVISO_PENSANDO_MS);
    return () => clearTimeout(id);
  }, []);
  return (
    <section className="pensando" role="status" aria-live="polite">
      <h2>{demorando ? "Estou pensando..." : `${texto}...`}</h2>
      {demorando && <p className="apoio">Está demorando um pouco mais que o normal. Aguarde mais alguns segundos.</p>}
    </section>
  );
}
