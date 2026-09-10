import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const concepts = [
  { number: '01', title: 'Preço', text: 'É o sinal que coordena consumidores e produtores. Quando muda, altera tanto a quantidade desejada quanto a oferecida.', tag: 'O sinal do mercado' },
  { number: '02', title: 'Demanda', text: 'Mostra quanto os consumidores querem comprar em cada preço. Em geral, preço maior significa menor quantidade demandada.', tag: 'Lado do consumidor' },
  { number: '03', title: 'Oferta', text: 'Mostra quanto as empresas querem vender em cada preço. Preços maiores tendem a tornar a produção mais atrativa.', tag: 'Lado do produtor' },
  { number: '04', title: 'Renda e relações', text: 'Renda desloca a demanda de bens normais. Substitutos competem entre si; complementares são consumidos em conjunto.', tag: 'Fatores externos' },
]

function Slider({ label, value, min, max, step = 1, suffix = '', onChange, hint }) {
  return <div className="control">
    <div className="control-top"><label>{label}</label><output>{value}{suffix}</output></div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    {hint && <small>{hint}</small>}
  </div>
}

function App() {
  const [price, setPrice] = useState(28)
  const [income, setIncome] = useState(0)
  const [substitute, setSubstitute] = useState(0)
  const [complement, setComplement] = useState(0)
  const [supplyShift, setSupplyShift] = useState(0)
  const [briefDone, setBriefDone] = useState(false)

  const data = useMemo(() => {
    const qd = Math.max(0, Math.round(104 - 2 * price + income * 0.75 + substitute * 0.6 - complement * 0.5))
    const qs = Math.max(0, Math.round(12 + 1.7 * price + supplyShift * 0.8))
    const equilibriumPrice = Math.round((92 + income * 0.75 + substitute * 0.6 - complement * 0.5 - supplyShift * 0.8) / 3.7)
    const equilibriumQty = Math.max(0, Math.round(12 + 1.7 * equilibriumPrice + supplyShift * 0.8))
    const gap = qd - qs
    return { qd, qs, equilibriumPrice, equilibriumQty, gap }
  }, [price, income, substitute, complement, supplyShift])

  const status = data.gap > 3 ? { label: 'Escassez', text: 'Consumidores querem mais do que empresas oferecem.', color: 'coral' } : data.gap < -3 ? { label: 'Excesso de oferta', text: 'Empresas oferecem mais do que consumidores desejam.', color: 'blue' } : { label: 'Equilíbrio', text: 'Oferta e demanda estão praticamente alinhadas.', color: 'mint' }
  const points = Array.from({length: 9}, (_, i) => ({ p: 8 + i * 7, d: Math.max(0, 104 - 2*(8+i*7) + income*.75 + substitute*.6 - complement*.5), s: Math.max(0, 12 + 1.7*(8+i*7) + supplyShift*.8) }))
  const line = (key) => points.map((x, i) => `${i ? 'L' : 'M'} ${44 + i*37} ${222 - Math.min(190, x[key]*1.8)}`).join(' ')
  const currentX = 44 + ((price - 8) / 56) * 296
  const scaleY = q => 222 - Math.min(190, q*1.8)

  return <main>
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark">µ</span> micro<span>lab</span></a>
      <div className="course-pill"><i></i> FUNDAMENTOS DE MICROECONOMIA</div>
      <button className="progress" onClick={() => document.getElementById('lab').scrollIntoView({behavior:'smooth'})}>Ir para o laboratório <span>↓</span></button>
    </header>

    <section id="top" className="hero">
      <div className="hero-copy">
        <p className="eyebrow">MÓDULO 01 <span>·</span> MERCADOS</p>
        <h1>O mercado é uma<br/><em>conversa em números.</em></h1>
        <p className="intro">Entenda como escolhas individuais formam preços — e teste cada força que move um mercado.</p>
        <div className="hero-actions">
          <a href="#conceitos" className="button primary">Começar módulo <span>→</span></a>
          <button className="text-button" onClick={() => setBriefDone(!briefDone)}>{briefDone ? '✓ Resumo concluído' : '◌ Marcar resumo como lido'}</button>
        </div>
      </div>
      <div className="hero-orbit" aria-hidden="true">
        <div className="orbit-ring ring-1"></div><div className="orbit-ring ring-2"></div><div className="orbit-ring ring-3"></div>
        <div className="price-token"><small>PREÇO</small><strong>R$ {price}</strong></div>
        <span className="tag tag-a">DEMANDA</span><span className="tag tag-b">OFERTA</span><span className="tag tag-c">EQUILÍBRIO</span>
      </div>
    </section>

    <section id="conceitos" className="concepts">
      <div className="section-heading"><div><p className="eyebrow">A BASE</p><h2>Antes de experimentar,<br/>entenda o idioma.</h2></div><p>Quatro ideias para ler qualquer mercado com mais clareza.</p></div>
      <div className="concept-grid">
        {concepts.map((item, index) => <article className="concept-card" key={item.title}>
          <span className="card-number">{item.number}</span><span className="card-arrow">↗</span>
          <h3>{item.title}</h3><p>{item.text}</p><small>{item.tag}</small>
        </article>)}
      </div>
    </section>

    <section id="lab" className="lab-section">
      <div className="lab-heading"><div><p className="eyebrow">LABORATÓRIO PRÁTICO</p><h2>Faça o mercado<br/><em>se mover.</em></h2></div><p>Escolha um preço e altere as condições. Observe como as curvas respondem e encontre o novo ponto de equilíbrio.</p></div>
      <div className="lab-shell">
        <aside className="controls-panel">
          <div className="panel-title"><span className="pulse"></span> CONTROLES DO CENÁRIO</div>
          <Slider label="Preço do produto" value={price} min={8} max={64} suffix=" R$" onChange={setPrice} hint="Movimento ao longo das curvas" />
          <div className="divider"><span>DESLOCAMENTOS DE CURVA</span></div>
          <Slider label="Variação na renda" value={income} min={-30} max={30} suffix="%" onChange={setIncome} hint="Bens normais: renda ↑, demanda ↑" />
          <Slider label="Preço do substituto" value={substitute} min={-30} max={30} suffix="%" onChange={setSubstitute} hint="Ex.: café e chá" />
          <Slider label="Preço do complementar" value={complement} min={-30} max={30} suffix="%" onChange={setComplement} hint="Ex.: carros e combustível" />
          <Slider label="Condições de produção" value={supplyShift} min={-30} max={30} suffix="%" onChange={setSupplyShift} hint="Tecnologia, custos, clima…" />
          <button className="reset" onClick={() => {setPrice(28);setIncome(0);setSubstitute(0);setComplement(0);setSupplyShift(0)}}>↺ Restaurar cenário</button>
        </aside>
        <div className="market-panel">
          <div className="market-header"><div><span className="market-label">MERCADO DE CAFÉ</span><h3>Oferta x Demanda</h3></div><div className={`market-status ${status.color}`}><b>{status.label}</b><span>{status.text}</span></div></div>
          <div className="chart-wrap">
            <div className="axis-y">PREÇO (R$)</div><div className="axis-x">QUANTIDADE (MIL UNIDADES)</div>
            <svg viewBox="0 0 390 280" role="img" aria-label="Gráfico de oferta e demanda">
              {[32,80,128,176,224].map(y => <line key={y} x1="44" y1={y} x2="356" y2={y} className="gridline" />)}
              {[44,118,192,266,340].map(x => <line key={x} x1={x} y1="32" x2={x} y2="224" className="gridline" />)}
              <path d="M 44 32 V 224 H 356" className="axis" />
              <path d={line('d')} className="demand-line" /><path d={line('s')} className="supply-line" />
              <line x1={currentX} y1="224" x2={currentX} y2="32" className="current-line" />
              <circle cx={currentX} cy={scaleY(data.qd)} r="5" className="demand-dot" /><circle cx={currentX} cy={scaleY(data.qs)} r="5" className="supply-dot" />
              <text x="282" y={Math.max(38, scaleY(points[7].d)-10)} className="demand-text">DEMANDA</text><text x="265" y={Math.max(38, scaleY(points[7].s)-10)} className="supply-text">OFERTA</text>
            </svg>
          </div>
          <div className="metric-row"><div><span>QUANTIDADE DEMANDADA</span><strong>{data.qd}<small> mil</small></strong></div><div><span>QUANTIDADE OFERTADA</span><strong>{data.qs}<small> mil</small></strong></div><div className="highlight"><span>EQUILÍBRIO ESTIMADO</span><strong>R$ {data.equilibriumPrice}<small> · {data.equilibriumQty} mil</small></strong></div></div>
        </div>
      </div>
      <div className="insight"><span className="spark">✦</span><p><b>Leitura do cenário:</b> {status.text} {income > 0 && ' O aumento de renda deslocou a demanda para a direita.'}{substitute > 0 && ' Um substituto mais caro torna o café relativamente mais atraente.'}{complement > 0 && ' Um complementar mais caro reduz o interesse pelo produto.'}{supplyShift > 0 && ' Melhores condições de produção expandem a oferta.'}</p></div>
    </section>

    <section className="challenge"><div><p className="eyebrow">DESAFIO RÁPIDO</p><h2>Consegue criar<br/>um novo equilíbrio?</h2><p>Aumente a renda em 20%, suba o preço do chá e ajuste o preço do café até oferta e demanda se encontrarem.</p></div><button className="button light" onClick={() => {setIncome(20);setSubstitute(15);setComplement(0);setSupplyShift(0);setPrice(36)}}>Carregar desafio <span>→</span></button></section>
    <footer><span>MICROLAB <b>·</b> APRENDER FAZENDO</span><span>Fundamentos de Microeconomia — 2026</span></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
