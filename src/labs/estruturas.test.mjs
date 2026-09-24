import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  classificar, gerarCaso, gerarRodada, enunciado,
  ESTRUTURAS, DETERMINANTES, QUANTIDADES, FORA_DO_RECORTE,
} from './estruturas.js'

function rngSemente(semente) {
  let estado = semente
  return () => {
    estado = (estado * 1664525 + 1013904223) % 4294967296
    return estado / 4294967296
  }
}

test('cada estrutura sai dos seus determinantes', () => {
  for (const [chave, determinantes] of Object.entries(DETERMINANTES)) {
    assert.equal(classificar(determinantes), chave)
    assert.ok(ESTRUTURAS[chave], `${chave} precisa existir no catálogo`)
  }
})

test('perfeita e monopolista só se distinguem pela diferenciação', () => {
  const base = { vendedores: 'muitos', compradores: 'muitos' }
  assert.equal(classificar({ ...base, diferenciado: false }), 'concorrencia-perfeita')
  assert.equal(classificar({ ...base, diferenciado: true }), 'concorrencia-monopolista')
})

test('a diferenciação não muda nada fora de muitos × muitos', () => {
  for (const vendedores of QUANTIDADES) {
    for (const compradores of QUANTIDADES) {
      if (vendedores === 'muitos' && compradores === 'muitos') continue
      assert.equal(
        classificar({ vendedores, compradores, diferenciado: false }),
        classificar({ vendedores, compradores, diferenciado: true }),
        `${vendedores}/${compradores} não deveria depender da diferenciação`,
      )
    }
  }
})

test('concentração dos dois lados fica fora do recorte da disciplina', () => {
  const foraDoRecorte = []
  for (const vendedores of QUANTIDADES) {
    for (const compradores of QUANTIDADES) {
      if (classificar({ vendedores, compradores, diferenciado: false }) === FORA_DO_RECORTE) {
        foraDoRecorte.push(`${vendedores}/${compradores}`)
      }
    }
  }
  // um/um, um/poucos, poucos/um, poucos/poucos
  assert.deepEqual(foraDoRecorte.sort(), ['poucos/poucos', 'poucos/um', 'um/poucos', 'um/um'])
})

// O gerador substitui a revisão humana de cada enunciado: confere que o gabarito
// declarado no caso é o mesmo que a regra de classificação produz.
test('todo caso gerado tem gabarito coerente com a regra', () => {
  for (let i = 0; i < 600; i++) {
    const caso = gerarCaso(rngSemente(i + 1))
    assert.equal(classificar(caso.determinantes), caso.estrutura,
      `gabarito ${caso.estrutura} discorda da regra para ${JSON.stringify(caso.determinantes)}`)
    assert.notEqual(caso.estrutura, FORA_DO_RECORTE, 'caso sem resposta não pode ser perguntado')
    // guarda de concordância: o app é em pt-BR e o enunciado é lido pelo aluno
    const texto = enunciado(caso.determinantes)
    for (const erro of ['poucas compradores', 'muitas compradores', 'uma única empresa vendem',
                        'empresas vende ', 'para uma única empresa']) {
      assert.ok(!texto.includes(erro), `concordância quebrada ("${erro}"): ${texto}`)
    }
    assert.ok(texto.length > 30)
  }
})

test('uma rodada não repete estrutura', () => {
  for (let i = 0; i < 100; i++) {
    const rodada = gerarRodada(rngSemente(i + 1))
    const estruturas = rodada.map(c => c.estrutura)
    assert.equal(new Set(estruturas).size, estruturas.length, `repetiu: ${estruturas}`)
    assert.equal(rodada.length, 4)
    for (const caso of rodada) assert.equal(classificar(caso.determinantes), caso.estrutura)
  }
})
