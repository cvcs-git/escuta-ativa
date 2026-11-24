/**
 * Conexão real com o Gemini pelo Firebase AI Logic.
 *
 * - App Check com reCAPTCHA Enterprise: só o app nos domínios cadastrados consegue
 *   chamar a IA. O token vale 1 hora e é reaproveitado: um token novo a cada pergunta
 *   somava segundos de espera ao limite de resposta.
 * - Gemini Developer API (plano gratuito), com resposta em JSON no formato fixo.
 * - Em desenvolvimento (localhost), usa o token de depuração do App Check: o token
 *   aparece no console do navegador e precisa ser cadastrado no Firebase.
 */
import { initializeApp } from "firebase/app";
import { getToken, initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAI, getGenerativeModel, GoogleAIBackend, ThinkingLevel } from "firebase/ai";
import { CHAVE_RECAPTCHA, CONFIG_FIREBASE, MODELO_GEMINI } from "./configuracao";
import type { GerarJSON } from "./servicoGemini";

/** Pouca criatividade: respostas estáveis e fiéis às instruções. */
const TEMPERATURA = 0.3;

/**
 * Raciocínio interno mínimo: as respostas são simples e o app espera no máximo 15 s.
 * Com o raciocínio padrão, perguntas vagas ("celular travando") passavam do limite.
 */
const RACIOCINIO = ThinkingLevel.MINIMAL;

declare global {
  // Nome definido pelo Firebase para ligar o modo de depuração do App Check.
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
}

export function criarGeradorFirebase(): GerarJSON {
  if (import.meta.env.DEV) globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

  const app = initializeApp(CONFIG_FIREBASE);
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(CHAVE_RECAPTCHA),
    isTokenAutoRefreshEnabled: true,
  });
  // Aquecimento: carrega o reCAPTCHA e obtém o token já ao abrir a tela, enquanto a
  // pessoa digita ou fala. Sem isso, a primeira pergunta pagava esse tempo e podia
  // passar do limite. Uma falha aqui não importa: o token é pedido de novo na pergunta.
  void getToken(appCheck).catch(() => undefined);
  const ai = getAI(app, { backend: new GoogleAIBackend() });

  return async ({ instrucao, esquema, texto }, sinal) => {
    const modelo = getGenerativeModel(ai, {
      model: MODELO_GEMINI,
      systemInstruction: instrucao,
      generationConfig: {
        temperature: TEMPERATURA,
        thinkingConfig: { thinkingLevel: RACIOCINIO },
        responseMimeType: "application/json",
        ...(esquema ? { responseJsonSchema: esquema } : {}),
      },
    });
    const resultado = await modelo.generateContent(texto, { signal: sinal });
    return resultado.response.text();
  };
}
