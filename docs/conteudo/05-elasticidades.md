# 5 · Elasticidades

Quanto uma quantidade **responde** à variação de um preço ou da renda. Demanda e oferta já
dizem a direção; elasticidade dá a intensidade.

## Elasticidade-preço da demanda

Variação percentual da quantidade demandada para cada 1% de variação no preço do bem.

```
E = Var% Qd / Var% P
```

Como preço e quantidade andam em sentidos opostos, o resultado é negativo; é comum trabalhar
com o módulo. Classificação por |E|:

| Faixa | Nome | Leitura |
|---|---|---|
| \|E\| < 1 | demanda **inelástica** | quantidade muda **menos** que o preço |
| \|E\| = 1 | elasticidade **unitária** | mudam na mesma proporção |
| \|E\| > 1 | demanda **elástica** | quantidade muda **mais** que o preço |

**Atenção à notação:** a mesma classificação pode aparecer com sinal (E > −1 para inelástica)
ou em módulo (|E| < 1). São a mesma coisa dita de dois jeitos — qualquer material do lab
precisa fixar uma convenção e não alternar.

## Casos extremos

**Perfeitamente inelástica (E = 0)** — a quantidade não muda, aconteça o que acontecer com o
preço. A curva é uma **reta vertical**.

**Perfeitamente elástica (E → ∞)** — a qualquer preço acima de certo nível a quantidade
demandada é zero; naquele nível, é qualquer valor. A curva é uma **reta horizontal**.

## O que torna a demanda mais elástica

1. **Disponibilidade de substitutos** — mais opções de fuga, mais elástica
2. **Essencialidade** — quanto mais essencial o bem, mais inelástico
3. **Peso no orçamento** — quanto maior a fatia da renda gasta com ele, mais elástico
4. **Horizonte de tempo** — prazos maiores dão tempo de encontrar substitutos, então a
   elasticidade de longo prazo tende a ser maior que a de curto prazo

## Elasticidade e receita total

A relação que mais interessa na prática: baixar o preço compensa?

| Elasticidade | Se o preço **cai** | Se o preço **sobe** |
|---|---|---|
| Elástica (\|E\| > 1) | receita **aumenta** | receita diminui |
| Unitária (\|E\| = 1) | receita **inalterada** | receita inalterada |
| Inelástica (\|E\| < 1) | receita **diminui** | receita aumenta |

## Elasticidade da oferta

```
E = Var% Qs / Var% P
```

Mesma classificação: elástica, unitária, inelástica.

## Elasticidade-renda

```
E = Var% Qd / Var% Renda
```

Positiva para **bens normais**. **Negativa para bens inferiores** — a quantidade cai quando a
renda sobe. É o teste que distingue os dois.

## Elasticidade-cruzada

Resposta da demanda de um bem à variação do preço de **outro**. Positiva para substitutos,
negativa para complementares — a formalização do que o tema 3 introduziu qualitativamente.

## Estado no MicroLab

`labs/elasticidades.jsx` cobre a **elasticidade-preço da demanda**, em três seções.

O laboratório não usa diagrama de Marshall: elasticidade é razão entre duas variações, e a
forma que mostra isso são duas barras a partir de um zero central — a maior manda. O aluno
escolhe dois preços e lê a elasticidade e o efeito sobre a receita.

O cálculo usa **variação percentual simples entre dois pontos** (`Var% Q / Var% P`), que é a
fórmula dos exercícios da disciplina — não a elasticidade-ponto `(dQ/dP)·(P/Q)`. Quem for
evoluir o tema precisa saber disso antes de mexer: as duas dão valores diferentes no mesmo
trecho da curva.

A faixa dos sliders para antes do **preço de choke** (R$ 52), acima do qual a quantidade
demandada é zero e a elasticidade deixa de existir.

O desafio sorteia os casos a cada rodada, sem banco de perguntas, e conta rodadas fechadas
para o aluno poder treinar repetidamente.

O laboratório alterna entre **elasticidade-preço** e **elasticidade-renda** no mesmo par de
barras. A diferença entre as duas está no tratamento do sinal: na de preço ele é ruído, e a
classificação usa o módulo; na de renda **o sinal é a informação** — negativo identifica bem
inferior, e por isso ela tem uma classe a mais.

Na leitura visual, barras no mesmo sentido indicam bem normal; em sentidos opostos, bem
inferior.

O desafio sorteia quatro casos por rodada, dois de cada medida. A opção "bem inferior" só
aparece nos de renda.

**Ainda não cobre:** elasticidade da oferta e elasticidade-cruzada.
