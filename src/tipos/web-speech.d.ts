/**
 * Tipos mínimos da API de reconhecimento de fala do navegador (Web Speech API).
 * A síntese de voz (speechSynthesis) já faz parte dos tipos padrão do TypeScript;
 * o reconhecimento ainda não, e no Chrome ele existe com o prefixo "webkit".
 */

interface ResultadoReconhecimento {
  readonly isFinal: boolean;
  readonly 0: { readonly transcript: string };
}

interface EventoResultadoReconhecimento extends Event {
  readonly resultIndex: number;
  readonly results: ArrayLike<ResultadoReconhecimento>;
}

interface EventoErroReconhecimento extends Event {
  readonly error: string;
}

interface ReconhecedorDeFala extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((evento: EventoResultadoReconhecimento) => void) | null;
  onerror: ((evento: EventoErroReconhecimento) => void) | null;
  onend: (() => void) | null;
}

interface Window {
  SpeechRecognition?: new () => ReconhecedorDeFala;
  webkitSpeechRecognition?: new () => ReconhecedorDeFala;
}
