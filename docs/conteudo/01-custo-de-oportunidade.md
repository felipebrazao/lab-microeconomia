# 1 · Custo de oportunidade

Aula de abertura. Situa a disciplina e introduz a noção que sustenta todo o resto.

## Micro e macroeconomia

**Microeconomia** estuda as unidades individuais — consumidores, famílias, empresas — e como
elas agem e reagem umas sobre as outras: o que se consome, o que se produz, a que preço.

**Macroeconomia** estuda o sistema como um todo, por agregados: renda nacional, nível de
emprego, nível geral de preços, consumo e investimento totais.

A separação é de recorte, não de assunto. O preço de um produto específico subindo é questão
micro; a taxa básica de juros do país é macro.

## Escassez

Recursos são limitados e desejos não. Toda economia precisa decidir o que produzir, como
produzir e para quem — e qualquer escolha implica abrir mão de outra.

## Custo de oportunidade

O custo de uma escolha é **o valor da melhor alternativa abandonada**, não o dinheiro gasto.

Quem usa um terreno próprio para abrir uma loja não tem custo de aluguel na contabilidade,
mas tem custo de oportunidade: o aluguel que receberia se alugasse o terreno a outro. Ignorar
isso faz um negócio parecer lucrativo quando apenas empata com a alternativa.

É o conceito que explica por que "de graça" quase nunca é de graça.

## Estado no MicroLab

`labs/oportunidade.jsx` cobre o tema em três seções.

O laboratório não usa gráfico: o recurso é indivisível e só cabe um uso, então a forma são
barras de alternativas lado a lado, com a melhor abandonada destacada. O aluno ajusta o
retorno de cada uso e escolhe um.

A métrica que carrega o conceito é o **ganho líquido** — retorno da escolha menos o da melhor
abandonada. Negativo significa que havia opção melhor, mesmo com o caixa positivo; zero
significa que a escolha apenas empata com o que se sacrificou.

O desafio sorteia cenários e pede o custo de oportunidade por entrada numérica. Os valores
são sempre distintos: com empate no topo a resposta seria ambígua.
