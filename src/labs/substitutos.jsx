import React, { useMemo, useState } from 'react'
import Slider from '../shared/Slider.jsx'
import Chart from '../shared/Chart.jsx'
import { num } from '../shared/formato.js'
import {
  situacao,
  EFEITO_RENDA,
  EFEITO_SUBSTITUTO,
  EFEITO_COMPLEMENTAR,
  EFEITO_PRODUCAO,
  PRECO_MIN,
  PRECO_MAX,
} from '../shared/modelo.js'

const CENARIO_PADRAO = { preco: 28, renda: 0, substituto: 0, complementar: 0, producao: 0 }

const LEITURA = {
  escassez: { rotulo: 'Escassez', texto: 'Consumidores querem mais do que empresas oferecem.', cor: 'coral' },
  excesso: { rotulo: 'Excesso de oferta', texto: 'Empresas oferecem mais do que consumidores desejam.', cor: 'blue' },
  equilibrio: { rotulo: 'Equilíbrio', texto: 'Oferta e demanda estão praticamente alinhadas.', cor: 'mint' },
}

export default function LabSubstitutos({ inicial = CENARIO_PADRAO }) {
  const [preco, setPreco] = useState(inicial.preco)
  const [renda, setRenda] = useState(inicial.renda)
  const [substituto, setSubstituto] = useState(inicial.substituto)
  const [complementar, setComplementar] = useState(inicial.complementar)
  const [producao, setProducao] = useState(inicial.producao)

  // Um substituto mais caro empurra consumidores para cá (desloca a demanda à
  // direita); um complementar mais caro derruba o consumo conjunto (à esquerda).
  const deslocDemanda =
    renda * EFEITO_RENDA + substituto * EFEITO_SUBSTITUTO - complementar * EFEITO_COMPLEMENTAR
  const deslocOferta = producao * EFEITO_PRODUCAO

  const mercado = useMemo(
    () => situacao(preco, deslocDemanda, deslocOferta),
    [preco, deslocDemanda, deslocOferta],
  )

  const restaurar = () => {
    setPreco(CENARIO_PADRAO.preco)
    setRenda(CENARIO_PADRAO.renda)
    setSubstituto(CENARIO_PADRAO.substituto)
    setComplementar(CENARIO_PADRAO.complementar)
    setProducao(CENARIO_PADRAO.producao)
  }

  const leitura = LEITURA[mercado.tipo]

  return (
    <>
    <div className="lab-shell">
      <aside className="controls-panel">
        <div className="panel-title"><span className="pulse"></span> CONTROLES DO CENÁRIO</div>

        <Slider label="Preço do produto" value={preco} min={PRECO_MIN} max={PRECO_MAX} suffix=" R$"
                onChange={setPreco} hint="Movimento ao longo das curvas" />

        <div className="divider"><span>DESLOCAMENTOS DE CURVA</span></div>

        <Slider label="Variação na renda" value={renda} min={-30} max={30} suffix="%"
                onChange={setRenda} hint="Bens normais: renda ↑, demanda ↑" />
        <Slider label="Preço do substituto" value={substituto} min={-30} max={30} suffix="%"
                onChange={setSubstituto} hint="Ex.: café e chá" />
        <Slider label="Preço do complementar" value={complementar} min={-30} max={30} suffix="%"
                onChange={setComplementar} hint="Ex.: carros e combustível" />
        <Slider label="Condições de produção" value={producao} min={-30} max={30} suffix="%"
                onChange={setProducao} hint="Tecnologia, custos, clima…" />

        <button className="reset" onClick={restaurar}>↺ Restaurar cenário</button>
      </aside>

      <div className="market-panel">
        <div className="market-header">
          <div>
            <span className="market-label">MERCADO DE CAFÉ</span>
            <h3>Oferta x Demanda</h3>
          </div>
          <div className={`market-status ${leitura.cor}`}>
            <b>{leitura.rotulo}</b>
            <span>{leitura.texto}</span>
          </div>
        </div>

        <div className="chart-wrap">
          <div className="axis-y">PREÇO (R$)</div>
          <div className="axis-x">QUANTIDADE (MIL UNIDADES)</div>
          <Chart deslocDemanda={deslocDemanda} deslocOferta={deslocOferta} preco={preco} situacao={mercado} />
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
            <span>EQUILÍBRIO ESTIMADO</span>
            <strong>R$ {num(mercado.equilibrio.preco, 2)}<small> · {num(mercado.equilibrio.quantidade)} mil un.</small></strong>
          </div>
        </div>
      </div>
    </div>

    <div className="insight">
      <span className="spark">✦</span>
      <p>
        <b>Leitura do cenário:</b> {leitura.texto}
        {renda > 0 && ' O aumento de renda deslocou a demanda para a direita.'}
        {substituto > 0 && ' Um substituto mais caro torna o café relativamente mais atraente.'}
        {complementar > 0 && ' Um complementar mais caro reduz o interesse pelo produto.'}
        {producao > 0 && ' Melhores condições de produção expandem a oferta.'}
      </p>
    </div>
    </>
  )
}
