import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  efeitoDaRenda, equilibrio, demanda, TIPOS_DE_BEM, TIPOS_DE_BEM_IDS,
} from './modelo.js'

test('renda em alta separa os três tipos de bem', () => {
  const alta = 20
  assert.ok(efeitoDaRenda('normal', alta) > 0, 'bem normal ganha demanda')
  assert.equal(efeitoDaRenda('saciado', alta), 0, 'bem saciado não se move')
  assert.ok(efeitoDaRenda('inferior', alta) < 0, 'bem inferior PERDE demanda quando a renda sobe')
})

// O caso que mais ensina: numa recessão o bem inferior ganha demanda, porque o
// consumidor desce de alternativa. Se o sinal for tratado como constante em vez
// de produto, este teste quebra.
test('renda em baixa inverte o efeito, e só o do bem inferior fica positivo', () => {
  const baixa = -20
  assert.ok(efeitoDaRenda('normal', baixa) < 0, 'bem normal perde demanda na recessão')
  assert.equal(efeitoDaRenda('saciado', baixa), 0)
  assert.ok(efeitoDaRenda('inferior', baixa) > 0, 'bem inferior ganha demanda na recessão')
})

test('o tipo do bem move o preço de equilíbrio para lados opostos', () => {
  const base = equilibrio().preco
  const comAlta = tipo => equilibrio(efeitoDaRenda(tipo, 20)).preco

  assert.ok(comAlta('normal') > base, 'demanda maior puxa o preço para cima')
  assert.equal(comAlta('saciado'), base, 'sem deslocamento, o equilíbrio não muda')
  assert.ok(comAlta('inferior') < base, 'demanda menor puxa o preço para baixo')
})

test('o catálogo de tipos está completo e coerente', () => {
  assert.deepEqual(TIPOS_DE_BEM_IDS.sort(), ['inferior', 'normal', 'saciado'])
  for (const id of TIPOS_DE_BEM_IDS) {
    const tipo = TIPOS_DE_BEM[id]
    assert.ok(tipo.rotulo && tipo.resumo, `${id} precisa de rótulo e resumo para a interface`)
    assert.equal(typeof tipo.efeitoRenda, 'number')
  }
  // O módulo do efeito do bem inferior é menor que o do normal: a troca por
  // uma alternativa melhor é parcial, parte do consumo persiste.
  assert.ok(Math.abs(TIPOS_DE_BEM.inferior.efeitoRenda) < TIPOS_DE_BEM.normal.efeitoRenda)
})

test('a demanda nunca fica negativa, qualquer que seja o tipo', () => {
  for (const id of TIPOS_DE_BEM_IDS) {
    for (const renda of [-30, 0, 30]) {
      for (const preco of [8, 30, 64]) {
        assert.ok(demanda(preco, efeitoDaRenda(id, renda)) >= 0, `${id} a R$ ${preco} com renda ${renda}`)
      }
    }
  }
})

