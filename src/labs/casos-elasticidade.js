// Gerador dos casos do desafio do tema 5.
//
// Não há banco de perguntas: cada rodada sorteia números novos, para o aluno
// poder treinar quantas vezes quiser sem decorar respostas.
//
// Os valores saem de grades escolhidas para que toda combinação caia certa por
// construção — preço e quantidade finais sempre inteiros, e a classificação
// sempre exata. Assim não é preciso gerar, conferir e tentar de novo: nenhum
// caso inválido chega ao aluno.

import { variacao, classificarElasticidade } from '../shared/modelo.js'

// Variações percentuais limpas. Múltiplos de 0,1 / 0,2 / 0,25 sobre as grades
// abaixo dão sempre valores inteiros.
const VARIACOES = [-0.5, -0.4, -0.25, -0.2, -0.1, 0.1, 0.2, 0.25, 0.4, 0.5]

// Múltiplos de 20 e de 200: qualquer variação acima os mantém inteiros.
const LIMITE_ELASTICIDADE = 3

const PRECOS = [20, 40, 60, 80, 100]
const QUANTIDADES = [200, 400, 800, 1000, 1200, 2000]

const MERCADOS = [
  { nome: 'passagens aéreas', unidade: 'passagens' },
  { nome: 'assinaturas de streaming', unidade: 'assinaturas' },
  { nome: 'ingressos de cinema', unidade: 'ingressos' },
  { nome: 'pacotes de café', unidade: 'pacotes' },
  { nome: 'consultas particulares', unidade: 'consultas' },
  { nome: 'caixas de um remédio de uso contínuo', unidade: 'caixas' },
]

// Pares (variação de preço, variação de quantidade) com sinais opostos,
// agrupados pela classificação que produzem. Calculado uma vez, no import.
const PARES_POR_TIPO = (() => {
  const grupos = { elastica: [], unitaria: [], inelastica: [] }
  for (const varPreco of VARIACOES) {
    for (const varQuantidade of VARIACOES) {
      if (varPreco * varQuantidade >= 0) continue // preço e quantidade andam em sentidos opostos
      const valor = varQuantidade / varPreco
      // Acima de 3 o caso vira caricatura: a resposta salta aos olhos e deixa
      // de exercitar a comparação entre as duas variações.
      if (Math.abs(valor) > LIMITE_ELASTICIDADE) continue
      const tipo = classificarElasticidade(valor)
      if (grupos[tipo]) grupos[tipo].push({ varPreco, varQuantidade })
    }
  }
  return grupos
})()

export const TIPOS_SORTEAVEIS = Object.keys(PARES_POR_TIPO)

const sortear = (lista, rng) => lista[Math.floor(rng() * lista.length)]

export function gerarCaso(tipo, rng = Math.random) {
  const { varPreco, varQuantidade } = sortear(PARES_POR_TIPO[tipo], rng)
  const precoDe = sortear(PRECOS, rng)
  const qDe = sortear(QUANTIDADES, rng)
  const mercado = sortear(MERCADOS, rng)

  return {
    id: `${tipo}-${precoDe}-${qDe}-${varPreco}-${varQuantidade}`,
    mercado,
    precoDe,
    precoPara: Math.round(precoDe * (1 + varPreco)),
    qDe,
    qPara: Math.round(qDe * (1 + varQuantidade)),
  }
}

// Uma rodada traz os três tipos, em ordem embaralhada — o aluno não consegue
// deduzir a resposta pela posição.
export function gerarRodada(rng = Math.random) {
  const casos = TIPOS_SORTEAVEIS.map(tipo => gerarCaso(tipo, rng))
  for (let i = casos.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[casos[i], casos[j]] = [casos[j], casos[i]]
  }
  return casos
}

export function enunciado(caso) {
  const { mercado, precoDe, precoPara, qDe, qPara } = caso
  return `Um mercado de ${mercado.nome} vendia ${qDe} ${mercado.unidade} a R$ ${precoDe}. ` +
    `O preço passou para R$ ${precoPara} e as vendas foram para ${qPara}.`
}

export function resolver(caso) {
  const varPreco = variacao(caso.precoDe, caso.precoPara)
  const varQuantidade = variacao(caso.qDe, caso.qPara)
  const valor = varQuantidade / varPreco
  return { varPreco, varQuantidade, valor, tipo: classificarElasticidade(valor) }
}
