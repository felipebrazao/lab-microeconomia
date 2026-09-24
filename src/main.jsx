import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import LabSubstitutos from './labs/substitutos.jsx'
import LabEquilibrio from './labs/equilibrio.jsx'
import LabElasticidades from './labs/elasticidades.jsx'
import LabConsumidor from './labs/consumidor.jsx'
import LabOportunidade from './labs/oportunidade.jsx'
import LabEstruturas from './labs/estruturas.jsx'
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
    desafio: {
      titulo: <>Consegue medir o que<br />foi abandonado?</>,
      texto: 'Cenários sorteados, com alternativas e valores novos a cada rodada. Diga o custo de oportunidade de quem escolheu.',
    },
    numero: '01',
    aba: 'Custo de oportunidade',
    titulo: <>Toda escolha<br /><em>abre mão de outra.</em></>,
    descricao: 'O que uma decisão custa não é o dinheiro que sai do bolso: é o valor da melhor alternativa que ficou para trás.',
  },
  {
    id: 'consumidor',
    desafio: {
      titulo: <>Consegue calcular<br />o excedente?</>,
      texto: 'Descubra até onde o consumidor compra e some, nas unidades compradas, o que ele deixou de pagar.',
    },
    numero: '02',
    aba: 'Teoria do consumidor',
    titulo: <>De onde vem<br /><em>a demanda.</em></>,
    descricao: 'Antes da curva existe uma decisão: quanto vale para você a próxima unidade? Monte a tabela de satisfação e veja a demanda nascer dela.',
  },
  {
    id: 'demanda-oferta',
    desafio: {
      titulo: <>Competem ou<br />andam juntos?</>,
      texto: 'Choques sorteados sobre pares de bens. Pela direção em que a demanda reagiu, diga se são substitutos ou complementares.',
    },
    numero: '03',
    aba: 'Demanda e oferta',
    titulo: <>Faça o mercado<br /><em>se mover.</em></>,
    descricao: 'Escolha um preço e altere as condições. Observe como as curvas respondem e encontre o novo ponto de equilíbrio.',
  },
  {
    id: 'equilibrio',
    desafio: {
      titulo: <>Consegue criar<br />um novo equilíbrio?</>,
      texto: 'Quatro metas verificadas no próprio laboratório: provoque escassez, provoque excesso, equilibre o mercado e desloque uma curva.',
    },
    numero: '04',
    aba: 'Equilíbrio de mercado',
    titulo: <>Quando falta,<br /><em>quando sobra.</em></>,
    descricao: 'A um preço qualquer, oferta e demanda raramente coincidem. Veja o tamanho da diferença e para onde ela empurra o preço.',
  },
  {
    id: 'elasticidades',
    desafio: {
      titulo: <>A quantidade responde<br />mais ou menos?</>,
      texto: 'Quatro casos por rodada: dois medem a resposta ao preço e dois à renda. Só nos de renda o sinal negativo é resposta.',
    },
    numero: '05',
    aba: 'Elasticidades',
    titulo: <>Não basta a direção,<br /><em>falta a intensidade.</em></>,
    descricao: 'Demanda e oferta dizem para onde a quantidade se move. A elasticidade diz o quanto — e é ela que decide se baixar o preço aumenta ou derruba a receita.',
  },
  {
    id: 'estruturas',
    desafio: {
      titulo: <>Que mercado<br />é este?</>,
      texto: 'Mercados descritos pelos determinantes, sem citar setores. Conte quantos há de cada lado e classifique a estrutura.',
    },
    numero: '06',
    aba: 'Estruturas de mercado',
    titulo: <>Quem manda<br /><em>no preço.</em></>,
    descricao: 'Quantos vendem, quantos compram e se dá para entrar. Três perguntas classificam qualquer mercado — e dizem de que lado está o poder.',
  },
]

// Preço de equilíbrio do cenário base — o número que a órbita do topo exibe.
const PRECO_BASE = equilibrio().preco

function App() {
  const [aba, setAba] = useState('demanda-oferta')
  const [briefDone, setBriefDone] = useState(false)
  // A faixa de desafio age sobre o tema ABERTO, não sobre um tema fixo. Guardar
  // qual tema pediu impede o sinal de vazar para os outros labs e marcá-los como
  // visitados sem o aluno ter entrado neles.
  const [pedidoDesafio, setPedidoDesafio] = useState({ tema: null, n: 0 })

  const temaAtivo = TEMAS.find(t => t.id === aba)

  const abrirDesafio = () => {
    setPedidoDesafio(p => ({ tema: aba, n: p.n + 1 }))
    document.getElementById('lab').scrollIntoView({ behavior: 'smooth' })
  }

  const sinalPara = id => (pedidoDesafio.tema === id ? pedidoDesafio.n : 0)

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

      <div className={aba === 'custo-oportunidade' ? 'lab-painel' : 'lab-painel oculto'}>
        <LabOportunidade abrirDesafio={sinalPara('custo-oportunidade')} />
      </div>
      <div className={aba === 'consumidor' ? 'lab-painel' : 'lab-painel oculto'}>
        <LabConsumidor abrirDesafio={sinalPara('consumidor')} />
      </div>
      <div className={aba === 'demanda-oferta' ? 'lab-painel' : 'lab-painel oculto'}>
        <LabSubstitutos abrirDesafio={sinalPara('demanda-oferta')} />
      </div>
      <div className={aba === 'equilibrio' ? 'lab-painel' : 'lab-painel oculto'}>
        <LabEquilibrio abrirDesafio={sinalPara('equilibrio')} />
      </div>
      <div className={aba === 'elasticidades' ? 'lab-painel' : 'lab-painel oculto'}>
        <LabElasticidades abrirDesafio={sinalPara('elasticidades')} />
      </div>
      <div className={aba === 'estruturas' ? 'lab-painel' : 'lab-painel oculto'}>
        <LabEstruturas abrirDesafio={sinalPara('estruturas')} />
      </div>
    </section>

    <section className="challenge">
      <div>
        <p className="eyebrow">DESAFIO RÁPIDO <span>·</span> {temaAtivo.aba.toUpperCase()}</p>
        <h2>{temaAtivo.desafio.titulo}</h2>
        <p>{temaAtivo.desafio.texto}</p>
      </div>
      <button className="button light" onClick={abrirDesafio}>Ir para o desafio <span>→</span></button>
    </section>

    <footer><span>MICROLAB <b>·</b> APRENDER FAZENDO</span><span>Fundamentos de Microeconomia — 2026</span></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
