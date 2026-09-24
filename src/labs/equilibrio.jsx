import React, { useEffect, useMemo, useState } from 'react'
import Slider from '../shared/Slider.jsx'
import Chart from '../shared/Chart.jsx'
import { num } from '../shared/formato.js'
import { usePersistido } from '../shared/persistencia.js'
import { METAS } from './metas-equilibrio.js'
import {
  situacao,
  proximoPreco,
  EFEITO_RENDA,
  EFEITO_PRODUCAO,
  PRECO_MIN,
  PRECO_MAX,
  TOLERANCIA_FOLGA,
} from '../shared/modelo.js'

const PRECO_INICIAL = 34
// Intervalo entre passos da animação de ajuste. Com ~30% da folga fechada por
// passo, a convergência leva de 11 a 16 passos: meio segundo, tempo de ver o
// preço caminhando sem que a espera canse.
const INTERVALO_AJUSTE = 45

const LEITURA = {
  escassez: {
    rotulo: 'Escassez',
    resumo: 'Consumidores querem mais do que as empresas oferecem.',
    pressao: 'Falta produto, e quem não conseguiu comprar aceita pagar mais. A pressão é de alta.',
  },
  excesso: {
    rotulo: 'Excesso de oferta',
    resumo: 'As empresas oferecem mais do que os consumidores querem.',
    pressao: 'Sobra produto no estoque, e vender exige baixar o preço. A pressão é de baixa.',
  },
  equilibrio: {
    rotulo: 'Equilíbrio',
    resumo: 'Tudo que se quer comprar é exatamente o que se quer vender.',
    pressao: 'Ninguém tem motivo para mudar de preço: o mercado está em repouso.',
  },
}

const COR_STATUS = { escassez: 'coral', excesso: 'blue', equilibrio: 'mint' }

// O módulo se apresenta em seções, não como um lab solto. Laboratório e desafio
// compartilham a MESMA instância do lab: o desafio avalia o estado que o aluno
// produziu manipulando os controles, então o lab não pode remontar entre as duas.
const SECOES = [
  { id: 'conceito', numero: '4.0', titulo: 'Conceito' },
  { id: 'laboratorio', numero: '4.1', titulo: 'Laboratório' },
  { id: 'desafio', numero: '4.2', titulo: 'Desafio' },
]

export default function LabEquilibrio() {
  const [preco, setPreco] = useState(PRECO_INICIAL)
  const [choqueDemanda, setChoqueDemanda] = useState(0)
  const [choqueOferta, setChoqueOferta] = useState(0)
  const [ajustando, setAjustando] = useState(false)
  const [secao, setSecao] = useState('conceito')
  const [conceitoLido, setConceitoLido] = usePersistido('microlab:equilibrio:conceito', false)
  const [labVisitado, setLabVisitado] = usePersistido('microlab:equilibrio:lab', false)
  const [feitas, setFeitas] = usePersistido('microlab:equilibrio:metas', [])
  // O cenário inicial já nasce com excesso de oferta. Sem esta trava, a meta
  // correspondente seria dada de graça a quem só abriu a aba.
  const [interagiu, setInteragiu] = useState(false)

  const deslocDemanda = choqueDemanda * EFEITO_RENDA
  const deslocOferta = choqueOferta * EFEITO_PRODUCAO

  const mercado = useMemo(
    () => situacao(preco, deslocDemanda, deslocOferta),
    [preco, deslocDemanda, deslocOferta],
  )

  // Um passo do ajuste por vez: cada render agenda o próximo enquanto houver
  // folga. Parar aqui (e não dentro do setPreco) mantém o efeito previsível.
  useEffect(() => {
    if (!ajustando) return
    if (Math.abs(mercado.folga) <= TOLERANCIA_FOLGA) {
      setAjustando(false)
      return
    }
    const id = setTimeout(
      () => setPreco(proximoPreco(preco, deslocDemanda, deslocOferta)),
      INTERVALO_AJUSTE,
    )
    return () => clearTimeout(id)
  }, [ajustando, preco, deslocDemanda, deslocOferta, mercado.folga])

  // Meta cumprida não se perde: o aluno pode seguir mexendo sem desmarcar o que
  // já conseguiu. Roda em qualquer seção, então conquistar algo no laboratório
  // já conta quando ele chega no desafio.
  const houveChoque = choqueDemanda !== 0 || choqueOferta !== 0
  useEffect(() => {
    if (!interagiu) return
    const novas = METAS
      .filter(meta => !feitas.includes(meta.id) && meta.ok(mercado, houveChoque))
      .map(meta => meta.id)
    if (novas.length) setFeitas(atuais => [...atuais, ...novas])
  }, [interagiu, mercado, houveChoque, feitas, setFeitas])

  // Mexer no preço à mão cancela o ajuste automático: quem está no comando é o aluno.
  const mudarPreco = valor => {
    setInteragiu(true)
    setAjustando(false)
    setPreco(valor)
  }

  const mudarChoque = setter => valor => {
    setInteragiu(true)
    setter(valor)
  }

  const restaurar = () => {
    setAjustando(false)
    setPreco(PRECO_INICIAL)
    setChoqueDemanda(0)
    setChoqueOferta(0)
  }

  const leitura = LEITURA[mercado.tipo]
  const distancia = preco - mercado.equilibrio.preco

  const secaoOk = {
    conceito: conceitoLido,
    laboratorio: labVisitado,
    desafio: feitas.length === METAS.length,
  }
  const concluidas = SECOES.filter(sec => secaoOk[sec.id]).length

  // Entrar no laboratório ou no desafio já conta como visitar o laboratório —
  // são a mesma tela, o desafio só acrescenta o painel de metas.
  const irPara = id => {
    setSecao(id)
    if (id !== 'conceito') setLabVisitado(true)
  }

  return (
    <>
    <nav className="secoes" aria-label="Seções do módulo">
      <div className="secoes-topo">
        <span className="secoes-rotulo">MÓDULO 04 · EQUILÍBRIO DE MERCADO</span>
        <span className="secoes-progresso">{concluidas} de {SECOES.length} concluídas</span>
      </div>
      <div className="secoes-barra">
        <i style={{ width: `${(concluidas / SECOES.length) * 100}%` }} />
      </div>
      <ul>
        {SECOES.map(sec => (
          <li key={sec.id}>
            <button
              className={`secao-item ${secao === sec.id ? 'ativa' : ''}`}
              onClick={() => irPara(sec.id)}
              aria-current={secao === sec.id ? 'step' : undefined}
            >
              <span className={`secao-check ${secaoOk[sec.id] ? 'feito' : ''}`} aria-hidden="true">
                {secaoOk[sec.id] ? '✓' : '○'}
              </span>
              <span className="secao-num">{sec.numero}</span>
              <span className="secao-titulo">{sec.titulo}</span>
              {sec.id === 'desafio' && (
                <span className="secao-contador">{feitas.length}/{METAS.length}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>

    {secao === 'conceito' && (
      <Conceito lido={conceitoLido} onLido={() => { setConceitoLido(true); irPara('laboratorio') }} />
    )}

    <div className={secao === 'conceito' ? 'secao oculto' : 'secao'}>
    <div className="lab-shell">
      <aside className="controls-panel">
        <div className="panel-title"><span className="pulse"></span> CONTROLES DO CENÁRIO</div>

        <Slider
          label="Preço praticado"
          value={preco}
          exibicao={num(preco, 1)}
          min={PRECO_MIN}
          max={PRECO_MAX}
          step={0.1}
          suffix=" R$"
          onChange={mudarPreco}
          hint="Movimento ao longo das curvas"
        />

        <button className="reset ajustar" onClick={() => { setInteragiu(true); setAjustando(true) }} disabled={ajustando || mercado.tipo === 'equilibrio'}>
          {ajustando ? '⟳ Ajustando…' : '▶ Deixar o mercado ajustar'}
        </button>

        <div className="divider"><span>DESLOCAMENTOS DE CURVA</span></div>

        <Slider
          label="Choque de demanda"
          value={choqueDemanda}
          min={-30}
          max={30}
          suffix="%"
          onChange={mudarChoque(setChoqueDemanda)}
          hint="Renda, preferências, população"
        />
        <Slider
          label="Choque de oferta"
          value={choqueOferta}
          min={-30}
          max={30}
          suffix="%"
          onChange={mudarChoque(setChoqueOferta)}
          hint="Tecnologia, custos, clima"
        />

        <button className="reset" onClick={restaurar}>↺ Restaurar cenário</button>
      </aside>

      <div className="market-panel">
        <div className="market-header">
          <div>
            <span className="market-label">MERCADO DE CAFÉ</span>
            <h3>Onde oferta e demanda se encontram</h3>
          </div>
          <div className={`market-status ${COR_STATUS[mercado.tipo]}`}>
            <b>{leitura.rotulo}</b>
            <span>{leitura.resumo}</span>
          </div>
        </div>

        <div className="chart-wrap">
          <div className="axis-y">PREÇO (R$)</div>
          <div className="axis-x">QUANTIDADE (MIL UNIDADES)</div>
          <Chart
            deslocDemanda={deslocDemanda}
            deslocOferta={deslocOferta}
            preco={preco}
            situacao={mercado}
            mostrarEquilibrio
            mostrarFolga
          />
        </div>

        <div className="metric-row">
          <div>
            <span>QUANTIDADE DEMANDADA</span>
            <strong>{num(mercado.qd)}<small> mil un.</small></strong>
          </div>
          <div>
            <span>QUANTIDADE OFERTADA</span>
            <strong>{num(mercado.qs)}<small> mil un.</small></strong>
          </div>
          <div className="highlight">
            <span>EQUILÍBRIO</span>
            <strong>R$ {num(mercado.equilibrio.preco, 2)}<small> · {num(mercado.equilibrio.quantidade)} mil un.</small></strong>
          </div>
        </div>
      </div>
    </div>

    {secao === 'desafio' && <PainelMetas feitas={feitas} />}

    <div className="insight">
      <span className="spark">✦</span>
      <p>
        <b>Leitura do cenário:</b>{' '}
        {mercado.tipo === 'equilibrio'
          ? `A R$ ${num(preco, 1)} o mercado está em repouso: ${num(mercado.qd)} mil unidades trocam de mãos. ${leitura.pressao}`
          : `A R$ ${num(preco, 1)}, os consumidores querem ${num(mercado.qd)} mil unidades e as empresas oferecem ${num(mercado.qs)} mil — uma diferença de ${num(Math.abs(mercado.folga))} mil. ${leitura.pressao} O equilíbrio está em R$ ${num(mercado.equilibrio.preco, 2)}, ${distancia > 0 ? 'abaixo' : 'acima'} do preço praticado.`}
        {deslocDemanda !== 0 && ` O choque deslocou a demanda para a ${deslocDemanda > 0 ? 'direita' : 'esquerda'} — a posição anterior segue tracejada no gráfico.`}
        {deslocOferta !== 0 && ` O choque deslocou a oferta para a ${deslocOferta > 0 ? 'direita' : 'esquerda'}.`}
      </p>
    </div>
    </div>
    </>
  )
}

function Conceito({ lido, onLido }) {
  return (
    <div className="conceito">
      <p className="eyebrow">4.0 · CONCEITO</p>
      <h3>O preço que põe o mercado em repouso</h3>
      <p>
        O <b>equilíbrio</b> é o par de preço e quantidade em que tudo que se quer comprar é
        exatamente o que se quer vender. É o único preço em que ninguém tem motivo para mudar
        de comportamento.
      </p>
      <p>
        <b>Acima</b> dele, as empresas oferecem mais do que os consumidores querem: sobra
        produto, e vender exige baixar o preço. <b>Abaixo</b> dele, falta produto, e quem não
        conseguiu comprar aceita pagar mais. O tamanho dessa folga mede a força da pressão.
      </p>
      <p>
        Um choque de renda, custo ou clima <b>desloca a curva inteira</b> e move o ponto de
        equilíbrio de lugar — diferente de mudar o preço praticado, que apenas desliza o ponto
        ao longo da curva.
      </p>
      <button className="button primary" onClick={onLido}>
        {lido ? 'Reler e ir ao laboratório' : 'Entendi, ir ao laboratório'} <span>→</span>
      </button>
    </div>
  )
}

function PainelMetas({ feitas }) {
  return (
    <div className="metas">
      <div className="metas-topo">
        <span className="market-label">4.2 · DESAFIO</span>
        <span className="metas-contador">{feitas.length} de {METAS.length}</span>
      </div>
      <p className="metas-intro">
        Nada aqui é de múltipla escolha: cada meta é verificada no estado que você produzir nos
        controles ao lado.
      </p>
      <ul>
        {METAS.map(meta => {
          const feita = feitas.includes(meta.id)
          return (
            <li key={meta.id} className={feita ? 'meta feita' : 'meta'}>
              <span className="meta-check" aria-hidden="true">{feita ? '✓' : '○'}</span>
              <div>
                <b>{meta.texto}</b>
                {!feita && <small>{meta.dica}</small>}
              </div>
            </li>
          )
        })}
      </ul>
      {feitas.length === METAS.length && (
        <p className="metas-fim">
          ✦ Módulo concluído. Você provocou escassez, excesso e equilíbrio — e viu uma curva
          se deslocar.
        </p>
      )}
    </div>
  )
}
