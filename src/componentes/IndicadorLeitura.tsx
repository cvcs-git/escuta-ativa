import { useFala } from "../voz/FalaContexto";
import { IconeAltoFalante } from "./Icones";

/** Ondas sonoras animadas enquanto o app lê em voz alta. */
export function IndicadorLeitura() {
  const { falando } = useFala();
  if (!falando) return null;
  return (
    <p className="indicador-leitura" role="status">
      <IconeAltoFalante />
      <span className="indicador-leitura__barras" aria-hidden="true">
        <span /><span /><span /><span />
      </span>
      Lendo em voz alta
    </p>
  );
}
