import React, { useEffect, useMemo, useState } from 'react'
import Slider from '../shared/Slider.jsx'
import Chart from '../shared/Chart.jsx'
import { num } from '../shared/formato.js'
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

export default function LabEquilibrio() {
  const [preco, setPreco] = useState(PRECO_INICIAL)
  const [choqueDemanda, setChoqueDemanda] = useState(0)
  const [choqueOferta, setChoqueOferta] = useState(0)
  const [ajustando, setAjustando] = useState(false)

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

  // Mexer no preço à mão cancela o ajuste automático: quem está no comando é o aluno.
  const mudarPreco = valor => {
    setAjustando(false)
    setPreco(valor)
  }

  const restaurar = () => {
    setAjustando(false)
    setPreco(PRECO_INICIAL)
    setChoqueDemanda(0)
    setChoqueOferta(0)
  }

  const leitura = LEITURA[mercado.tipo]
  const distancia = preco - mercado.equilibrio.preco

  return (
    <>
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

        <button className="reset ajustar" onClick={() => setAjustando(true)} disabled={ajustando || mercado.tipo === 'equilibrio'}>
          {ajustando ? '⟳ Ajustando…' : '▶ Deixar o mercado ajustar'}
        </button>

        <div className="divider"><span>DESLOCAMENTOS DE CURVA</span></div>

        <Slider
          label="Choque de demanda"
          value={choqueDemanda}
          min={-30}
          max={30}
          suffix="%"
          onChange={setChoqueDemanda}
          hint="Renda, preferências, população"
        />
        <Slider
          label="Choque de oferta"
          value={choqueOferta}
          min={-30}
          max={30}
          suffix="%"
          onChange={setChoqueOferta}
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
    </>
  )
}
