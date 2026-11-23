import { useFala } from "@/servicos/voz/FalaProvider";
import { IconeAltoFalante } from "./Icones";
import "./leitura.css";

/** Ondas sonoras animadas, mostradas enquanto o app lê em voz alta. */
export function IndicadorLeitura() {
  const { falando } = useFala();
  if (!falando) return null;
  return (
    <p className="indicador-leitura" role="status">
      <IconeAltoFalante />
      <span className="indicador-leitura__barras" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      Lendo em voz alta
    </p>
  );
}
