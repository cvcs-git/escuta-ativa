/**
 * Montagem do app: provedores (preferências e voz), rotas e rede de segurança.
 * A ordem importa: a voz lê as preferências (ligada, velocidade e voz escolhida).
 */
import { HashRouter } from "react-router-dom";
import { PreferenciasProvider } from "@/compartilhado/preferencias/PreferenciasProvider";
import { FalaProvider } from "@/servicos/voz/FalaProvider";
import { AoTrocarDeTela } from "./AoTrocarDeTela";
import { LimiteDeErro } from "./LimiteDeErro";
import { Rotas } from "./rotas";

export function App() {
  return (
    <LimiteDeErro>
      <PreferenciasProvider>
        <FalaProvider>
          <HashRouter>
            <AoTrocarDeTela />
            <Rotas />
          </HashRouter>
        </FalaProvider>
      </PreferenciasProvider>
    </LimiteDeErro>
  );
}
