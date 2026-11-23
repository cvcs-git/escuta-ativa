/** Ponto de entrada: fonte, estilos globais e montagem do app. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/atkinson-hyperlegible-next/400.css";
import "@fontsource/atkinson-hyperlegible-next/700.css";
import "@/estilos/index.css";
import { App } from "@/app/App";

const raiz = document.getElementById("root");
if (!raiz) throw new Error("Elemento #root não encontrado em index.html.");

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
