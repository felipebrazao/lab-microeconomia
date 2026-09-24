import { test } from 'node:test'
import assert from 'node:assert/strict'
import { elasticidadePreco, classificarElasticidade, precoChoke } from '../shared/modelo.js'
import { gerarCaso, gerarRodada, resolver, enunciado, TIPOS_SORTEAVEIS } from './casos-elasticidade.js'

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

test('elasticidade sai negativa e cresce em módulo com o preço', () => {
  const barato = elasticidadePreco(12, 14)
  const caro = elasticidadePreco(30, 40)
  assert.ok(barato.valor < 0 && caro.valor < 0, 'preço e quantidade andam em sentidos opostos')
  assert.ok(Math.abs(caro.valor) > Math.abs(barato.valor),
    'na mesma reta de demanda, a parte alta é mais elástica que a baixa')
  assert.equal(classificarElasticidade(barato.valor), 'inelastica')
  assert.equal(classificarElasticidade(caro.valor), 'elastica')
})

test('receita se move conforme a elasticidade — é o que o tema ensina', () => {
  const inelastica = elasticidadePreco(20, 30)
  assert.equal(classificarElasticidade(inelastica.valor), 'inelastica')
  assert.ok(inelastica.receitaPara > inelastica.receitaDe, 'inelástica: subir o preço aumenta a receita')

  const elastica = elasticidadePreco(30, 40)
  assert.equal(classificarElasticidade(elastica.valor), 'elastica')
  assert.ok(elastica.receitaPara < elastica.receitaDe, 'elástica: subir o preço derruba a receita')
})

test('acima do preço de choke a elasticidade não é definida', () => {
  const choke = precoChoke()
  assert.equal(classificarElasticidade(elasticidadePreco(choke + 2, choke + 6).valor), 'indefinida')
  assert.equal(classificarElasticidade(elasticidadePreco(20, 20).valor), 'indefinida')
})

// O gerador substitui o banco de perguntas, então o que antes era revisão
// humana de cada enunciado vira esta verificação.
test('todo caso gerado é válido e do tipo pedido', () => {
  // rng determinístico varrendo a grade inteira, em vez de confiar na sorte
  const passos = 400
  for (const tipo of TIPOS_SORTEAVEIS) {
    for (let i = 0; i < passos; i++) {
      const rng = rngSemente(i + 1)
      const caso = gerarCaso(tipo, rng)
      const r = resolver(caso)

      assert.equal(r.tipo, tipo, `pediu ${tipo} e veio ${r.tipo} (E=${r.valor})`)
      assert.ok(Number.isInteger(caso.precoPara) && caso.precoPara > 0, `preço final inválido: ${caso.precoPara}`)
      assert.ok(Number.isInteger(caso.qPara) && caso.qPara > 0, `quantidade final inválida: ${caso.qPara}`)
      assert.notEqual(caso.precoDe, caso.precoPara, 'sem variação de preço não há o que classificar')
      assert.ok(Math.abs(r.valor) <= 3, `elasticidade fora da faixa didática: ${r.valor}`)
      assert.ok(enunciado(caso).includes(String(caso.qPara)))
    }
  }
})

test('uma rodada traz os três tipos', () => {
  const tipos = gerarRodada().map(c => resolver(c).tipo).sort()
  assert.deepEqual(tipos, ['elastica', 'inelastica', 'unitaria'])
})
