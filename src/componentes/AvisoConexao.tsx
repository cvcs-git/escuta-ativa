import { useConexao } from "../rede/useConexao";
import { IconeSemInternet } from "./Icones";

/** Aparece quando a internet cai. As lições continuam funcionando. */
export function AvisoConexao() {
  const online = useConexao();
  if (online) return null;
  return (
    <p className="aviso aviso--conexao" role="status">
      <IconeSemInternet />
      <span>
        <strong>Sem internet.</strong> As lições continuam funcionando. Perguntar e verificar golpes voltam quando a conexão voltar.
      </span>
    </p>
  );
}
