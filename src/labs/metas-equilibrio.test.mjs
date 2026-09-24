import { test } from 'node:test'
import assert from 'node:assert/strict'
import { METAS, META_FOLGA } from './metas-equilibrio.js'
import { situacao, equilibrio, EFEITO_RENDA } from '../shared/modelo.js'

const meta = id => METAS.find(m => m.id === id)

test('equilibrar só passa no preço de equilíbrio', () => {
  const eq = equilibrio()
  assert.ok(meta('equilibrar').ok(situacao(eq.preco)))
  assert.ok(!meta('equilibrar').ok(situacao(eq.preco + 5)))
})

test('excesso e escassez exigem o tamanho pedido e não se confundem', () => {
  const caro = situacao(60)    // acima do equilíbrio → sobra produto
  const barato = situacao(10)  // abaixo → falta produto

  assert.ok(meta('excesso').ok(caro), 'preço alto deveria gerar excesso')
  assert.ok(!meta('escassez').ok(caro))
  assert.ok(meta('escassez').ok(barato), 'preço baixo deveria gerar escassez')
  assert.ok(!meta('excesso').ok(barato))

  // logo abaixo do limiar não vale
  const eq = equilibrio()
  const quase = situacao(eq.preco + (META_FOLGA - 1) / 3.7)
  assert.ok(!meta('excesso').ok(quase))
})

test('choque exige deslocar a curva, não só equilibrar', () => {
  const desloc = 20 * EFEITO_RENDA
  const m = situacao(equilibrio(desloc).preco, desloc)
  assert.ok(meta('choque').ok(m, true))
  assert.ok(!meta('choque').ok(m, false), 'equilibrar sem choque não cumpre a meta')
})
