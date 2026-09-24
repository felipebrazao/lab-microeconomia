import React, { useEffect, useState } from 'react'
import { num } from '../shared/formato.js'
import { usePersistido } from '../shared/persistencia.js'
import { avaliar, custoOportunidade, gerarRodada } from './oportunidade.js'

const VALOR_MAX = 600

const ALTERNATIVAS_PADRAO = [
  { id: 'loja', uso: 'Abrir uma loja no terreno', valor: 420 },
  { id: 'aluguel', uso: 'Alugar o terreno para um vizinho', valor: 380 },
  { id: 'plantio', uso: 'Arrendar a área para plantio', valor: 240 },
]

const SECOES = [
  { id: 'conceito', numero: '1.0', titulo: 'Conceito' },
  { id: 'laboratorio', numero: '1.1', titulo: 'Laboratório' },
  { id: 'desafio', numero: '1.2', titulo: 'Desafio' },
]

export default function LabOportunidade({ abrirDesafio = 0 }) {
  const [alternativas, setAlternativas] = useState(ALTERNATIVAS_PADRAO)
  const [escolhidaId, setEscolhidaId] = useState('loja')
  const [secao, setSecao] = useState('conceito')
  const [conceitoLido, setConceitoLido] = usePersistido('microlab:oportunidade:conceito', false)
  const [labVisitado, setLabVisitado] = usePersistido('microlab:oportunidade:lab', false)
  const [rodadas, setRodadas] = usePersistido('microlab:oportunidade:rodadas', 0)
  const [rodada, setRodada] = useState(() => gerarRodada())
  const [respostas, setRespostas] = useState({})

  const r = avaliar(alternativas, escolhidaId)

  const acertos = rodada.filter(caso => {
    const certo = custoOportunidade(caso.alternativas, caso.escolhidaId)
    const dada = respostas[caso.id]
    return dada !== undefined && dada !== '' && Number(dada) === certo
  }).length
  const rodadaCompleta = acertos === rodada.length

  useEffect(() => {
    if (rodadaCompleta) setRodadas(n => n + 1)
  }, [rodadaCompleta, setRodadas])

  const novaRodada = () => {
    setRodada(gerarRodada())
    setRespostas({})
  }

  const ajustar = (id, valor) => {
    const limpo = Math.max(0, Math.min(VALOR_MAX, Math.round(Number(valor) || 0)))
    setAlternativas(atuais => atuais.map(a => (a.id === id ? { ...a, valor: limpo } : a)))
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
        <span className="secoes-rotulo">MÓDULO 01 · CUSTO DE OPORTUNIDADE</span>
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
        <p className="eyebrow">1.0 · CONCEITO</p>
        <h3>O que a escolha custou não está na nota fiscal</h3>
        <p>
          Recursos são limitados e desejos não. Toda escolha implica abrir mão de outra, e o
          <b> custo de oportunidade</b> é o valor da <b>melhor alternativa abandonada</b> — não o
          dinheiro que saiu do bolso.
        </p>
        <p>
          Quem abre uma loja no próprio terreno não tem despesa de aluguel na contabilidade, mas
          tem custo de oportunidade: o aluguel que receberia de outra pessoa. Ignorar isso faz um
          negócio parecer lucrativo quando ele apenas <b>empata</b> com o que se deixou de lado.
        </p>
        <p>
          Por isso o que importa é o <b>ganho líquido</b>: o retorno da escolha menos o da melhor
          abandonada. Se der negativo, a decisão custou a diferença, mesmo que o caixa esteja
          positivo. É o que explica por que "de graça" quase nunca é de graça.
        </p>
        <button className="button primary" onClick={() => { setConceitoLido(true); irPara('laboratorio') }}>
          {conceitoLido ? 'Reler e ir ao laboratório' : 'Entendi, ir ao laboratório'} <span>→</span>
        </button>
      </div>
    )}

    <div className={secao === 'conceito' ? 'secao oculto' : 'secao'}>
      <div className="lab-shell">
        <aside className="controls-panel">
          <div className="panel-title"><span className="pulse"></span> QUANTO CADA USO RENDE</div>
          <p className="tabela-ajuda">
            Um terreno, um uso só. Ajuste o retorno mensal de cada alternativa e veja a decisão
            mudar de lado.
          </p>
          {alternativas.map(alt => (
            <div className="control" key={alt.id}>
              <div className="control-top">
                <label htmlFor={`v-${alt.id}`}>{alt.uso}</label>
                <output>R$ {alt.valor}</output>
              </div>
              <input
                id={`v-${alt.id}`} type="range" min="0" max={VALOR_MAX} step="10"
                value={alt.valor} onChange={ev => ajustar(alt.id, ev.target.value)}
              />
            </div>
          ))}
          <button className="reset" onClick={() => { setAlternativas(ALTERNATIVAS_PADRAO); setEscolhidaId('loja') }}>
            ↺ Restaurar cenário
          </button>
        </aside>

        <div className="market-panel">
          <div className="market-header">
            <div>
              <span className="market-label">DECISÃO</span>
              <h3>Escolha um uso para o terreno</h3>
            </div>
            <div className={`market-status ${r.ganhoLiquido > 0 ? 'mint' : r.ganhoLiquido < 0 ? 'coral' : 'blue'}`}>
              <b>
                {r.ganhoLiquido > 0 ? 'Vale a pena' : r.ganhoLiquido < 0 ? 'Havia opção melhor' : 'Apenas empata'}
              </b>
              <span>
                {r.ganhoLiquido > 0
                  ? 'A escolha supera o que foi sacrificado.'
                  : r.ganhoLiquido < 0
                    ? 'A melhor abandonada rendia mais que esta.'
                    : 'O retorno é igual ao da melhor abandonada.'}
              </span>
            </div>
          </div>

          <ul className="alternativas">
            {alternativas.map(alt => {
              const escolhida = alt.id === escolhidaId
              const sacrificada = !escolhida && alt.valor === r.custo
              return (
                <li key={alt.id} className={escolhida ? 'alternativa escolhida' : sacrificada ? 'alternativa sacrificada' : 'alternativa'}>
                  <button onClick={() => setEscolhidaId(alt.id)} aria-pressed={escolhida}>
                    <span className="alt-marca" aria-hidden="true">{escolhida ? '●' : '○'}</span>
                    <span className="alt-uso">{alt.uso}</span>
                    <span className="alt-valor">R$ {alt.valor}</span>
                  </button>
                  <div className="alt-barra"><i style={{ width: `${(alt.valor / VALOR_MAX) * 100}%` }} /></div>
                  {escolhida && <span className="alt-tag">escolhida</span>}
                  {sacrificada && <span className="alt-tag sacrificio">melhor abandonada</span>}
                </li>
              )
            })}
          </ul>

          <div className="metric-row">
            <div>
              <span>RETORNO DA ESCOLHA</span>
              <strong>R$ {num(r.escolhida.valor)}</strong>
            </div>
            <div>
              <span>CUSTO DE OPORTUNIDADE</span>
              <strong>R$ {num(r.custo)}</strong>
            </div>
            <div className="highlight">
              <span>GANHO LÍQUIDO</span>
              <strong>R$ {num(r.ganhoLiquido)}</strong>
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
          <b>Leitura do cenário:</b> Escolhendo {r.escolhida.uso.toLowerCase()}, entram R${' '}
          {num(r.escolhida.valor)} por mês. Mas abre-se mão de R$ {num(r.custo)} da melhor
          alternativa, então o ganho de verdade é R$ {num(r.ganhoLiquido)}.
          {r.ganhoLiquido < 0 && ' O caixa fica positivo, mas a decisão custou essa diferença.'}
          {r.ganhoLiquido === 0 && ' Contabilmente entra dinheiro, mas economicamente é indiferente.'}
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
        <span className="market-label">1.2 · DESAFIO</span>
        <span className="metas-contador">
          {acertos} de {rodada.length}
          {rodadas > 0 && <> · {rodadas} {rodadas === 1 ? 'rodada' : 'rodadas'}</>}
        </span>
      </div>
      <p className="metas-intro">
        Os cenários são sorteados a cada rodada. Dada a alternativa escolhida, diga qual foi o
        custo de oportunidade — lembrando que ele é o valor da melhor abandonada, não a soma
        delas.
      </p>
      <ul className="casos">
        {rodada.map(caso => {
          const certo = custoOportunidade(caso.alternativas, caso.escolhidaId)
          const escolhida = caso.alternativas.find(a => a.id === caso.escolhidaId)
          const resposta = respostas[caso.id]
          const respondeu = resposta !== undefined && resposta !== ''
          const acertou = respondeu && Number(resposta) === certo
          return (
            <li key={caso.id} className={respondeu ? (acertou ? 'caso certo' : 'caso errado') : 'caso'}>
              <p>
                Opções: {caso.alternativas.map(a => `${a.uso} (R$ ${a.valor})`).join('; ')}.
                {' '}Escolheu <b>{escolhida.uso}</b>.
              </p>
              <div className="caso-opcoes">
                <label className="caso-numero">
                  Custo de oportunidade R$
                  <input
                    type="number" value={resposta ?? ''} disabled={acertou}
                    onChange={ev => setRespostas(x => ({ ...x, [caso.id]: ev.target.value }))}
                  />
                </label>
              </div>
              {respondeu && (
                <p className="caso-feedback">
                  {acertou
                    ? `✓ A melhor abandonada rendia R$ ${certo}.`
                    : '✗ Olhe só as alternativas que ficaram de fora e pegue a de maior valor.'}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {completa && (
        <p className="metas-fim">✦ Rodada fechada. Sorteie outra para treinar com cenários novos.</p>
      )}
      <button className="reset ajustar" onClick={onNovaRodada}>↻ Sortear nova rodada</button>
    </div>
  )
}
