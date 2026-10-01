# TODO — MicroLab

Fonte única de pendências abertas do projeto. O `CLAUDE.md` guarda convenções e o
histórico do que já foi resolvido; o que ainda falta fazer mora aqui.

Cada item traz contexto suficiente para ser executado sem precisar do histórico de
conversa que o originou.

---

## Conteúdo

### Estreitar o lab de demanda e oferta ao seu tema
`src/labs/substitutos.jsx` já é módulo próprio, mas segue sendo o lab completo de
oferta e demanda: o recorte de substitutos e complementares divide espaço com renda e
condições de produção. Com o lab de equilíbrio cobrindo aquele tema, a sobreposição ficou
redundante.

Decidir o que sai dele e o que fica é decisão de conteúdo didático — combinar antes.

---

## UI e layout

### Botão "Marcar resumo como lido" não faz nada
`src/main.jsx` — `briefDone`, do commit inicial `b18feeb`.

O botão alterna um booleano que só troca o próprio rótulo: não persiste e não alimenta
progresso nenhum. É vestígio do protótipo, de antes de existir o sistema de progresso por
módulo — e hoje concorre com ele. O aluno marca "resumo concluído" e nada acontece, enquanto o
`conceitoLido` de cada módulo é o que de fato conta.

Decidir: remover o botão, ou ligá-lo a algo real. É decisão de produto, não de limpeza.

### Extrair a moldura do desafio para `shared/`
Os cinco labs que usam desafio por casos repetem a mesma moldura em `function Desafio(...)`:
`metas-topo` com contador, `metas-intro`, `<ul className="casos">`, feedback por caso,
`metas-fim` e o botão de sortear. Medido entre `oportunidade` e `estruturas`: **30 de 55 linhas
idênticas**.

O miolo difere de verdade — entrada numérica nos temas 1 e 2, botões nos temas 3 e 6, opções por
medida no tema 5 — então a extração precisa receber o miolo como filho, não como prop. É uma
abstração mais pesada que a de `SecoesDoModulo`, e por isso ficou de fora daquela rodada.

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
