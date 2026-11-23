import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { PreferenciasProvider } from "./contexto/Preferencias";
import { FalaProvider, useFala } from "./voz/FalaContexto";
import Inicio from "./paginas/Inicio";
import BoasVindas from "./paginas/BoasVindas";
import Perguntar from "./paginas/Perguntar";
import Licoes from "./paginas/Licoes";
import Licao from "./paginas/Licao";
import Golpe from "./paginas/Golpe";
import Ajustes from "./paginas/Ajustes";

/** Ao trocar de tela, volta ao topo e interrompe a leitura em voz. */
function AoTrocarDeTela() {
  const { pathname } = useLocation();
  const { parar } = useFala();
  useEffect(() => {
    window.scrollTo(0, 0);
    parar();
  }, [pathname, parar]);
  return null;
}

/**
 * Rotas do protótipo. O HashRouter (endereços com #) funciona em qualquer hospedagem
 * sem configuração extra: .../#/golpe abre direto a tela T6.
 */
export function App() {
  return (
    <PreferenciasProvider>
      <FalaProvider>
      <HashRouter>
        <AoTrocarDeTela />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/boas-vindas" element={<BoasVindas />} />
          <Route path="/perguntar" element={<Perguntar />} />
          <Route path="/licoes" element={<Licoes />} />
          <Route path="/licoes/:id" element={<Licao />} />
          <Route path="/golpe" element={<Golpe />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="*" element={<Inicio />} />
        </Routes>
      </HashRouter>
      </FalaProvider>
    </PreferenciasProvider>
  );
}
