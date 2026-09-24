# 3 · Demanda e oferta

Os dois lados do mercado, cada um como função do preço, mantidas constantes as demais
condições (*coeteris paribus*).

## Demanda

Quantidade que os consumidores **desejam adquirir** em certo período. Determinantes:

1. **Preço do próprio bem** — move o ponto *ao longo* da curva
2. **Preço de outros bens** — desloca a curva
3. **Renda do consumidor** — desloca a curva
4. **Gosto e preferências** — desloca a curva

A distinção entre 1 e os demais é a mais confundida do tema e a que os labs precisam deixar
visível: mudança no preço do próprio bem é **movimento ao longo da curva**; qualquer outro
fator **desloca a curva inteira**.

## Por que a demanda desce

**Efeito renda** — preço menor aumenta o poder de compra real: com a mesma renda nominal, o
consumidor leva mais.

**Efeito substituição** — preço maior empurra o consumidor para outro bem que cumpra função
parecida.

## Bens relacionados

**Substitutos** — sobe o preço de A, sobe a demanda de B. Competem entre si (arroz e massa,
manteiga e margarina, trem e avião).

**Complementares** — sobe o preço de A, cai a demanda de B. São consumidos em conjunto
(caneta e tinta, pão e manteiga).

## Demanda e renda

Em regra a relação é **direta**: renda sobe, demanda sobe. São os **bens normais**. Há duas
exceções:

**Bens saciados** — o consumidor já está satisfeito e mais renda não muda o consumo. O caso
clássico é o sal.

**Bens inferiores** — a demanda **cai** quando a renda sobe, porque o consumidor troca por
uma alternativa melhor. Cortes de carne mais baratos são o exemplo usual.

## Oferta

Quantidade que os produtores **desejam vender** em certo período. Depende do preço do bem,
do preço dos demais bens e do **preço dos fatores de produção** (terra, trabalho,
tecnologia). Sobe com o preço: preço maior torna a produção mais atrativa.

## Estado no MicroLab

`labs/substitutos.jsx` cobre o tema em três seções, com laboratório e desafio. Tem sliders de
renda, substituto, complementar e condições de produção, e separa visualmente movimento de
deslocamento.

O desafio sorteia choques de preço sobre pares de bens reais e pede a classificação. Os pares
são curados, não sorteados: a relação entre café e chá é fato do mundo, e sortear produziria
economia falsa. A resposta certa sai dos sinais das duas variações.

Não cobre:

- **bens inferiores e saciados** — o modelo só tem bem normal, com renda ↑ → demanda ↑
- **efeito renda e efeito substituição** nomeados como tais na interface
