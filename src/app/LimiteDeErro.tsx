/**
 * Rede de segurança: se uma tela quebrar por um erro inesperado, mostra uma mensagem
 * simples com um botão para recarregar, em vez de uma tela em branco.
 * (Error boundaries ainda precisam ser componentes de classe no React.)
 */
import { Component, type ErrorInfo, type ReactNode } from "react";

type Estado = { comErro: boolean };

export class LimiteDeErro extends Component<{ children: ReactNode }, Estado> {
  state: Estado = { comErro: false };

  static getDerivedStateFromError(): Estado {
    return { comErro: true };
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error("Erro inesperado na tela:", erro, info.componentStack);
  }

  render() {
    if (!this.state.comErro) return this.props.children;
    return (
      <div className="tela">
        <main className="conteudo limite-de-erro" role="alert">
          <h1>Algo deu errado nesta tela</h1>
          <p className="apoio">Não é culpa sua. Toque no botão abaixo para recomeçar.</p>
          <button type="button" className="botao" onClick={() => window.location.assign("#/")}>
            Voltar ao início
          </button>
        </main>
      </div>
    );
  }
}
