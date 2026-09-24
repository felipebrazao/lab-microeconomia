// Modelo do tema 2 — teoria do consumidor.
//
// Grandezas DISCRETAS, por unidade consumida: não há curva contínua aqui, e é
// por isso que este tema não usa o diagrama dos temas 3 e 4.
//
// Seguindo a simplificação da disciplina, o preço marginal de reserva de cada
// unidade é igual à sua utilidade marginal — o máximo que o consumidor aceitaria
// pagar por aquela unidade, em reais.

export function montarTabela(utilidadesMarginais) {
  let acumulada = 0
  return utilidadesMarginais.map((uMarginal, i) => {
    acumulada += uMarginal
    return { unidade: i + 1, uMarginal, uTotal: acumulada, precoReserva: uMarginal }
  })
}

// A lei da utilidade marginal decrescente. Uma tabela que a viola não está
// errada por acaso — o laboratório avisa em vez de corrigir, porque é
// justamente o que o aluno precisa enxergar.
export function respeitaDecrescente(utilidadesMarginais) {
  return utilidadesMarginais.every((u, i) => i === 0 || u <= utilidadesMarginais[i - 1])
}

// O consumidor compra enquanto o que aceitaria pagar cobre o preço de mercado.
// Parar antes deixaria de comprar algo que vale mais do que custa; passar disso
// seria pagar por algo que vale menos.
export function equilibrioConsumidor(utilidadesMarginais, precoMercado) {
  const linhas = montarTabela(utilidadesMarginais)
  const compradas = linhas.filter(l => l.precoReserva >= precoMercado)

  return {
    linhas,
    quantidade: compradas.length,
    gasto: compradas.length * precoMercado,
    // Diferença entre o que aceitaria pagar e o que de fato paga, somada nas
    // unidades compradas.
    excedente: compradas.reduce((soma, l) => soma + (l.precoReserva - precoMercado), 0),
    utilidadeTotal: compradas.reduce((soma, l) => soma + l.uMarginal, 0),
  }
}

// --- Gerador do desafio -------------------------------------------------
// Sem banco de perguntas: cada rodada sorteia uma tabela nova. Os valores saem
// inteiros por construção, então o excedente também é inteiro e a resposta do
// aluno pode ser comparada exatamente.

const PRIMEIRA = [8, 10, 12, 14, 16, 18, 20]
const PASSO = [1, 2, 3]
const UNIDADES = [4, 5, 6]

const sortear = (lista, rng) => lista[Math.floor(rng() * lista.length)]

export function gerarCaso(rng = Math.random) {
  const n = sortear(UNIDADES, rng)
  const passo = sortear(PASSO, rng)
  // A primeira utilidade precisa ser alta o bastante para a última ainda ser
  // positiva: utilidade marginal zero ou negativa não existe neste modelo, e
  // geraria reservas absurdas ("aceito pagar R$ -2 por esta unidade").
  const minimaPrimeira = (n - 1) * passo + 1
  const primeira = sortear(PRIMEIRA.filter(v => v >= minimaPrimeira), rng)
  const utilidades = Array.from({ length: n }, (_, i) => primeira - i * passo)

  // Preço de mercado igual à reserva de alguma unidade: garante que a fronteira
  // caia exatamente numa linha da tabela, como nos exercícios da disciplina.
  const corte = Math.floor(rng() * n)
  const precoMercado = utilidades[corte]

  return { id: `${primeira}-${passo}-${n}-${precoMercado}`, utilidades, precoMercado }
}

export function gerarRodada(rng = Math.random, quantos = 3) {
  return Array.from({ length: quantos }, () => gerarCaso(rng))
}
