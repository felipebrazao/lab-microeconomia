# TODO — MicroLab

Fonte única de pendências abertas do projeto. O `CLAUDE.md` guarda convenções e o
histórico do que já foi resolvido; o que ainda falta fazer mora aqui.

Cada item traz contexto suficiente para ser executado sem precisar do histórico de
conversa que o originou.

---

## Conteúdo

### Cobrir bens inferiores e saciados
`docs/conteudo/03-demanda-e-oferta.md` registra a lacuna: o modelo em `shared/modelo.js` só
tem bem normal (renda ↑ → demanda ↑). A ementa trata as duas exceções — bens saciados, em que
mais renda não muda o consumo, e bens inferiores, em que a demanda **cai** quando a renda
sobe.

É também pré-requisito do tema 5: a elasticidade-renda negativa é justamente o que define bem
inferior, e sem modelar o caso o lab de elasticidades não consegue mostrá-lo.

### Cenários prontos de choque no lab de equilíbrio
`docs/conteudo/04-equilibrio-de-mercado.md` lista os quatro casos (oferta/demanda × aumenta/
diminui). Hoje o aluno monta cada um no slider; botões de cenário deixariam a comparação
entre os quatro imediata.

### Lab de teoria do consumidor (tema 2)
Utilidade marginal decrescente → preço marginal de reserva → equilíbrio do consumidor →
excedente do consumidor. Segundo `docs/conteudo/02-teoria-do-consumidor.md`, é o tema que
melhor se encaixa no formato de sliders depois de elasticidades — e explica *de onde vem* a
curva de demanda que os outros labs usam pronta.

### Formato para custo de oportunidade (tema 1) e estruturas de mercado (tema 6)
Nenhum dos dois é diagrama de Marshall. Custo de oportunidade é decisão sob restrição;
estruturas de mercado é classificação. Decidir o formato antes de codar qualquer coisa — ver
as notas dos dois temas em `docs/conteudo/`.

### Estreitar o lab de demanda e oferta ao seu tema
`src/labs/substitutos.jsx` já é módulo próprio, mas segue sendo o lab completo de
oferta e demanda: o recorte de substitutos e complementares divide espaço com renda e
condições de produção. Com o lab de equilíbrio cobrindo aquele tema, a sobreposição ficou
redundante.

Decidir o que sai dele e o que fica é decisão de conteúdo didático — combinar antes.

---

## UI e layout

### Rótulo dos cards de conceito sobrepõe o parágrafo
**Pré-existente**, presente desde o commit inicial `b18feeb`. Não introduzido pela
migração para `labs/` + `shared/`.

`.concept-card small` é `position: absolute; bottom: 24px`, ou seja, fora do fluxo: não
empurra nada e nada o empurra. A altura do card vem de `min-height` fixo, não do
conteúdo. O espaço entre o fim do parágrafo e o rótulo é, portanto, um resíduo — o que
sobra de uma altura fixa menos um texto que cresce livre. Quando o texto cresce o
bastante, o resíduo fica negativo e um passa por cima do outro.

Folga medida entre o fim do `<p>` e o topo do `<small>`:

| Viewport | Colunas | Card | `min-height` | Linhas | Folga |
|---|---|---|---|---|---|
| 1265 | 4 | 238px | 294px | 5 | +7px |
| 785 | 2 | 335px | 294px | 3 | +50px |
| 575 | 2 | 246px | 294px | 4 | +29px |
| 546 | 1 | 468px | 240px | 2 | +18px |
| 450 | 1 | 386px | 240px | 3 | **−4px** |
| 375 | 1 | 321px | 240px | 3–4 | **−4 a −12px** |

Dois pontos:

1. Abaixo de 560px o `min-height` cai de 294px para 240px, mas o conteúdo não encolhe
   junto. O que sobra comporta exatamente **duas** linhas de parágrafo — da terceira em
   diante, sobrepõe.
2. No desktop a folga é de **7px**. Não está quebrado, mas está a 7 pixels de quebrar:
   uma frase mais longa num card futuro, o fallback da fonte do Google Fonts, ou fonte-base
   maior no navegador do aluno já bastam.

Correção proposta — trazer o rótulo para o fluxo em vez de flutuá-lo:

```css
.concept-card { display: flex; flex-direction: column; }
.concept-card small { position: static; margin-top: auto; }
```

O `margin-top: auto` mantém o rótulo colado no rodapé quando há espaço, mas, por estar
no fluxo, passa a ser intransponível e o card cresce se o texto exigir. Elimina a classe
inteira do problema, em vez de recalibrar o `min-height` — o que só empurraria o limite
para outro tamanho de tela.

Efeito colateral: o card deixa de ter altura fixa em alguns casos.

### Órbita do hero perdeu o vínculo ao vivo
Antes da modularização, o círculo central do hero mostrava o preço do slider do lab em
tempo real. Com o lab fora de `main.jsx`, passou a mostrar o preço de equilíbrio do
cenário base (R$ 24,86), estático.

Restaurar o vínculo exigiria acoplar o hero ao estado de um lab específico, o que
contraria "estado local por lab" (`CLAUDE.md` §5). Se o efeito fizer falta, vale pensar
em algo que não reintroduza o acoplamento.

---

## Dívida técnica

### Extrair o painel de mercado para `shared/`
Os dois labs repetem ~35 linhas de JSX estruturalmente equivalente: `market-header`,
`market-label`, `market-status`, o `chart-wrap` com os rótulos de eixo, o `metric-row` e a
faixa `insight`. Cada bloco aparece uma vez em `labs/substitutos.jsx` e uma vez em
`labs/equilibrio.jsx`.

Um terceiro lab seria a terceira cópia — e é o momento natural para resolver: só com três casos
fica visível o que é mesmo comum e o que é específico de cada lab. Extrair agora, com dois
exemplos, arrisca desenhar a abstração errada.

Forma provável: um `shared/PainelMercado.jsx` recebendo título, status, gráfico, métricas e
leitura. Alinha com a regra do `CLAUDE.md` §4 — "nenhum lab reimplementa o que já está em
`shared/`".

Levantado na revisão de código de 2026-09-17 (confiança média: é refatoração de código
recém-escrito, não código morto).

### Hex solto fora dos tokens de `:root`
O CSS herdado usa bastante cor literal fora das variáveis (`#53666a`, `#647476`,
`#5d6c6e`, `#486064`, `#e7e9df`…). Os estilos novos (abas, elementos do gráfico de
equilíbrio) já usam só tokens.

Consolidar envolve decisão de design — combinar antes de mexer.

### Histórico do git ainda carrega `node_modules/`
O commit `0f14ff7` tirou `node_modules/` e `dist/` do índice, mas os blobs continuam nos
objetos do repositório, no commit inicial `b18feeb` (~375 mil linhas). Clones futuros
ainda baixam esse peso.

Limpar de vez exige reescrever o histórico (`git filter-repo`), que é destrutivo e só
faz sentido antes de o repositório ser compartilhado. Decidir cedo é melhor que tarde.

---

## Infra

### Sem CI e sem deploy
Não há pipeline nem publicação configurada. Há testes (`npm test`, runner nativo do Node)
cobrindo a lógica pura, mas nada roda automaticamente num push. Também não há linter.
