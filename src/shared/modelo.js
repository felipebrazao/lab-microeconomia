// Modelo econômico dos laboratórios.
//
// Mercado único (café) com curvas lineares. Quantidades em mil unidades,
// preços em reais.
//
//   Demanda:  Qd(P) = DEMANDA_A_PRECO_ZERO - SENSIBILIDADE_DEMANDA * P + deslocamento
//   Oferta:   Qs(P) = OFERTA_A_PRECO_ZERO  + SENSIBILIDADE_OFERTA  * P + deslocamento
//
// O deslocamento é somado à QUANTIDADE, não ao preço: ele move a curva inteira
// para a direita (positivo) ou para a esquerda (negativo). Essa é justamente a
// distinção que os laboratórios precisam ensinar — mudar o preço do próprio bem
// move o ponto AO LONGO da curva; qualquer outro fator DESLOCA a curva.

// Quantidade que os consumidores demandariam se o produto fosse de graça.
export const DEMANDA_A_PRECO_ZERO = 104
// Mil unidades que a demanda perde a cada real de aumento no preço.
export const SENSIBILIDADE_DEMANDA = 2
// Produção que chega ao mercado mesmo a preço zero (estoque, contratos firmados).
export const OFERTA_A_PRECO_ZERO = 12
// Mil unidades que a oferta ganha a cada real de aumento no preço.
export const SENSIBILIDADE_OFERTA = 1.7

// Faixa de preços coberta pelos laboratórios.
export const PRECO_MIN = 8
export const PRECO_MAX = 64

// Conversão de um choque percentual (o que o aluno move no slider) para
// deslocamento em mil unidades. Cada ponto percentual de variação na renda
// desloca a demanda em 0,75 mil unidades, e assim por diante.
export const EFEITO_RENDA = 0.75
export const EFEITO_SUBSTITUTO = 0.6
export const EFEITO_COMPLEMENTAR = 0.5
export const EFEITO_PRODUCAO = 0.8

// Quantidade demandada a um dado preço. Nunca negativa: acima do preço de
// choke a demanda é zero, não negativa.
export function demanda(preco, deslocamento = 0) {
  return Math.max(0, DEMANDA_A_PRECO_ZERO - SENSIBILIDADE_DEMANDA * preco + deslocamento)
}

// Quantidade ofertada a um dado preço.
export function oferta(preco, deslocamento = 0) {
  return Math.max(0, OFERTA_A_PRECO_ZERO + SENSIBILIDADE_OFERTA * preco + deslocamento)
}

// Preço e quantidade em que as duas curvas se cruzam.
//
// Igualando Qd = Qs e isolando P:
//   (A - b·P + Δd) = (C + d·P + Δo)  →  P* = (A - C + Δd - Δo) / (b + d)
//
// Vale enquanto P* cair dentro da faixa de preços dos sliders, o que acontece
// para todos os choques que os laboratórios permitem.
export function equilibrio(deslocDemanda = 0, deslocOferta = 0) {
  const preco =
    (DEMANDA_A_PRECO_ZERO - OFERTA_A_PRECO_ZERO + deslocDemanda - deslocOferta) /
    (SENSIBILIDADE_DEMANDA + SENSIBILIDADE_OFERTA)
  return { preco, quantidade: oferta(preco, deslocOferta) }
}

// Abaixo de meia mil unidades de folga o mercado é tratado como ajustado —
// a diferença não é legível no gráfico nem relevante para o que o lab ensina.
export const TOLERANCIA_FOLGA = 0.5

// Retrato completo do mercado a um preço praticado: o que os consumidores
// querem, o que as empresas oferecem, e de que lado está a pressão.
export function situacao(preco, deslocDemanda = 0, deslocOferta = 0) {
  const qd = demanda(preco, deslocDemanda)
  const qs = oferta(preco, deslocOferta)
  // Positivo: falta produto (escassez). Negativo: sobra produto (excesso).
  const folga = qd - qs

  let tipo = 'equilibrio'
  if (folga > TOLERANCIA_FOLGA) tipo = 'escassez'
  else if (folga < -TOLERANCIA_FOLGA) tipo = 'excesso'

  return { qd, qs, folga, tipo, equilibrio: equilibrio(deslocDemanda, deslocOferta) }
}

// Velocidade do ajuste na animação de convergência.
//
// ATENÇÃO: este é um parâmetro de VISUALIZAÇÃO, não de teoria. A teoria diz que
// o preço sobe quando falta produto e cai quando sobra, mas não a que ritmo —
// isso depende do mercado concreto. O valor foi escolhido para a animação ser
// legível: 0,08 × (2 + 1,7) = 0,296, ou seja, cada passo fecha cerca de 30% da
// distância até o equilíbrio, o que converge sem oscilar em torno dele.
// Valores acima de 1 / (b + d) ≈ 0,27 fariam o preço passar do ponto e voltar.
export const VELOCIDADE_AJUSTE = 0.08

// Um passo do ajuste: o preço caminha na direção que a folga indica.
export function proximoPreco(preco, deslocDemanda = 0, deslocOferta = 0) {
  const { folga } = situacao(preco, deslocDemanda, deslocOferta)
  return preco + VELOCIDADE_AJUSTE * folga
}

// Preço a partir do qual ninguém mais compra (preço de choke). Acima dele a
// quantidade demandada é zero e a elasticidade deixa de ser definida — por isso
// o laboratório de elasticidades não deixa o aluno chegar até aqui.
export function precoChoke(deslocamento = 0) {
  return (DEMANDA_A_PRECO_ZERO + deslocamento) / SENSIBILIDADE_DEMANDA
}

// Variação percentual entre dois valores, em pontos percentuais (0,5 = +50%).
export function variacao(de, para) {
  return (para - de) / de
}

// Elasticidade-preço da demanda entre dois pontos: quanto a quantidade responde,
// em %, para cada 1% de variação no preço.
//
//   E = Var% Qd / Var% P
//
// Usa variação percentual simples, como nos exercícios da disciplina — não a
// fórmula do ponto médio. O sinal sai negativo porque preço e quantidade andam
// em sentidos opostos; a classificação olha o módulo.
export function elasticidadePreco(precoDe, precoPara, deslocamento = 0) {
  const qDe = demanda(precoDe, deslocamento)
  const qPara = demanda(precoPara, deslocamento)
  const varPreco = variacao(precoDe, precoPara)
  const varQuantidade = qDe === 0 ? NaN : variacao(qDe, qPara)

  return {
    qDe,
    qPara,
    varPreco,
    varQuantidade,
    valor: varPreco === 0 ? NaN : varQuantidade / varPreco,
    receitaDe: precoDe * qDe,
    receitaPara: precoPara * qPara,
  }
}

// Faixa em torno de 1 tratada como elasticidade unitária. Sem ela o caso
// unitário seria inalcançável na prática: exigiria acertar o valor exato.
export const TOLERANCIA_UNITARIA = 0.05

export function classificarElasticidade(valor) {
  if (!Number.isFinite(valor)) return 'indefinida'
  const modulo = Math.abs(valor)
  if (modulo > 1 + TOLERANCIA_UNITARIA) return 'elastica'
  if (modulo < 1 - TOLERANCIA_UNITARIA) return 'inelastica'
  return 'unitaria'
}
