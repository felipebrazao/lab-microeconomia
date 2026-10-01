// Os quatro casos da aula de equilíbrio, um para cada combinação de curva
// (oferta ou demanda) e sentido (aumenta ou diminui). O lab aplica o choque nas
// curvas do mercado de café: o que se compara é a direção de preço e quantidade,
// que a teoria fixa, e não os números de cada mercado.

// Tamanho do choque, em pontos do slider (−30 a 30). Grande o bastante para o
// deslocamento ficar evidente no gráfico, com folga até o limite do controle.
export const CHOQUE_CENARIO = 25

export const CENARIOS = [
  {
    id: 'soja',
    rotulo: 'Supersafra',
    titulo: 'Supersafra de soja',
    curva: 'oferta',
    sentido: 1,
    preco: 'cai',
    quantidade: 'sobe',
    leitura: 'A colheita recorde desloca a oferta para a direita: o preço cai e a quantidade sobe.',
  },
  {
    id: 'estiagem',
    rotulo: 'Estiagem',
    titulo: 'Estiagem no café',
    curva: 'oferta',
    sentido: -1,
    preco: 'sobe',
    quantidade: 'cai',
    leitura: 'A seca derruba a produção e desloca a oferta para a esquerda: o preço sobe e a quantidade cai.',
  },
  {
    id: 'cirio',
    rotulo: 'Círio',
    titulo: 'Pato antes do Círio',
    curva: 'demanda',
    sentido: 1,
    preco: 'sobe',
    quantidade: 'sobe',
    leitura: 'Às vésperas do Círio, a procura por pato desloca a demanda para a direita: preço e quantidade sobem.',
  },
  {
    id: 'pascoa',
    rotulo: 'Páscoa',
    titulo: 'Ovos de chocolate depois da Páscoa',
    curva: 'demanda',
    sentido: -1,
    preco: 'cai',
    quantidade: 'cai',
    leitura: 'Passada a Páscoa, a procura por ovos de chocolate desloca a demanda para a esquerda: preço e quantidade caem.',
  },
]

// Choques que o cenário põe nos dois sliders. A outra curva volta ao lugar:
// cada caso da aula move uma curva só.
export function choquesDo(cenario) {
  const choque = cenario.sentido * CHOQUE_CENARIO
  return cenario.curva === 'demanda'
    ? { demanda: choque, oferta: 0 }
    : { demanda: 0, oferta: choque }
}
