import React, { useEffect, useState } from 'react'
import { usePersistido } from '../shared/persistencia.js'
import {
  classificar, gerarRodada, enunciado,
  ESTRUTURAS, QUANTIDADES, FORA_DO_RECORTE,
} from './estruturas.js'

const SECOES = [
  { id: 'conceito', numero: '6.0', titulo: 'Conceito' },
  { id: 'laboratorio', numero: '6.1', titulo: 'Laboratório' },
  { id: 'desafio', numero: '6.2', titulo: 'Desafio' },
]

const ROTULO = { um: 'Um', poucos: 'Poucos', muitos: 'Muitos' }
const OPCOES = Object.keys(ESTRUTURAS)

export default function LabEstruturas({ abrirDesafio = 0 }) {
  const [vendedores, setVendedores] = useState('muitos')
  const [compradores, setCompradores] = useState('muitos')
  const [diferenciado, setDiferenciado] = useState(false)
  const [secao, setSecao] = useState('conceito')
  const [conceitoLido, setConceitoLido] = usePersistido('microlab:estruturas:conceito', false)
  const [labVisitado, setLabVisitado] = usePersistido('microlab:estruturas:lab', false)
  const [rodadas, setRodadas] = usePersistido('microlab:estruturas:rodadas', 0)
  const [rodada, setRodada] = useState(() => gerarRodada())
  const [respostas, setRespostas] = useState({})

  const chave = classificar({ vendedores, compradores, diferenciado })
  const estrutura = ESTRUTURAS[chave]

  const acertos = rodada.filter(caso => respostas[caso.id] === caso.estrutura).length
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
        <span className="secoes-rotulo">MÓDULO 06 · ESTRUTURAS DE MERCADO</span>
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
        <p className="eyebrow">6.0 · CONCEITO</p>
        <h3>Quem tem poder sobre o preço, e por quê</h3>
        <p>
          Duas perguntas classificam qualquer mercado: <b>quantos agentes</b> há de cada lado, e
          se <b>dá para entrar e sair</b> livremente. Quanto menos participantes e maiores as
          barreiras, mais poder sobre o preço.
        </p>
        <p>
          Concentração do lado da <b>venda</b> dá monopólio (um) e oligopólio (poucos). Do lado da
          <b> compra</b>, monopsônio e oligopsônio — o espelho, em que quem compra dita o preço.
        </p>
        <p>
          Com muitos dos dois lados, o que separa <b>concorrência perfeita</b> de <b>concorrência
          monopolista</b> é só o produto: idêntico numa, diferenciado na outra. É essa
          diferenciação que dá à empresa alguma margem sobre o próprio preço — margem que a livre
          entrada depois corrói.
        </p>
        <button className="button primary" onClick={() => { setConceitoLido(true); irPara('laboratorio') }}>
          {conceitoLido ? 'Reler e ir ao laboratório' : 'Entendi, ir ao laboratório'} <span>→</span>
        </button>
      </div>
    )}

    <div className={secao === 'conceito' ? 'secao oculto' : 'secao'}>
      <div className="lab-shell">
        <aside className="controls-panel">
          <div className="panel-title"><span className="pulse"></span> COMO É ESTE MERCADO</div>
          <p className="tabela-ajuda">
            Monte a combinação e veja que estrutura ela produz. Nem toda combinação tem nome
            dentro do recorte da disciplina.
          </p>

          <div className="escolha-grupo">
            <span className="escolha-rotulo">Quantos vendem</span>
            <div className="escolha-botoes">
              {QUANTIDADES.map(q => (
                <button key={q} className={vendedores === q ? 'escolha ativa' : 'escolha'}
                        onClick={() => setVendedores(q)} aria-pressed={vendedores === q}>
                  {ROTULO[q]}
                </button>
              ))}
            </div>
          </div>

          <div className="escolha-grupo">
            <span className="escolha-rotulo">Quantos compram</span>
            <div className="escolha-botoes">
              {QUANTIDADES.map(q => (
                <button key={q} className={compradores === q ? 'escolha ativa' : 'escolha'}
                        onClick={() => setCompradores(q)} aria-pressed={compradores === q}>
                  {ROTULO[q]}
                </button>
              ))}
            </div>
          </div>

          <div className="escolha-grupo">
            <span className="escolha-rotulo">Produto</span>
            <div className="escolha-botoes">
              <button className={!diferenciado ? 'escolha ativa' : 'escolha'}
                      onClick={() => setDiferenciado(false)} aria-pressed={!diferenciado}>Idêntico</button>
              <button className={diferenciado ? 'escolha ativa' : 'escolha'}
                      onClick={() => setDiferenciado(true)} aria-pressed={diferenciado}>Diferenciado</button>
            </div>
            <small>Só muda a estrutura quando há muitos dos dois lados.</small>
          </div>

          <button className="reset" onClick={() => { setVendedores('muitos'); setCompradores('muitos'); setDiferenciado(false) }}>
            ↺ Restaurar cenário
          </button>
        </aside>

        <div className="market-panel">
          <div className="market-header">
            <div>
              <span className="market-label">CLASSIFICAÇÃO</span>
              <h3>{estrutura ? estrutura.nome : 'Fora do recorte'}</h3>
            </div>
            <div className={`market-status ${estrutura ? 'mint' : 'blue'}`}>
              <b>{estrutura ? 'Poder sobre o preço' : 'Sem nome nesta disciplina'}</b>
              <span>
                {estrutura
                  ? estrutura.poder
                  : 'Concentração dos dois lados ao mesmo tempo não é tratada na ementa.'}
              </span>
            </div>
          </div>

          <table className="matriz">
            <caption>Vendedores nas linhas, compradores nas colunas</caption>
            <thead>
              <tr>
                <th></th>
                {QUANTIDADES.map(c => <th key={c}>{ROTULO[c]} compram</th>)}
              </tr>
            </thead>
            <tbody>
              {QUANTIDADES.map(v => (
                <tr key={v}>
                  <th>{ROTULO[v]} vendem</th>
                  {QUANTIDADES.map(c => {
                    const k = classificar({ vendedores: v, compradores: c, diferenciado })
                    const aqui = v === vendedores && c === compradores
                    return (
                      <td key={c} className={`${aqui ? 'aqui' : ''} ${k === FORA_DO_RECORTE ? 'vazia' : ''}`}>
                        {ESTRUTURAS[k]?.nome ?? '—'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {estrutura && (
            <ul className="tracos">
              {estrutura.tracos.map(t => <li key={t}>{t}</li>)}
            </ul>
          )}
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
          {estrutura
            ? `${ROTULO[vendedores].toLowerCase()} vendendo para ${ROTULO[compradores].toLowerCase()} compradores${vendedores === 'muitos' && compradores === 'muitos' ? (diferenciado ? ', com produto diferenciado,' : ', com produto idêntico,') : ''} configura ${estrutura.nome.toLowerCase()}. ${estrutura.poder}`
            : 'Concentração simultânea dos dois lados foge do recorte da disciplina — a ementa trata concentração de um lado por vez. Mova um dos controles para "muitos".'}
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
        <span className="market-label">6.2 · DESAFIO</span>
        <span className="metas-contador">
          {acertos} de {rodada.length}
          {rodadas > 0 && <> · {rodadas} {rodadas === 1 ? 'rodada' : 'rodadas'}</>}
        </span>
      </div>
      <p className="metas-intro">
        Os mercados são descritos pelos determinantes, não por setores reais. Leia quantos há de
        cada lado e como é a entrada, e diga que estrutura é.
      </p>
      <ul className="casos">
        {rodada.map(caso => {
          const escolha = respostas[caso.id]
          const acertou = escolha === caso.estrutura
          return (
            <li key={caso.id} className={escolha ? (acertou ? 'caso certo' : 'caso errado') : 'caso'}>
              <p>{enunciado(caso.determinantes)}</p>
              <div className="caso-opcoes">
                {OPCOES.map(op => (
                  <button
                    key={op}
                    className={`caso-op ${escolha === op ? 'escolhida' : ''}`}
                    onClick={() => setRespostas(r => ({ ...r, [caso.id]: op }))}
                    disabled={acertou}
                  >
                    {ESTRUTURAS[op].nome}
                  </button>
                ))}
              </div>
              {escolha && (
                <p className="caso-feedback">
                  {acertou
                    ? `✓ ${ESTRUTURAS[caso.estrutura].nome}: ${ESTRUTURAS[caso.estrutura].poder}`
                    : '✗ Conte quantos há de cada lado antes de olhar a entrada — é a contagem que decide primeiro.'}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {completa && (
        <p className="metas-fim">✦ Rodada fechada. Sorteie outra para treinar com outras estruturas.</p>
      )}
      <button className="reset ajustar" onClick={onNovaRodada}>↻ Sortear nova rodada</button>
    </div>
  )
}
