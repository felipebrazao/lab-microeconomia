import React, { useEffect, useMemo, useState } from 'react'
import Slider from '../shared/Slider.jsx'
import Chart from '../shared/Chart.jsx'
import { num } from '../shared/formato.js'
import { usePersistido } from '../shared/persistencia.js'
import { gerarRodada, resolver, enunciado, RELACOES } from './pares-demanda.js'
import {
  situacao,
  EFEITO_RENDA,
  EFEITO_SUBSTITUTO,
  EFEITO_COMPLEMENTAR,
  EFEITO_PRODUCAO,
  PRECO_MIN,
  PRECO_MAX,
} from '../shared/modelo.js'

const SECOES = [
  { id: 'conceito', numero: '3.0', titulo: 'Conceito' },
  { id: 'laboratorio', numero: '3.1', titulo: 'Laboratório' },
  { id: 'desafio', numero: '3.2', titulo: 'Desafio' },
]

const ROTULO_RELACAO = { substituto: 'Substitutos', complementar: 'Complementares' }

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
  const [secao, setSecao] = useState('conceito')
  const [conceitoLido, setConceitoLido] = usePersistido('microlab:demanda-oferta:conceito', false)
  const [labVisitado, setLabVisitado] = usePersistido('microlab:demanda-oferta:lab', false)
  const [rodadas, setRodadas] = usePersistido('microlab:demanda-oferta:rodadas', 0)
  const [rodada, setRodada] = useState(() => gerarRodada())
  const [respostas, setRespostas] = useState({})

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

  const acertos = rodada.filter(caso => respostas[caso.id] === resolver(caso).relacao).length
  const rodadaCompleta = acertos === rodada.length

  useEffect(() => {
    if (rodadaCompleta) setRodadas(n => n + 1)
  }, [rodadaCompleta, setRodadas])

  const novaRodada = () => {
    setRodada(gerarRodada())
    setRespostas({})
  }

  const secaoOk = { conceito: conceitoLido, laboratorio: labVisitado, desafio: rodadas > 0 }
  const concluidas = SECOES.filter(sec => secaoOk[sec.id]).length

  const irPara = id => {
    setSecao(id)
    if (id !== 'conceito') setLabVisitado(true)
  }

  const leitura = LEITURA[mercado.tipo]

  return (
    <>
    <nav className="secoes" aria-label="Seções do módulo">
      <div className="secoes-topo">
        <span className="secoes-rotulo">MÓDULO 03 · DEMANDA E OFERTA</span>
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
              {sec.id === 'desafio' && <span className="secao-contador">{acertos}/{rodada.length}</span>}
            </button>
          </li>
        ))}
      </ul>
    </nav>

    {secao === 'conceito' && (
      <div className="conceito">
        <p className="eyebrow">3.0 · CONCEITO</p>
        <h3>O que move a curva, e o que move o ponto</h3>
        <p>
          Mudar o <b>preço do próprio bem</b> desliza o ponto <b>ao longo</b> da curva. Qualquer
          outro fator — renda, preço de bens relacionados, gosto, tecnologia — <b>desloca a curva
          inteira</b> para o lado. É a distinção que mais confunde no tema, e a que o laboratório
          existe para tornar visível.
        </p>
        <p>
          Dois bens são <b>substitutos</b> quando competem: se um encarece, o consumidor migra
          para o outro, e a demanda do outro sobe. São <b>complementares</b> quando se consomem
          juntos: se um encarece, o consumo do par cai junto.
        </p>
        <p>
          Quanto à renda, a regra é direta — mais renda, mais demanda. Há duas exceções: <b>bens
          saciados</b>, em que o consumidor já está satisfeito, e <b>bens inferiores</b>, cuja
          demanda cai quando a renda sobe, porque ele troca por algo melhor.
        </p>
        <button className="button primary" onClick={() => { setConceitoLido(true); irPara('laboratorio') }}>
          {conceitoLido ? 'Reler e ir ao laboratório' : 'Entendi, ir ao laboratório'} <span>→</span>
        </button>
      </div>
    )}

    <div className={secao === 'conceito' ? 'secao oculto' : 'secao'}>
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

    {secao === 'desafio' && (
      <Desafio rodada={rodada} respostas={respostas} setRespostas={setRespostas}
               acertos={acertos} rodadas={rodadas} completa={rodadaCompleta} onNovaRodada={novaRodada} />
    )}

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
    </div>
    </>
  )
}

function Desafio({ rodada, respostas, setRespostas, acertos, rodadas, completa, onNovaRodada }) {
  return (
    <div className="metas">
      <div className="metas-topo">
        <span className="market-label">3.2 · DESAFIO</span>
        <span className="metas-contador">
          {acertos} de {rodada.length}
          {rodadas > 0 && <> · {rodadas} {rodadas === 1 ? 'rodada' : 'rodadas'}</>}
        </span>
      </div>
      <p className="metas-intro">
        Os choques são sorteados a cada rodada. Pela direção em que a demanda reagiu, diga se os
        dois bens competem entre si ou são consumidos juntos.
      </p>
      <ul className="casos">
        {rodada.map(caso => {
          const certo = resolver(caso)
          const escolha = respostas[caso.id]
          const acertou = escolha === certo.relacao
          return (
            <li key={caso.id} className={escolha ? (acertou ? 'caso certo' : 'caso errado') : 'caso'}>
              <p>{enunciado(caso)}</p>
              <div className="caso-opcoes">
                {RELACOES.map(op => (
                  <button
                    key={op}
                    className={`caso-op ${escolha === op ? 'escolhida' : ''}`}
                    onClick={() => setRespostas(r => ({ ...r, [caso.id]: op }))}
                    disabled={acertou}
                  >
                    {ROTULO_RELACAO[op]}
                  </button>
                ))}
              </div>
              {escolha && (
                <p className="caso-feedback">
                  {acertou ? '✓ ' : '✗ '}
                  A demanda por {caso.par.b} {certo.varDemanda > 0 ? 'subiu' : 'caiu'}{' '}
                  {Math.abs(certo.varDemanda)}% — {certo.varPreco > 0 ? 'com o preço em alta' : 'com o preço em baixa'},
                  os dois se moveram {Math.sign(certo.varPreco) === Math.sign(certo.varDemanda) ? 'no mesmo sentido' : 'em sentidos opostos'}.
                  {!acertou && ' Mesmo sentido é substituto; sentidos opostos, complementar.'}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {completa && (
        <p className="metas-fim">✦ Rodada fechada. Sorteie outra para treinar com choques novos.</p>
      )}
      <button className="reset ajustar" onClick={onNovaRodada}>↻ Sortear nova rodada</button>
    </div>
  )
}
