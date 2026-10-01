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

## Trade-off na produção

Na produção, custo de oportunidade é o **sacrifício do que se deixou de produzir** ao
transferir recursos de uma atividade para outra. Por isso ele se mede, naturalmente, em
**unidades do outro bem**: se os recursos de um produtor rendem 60 sacas de café ou 120 de
cacau, cada saca de café custa 2 de cacau.

## Fronteira de possibilidades de produção

As combinações que um produtor consegue obter com os recursos que tem formam a **fronteira de
possibilidades de produção**. Com custo constante, é uma reta entre os dois máximos, e a
inclinação é o custo de oportunidade.

## Troca

Dois produtores com fronteiras diferentes têm custos de oportunidade diferentes para o mesmo
bem. A troca compensa para os dois quando a taxa combinada fica **entre** os dois custos: quem
vende recebe mais do que o bem lhe custa, e quem compra paga menos do que custaria produzi-lo.

## Estado no MicroLab

`labs/oportunidade.jsx` cobre o tema em três seções.

O conceito (1.0) traz o trade-off na produção, a fronteira de possibilidades de produção e a
troca como **texto e figura estática**: duas fronteiras na mesma figura, de produtores com custos
diferentes. Laboratório e desafio continuam no exemplo do terreno.

O laboratório não usa gráfico: o recurso é indivisível e só cabe um uso, então a forma são
barras de alternativas lado a lado, com a melhor abandonada destacada. O aluno ajusta o
retorno de cada uso e escolhe um.

A métrica que carrega o conceito é o **ganho líquido** — retorno da escolha menos o da melhor
abandonada. Negativo significa que havia opção melhor, mesmo com o caixa positivo; zero
significa que a escolha apenas empata com o que se sacrificou.

O desafio sorteia cenários e pede o custo de oportunidade por entrada numérica. Os valores
são sempre distintos: com empate no topo a resposta seria ambígua.
