import React, { useEffect, useState } from 'react'
import Slider from '../shared/Slider.jsx'
import { num } from '../shared/formato.js'
import { usePersistido } from '../shared/persistencia.js'
import {
  equilibrioConsumidor, respeitaDecrescente, gerarRodada,
} from './utilidade.js'

const UTILIDADES_PADRAO = [18, 15, 12, 9, 6, 3]
const PRECO_INICIAL = 9
const PRECO_MAX = 24

const SECOES = [
  { id: 'conceito', numero: '2.0', titulo: 'Conceito' },
  { id: 'laboratorio', numero: '2.1', titulo: 'Laboratório' },
  { id: 'desafio', numero: '2.2', titulo: 'Desafio' },
]

// Altura máxima de um degrau, em pixels. Escala fixa pelo mesmo motivo dos
// outros temas: com escala automática, tabelas diferentes desenhariam o mesmo.
const ALTURA_DEGRAU = 150
const UTILIDADE_MAX = 24

export default function LabConsumidor({ abrirDesafio = 0 }) {
  const [utilidades, setUtilidades] = useState(UTILIDADES_PADRAO)
  const [precoMercado, setPrecoMercado] = useState(PRECO_INICIAL)
  const [secao, setSecao] = useState('conceito')
  const [conceitoLido, setConceitoLido] = usePersistido('microlab:consumidor:conceito', false)
  const [labVisitado, setLabVisitado] = usePersistido('microlab:consumidor:lab', false)
  const [rodadas, setRodadas] = usePersistido('microlab:consumidor:rodadas', 0)
  const [rodada, setRodada] = useState(() => gerarRodada())
  const [respostas, setRespostas] = useState({})

  const e = equilibrioConsumidor(utilidades, precoMercado)
  const decrescente = respeitaDecrescente(utilidades)

  const acertos = rodada.filter(caso => {
    const certo = equilibrioConsumidor(caso.utilidades, caso.precoMercado).excedente
    return respostas[caso.id] !== undefined && Number(respostas[caso.id]) === certo
  }).length
  const rodadaCompleta = acertos === rodada.length

  useEffect(() => {
    if (rodadaCompleta) setRodadas(n => n + 1)
  }, [rodadaCompleta, setRodadas])

  const novaRodada = () => {
    setRodada(gerarRodada())
    setRespostas({})
  }

  const editar = (i, valor) => {
    const limpo = Math.max(0, Math.min(UTILIDADE_MAX, Math.round(Number(valor) || 0)))
    setUtilidades(atuais => atuais.map((u, j) => (j === i ? limpo : u)))
  }

  const secaoOk = { conceito: conceitoLido, laboratorio: labVisitado, desafio: rodadas > 0 }
  const concluidas = SECOES.filter(sec => secaoOk[sec.id]).length

  const irPara = id => {
    setSecao(id)
    if (id !== 'conceito') setLabVisitado(true)
  }

  // A faixa "Desafio rápido" da página pede a abertura desta seção. Vem como
  // número que só cresce, em vez de booleano, para um segundo clique também
  // valer — e zero significa "nenhum pedido", o que evita marcar como visitado
  // um módulo que o aluno nunca abriu.
  useEffect(() => {
    if (abrirDesafio > 0) irPara('desafio')
  }, [abrirDesafio])

  return (
    <>
    <nav className="secoes" aria-label="Seções do módulo">
      <div className="secoes-topo">
        <span className="secoes-rotulo">MÓDULO 02 · TEORIA DO CONSUMIDOR</span>
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
        <p className="eyebrow">2.0 · CONCEITO</p>
        <h3>De onde vem a curva de demanda</h3>
        <p>
          A <b>utilidade marginal</b> é a satisfação que cada unidade adicional acrescenta. Ela
          <b> decresce</b>: o primeiro copo d'água de quem está com sede vale muito; o quinto,
          pouco. É a lei da utilidade marginal decrescente.
        </p>
        <p>
          O <b>preço marginal de reserva</b> é o máximo que o consumidor aceitaria pagar por cada
          unidade. Como acompanha a utilidade marginal, também cai — e é exatamente por isso que
          a curva de demanda desce.
        </p>
        <p>
          Ele compra até a unidade em que a reserva iguala o <b>preço de mercado</b>. A diferença
          entre o que aceitaria pagar e o que de fato paga é o <b>excedente do consumidor</b>: o
          ganho dele na troca.
        </p>
        <button className="button primary" onClick={() => { setConceitoLido(true); irPara('laboratorio') }}>
          {conceitoLido ? 'Reler e ir ao laboratório' : 'Entendi, ir ao laboratório'} <span>→</span>
        </button>
      </div>
    )}

    <div className={secao === 'conceito' ? 'secao oculto' : 'secao'}>
      <div className="lab-shell">
        <aside className="controls-panel">
          <div className="panel-title"><span className="pulse"></span> TABELA DE UTILIDADE</div>
          <p className="tabela-ajuda">
            Edite a satisfação que cada unidade acrescenta, em reais. O preço de reserva de cada
            unidade é esse mesmo valor.
          </p>
          <table className="tabela-utilidade">
            <thead>
              <tr><th>Un.</th><th>U. marginal</th><th>U. total</th></tr>
            </thead>
            <tbody>
              {e.linhas.map((linha, i) => (
                <tr key={linha.unidade} className={linha.precoReserva >= precoMercado ? 'compra' : ''}>
                  <td>{linha.unidade}</td>
                  <td>
                    <input
                      type="number" min="0" max={UTILIDADE_MAX} value={linha.uMarginal}
                      onChange={ev => editar(i, ev.target.value)}
                      aria-label={`Utilidade marginal da unidade ${linha.unidade}`}
                    />
                  </td>
                  <td>{linha.uTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!decrescente && (
            <p className="aviso">
              ⚠ Esta tabela não decresce. É possível montá-la assim, mas contraria a lei da
              utilidade marginal decrescente — e é por isso que a demanda deixa de fazer sentido.
            </p>
          )}
          <div className="divider"><span>MERCADO</span></div>
          <Slider
            label="Preço de mercado" value={precoMercado} min={1} max={PRECO_MAX}
            suffix=" R$" onChange={setPrecoMercado} hint="Onde a reserva encontra o preço"
          />
          <button className="reset" onClick={() => { setUtilidades(UTILIDADES_PADRAO); setPrecoMercado(PRECO_INICIAL) }}>
            ↺ Restaurar cenário
          </button>
        </aside>

        <div className="market-panel">
          <div className="market-header">
            <div>
              <span className="market-label">DECISÃO DO CONSUMIDOR</span>
              <h3>Até onde vale a pena comprar</h3>
            </div>
            <div className="market-status mint">
              <b>Compra {e.quantidade} un.</b>
              <span>Para de comprar quando a reserva fica abaixo do preço.</span>
            </div>
          </div>

          <div className="degraus" style={{ height: ALTURA_DEGRAU + 34 }}>
            {e.linhas.map(linha => {
              const altura = Math.min(linha.precoReserva, UTILIDADE_MAX) / UTILIDADE_MAX * ALTURA_DEGRAU
              const paga = Math.min(precoMercado, linha.precoReserva) / UTILIDADE_MAX * ALTURA_DEGRAU
              const comprada = linha.precoReserva >= precoMercado
              return (
                <div key={linha.unidade} className="degrau">
                  <div className={comprada ? 'degrau-barra comprada' : 'degrau-barra'} style={{ height: altura }}>
                    {comprada && <i className="degrau-pago" style={{ height: paga }} />}
                  </div>
                  <span>{linha.unidade}</span>
                </div>
              )
            })}
            <div className="linha-preco" style={{ bottom: 34 + precoMercado / UTILIDADE_MAX * ALTURA_DEGRAU }}>
              <span>preço R$ {precoMercado}</span>
            </div>
          </div>
          <p className="degraus-legenda">
            A parte clara de cada degrau é o que o consumidor paga; a escura acima dela é o que
            ele ganha de graça — o excedente.
          </p>

          <div className="metric-row">
            <div>
              <span>QUANTIDADE COMPRADA</span>
              <strong>{e.quantidade}<small> un.</small></strong>
            </div>
            <div>
              <span>GASTO TOTAL</span>
              <strong>R$ {num(e.gasto)}</strong>
            </div>
            <div className="highlight">
              <span>EXCEDENTE DO CONSUMIDOR</span>
              <strong>R$ {num(e.excedente)}</strong>
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
          <b>Leitura do cenário:</b> A R$ {precoMercado}, o consumidor compra {e.quantidade} de{' '}
          {utilidades.length} unidades e gasta R$ {num(e.gasto)}. Estaria disposto a pagar R${' '}
          {num(e.utilidadeTotal)} por elas, então leva R$ {num(e.excedente)} de vantagem na troca.
          {' '}A próxima unidade vale menos para ele do que custa — por isso ele para.
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
        <span className="market-label">2.2 · DESAFIO</span>
        <span className="metas-contador">
          {acertos} de {rodada.length}
          {rodadas > 0 && <> · {rodadas} {rodadas === 1 ? 'rodada' : 'rodadas'}</>}
        </span>
      </div>
      <p className="metas-intro">
        As tabelas são sorteadas a cada rodada. Descubra quantas unidades o consumidor compra e
        calcule o excedente — a soma, nas unidades compradas, do que ele deixou de pagar.
      </p>
      <ul className="casos">
        {rodada.map(caso => {
          const certo = equilibrioConsumidor(caso.utilidades, caso.precoMercado)
          const resposta = respostas[caso.id]
          const respondeu = resposta !== undefined && resposta !== ''
          const acertou = respondeu && Number(resposta) === certo.excedente
          return (
            <li key={caso.id} className={respondeu ? (acertou ? 'caso certo' : 'caso errado') : 'caso'}>
              <p>
                Reservas de R$ {caso.utilidades.join(', ')} por unidade. Preço de mercado:
                {' '}R$ {caso.precoMercado}.
              </p>
              <div className="caso-opcoes">
                <label className="caso-numero">
                  Excedente R$
                  <input
                    type="number" value={resposta ?? ''} disabled={acertou}
                    onChange={ev => setRespostas(r => ({ ...r, [caso.id]: ev.target.value }))}
                  />
                </label>
              </div>
              {respondeu && (
                <p className="caso-feedback">
                  {acertou
                    ? `✓ Compra ${certo.quantidade} un. e o excedente é R$ ${certo.excedente}.`
                    : `✗ Some, só nas unidades cuja reserva cobre R$ ${caso.precoMercado}, quanto cada uma deixou de pagar.`}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {completa && (
        <p className="metas-fim">✦ Rodada fechada. Sorteie outra para treinar com tabelas novas.</p>
      )}
      <button className="reset ajustar" onClick={onNovaRodada}>↻ Sortear nova rodada</button>
    </div>
  )
}
