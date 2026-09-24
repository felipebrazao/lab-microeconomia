# 4 · Equilíbrio de mercado

Onde os dois lados se encontram, e o que acontece quando o preço praticado não é o de
equilíbrio.

## O ponto de equilíbrio

O par (Peq, Qeq) em que a quantidade demandada iguala a ofertada. É o único preço em que
ninguém tem motivo para mudar de comportamento: tudo que se quer comprar é exatamente o que
se quer vender.

Convenção de desenho: **preço no eixo vertical, quantidade no horizontal**. A demanda desce,
a oferta sobe, e o cruzamento é o equilíbrio.

## Fora do equilíbrio

**Acima do preço de equilíbrio** — a quantidade ofertada supera a demandada. Há **excesso de
oferta**: sobra produto, e vender exige baixar o preço. Pressão de baixa.

**Abaixo do preço de equilíbrio** — a quantidade demandada supera a ofertada. Há **excesso de
demanda** (escassez): falta produto, e quem não conseguiu comprar aceita pagar mais. Pressão
de alta.

O tamanho da folga entre as duas quantidades mede a intensidade da pressão.

## Choques e novo equilíbrio

Um deslocamento de curva move o ponto de equilíbrio. Os quatro casos:

| Choque | Curva | Efeito no preço | Efeito na quantidade |
|---|---|---|---|
| Oferta aumenta (supersafra, tecnologia) | oferta → direita | cai | sobe |
| Oferta diminui (estiagem, custo maior) | oferta → esquerda | sobe | cai |
| Demanda aumenta (renda, sazonalidade, moda) | demanda → direita | sobe | sobe |
| Demanda diminui (fim de sazonalidade) | demanda → esquerda | cai | cai |

Vale insistir: nos quatro casos **a curva se move**, o ponto não desliza sobre ela. Confundir
os dois é o erro mais comum do tema.

## Estado no MicroLab

`labs/equilibrio.jsx` cobre o tema e é a **referência do formato de módulo**: três seções
numeradas — conceito, laboratório e desafio — com progresso por seção.

O laboratório mostra a folga entre Qd e Qs ao preço praticado, nomeia o caso, indica a direção
da pressão e anima o ajuste até o novo equilíbrio. Curvas deslocadas deixam a posição anterior
tracejada, para o deslocamento ficar visível.

O desafio pede quatro estados verificados no próprio laboratório: equilibrar, provocar excesso,
provocar escassez e encontrar o novo equilíbrio depois de deslocar uma curva. Avalia o que o
aluno fez, não o que lembrou.

Possível evolução: **cenários prontos** para os quatro casos da tabela acima, em vez de o
aluno ter de montar cada um no slider.
