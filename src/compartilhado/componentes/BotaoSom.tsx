/**
 * Botão redondo de silêncio: liga e desliga a leitura em voz para o app inteiro
 * (a mesma preferência da chave em Ajustes). Ao silenciar, corta a fala na hora.
 * Um aviso curto confirma a mudança em palavras, para quem não reconhece o ícone.
 */
import { useEffect, useRef, useState } from "react";
import { usePreferencias } from "@/compartilhado/preferencias/PreferenciasProvider";
import { useFala } from "@/servicos/voz/FalaProvider";
import { IconeAltoFalante, IconeSemSom } from "./Icones";
import "./botao-som.css";

const DURACAO_AVISO_MS = 2000;

export function BotaoSom() {
  const { vozLigada, atualizar } = usePreferencias();
  const { parar } = useFala();
  const [aviso, setAviso] = useState<string | null>(null);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const alternar = () => {
    if (vozLigada) parar();
    atualizar({ vozLigada: !vozLigada });
    setAviso(vozLigada ? "Som desligado" : "Som ligado");
    clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setAviso(null), DURACAO_AVISO_MS);
  };

  return (
    <>
      <button
        type="button"
        className={vozLigada ? "botao-redondo botao-som" : "botao-redondo botao-som botao-som--mudo"}
        aria-pressed={!vozLigada}
        aria-label={vozLigada ? "Tirar o som" : "Ligar o som"}
        onClick={alternar}
      >
        {vozLigada ? <IconeAltoFalante /> : <IconeSemSom />}
      </button>
      <p className="aviso-som" role="status" data-visivel={aviso ? "" : undefined}>
        {aviso}
      </p>
    </>
  );
}
