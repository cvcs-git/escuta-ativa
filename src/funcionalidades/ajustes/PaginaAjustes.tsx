/** T7 Ajustes (wf_10): tamanho da letra e leitura em voz (ligada, velocidade e voz). */
import { Botao } from "@/compartilhado/componentes/Botao";
import { EscolhaLetra } from "@/compartilhado/componentes/EscolhaLetra";
import { IconeAltoFalante } from "@/compartilhado/componentes/Icones";
import { Tela } from "@/compartilhado/componentes/Tela";
import { useFala } from "@/servicos/voz/FalaProvider";
import { useLerAoAbrir } from "@/servicos/voz/useLerAoAbrir";
import { ChaveLeitura } from "./componentes/ChaveLeitura";
import { EscolhaVelocidade } from "./componentes/EscolhaVelocidade";
import { EscolhaVoz, FRASE_DE_EXEMPLO } from "./componentes/EscolhaVoz";
import "./ajustes.css";

export default function PaginaAjustes() {
  const { falar, suportada } = useFala();
  useLerAoAbrir("Ajustes. Escolha o tamanho da letra e se quer ouvir as respostas em voz.");

  return (
    <Tela titulo="Ajustes">
      <EscolhaLetra legenda="Tamanho da letra" />

      <section className="ajustes__voz">
        <h2>Leitura em voz</h2>
        {suportada ? (
          <>
            <ChaveLeitura />
            <EscolhaVelocidade />
            <EscolhaVoz />
            <Botao variante="secundario" onClick={() => falar(FRASE_DE_EXEMPLO, true)}>
              <IconeAltoFalante /> Ouvir um exemplo
            </Botao>
          </>
        ) : (
          <p className="aviso aviso--neutro">Este celular não lê em voz alta. As respostas aparecem em texto.</p>
        )}
      </section>

      <p className="apoio ajustes__privacidade">
        Seus ajustes ficam guardados só neste celular. Não pedimos senha nem cadastro.
      </p>
    </Tela>
  );
}
