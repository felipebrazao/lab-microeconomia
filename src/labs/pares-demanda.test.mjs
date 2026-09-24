import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gerarCaso, gerarRodada, resolver, enunciado, RELACOES } from './pares-demanda.js'

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

// Rede de segurança do cadastro: se um par estiver com a relação errada, a
// resposta derivada dos sinais deixa de bater com a pedida e o teste acusa.
test('todo caso gerado confere com a relação pedida', () => {
  for (const relacao of RELACOES) {
    for (let i = 0; i < 500; i++) {
      const rng = rngSemente(i + 1)
      const caso = gerarCaso(relacao, rng)
      const r = resolver(caso)

      assert.equal(r.relacao, relacao, `pediu ${relacao} e os sinais dizem ${r.relacao}`)
      assert.notEqual(caso.varPreco, 0, 'sem variação de preço não há reação a classificar')
      assert.notEqual(caso.varDemanda, 0, 'sem reação da demanda não dá para classificar')
      // o enunciado tem de ser resolvível sozinho: as duas direções precisam estar nele
      const texto = enunciado(caso)
      assert.ok(texto.includes(caso.par.a) && texto.includes(caso.par.b))
      assert.ok(texto.includes(`${Math.abs(caso.varPreco)}%`), 'falta a variação do preço')
      assert.ok(texto.includes(`${Math.abs(caso.varDemanda)}%`), 'falta a reação da demanda')
    }
  }
})

test('substitutos andam no mesmo sentido; complementares, em sentidos opostos', () => {
  const rng = () => 0.3
  const sub = resolver(gerarCaso('substituto', rng))
  assert.equal(Math.sign(sub.varPreco), Math.sign(sub.varDemanda))

  const comp = resolver(gerarCaso('complementar', rng))
  assert.notEqual(Math.sign(comp.varPreco), Math.sign(comp.varDemanda))
})

test('uma rodada traz duas de cada relação', () => {
  const contagem = gerarRodada().map(c => resolver(c).relacao)
  assert.equal(contagem.filter(r => r === 'substituto').length, 2)
  assert.equal(contagem.filter(r => r === 'complementar').length, 2)
})
