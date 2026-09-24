// Modelo do tema 6 — estruturas de mercado.
//
// Aqui não há curva nem otimização: a manipulação é CLASSIFICATÓRIA. O que
// define a estrutura é a combinação de três determinantes — quantos vendem,
// quantos compram, e se o produto é homogêneo ou diferenciado.
//
// Concorrência perfeita e monopolista têm a mesma contagem dos dois lados; o
// que as separa é só a diferenciação do produto.

export const QUANTIDADES = ['um', 'poucos', 'muitos']

export const ESTRUTURAS = {
  'concorrencia-perfeita': {
    nome: 'Concorrência perfeita',
    poder: 'Nenhum: cada um é tomador de preço.',
    tracos: ['muitos de cada lado', 'produtos homogêneos', 'entrada e saída livres', 'transparência de mercado'],
  },
  'concorrencia-monopolista': {
    nome: 'Concorrência monopolista',
    poder: 'Pequeno, vindo da diferenciação — e limitado pela livre entrada.',
    tracos: ['muitos de cada lado', 'produto diferenciado', 'entrada e saída livres'],
  },
  oligopolio: {
    nome: 'Oligopólio',
    poder: 'Alto, do lado da venda.',
    tracos: ['poucos vendedores', 'muitos compradores', 'entrada difícil', 'risco de cartel'],
  },
  monopolio: {
    nome: 'Monopólio',
    poder: 'Total, do lado da venda.',
    tracos: ['um único vendedor', 'sem substitutos próximos', 'entrada bloqueada'],
  },
  oligopsonio: {
    nome: 'Oligopsônio',
    poder: 'Alto, do lado da compra.',
    tracos: ['muitos vendedores', 'poucos compradores', 'quem compra influencia o preço'],
  },
  monopsonio: {
    nome: 'Monopsônio',
    poder: 'Total, do lado da compra.',
    tracos: ['muitos vendedores', 'um único comprador', 'quem compra dita o preço'],
  },
}

// Combinações que a disciplina não cobre — concentração dos DOIS lados ao mesmo
// tempo. Em vez de inventar um nome, o laboratório diz que está fora do recorte:
// melhor admitir o limite do modelo do que ensinar rótulo que a aula não deu.
export const FORA_DO_RECORTE = 'fora-do-recorte'

export function classificar({ vendedores, compradores, diferenciado }) {
  if (vendedores === 'muitos' && compradores === 'muitos') {
    return diferenciado ? 'concorrencia-monopolista' : 'concorrencia-perfeita'
  }
  if (compradores === 'muitos') {
    if (vendedores === 'um') return 'monopolio'
    if (vendedores === 'poucos') return 'oligopolio'
  }
  if (vendedores === 'muitos') {
    if (compradores === 'um') return 'monopsonio'
    if (compradores === 'poucos') return 'oligopsonio'
  }
  return FORA_DO_RECORTE
}

// --- Gerador do desafio -------------------------------------------------
// Descrições montadas a partir dos próprios determinantes, sem citar setores
// reais: dizer "mercado de energia com muitos vendedores" seria economia falsa,
// porque a estrutura é sorteada e o setor não acompanharia.

const CLASSIFICAVEIS = Object.keys(ESTRUTURAS)

// Determinantes que produzem cada estrutura. Percorrido para gerar casos, e
// conferido contra `classificar` no teste — se os dois discordarem, o teste
// acusa em vez de o aluno receber um caso com gabarito errado.
export const DETERMINANTES = {
  'concorrencia-perfeita': { vendedores: 'muitos', compradores: 'muitos', diferenciado: false },
  'concorrencia-monopolista': { vendedores: 'muitos', compradores: 'muitos', diferenciado: true },
  oligopolio: { vendedores: 'poucos', compradores: 'muitos', diferenciado: false },
  monopolio: { vendedores: 'um', compradores: 'muitos', diferenciado: false },
  oligopsonio: { vendedores: 'muitos', compradores: 'poucos', diferenciado: false },
  monopsonio: { vendedores: 'muitos', compradores: 'um', diferenciado: false },
}

// Cada lado tem sua própria redação, com verbo e gênero já concordados. Derivar
// um do outro por substituição de palavra produzia "poucas compradores" e
// "uma única empresa vendem".
const VENDEM = {
  um: 'uma única empresa vende',
  poucos: 'poucas empresas vendem',
  muitos: 'muitas empresas vendem',
}

const COMPRAM = {
  um: 'um único comprador',
  poucos: 'poucos compradores',
  muitos: 'muitos compradores',
}

export function enunciado({ vendedores, compradores, diferenciado }) {
  const entrada = vendedores === 'muitos' ? 'a entrada de novos concorrentes é livre'
    : vendedores === 'poucos' ? 'entrar neste mercado é difícil'
    : 'há barreiras que impedem a entrada de novas empresas'
  const produto = vendedores === 'muitos' && compradores === 'muitos'
    ? (diferenciado ? ', cada uma com um produto diferenciado,' : ', todas com produtos idênticos,')
    : ''
  return `Neste mercado, ${VENDEM[vendedores]}${produto} para ${COMPRAM[compradores]}, e ${entrada}.`
}

const sortear = (lista, rng) => lista[Math.floor(rng() * lista.length)]

export function gerarCaso(rng = Math.random) {
  const estrutura = sortear(CLASSIFICAVEIS, rng)
  const determinantes = DETERMINANTES[estrutura]
  return { id: `${estrutura}-${rng().toFixed(6)}`, determinantes, estrutura }
}

// Uma rodada não repete estrutura: repetir daria a resposta pela eliminação.
export function gerarRodada(rng = Math.random, quantos = 4) {
  const restantes = [...CLASSIFICAVEIS]
  return Array.from({ length: Math.min(quantos, restantes.length) }, () => {
    const i = Math.floor(rng() * restantes.length)
    const estrutura = restantes.splice(i, 1)[0]
    return { id: `${estrutura}-${i}-${restantes.length}`, determinantes: DETERMINANTES[estrutura], estrutura }
  })
}
