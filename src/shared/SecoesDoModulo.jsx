import React from 'react'

// Navegação em seções de um módulo, no formato da Cisco Networking Academy:
// contador de conclusão, barra de progresso e a lista numerada.
//
// Estava copiada nos seis labs — cinco delas byte a byte idênticas. O que varia
// entre módulos é só o rótulo, a lista de seções, quais estão concluídas e o
// contador do desafio; tudo isso entra por prop.
export default function SecoesDoModulo({ rotulo, secoes, ativa, concluidas, contador, onIr }) {
  const feitas = secoes.filter(sec => concluidas[sec.id]).length

  return (
    <nav className="secoes" aria-label="Seções do módulo">
      <div className="secoes-topo">
        <span className="secoes-rotulo">{rotulo}</span>
        <span className="secoes-progresso">{feitas} de {secoes.length} concluídas</span>
      </div>
      <div className="secoes-barra">
        <i style={{ width: `${(feitas / secoes.length) * 100}%` }} />
      </div>
      <ul>
        {secoes.map(sec => (
          <li key={sec.id}>
            <button
              className={`secao-item ${ativa === sec.id ? 'ativa' : ''}`}
              onClick={() => onIr(sec.id)}
              aria-current={ativa === sec.id ? 'step' : undefined}
            >
              <span className={`secao-check ${concluidas[sec.id] ? 'feito' : ''}`} aria-hidden="true">
                {concluidas[sec.id] ? '✓' : '○'}
              </span>
              <span className="secao-num">{sec.numero}</span>
              <span className="secao-titulo">{sec.titulo}</span>
              {sec.id === 'desafio' && contador && (
                <span className="secao-contador">{contador}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
