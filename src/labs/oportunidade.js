// Modelo do tema 1 — custo de oportunidade.
//
// Não há curva nem equilíbrio aqui: o tema é decisão sob restrição. O recurso é
// indivisível (um sábado, um terreno, uma quantia) e só pode ir para um uso.
//
// O custo de uma escolha é o valor da MELHOR alternativa abandonada. O ganho
// líquido é o que sobra depois de descontá-lo — e é ele que revela quando uma
// escolha aparentemente lucrativa apenas empata com o que se deixou de lado.

export function custoOportunidade(alternativas, escolhidaId) {
  const abandonadas = alternativas.filter(a => a.id !== escolhidaId)
  // Sem alternativa abandonada não há o que sacrificar: o custo é zero.
  return abandonadas.length === 0 ? 0 : Math.max(...abandonadas.map(a => a.valor))
}

export function avaliar(alternativas, escolhidaId) {
  const escolhida = alternativas.find(a => a.id === escolhidaId)
  if (!escolhida) return null

  const custo = custoOportunidade(alternativas, escolhidaId)
  const melhorValor = Math.max(...alternativas.map(a => a.valor))

  return {
    escolhida,
    custo,
    // Positivo: a escolha supera o que foi sacrificado. Zero: apenas empata.
    // Negativo: havia opção melhor, e escolher esta custou a diferença.
    ganhoLiquido: escolhida.valor - custo,
    ehMelhor: escolhida.valor === melhorValor,
  }
}

// --- Gerador do desafio -------------------------------------------------
// Sem banco de perguntas: cada rodada sorteia usos e valores novos.

const USOS = [
  'trabalhar como freelancer no sábado',
  'alugar o terreno para um vizinho',
  'fazer um curso de extensão',
  'abrir uma barraca na feira',
  'aplicar o dinheiro na poupança',
  'revender mercadoria no fim de semana',
  'dar aulas particulares',
  'arrendar a área para plantio',
]

const VALORES = [80, 120, 150, 200, 240, 300, 360, 420, 500]

const sortear = (lista, rng) => lista[Math.floor(rng() * lista.length)]

// Sorteia `quantos` itens distintos de uma lista.
function sortearDistintos(lista, quantos, rng) {
  const restantes = [...lista]
  return Array.from({ length: quantos }, () => {
    const i = Math.floor(rng() * restantes.length)
    return restantes.splice(i, 1)[0]
  })
}

export function gerarCaso(rng = Math.random) {
  const quantas = 3 + Math.floor(rng() * 2) // 3 ou 4 alternativas
  const usos = sortearDistintos(USOS, quantas, rng)
  // Valores distintos: com empate no topo, "a melhor abandonada" teria duas
  // respostas igualmente defensáveis e o exercício ficaria ambíguo.
  const valores = sortearDistintos(VALORES, quantas, rng)

  const alternativas = usos.map((uso, i) => ({ id: `alt-${i}`, uso, valor: valores[i] }))
  const escolhida = sortear(alternativas, rng)

  return { id: `${valores.join('-')}-${escolhida.id}`, alternativas, escolhidaId: escolhida.id }
}

export function gerarRodada(rng = Math.random, quantos = 3) {
  return Array.from({ length: quantos }, () => gerarCaso(rng))
}
