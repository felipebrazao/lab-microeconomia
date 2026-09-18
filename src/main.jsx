import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import LabSubstitutos from './labs/substitutos.jsx'
import LabEquilibrio from './labs/equilibrio.jsx'
import { equilibrio } from './shared/modelo.js'
import { num } from './shared/formato.js'

const concepts = [
  { number: '01', title: 'Preço', text: 'É o sinal que coordena consumidores e produtores. Quando muda, altera tanto a quantidade desejada quanto a oferecida.', tag: 'O sinal do mercado' },
  { number: '02', title: 'Demanda', text: 'Mostra quanto os consumidores querem comprar em cada preço. Em geral, preço maior significa menor quantidade demandada.', tag: 'Lado do consumidor' },
  { number: '03', title: 'Oferta', text: 'Mostra quanto as empresas querem vender em cada preço. Preços maiores tendem a tornar a produção mais atrativa.', tag: 'Lado do produtor' },
  { number: '04', title: 'Renda e relações', text: 'Renda desloca a demanda de bens normais. Substitutos competem entre si; complementares são consumidos em conjunto.', tag: 'Fatores externos' },
]

// Os temas seguem a ordem da ementa — a mesma em que são dados em aula. Os que
// ainda não têm laboratório aparecem mesmo assim, desabilitados: o aluno precisa
// enxergar onde o que está manipulando se encaixa no curso inteiro.
const TEMAS = [
  {
    id: 'custo-oportunidade',
    numero: '01',
    aba: 'Custo de oportunidade',
    emBreve: true,
  },
  {
    id: 'consumidor',
    numero: '02',
    aba: 'Teoria do consumidor',
    emBreve: true,
  },
  {
    id: 'demanda-oferta',
    numero: '03',
    aba: 'Demanda e oferta',
    titulo: <>Faça o mercado<br /><em>se mover.</em></>,
    descricao: 'Escolha um preço e altere as condições. Observe como as curvas respondem e encontre o novo ponto de equilíbrio.',
  },
  {
    id: 'equilibrio',
    numero: '04',
    aba: 'Equilíbrio de mercado',
    titulo: <>Quando falta,<br /><em>quando sobra.</em></>,
    descricao: 'A um preço qualquer, oferta e demanda raramente coincidem. Veja o tamanho da diferença e para onde ela empurra o preço.',
  },
  {
    id: 'elasticidades',
    numero: '05',
    aba: 'Elasticidades',
    emBreve: true,
  },
  {
    id: 'estruturas',
    numero: '06',
    aba: 'Estruturas de mercado',
    emBreve: true,
  },
]

// Preço de equilíbrio do cenário base — o número que a órbita do topo exibe.
const PRECO_BASE = equilibrio().preco

function App() {
  const [aba, setAba] = useState('demanda-oferta')
  const [briefDone, setBriefDone] = useState(false)
  // O desafio recarrega o lab de demanda e oferta com um cenário pronto. Trocar a chave remonta o
  // lab, que é exatamente o que "carregar um cenário" significa: começar de novo
  // a partir dali, sem estado global e sem o lab precisar saber do desafio.
  const [cenarioDesafio, setCenarioDesafio] = useState(undefined)
  const [chaveDesafio, setChaveDesafio] = useState(0)

  const temaAtivo = TEMAS.find(t => t.id === aba)

  const carregarDesafio = () => {
    setCenarioDesafio({ preco: 36, renda: 20, substituto: 15, complementar: 0, producao: 0 })
    setChaveDesafio(c => c + 1)
    setAba('demanda-oferta')
    document.getElementById('lab').scrollIntoView({ behavior: 'smooth' })
  }

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
        <div className="price-token"><small>EQUILÍBRIO</small><strong>R$ {num(PRECO_BASE, 2)}</strong></div>
        <span className="tag tag-a">DEMANDA</span><span className="tag tag-b">OFERTA</span><span className="tag tag-c">EQUILÍBRIO</span>
      </div>
    </section>

    <section id="conceitos" className="concepts">
      <div className="section-heading"><div><p className="eyebrow">A BASE</p><h2>Antes de experimentar,<br/>entenda o idioma.</h2></div><p>Quatro ideias para ler qualquer mercado com mais clareza.</p></div>
      <div className="concept-grid">
        {concepts.map(item => <article className="concept-card" key={item.title}>
          <span className="card-number">{item.number}</span><span className="card-arrow">↗</span>
          <h3>{item.title}</h3><p>{item.text}</p><small>{item.tag}</small>
        </article>)}
      </div>
    </section>

    <section id="lab" className="lab-section">
      <div className="lab-heading">
        <div>
          <p className="eyebrow">LABORATÓRIO PRÁTICO</p>
          <h2>{temaAtivo.titulo}</h2>
        </div>
        <p>{temaAtivo.descricao}</p>
      </div>

      <nav className="lab-tabs" aria-label="Temas da disciplina">
        {TEMAS.map(tema => (
          <button
            key={tema.id}
            className={`lab-tab ${aba === tema.id ? 'ativa' : ''}`}
            onClick={() => setAba(tema.id)}
            disabled={tema.emBreve}
            aria-current={aba === tema.id ? 'page' : undefined}
          >
            <span className="tab-numero">{tema.numero}</span>
            {tema.aba}
            {tema.emBreve && <span className="tab-breve">em breve</span>}
          </button>
        ))}
      </nav>

      <div className={aba === 'demanda-oferta' ? 'lab-painel' : 'lab-painel oculto'}>
        <LabSubstitutos key={chaveDesafio} inicial={cenarioDesafio} />
      </div>
      <div className={aba === 'equilibrio' ? 'lab-painel' : 'lab-painel oculto'}>
        <LabEquilibrio />
      </div>
    </section>

    <section className="challenge">
      <div>
        <p className="eyebrow">DESAFIO RÁPIDO</p>
        <h2>Consegue criar<br/>um novo equilíbrio?</h2>
        <p>Aumente a renda em 20%, suba o preço do chá e ajuste o preço do café até oferta e demanda se encontrarem.</p>
      </div>
      <button className="button light" onClick={carregarDesafio}>Carregar desafio <span>→</span></button>
    </section>

    <footer><span>MICROLAB <b>·</b> APRENDER FAZENDO</span><span>Fundamentos de Microeconomia — 2026</span></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
