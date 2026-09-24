// Gerador dos casos do desafio do tema 3.
//
// Diferente do tema 5, aqui os pares de bens não podem ser sorteados: a relação
// entre café e chá é um fato do mundo, não um número. Sortear produziria
// economia falsa ("café e chá são complementares"). Então os pares são reais e
// curados, e o que se sorteia são os números e a direção do choque.
//
// A resposta certa é **derivada dos sinais**, nunca lida do rótulo do par — e um
// teste confere que as duas coisas sempre coincidem. Se um par for cadastrado
// errado, o teste acusa em vez de ensinar errado ao aluno.

const VARIACOES = [10, 15, 20, 25, 30, 40, 50]

// substituto: consumidores trocam um pelo outro.
// complementar: consumidos juntos, um puxa o outro.
const PARES = [
  { a: 'arroz', b: 'macarrão', relacao: 'substituto' },
  { a: 'manteiga', b: 'margarina', relacao: 'substituto' },
  { a: 'passagem de trem', b: 'passagem de avião', relacao: 'substituto' },
  { a: 'café', b: 'chá', relacao: 'substituto' },
  { a: 'ingresso de cinema', b: 'assinatura de streaming', relacao: 'substituto' },
  { a: 'café', b: 'açúcar', relacao: 'complementar' },
  { a: 'caneta', b: 'tinta', relacao: 'complementar' },
  { a: 'pão', b: 'manteiga', relacao: 'complementar' },
  { a: 'carro', b: 'combustível', relacao: 'complementar' },
  { a: 'açaí', b: 'tapioca', relacao: 'complementar' },
]

export const RELACOES = ['substituto', 'complementar']

const sortear = (lista, rng) => lista[Math.floor(rng() * lista.length)]

export function gerarCaso(relacao, rng = Math.random) {
  const par = sortear(PARES.filter(p => p.relacao === relacao), rng)
  const subiu = rng() < 0.5
  const varPreco = (subiu ? 1 : -1) * sortear(VARIACOES, rng)

  // Substitutos andam no mesmo sentido: A mais caro empurra gente para B.
  // Complementares andam em sentidos opostos: A mais caro derruba o consumo
  // conjunto, e B cai junto.
  const mesmoSentido = relacao === 'substituto'
  const varDemanda = (mesmoSentido ? 1 : -1) * Math.sign(varPreco) * sortear(VARIACOES, rng)

  return { id: `${par.a}-${par.b}-${varPreco}-${varDemanda}`, par, varPreco, varDemanda }
}

export function gerarRodada(rng = Math.random) {
  // Duas de cada, para o aluno não deduzir a resposta pela contagem.
  const casos = [...RELACOES, ...RELACOES].map(relacao => gerarCaso(relacao, rng))
  for (let i = casos.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[casos[i], casos[j]] = [casos[j], casos[i]]
  }
  return casos
}

// O enunciado precisa trazer as DUAS direções. Escondendo a reação da demanda,
// o exercício deixaria de ser resolvível pelos dados e só premiaria quem já
// soubesse o par de cor — o oposto do que o tema ensina.
export function enunciado(caso) {
  const { par, varPreco, varDemanda } = caso
  const verbo = v => (v > 0 ? 'subiu' : 'caiu')
  return `O preço de ${par.a} ${verbo(varPreco)} ${Math.abs(varPreco)}% ` +
    `e a demanda por ${par.b} ${verbo(varDemanda)} ${Math.abs(varDemanda)}%.`
}

// A classificação sai dos sinais, não do rótulo do par.
export function resolver(caso) {
  const mesmoSentido = Math.sign(caso.varPreco) === Math.sign(caso.varDemanda)
  return {
    varPreco: caso.varPreco,
    varDemanda: caso.varDemanda,
    relacao: mesmoSentido ? 'substituto' : 'complementar',
  }
}
