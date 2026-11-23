/** Ícones sempre acompanhados de texto (padrão de acessibilidade do projeto). */
type P = { className?: string };
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const IconeMicrofone = (p: P) => (
  <svg {...base} {...p}><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" /></svg>
);
export const IconeAltoFalante = (p: P) => (
  <svg {...base} {...p}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></svg>
);
export const IconeAlerta = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" /><path d="M12 7v6" style={{ stroke: "var(--icone-interno, #fff)" }} strokeWidth="2.8" /><circle cx="12" cy="17" r="1.6" style={{ fill: "var(--icone-interno, #fff)" }} stroke="none" /></svg>
);
export const IconeAlertaContorno = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9.6" /><path d="M12 7v6" strokeWidth="2.8" /><circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" /></svg>
);
export const IconeInfo = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" /><path d="M12 11v6" stroke="#fff" strokeWidth="2.8" /><circle cx="12" cy="7.3" r="1.6" fill="#fff" stroke="none" /></svg>
);
export const IconeVoltar = (p: P) => (<svg {...base} {...p}><path d="M15 5l-7 7 7 7" strokeWidth="3" /></svg>);
export const IconeAvancar = (p: P) => (<svg {...base} {...p}><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>);
export const IconeConfere = (p: P) => (<svg {...base} {...p}><path d="M4.5 12.5l5 5 10-11" strokeWidth="3" /></svg>);
export const IconeRepetir = (p: P) => (<svg {...base} {...p}><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4.5h4.5" /></svg>);
export const IconeLivro = (p: P) => (<svg {...base} {...p}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /></svg>);
export const IconeEscudo = (p: P) => (<svg {...base} {...p}><path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z" /><path d="M12 8v4.5" strokeWidth="2.8" /><circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none" /></svg>);
export const IconeAjustes = (p: P) => (<svg {...base} {...p}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2.4" /><circle cx="8" cy="17" r="2.4" /></svg>);
export const IconeTelefone = (p: P) => (<svg {...base} {...p}><path d="M6.5 3.5h3l1.5 4-2 1.3a10.5 10.5 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" /></svg>);
export const IconeSemInternet = (p: P) => (<svg {...base} {...p}><path d="M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2.4-1.8M2 9.5a15 15 0 0 1 4.3-2.8M22 9.5A15 15 0 0 0 11 5.6" /><circle cx="12" cy="20" r="1.2" fill="currentColor" stroke="none" /></svg>);
