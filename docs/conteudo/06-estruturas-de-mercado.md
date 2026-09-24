# 6 · Estruturas de mercado

Como o **número de participantes** de cada lado e as **barreiras à entrada** determinam quem
tem poder sobre o preço. É o último tema do recorte atual da disciplina.

## O eixo que organiza tudo

Duas perguntas classificam qualquer mercado:

1. Quantos agentes de cada lado — muitos ou poucos, comprando ou vendendo?
2. Dá para entrar e sair livremente?

Quanto menos participantes e maiores as barreiras, mais poder de preço.

## Concorrência perfeita

Compradores e vendedores em número tão grande que **nenhum deles, sozinho, influencia o
preço**. Cada um é tomador de preço.

- elevado número de compradores e vendedores
- produtos homogêneos
- transparência de mercado
- liberdade de entrada e saída
- não rivalidade entre compradores e vendedores

É o caso de referência: o modelo de oferta e demanda dos temas 3 e 4 supõe esta estrutura.

## Monopólio

**Uma única empresa** produz um bem sem substituto próximo e detém toda a oferta.

- oferta concentrada em uma empresa
- ausência de substitutos próximos
- barreiras à entrada de novas empresas

Exemplos típicos: monopólios estatais e legais (licenças, concessões), distribuição de
energia elétrica.

## Monopsônio

O espelho do monopólio, **do lado da compra**: muitas empresas vendedoras e **uma única
compradora**. Quem compra dita o preço. Ocorre em cadeias onde a produção é pulverizada e o
processamento é concentrado.

## Oligopólio

**Poucas empresas vendedoras** diante de muitos compradores, com poder de controlar o preço.
Produtos podem ser homogêneos ou diferenciados, e a entrada é difícil.

**Cartel** — agrupamento de empresas que limita a livre concorrência para fixar preço comum
ou maximizar lucros em conjunto. É ilegal no Brasil: a Lei nº 12.529/2011 trata o abuso de
poder econômico como crime, e o CADE é a autoridade de defesa da concorrência.

Duas formas de concentração aparecem aqui:

- **horizontal** — entre agentes que ofertam produtos substitutos entre si
- **vertical** — entre agentes em etapas diferentes da mesma cadeia produtiva

## Oligopsônio

**Poucas empresas compradoras** e muitas vendedoras. Como no monopsônio, o poder está do lado
da demanda, só que dividido entre alguns.

## Concorrência monopolista

Estrutura **intermediária** entre concorrência perfeita e monopólio:

- muitos compradores e vendedores
- livre entrada e saída
- cada empresa vende produto **diferenciado**, ainda que substituto próximo dos demais

A diferenciação dá a cada empresa alguma margem sobre o próprio preço — daí "monopolista" —,
mas a livre entrada impede que essa margem se sustente indefinidamente.

## Resumo

| Estrutura | Vendedores | Compradores | Entrada | Poder de preço |
|---|---|---|---|---|
| Concorrência perfeita | muitos | muitos | livre | nenhum |
| Concorrência monopolista | muitos | muitos | livre | pequeno, via diferenciação |
| Oligopólio | poucos | muitos | difícil | alto, do lado da venda |
| Monopólio | um | muitos | bloqueada | total, do lado da venda |
| Oligopsônio | muitos | poucos | difícil | alto, do lado da compra |
| Monopsônio | muitos | um | bloqueada | total, do lado da compra |

## Estado no MicroLab

`labs/estruturas.jsx` cobre o tema em três seções.

A manipulação é classificatória, como previsto: o aluno monta a combinação dos três
determinantes — quantos vendem, quantos compram, produto homogêneo ou diferenciado — e a
matriz acende a célula correspondente. Não há gráfico.

Trocar apenas a diferenciação leva de concorrência perfeita a monopolista, que é justamente o
que separa as duas.

**Limite declarado:** concentração simultânea dos dois lados (um ou poucos vendedores *e* um
ou poucos compradores) fica marcada como fora do recorte, sem nome. A ementa trata
concentração de um lado por vez, e inventar rótulo ali ensinaria o que a aula não deu.

O desafio sorteia mercados descritos pelos determinantes, sem citar setores reais — como a
estrutura é sorteada, um setor real não acompanharia e o enunciado afirmaria algo falso.
