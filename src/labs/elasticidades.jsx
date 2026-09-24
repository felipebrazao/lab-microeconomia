import React, { useEffect, useMemo, useState } from 'react'
import Slider from '../shared/Slider.jsx'
import { num } from '../shared/formato.js'
import { usePersistido } from '../shared/persistencia.js'
import { elasticidadePreco, classificarElasticidade, precoChoke, PRECO_MIN } from '../shared/modelo.js'
import { gerarRodada, resolver, enunciado } from './casos-elasticidade.js'

// Acima do preço de choke a demanda é zero e a elasticidade deixa de existir.
// A faixa para aqui, com folga, para o aluno não cair num buraco do modelo.
const PRECO_MAX_LAB = precoChoke() - 6

const DE_INICIAL = 20
const PARA_INICIAL = 30

const SECOES = [
  { id: 'conceito', numero: '5.0', titulo: 'Conceito' },
  { id: 'laboratorio', numero: '5.1', titulo: 'Laboratório' },
  { id: 'desafio', numero: '5.2', titulo: 'Desafio' },
]

const TIPOS = {
  elastica: { rotulo: 'Elástica', cor: 'coral', leitura: 'A quantidade responde mais que o preço.' },
  unitaria: { rotulo: 'Unitária', cor: 'mint', leitura: 'Quantidade e preço variam na mesma proporção.' },
  inelastica: { rotulo: 'Inelástica', cor: 'blue', leitura: 'A quantidade responde menos que o preço.' },
  indefinida: { rotulo: 'Indefinida', cor: 'blue', leitura: 'Sem variação de preço não há o que medir.' },
}

const OPCOES = ['elastica', 'unitaria', 'inelastica']

// Percentual que ocupa a metade da barra. Escala fixa: com escala automática,
// duas variações diferentes desenhariam a mesma barra.
const ESCALA_BARRA = 100

function Barra({ rotulo, valor }) {
  const pct = valor * 100
  const largura = Math.min(Math.abs(pct), ESCALA_BARRA) / ESCALA_BARRA * 50
  return (
    <div className="barra-linha">
      <span className="barra-rotulo">{rotulo}</span>
      <div className="barra-trilho">
        <i className="barra-zero" />
        <i
          className={pct < 0 ? 'barra-preenche negativa' : 'barra-preenche'}
          style={pct < 0 ? { right: '50%', width: `${largura}%` } : { left: '50%', width: `${largura}%` }}
        />
      </div>
      <span className="barra-valor">{pct > 0 ? '+' : ''}{num(pct, 1)}%</span>
    </div>
  )
}

export default function LabElasticidades() {
  const [precoDe, setPrecoDe] = useState(DE_INICIAL)
  const [precoPara, setPrecoPara] = useState(PARA_INICIAL)
  const [secao, setSecao] = useState('conceito')
  const [conceitoLido, setConceitoLido] = usePersistido('microlab:elasticidades:conceito', false)
  const [labVisitado, setLabVisitado] = usePersistido('microlab:elasticidades:lab', false)
  // A rodada vive só em memória: cada treino é sorteado na hora, e o que vale
  // guardar é quantas vezes o aluno fechou uma rodada, não quais números saíram.
  const [rodada, setRodada] = useState(() => gerarRodada())
  const [respostas, setRespostas] = useState({})
  const [rodadas, setRodadas] = usePersistido('microlab:elasticidades:rodadas', 0)

  const e = useMemo(() => elasticidadePreco(precoDe, precoPara), [precoDe, precoPara])
  const tipo = classificarElasticidade(e.valor)
  const variacaoReceita = e.receitaPara - e.receitaDe

  const acertos = rodada.filter(caso => respostas[caso.id] === resolver(caso).tipo).length
  const rodadaCompleta = acertos === rodada.length

  useEffect(() => {
    if (rodadaCompleta) setRodadas(n => n + 1)
  }, [rodadaCompleta, setRodadas])

  const novaRodada = () => {
    setRodada(gerarRodada())
    setRespostas({})
  }

  const secaoOk = {
    conceito: conceitoLido,
    laboratorio: labVisitado,
    desafio: rodadas > 0,
  }
  const concluidas = SECOES.filter(sec => secaoOk[sec.id]).length

  const irPara = id => {
    setSecao(id)
    if (id !== 'conceito') setLabVisitado(true)
  }

  return (
    <>
    <nav className="secoes" aria-label="Seções do módulo">
      <div className="secoes-topo">
        <span className="secoes-rotulo">MÓDULO 05 · ELASTICIDADES</span>
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
        <p className="eyebrow">5.0 · CONCEITO</p>
        <h3>Não basta saber a direção; falta a intensidade</h3>
        <p>
          Demanda e oferta já dizem <b>para onde</b> a quantidade se move quando o preço muda.
          A <b>elasticidade</b> diz <b>o quanto</b>: é a variação percentual da quantidade para
          cada 1% de variação no preço.
        </p>
        <p>
          Se a quantidade responde <b>mais</b> que o preço, a demanda é <b>elástica</b>. Se
          responde <b>menos</b>, é <b>inelástica</b>. Respondendo na mesma proporção, é unitária.
        </p>
        <p>
          A consequência prática é a receita. Com demanda elástica, baixar o preço <b>aumenta</b>
          a receita, porque o ganho em quantidade supera a perda por unidade. Com demanda
          inelástica acontece o contrário. É por isso que a mesma promoção funciona num produto e
          quebra outro.
        </p>
        <button className="button primary" onClick={() => { setConceitoLido(true); irPara('laboratorio') }}>
          {conceitoLido ? 'Reler e ir ao laboratório' : 'Entendi, ir ao laboratório'} <span>→</span>
        </button>
      </div>
    )}

    <div className={secao === 'conceito' ? 'secao oculto' : 'secao'}>
      <div className="lab-shell">
        <aside className="controls-panel">
          <div className="panel-title"><span className="pulse"></span> DUAS OBSERVAÇÕES DO MERCADO</div>
          <Slider
            label="Preço antes" value={precoDe} min={PRECO_MIN} max={PRECO_MAX_LAB} step={0.5}
            suffix=" R$" onChange={setPrecoDe} hint={`Vendia ${num(e.qDe)} mil un.`}
          />
          <Slider
            label="Preço depois" value={precoPara} min={PRECO_MIN} max={PRECO_MAX_LAB} step={0.5}
            suffix=" R$" onChange={setPrecoPara} hint={`Passou a vender ${num(e.qPara)} mil un.`}
          />
          <button className="reset" onClick={() => { setPrecoDe(DE_INICIAL); setPrecoPara(PARA_INICIAL) }}>
            ↺ Restaurar cenário
          </button>
        </aside>

        <div className="market-panel">
          <div className="market-header">
            <div>
              <span className="market-label">MERCADO DE CAFÉ</span>
              <h3>Quanto a quantidade responde</h3>
            </div>
            <div className={`market-status ${TIPOS[tipo].cor}`}>
              <b>Demanda {TIPOS[tipo].rotulo.toLowerCase()}</b>
              <span>{TIPOS[tipo].leitura}</span>
            </div>
          </div>

          <div className="barras">
            <Barra rotulo="Preço" valor={e.varPreco} />
            <Barra rotulo="Quantidade" valor={Number.isFinite(e.varQuantidade) ? e.varQuantidade : 0} />
            <p className="barras-legenda">
              A barra maior manda: quantidade maior que preço é demanda elástica.
            </p>
          </div>

          <div className="metric-row">
            <div className="highlight">
              <span>ELASTICIDADE-PREÇO</span>
              <strong>{Number.isFinite(e.valor) ? num(e.valor, 2) : '—'}</strong>
            </div>
            <div>
              <span>RECEITA ANTES</span>
              <strong>R$ {num(e.receitaDe)}<small> mil</small></strong>
            </div>
            <div>
              <span>RECEITA DEPOIS</span>
              <strong>R$ {num(e.receitaPara)}<small> mil</small></strong>
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
          <b>Leitura do cenário:</b>{' '}
          {!Number.isFinite(e.valor)
            ? 'Escolha dois preços diferentes para haver variação a medir.'
            : `Subindo de R$ ${num(precoDe, 1)} para R$ ${num(precoPara, 1)}, o preço variou ${num(e.varPreco * 100, 1)}% e a quantidade ${num(e.varQuantidade * 100, 1)}% — elasticidade de ${num(e.valor, 2)}, demanda ${TIPOS[tipo].rotulo.toLowerCase()}. A receita ${variacaoReceita > 1 ? 'subiu' : variacaoReceita < -1 ? 'caiu' : 'ficou praticamente igual'}.`}
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
        <span className="market-label">5.2 · DESAFIO</span>
        <span className="metas-contador">
          {acertos} de {rodada.length}
          {rodadas > 0 && <> · {rodadas} {rodadas === 1 ? 'rodada' : 'rodadas'}</>}
        </span>
      </div>
      <p className="metas-intro">
        Os números são sorteados a cada rodada — não há gabarito para decorar. Classifique a
        demanda de cada mercado; o cálculo aparece depois da resposta.
      </p>
      <ul className="casos">
        {rodada.map(caso => {
          const certo = resolver(caso)
          const escolha = respostas[caso.id]
          const acertou = escolha === certo.tipo
          return (
            <li key={caso.id} className={escolha ? (acertou ? 'caso certo' : 'caso errado') : 'caso'}>
              <p>{enunciado(caso)}</p>
              <div className="caso-opcoes">
                {OPCOES.map(op => (
                  <button
                    key={op}
                    className={`caso-op ${escolha === op ? 'escolhida' : ''}`}
                    onClick={() => setRespostas(r => ({ ...r, [caso.id]: op }))}
                    disabled={acertou}
                  >
                    {TIPOS[op].rotulo}
                  </button>
                ))}
              </div>
              {escolha && (
                <p className="caso-feedback">
                  {acertou ? '✓ ' : '✗ '}
                  Preço {num(certo.varPreco * 100, 0)}%, quantidade {num(certo.varQuantidade * 100, 0)}% →
                  {' '}elasticidade {num(certo.valor, 2)}.
                  {!acertou && ' Compare o tamanho das duas variações e tente de novo.'}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {completa && (
        <p className="metas-fim">✦ Rodada fechada. Sorteie outra para treinar com números novos.</p>
      )}
      <button className="reset ajustar" onClick={onNovaRodada}>↻ Sortear nova rodada</button>
    </div>
  )
}
