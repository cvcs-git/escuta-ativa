/**
 * Configuração do Firebase (projeto escuta-ativa-9bce4).
 *
 * Estes dados são públicos por natureza: identificam o projeto e ficam visíveis no
 * navegador de qualquer pessoa. Quem protege o uso da IA é o App Check (reCAPTCHA
 * Enterprise), que só aceita chamadas vindas dos domínios cadastrados.
 */
export const CONFIG_FIREBASE = {
  apiKey: "AIzaSyDwo4GCeinjf6UWeEOgJxniEjkExw6e1W4",
  authDomain: "escuta-ativa-9bce4.firebaseapp.com",
  projectId: "escuta-ativa-9bce4",
  storageBucket: "escuta-ativa-9bce4.firebasestorage.app",
  messagingSenderId: "632960023444",
  appId: "1:632960023444:web:7d808107e641ddff16ed81",
} as const;

/** Chave do site do reCAPTCHA Enterprise (Fraud Defense) usada pelo App Check. Vazia: o app usa a simulação. */
export const CHAVE_RECAPTCHA = "6Le8mzAuAAAAAPo865uvPHomuD6oJY5qDy8BSUxS";

/** Modelo do Gemini (plano gratuito). Trocar aqui se o Google aposentar o modelo. */
export const MODELO_GEMINI = "gemini-3.5-flash-lite";

export const geminiConfigurado = () => CHAVE_RECAPTCHA.length > 0;
