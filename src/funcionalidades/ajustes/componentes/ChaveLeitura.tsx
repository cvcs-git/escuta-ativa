import { usePreferencias } from "@/compartilhado/preferencias/PreferenciasProvider";

/** Chave liga/desliga da leitura em voz (papel "switch" para leitores de tela). */
export function ChaveLeitura() {
  const { vozLigada, atualizar } = usePreferencias();
  return (
    <button
      type="button"
      className="cartao chave"
      role="switch"
      aria-checked={vozLigada}
      onClick={() => atualizar({ vozLigada: !vozLigada })}
    >
      <span>Ler as respostas em voz alta</span>
      <span className={vozLigada ? "chave__trilho ligada" : "chave__trilho"} aria-hidden="true">
        <span className="chave__bolinha" />
      </span>
      <span className="chave__estado">{vozLigada ? "Ligado" : "Desligado"}</span>
    </button>
  );
}
