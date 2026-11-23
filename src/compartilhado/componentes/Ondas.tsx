/**
 * Ondas sonoras em tela inteira, atrás do conteúdo. Mostram o estado do assistente:
 * - repouso: finas e claras;
 * - falando: laranja;
 * - ouvindo: correm no sentido contrário e acompanham a atividade da voz;
 * - pensando: verdes e quase paradas.
 *
 * As cores e os movimentos de cada estado estão em ondas.css.
 */
import { useEffect, useMemo, useRef } from "react";
import "./ondas.css";

export type EstadoOndas = "repouso" | "falando" | "ouvindo" | "pensando";

/** Faixas de onda espalhadas pela tela: posição vertical (%), comprimento, velocidade e fase. */
const FAIXAS = [
  { topo: 14, comprimento: 170, segundos: 16, fase: 0 },
  { topo: 25, comprimento: 120, segundos: 11, fase: 1.4 },
  { topo: 38, comprimento: 210, segundos: 19, fase: 2.6 },
  { topo: 51, comprimento: 150, segundos: 14, fase: 0.7 },
  { topo: 64, comprimento: 180, segundos: 17, fase: 2.0 },
  { topo: 77, comprimento: 130, segundos: 12, fase: 0.3 },
];
const LARGURA = 680; // duas larguras de tela: o desenho se repete e desliza sem emenda
const ALTURA = 120;

function senoide(comprimento: number, fase: number) {
  let d = "";
  for (let x = 0; x <= LARGURA; x += 4) {
    const y = ALTURA / 2 + Math.sin((x / comprimento) * Math.PI * 2 + fase) * ALTURA * 0.38;
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
  }
  return d;
}

export function Ondas({ estado }: { estado: EstadoOndas }) {
  const camada = useRef<HTMLDivElement>(null);
  const caminhos = useMemo(() => FAIXAS.map((f) => senoide(f.comprimento, f.fase)), []);

  /* Ao ouvir, a altura varia como uma voz. O reconhecimento de fala do navegador não
     informa o volume, por isso a variação é simulada. */
  useEffect(() => {
    if (estado !== "ouvindo") return;
    let v = 0;
    let alvo = 0;
    const id = window.setInterval(() => {
      if (Math.random() < 0.25) alvo = Math.random() < 0.2 ? 0.05 : 0.3 + Math.random() * 0.7;
      v += (alvo - v) * 0.35;
      camada.current?.style.setProperty("--volume", v.toFixed(3));
    }, 90);
    return () => clearInterval(id);
  }, [estado]);

  return (
    <div className="ondas" data-estado={estado} ref={camada} aria-hidden="true">
      {FAIXAS.map((f, i) => (
        <div key={i} className="ondas__faixa" style={{ top: `${f.topo}%` }}>
          <svg
            className="ondas__desliza"
            viewBox={`0 0 ${LARGURA} ${ALTURA}`}
            preserveAspectRatio="none"
            style={{ animationDuration: `${f.segundos}s` }}
          >
            <g className="ondas__altura">
              <path d={caminhos[i]} />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}
