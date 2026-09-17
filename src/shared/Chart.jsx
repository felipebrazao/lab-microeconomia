import React from 'react'
import { demanda, oferta, PRECO_MIN, PRECO_MAX, TOLERANCIA_FOLGA } from './modelo.js'

// Diagrama de Marshall: PREÇO no eixo vertical, QUANTIDADE no horizontal.
// É a convenção de qualquer livro-texto — o aluno precisa ver aqui o mesmo
// desenho que vê na aula.

const LARGURA = 390
const ALTURA = 280
const MARGEM = { esq: 46, dir: 18, topo: 22, base: 42 }

// Escala de quantidade fixa, não ajustada aos dados. É intencional: com escala
// fixa, deslocar uma curva aparece como a curva se movendo; com escala móvel, o
// eixo se reajustaria embaixo dela e o deslocamento ficaria invisível.
const QUANTIDADE_MAX = 150

const escalaX = q =>
  MARGEM.esq + (Math.min(q, QUANTIDADE_MAX) / QUANTIDADE_MAX) * (LARGURA - MARGEM.esq - MARGEM.dir)

const escalaY = p =>
  (ALTURA - MARGEM.base) -
  ((p - PRECO_MIN) / (PRECO_MAX - PRECO_MIN)) * (ALTURA - MARGEM.topo - MARGEM.base)

// Amostra a curva em preços igualmente espaçados e devolve o path SVG.
// 24 passos bastam: as curvas são retas, os pontos extras só suavizam o
// joelho onde a demanda encosta no zero.
const PASSOS = 24
function caminho(fn, deslocamento) {
  return Array.from({ length: PASSOS + 1 }, (_, i) => {
    const preco = PRECO_MIN + (i / PASSOS) * (PRECO_MAX - PRECO_MIN)
    return `${i ? 'L' : 'M'} ${escalaX(fn(preco, deslocamento)).toFixed(1)} ${escalaY(preco).toFixed(1)}`
  }).join(' ')
}

const PRECOS_MARCADOS = [8, 22, 36, 50, 64]
const QUANTIDADES_MARCADAS = [0, 30, 60, 90, 120, 150]

export default function Chart({
  deslocDemanda = 0,
  deslocOferta = 0,
  preco,
  situacao,
  mostrarEquilibrio = false,
  mostrarFolga = false,
}) {
  const { qd, qs, equilibrio } = situacao
  const yPreco = escalaY(preco)
  const xMenor = escalaX(Math.min(qd, qs))
  const xMaior = escalaX(Math.max(qd, qs))

  return (
    <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} role="img" aria-label="Gráfico de oferta e demanda">
      {PRECOS_MARCADOS.map(p => (
        <line key={`gp${p}`} x1={MARGEM.esq} y1={escalaY(p)} x2={LARGURA - MARGEM.dir} y2={escalaY(p)} className="gridline" />
      ))}
      {QUANTIDADES_MARCADAS.map(q => (
        <line key={`gq${q}`} x1={escalaX(q)} y1={MARGEM.topo} x2={escalaX(q)} y2={ALTURA - MARGEM.base} className="gridline" />
      ))}

      {PRECOS_MARCADOS.map(p => (
        <text key={`tp${p}`} x={MARGEM.esq - 7} y={escalaY(p) + 3} className="tick-text" textAnchor="end">{p}</text>
      ))}
      {QUANTIDADES_MARCADAS.map(q => (
        <text key={`tq${q}`} x={escalaX(q)} y={ALTURA - MARGEM.base + 14} className="tick-text" textAnchor="middle">{q}</text>
      ))}

      <path d={`M ${MARGEM.esq} ${MARGEM.topo} V ${ALTURA - MARGEM.base} H ${LARGURA - MARGEM.dir}`} className="axis" />

      {/* Posição original das curvas, mantida tracejada sempre que um choque as
          deslocou — sem ela o aluno não tem como ver que a curva se moveu. */}
      {deslocDemanda !== 0 && <path d={caminho(demanda, 0)} className="ghost-line ghost-demand" />}
      {deslocOferta !== 0 && <path d={caminho(oferta, 0)} className="ghost-line ghost-supply" />}

      <path d={caminho(demanda, deslocDemanda)} className="demand-line" />
      <path d={caminho(oferta, deslocOferta)} className="supply-line" />

      <text x={escalaX(demanda(PRECO_MIN, deslocDemanda)) - 4} y={ALTURA - MARGEM.base - 8} className="demand-text" textAnchor="end">
        DEMANDA
      </text>
      <text x={escalaX(oferta(PRECO_MAX, deslocOferta)) - 4} y={MARGEM.topo + 12} className="supply-text" textAnchor="end">
        OFERTA
      </text>

      {mostrarEquilibrio && (
        <g>
          <line x1={MARGEM.esq} y1={escalaY(equilibrio.preco)} x2={escalaX(equilibrio.quantidade)} y2={escalaY(equilibrio.preco)} className="guide-line" />
          <line x1={escalaX(equilibrio.quantidade)} y1={escalaY(equilibrio.preco)} x2={escalaX(equilibrio.quantidade)} y2={ALTURA - MARGEM.base} className="guide-line" />
          <circle cx={escalaX(equilibrio.quantidade)} cy={escalaY(equilibrio.preco)} r="5" className="equilibrium-dot" />
          <text x={escalaX(equilibrio.quantidade) + 9} y={escalaY(equilibrio.preco) - 7} className="equilibrium-text">E</text>
        </g>
      )}

      {/* Linha do preço praticado: horizontal, porque o preço está na vertical. */}
      <line x1={MARGEM.esq} y1={yPreco} x2={xMaior} y2={yPreco} className="current-line" />

      {mostrarFolga && Math.abs(qd - qs) > TOLERANCIA_FOLGA && (
        <g>
          <line x1={xMenor} y1={yPreco} x2={xMaior} y2={yPreco} className="gap-band" />
          <line x1={xMenor} y1={yPreco - 6} x2={xMenor} y2={yPreco + 6} className="gap-tick" />
          <line x1={xMaior} y1={yPreco - 6} x2={xMaior} y2={yPreco + 6} className="gap-tick" />
        </g>
      )}

      <circle cx={escalaX(qd)} cy={yPreco} r="5" className="demand-dot" />
      <circle cx={escalaX(qs)} cy={yPreco} r="5" className="supply-dot" />
    </svg>
  )
}
