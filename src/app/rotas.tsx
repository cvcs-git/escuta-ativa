/**
 * Rotas do app. O HashRouter (endereços com #) funciona em qualquer hospedagem sem
 * configuração extra: .../#/golpe abre direto a tela T6.
 *
 * As telas não são carregadas sob demanda (lazy) de propósito: assim o app inteiro já
 * está no aparelho depois do primeiro acesso, e as lições abrem mesmo se a internet
 * cair antes de a pessoa visitá-las (HU07).
 */
import { Route, Routes } from "react-router-dom";
import PaginaAjustes from "@/funcionalidades/ajustes/PaginaAjustes";
import PaginaPerguntar from "@/funcionalidades/assistente/PaginaPerguntar";
import PaginaBoasVindas from "@/funcionalidades/boas-vindas/PaginaBoasVindas";
import PaginaGolpe from "@/funcionalidades/golpe/PaginaGolpe";
import PaginaInicio from "@/funcionalidades/inicio/PaginaInicio";
import PaginaLicao from "@/funcionalidades/licoes/PaginaLicao";
import PaginaLicoes from "@/funcionalidades/licoes/PaginaLicoes";

const ROTAS = {
  inicio: "/",
  boasVindas: "/boas-vindas",
  perguntar: "/perguntar",
  licoes: "/licoes",
  licao: "/licoes/:id",
  golpe: "/golpe",
  ajustes: "/ajustes",
} as const;

export function Rotas() {
  return (
    <Routes>
      <Route path={ROTAS.inicio} element={<PaginaInicio />} />
      <Route path={ROTAS.boasVindas} element={<PaginaBoasVindas />} />
      <Route path={ROTAS.perguntar} element={<PaginaPerguntar />} />
      <Route path={ROTAS.licoes} element={<PaginaLicoes />} />
      <Route path={ROTAS.licao} element={<PaginaLicao />} />
      <Route path={ROTAS.golpe} element={<PaginaGolpe />} />
      <Route path={ROTAS.ajustes} element={<PaginaAjustes />} />
      <Route path="*" element={<PaginaInicio />} />
    </Routes>
  );
}
