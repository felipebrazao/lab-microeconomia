import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  montarTabela, respeitaDecrescente, equilibrioConsumidor, gerarCaso, gerarRodada,
} from './utilidade.js'

// Gerador pseudoaleatório determinístico. Um rng CONSTANTE faria `sortear`
// escolher sempre o mesmo índice em todas as listas, testando só a diagonal da
// grade — foi assim que um caso inválido passou despercebido antes.
function rngSemente(semente) {
  let estado = semente
  return () => {
    estado = (estado * 1664525 + 1013904223) % 4294967296
    return estado / 4294967296
  }
}

// Âncoras: os dois exemplos trabalhados em aula. Se o modelo divergir deles,
// o laboratório passa a ensinar diferente do quadro.
test('reproduz os exemplos da disciplina', () => {
  const a = equilibrioConsumidor([5, 4, 3, 2, 1], 2)
  assert.equal(a.quantidade, 4)
  assert.equal(a.excedente, 6)   // (5-2)+(4-2)+(3-2)+(2-2)

  const b = equilibrioConsumidor([18, 17, 16, 15, 14], 17)
  assert.equal(b.quantidade, 2)
  assert.equal(b.excedente, 1)   // (18-17)+(17-17)
})

test('utilidade total acumula a marginal', () => {
  const linhas = montarTabela([5, 4, 3])
  assert.deepEqual(linhas.map(l => l.uTotal), [5, 9, 12])
  assert.deepEqual(linhas.map(l => l.precoReserva), [5, 4, 3])
})

test('detecta violação da lei da utilidade marginal decrescente', () => {
  assert.ok(respeitaDecrescente([5, 4, 4, 2]))
  assert.ok(!respeitaDecrescente([5, 4, 6, 2]))
})

test('preço acima de toda reserva zera a compra', () => {
  const e = equilibrioConsumidor([5, 4, 3], 9)
  assert.equal(e.quantidade, 0)
  assert.equal(e.excedente, 0)
  assert.equal(e.gasto, 0)
})

// O gerador substitui a revisão humana de cada enunciado.
test('todo caso gerado é resolvível e dá excedente inteiro', () => {
  for (let i = 0; i < 600; i++) {
    const rng = rngSemente(i + 1)
    const caso = gerarCaso(rng)
    const e = equilibrioConsumidor(caso.utilidades, caso.precoMercado)

    assert.ok(respeitaDecrescente(caso.utilidades), `tabela não decrescente: ${caso.utilidades}`)
    assert.ok(caso.utilidades.every(u => Number.isInteger(u) && u > 0), `utilidade inválida: ${caso.utilidades}`)
    assert.ok(Number.isInteger(e.excedente) && e.excedente >= 0, `excedente não inteiro: ${e.excedente}`)
    assert.ok(e.quantidade >= 1, 'o consumidor precisa comprar ao menos uma unidade')
    assert.ok(e.quantidade <= caso.utilidades.length)
  }
})

test('uma rodada traz três casos', () => {
  assert.equal(gerarRodada().length, 3)
})
