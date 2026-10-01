import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CENARIOS, choquesDo } from './cenarios-equilibrio.js'
import { equilibrio, EFEITO_RENDA, EFEITO_PRODUCAO } from '../shared/modelo.js'

const sentido = (antes, depois) => (depois > antes ? 'sobe' : 'cai')

test('cada cenário move preço e quantidade na direção que o texto anuncia', () => {
  const base = equilibrio()
  for (const c of CENARIOS) {
    const { demanda, oferta } = choquesDo(c)
    const novo = equilibrio(demanda * EFEITO_RENDA, oferta * EFEITO_PRODUCAO)
    assert.equal(sentido(base.preco, novo.preco), c.preco, `${c.id}: preço`)
    assert.equal(sentido(base.quantidade, novo.quantidade), c.quantidade, `${c.id}: quantidade`)
  }
})

test('os quatro cenários cobrem os quatro casos, movendo uma curva só', () => {
  const casos = CENARIOS.map(c => `${c.curva}${c.sentido}`)
  assert.equal(new Set(casos).size, 4)
  for (const c of CENARIOS) {
    const { demanda, oferta } = choquesDo(c)
    assert.ok((demanda === 0) !== (oferta === 0), `${c.id} deveria mover uma curva só`)
  }
})
