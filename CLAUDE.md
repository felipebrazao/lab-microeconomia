# MicroLab — Laboratório de Microeconomia

Aplicação web interativa para **ensino de microeconomia**. Cada conceito vira um laboratório
manipulável: o aluno move controles, vê curvas e métricas responderem na hora, e lê uma
interpretação em texto do cenário que acabou de criar.

Idioma do produto, do código e da documentação: **português do Brasil**.

---

## 1. Regras inegociáveis

Estas duas regras valem para toda e qualquer interação neste repositório e têm precedência
sobre qualquer padrão default da ferramenta.

### 1.1 Commits sem co-autoria da Anthropic

Nenhum commit criado por assistente pode conter atribuição de autoria à Anthropic ou ao
Claude. Concretamente, **é proibido** incluir nas mensagens de commit:

- o trailer `Co-Authored-By: Claude ...` (em qualquer variação de modelo);
- o rodapé `🤖 Generated with [Claude Code](...)`;
- qualquer outra menção de geração automática ou co-autoria.

O mesmo vale para corpos de pull request. A autoria dos commits é do Gabriel, ponto.

### 1.2 Não assuma — pergunte antes de executar

Diante de **qualquer** divergência, ambiguidade ou dúvida, pare e pergunte **antes** de
executar. Não preencha lacunas com suposição, mesmo que a suposição pareça óbvia.

Casos que exigem pergunta prévia:

- a instrução admite mais de uma leitura razoável;
- a mudança contraria um padrão já existente no código;
- a mudança extrapola o que foi pedido (refatorar de passagem, "já que estou aqui…");
- há decisão de modelagem econômica em jogo (forma funcional, parâmetros, faixas de slider);
- escolha de biblioteca, ferramenta ou nova dependência;
- qualquer operação destrutiva ou de histórico (`git reset`, `push --force`, apagar arquivo).

Perguntar custa uma mensagem. Refazer trabalho errado custa muito mais.

---

## 2. Conteúdo da disciplina

O projeto acompanha a ementa de Microeconomia **até Estruturas de Mercado**, na sequência em
que os temas são dados em aula. Os seis temas têm laboratório. **Todos aparecem como aba**, mesmo sem lab: o aluno
precisa enxergar onde o que está manipulando se encaixa no curso inteiro.

| # | Tema | Lab | Estado |
|---|------|-----|--------|
| 1 | Custo de oportunidade | `labs/oportunidade.jsx` | Implementado |
| 2 | Teoria do consumidor | `labs/consumidor.jsx` | Implementado |
| 3 | Demanda e oferta | `labs/substitutos.jsx` | Implementado |
| 4 | Equilíbrio de mercado | `labs/equilibrio.jsx` | Implementado |
| 5 | Elasticidades | `labs/elasticidades.jsx` | Implementado |
| 6 | Estruturas de mercado | `labs/estruturas.jsx` | Implementado |

**As notas de conteúdo de cada tema estão em [`docs/`](docs/README.md)** — conceitos, notação
e, ao final de cada nota, o que o lab correspondente já cobre e o que ainda não. É de lá que
saem os itens de conteúdo do `TODO.md`. Antes de construir ou evoluir um lab, leia a nota do
tema: ela é a fonte sobre o recorte que a aula exige.

As notas são texto próprio, em termos genéricos de microeconomia. Os slides da disciplina são
material do professor e **não são redistribuídos neste repositório**.

Os labs compartilham o mesmo mercado (café) e as mesmas curvas, vindas de `shared/modelo.js`.
É intencional: o aluno reconhece o mesmo mercado em cada lab e só o recorte muda.

---

## 3. Stack e comandos

- **Vite** + **React 19**, JavaScript puro (sem TypeScript), ES modules.
- **Versões fixadas exatas** no `package.json` (React 19.3.0, React-DOM 19.3.0, Vite 8.3.0,
  `@vitejs/plugin-react` 6.1.1) — sem `^` e sem `latest`. Num projeto sem testes, um salto de
  major silencioso só apareceria em runtime. Atualizar é ato deliberado: mude a versão e
  verifique. Não afrouxe para faixas sem combinar.
- **Testes com o runner nativo do Node** (`npm test`) — sem framework e sem dependência.
  Cobrem a lógica pura: o modelo econômico e os predicados de avaliação, que são funções
  sem React e por isso verificáveis sem montar nada. Sem linter e sem formatter.
- **`vite.config.js`** carrega o `@vitejs/plugin-react`, o que habilita **Fast Refresh**:
  ao editar um componente, o estado dos sliders do laboratório é preservado em vez de a
  página recarregar inteira. O plugin não altera o bundle de produção — só o dev.

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # serve o build
```

---

## 4. Estrutura do código

```
index.html              # shell HTML, fontes do Google (Manrope, Playfair Display, DM Mono)
vite.config.js          # plugin do React (Fast Refresh)
.claude/launch.json     # dev server do preview (local, fora do versionamento)
src/
  main.jsx              # casca: layout da página e navegação por abas entre eixos
  styles.css            # folha de estilo única, ~1058 linhas, seccionada por comentários
  labs/
    oportunidade.jsx          # tema 1 — custo de oportunidade
    oportunidade.js           # modelo e gerador do tema 1
    oportunidade.test.mjs
    consumidor.jsx            # tema 2 — teoria do consumidor
    utilidade.js              # modelo e gerador do tema 2
    utilidade.test.mjs
    substitutos.jsx           # tema 3 — demanda e oferta
    pares-demanda.js          # gerador dos casos do desafio do tema 3
    pares-demanda.test.mjs
    equilibrio.jsx            # tema 4 — equilíbrio de mercado
    metas-equilibrio.js       # metas do desafio do tema 4 (predicados puros)
    metas-equilibrio.test.mjs
    elasticidades.jsx         # tema 5 — elasticidades
    casos-elasticidade.js     # gerador dos casos do desafio do tema 5
    elasticidade.test.mjs
    estruturas.jsx            # tema 6 — estruturas de mercado
    estruturas.js             # regra de classificação e gerador do tema 6
    estruturas.test.mjs
  shared/
    Slider.jsx                # controle de faixa reutilizável
    Chart.jsx                 # diagrama de Marshall: eixos, gridlines, escalas, curvas
    modelo.js                 # curvas, equilíbrio, folga e dinâmica de ajuste
    formato.js                # formatação numérica pt-BR
    persistencia.js           # estado que sobrevive ao reload (localStorage)
```

**Navegação e estado.** As abas seguem a ordem da ementa (`TEMAS` em `main.jsx`), numeradas
de 01 a 06; as sem laboratório ficam desabilitadas e marcadas "em breve". `main.jsx` mantém
todos os labs montados e esconde os inativos com `.lab-painel.oculto`. É o que preserva o cenário de cada eixo quando o aluno alterna de aba —
desmontar zeraria os sliders. O botão do desafio troca a `key` do lab de demanda e oferta para remontá-lo
com um cenário pronto, sem estado global e sem o lab precisar saber que o desafio existe.

**Formato de módulo.** Um tema não é um laboratório solto: apresenta-se em seções numeradas
(`4.0 Conceito`, `4.1 Laboratório`, `4.2 Desafio`) com progresso por seção, como na Cisco
Networking Academy. `labs/equilibrio.jsx` é a referência do formato.

**Cada tema avalia à sua maneira, e desenha à sua maneira.** O diagrama de Marshall serve só
aos temas 3 e 4, onde é o desenho canônico; aplicá-lo aos demais seria forçar a forma errada.
Os outros quatro usam barras de alternativas, tabela com degraus, comparação de duas barras e
matriz de classificação — quatro verbos distintos: escolher, preencher, calcular, posicionar. Utilidade marginal pede tabela e
degraus, elasticidade pede comparação de barras, estruturas de mercado pede classificação. O
verbo também muda: preencher, classificar, alocar — não só arrastar sliders.

A avaliação prefere **predicados sobre o estado que o aluno produziu** a perguntas de múltipla
escolha. Ficam em arquivo próprio, fora do componente, para serem verificáveis sem montar
React — ver `labs/metas-equilibrio.js`.

Regra: **nenhum lab reimplementa o que já está em `shared/`.** Se dois eixos precisam da
mesma curva ou do mesmo gráfico, a lógica sobe para `shared/` — não é copiada.

Cada tema novo entra como mais um módulo em `labs/`, consumindo `shared/` — sem refatoração de
estrutura. Se ele precisar de algo que `shared/` ainda não oferece, o certo é ampliar
`shared/`, não criar uma variante local.

---

## 5. Convenções de código

**Modelo econômico**

- Toda função de modelo (curva, equilíbrio, elasticidade) vive em `shared/modelo.js`,
  separada do componente que a desenha. Componente renderiza; módulo de modelo calcula.
- Cada parâmetro numérico embutido numa fórmula precisa de comentário explicando o que
  representa em termos econômicos. `104 - 2 * price` não se explica sozinho.
- **Correção econômica antes de estética.** Se uma simplificação matemática produzir
  comportamento que contradiz a teoria que o lab ensina, ela está errada — mesmo que o
  gráfico fique bonito. Levante o ponto em vez de escolher sozinho.
- Distinga sempre, no texto e na visualização, **movimento ao longo da curva** (mudança do
  preço do próprio bem) de **deslocamento da curva** (renda, bens relacionados, tecnologia).

**React**

- Componentes de função, hooks. Estado local por lab; nada de estado global por enquanto.
- Cálculos derivados em `useMemo`, com o array de dependências completo.
- Sem bibliotecas de gráfico: as visualizações são **SVG escrito à mão**. É intencional —
  mantém o controle sobre o traço e evita peso de dependência.
- **Diagrama de Marshall: preço na vertical, quantidade na horizontal.** É a convenção de
  livro-texto, e o aluno precisa ver aqui o mesmo desenho que vê na aula. `shared/Chart.jsx`
  já nasce assim; nenhum lab deve inverter os eixos.
- A **escala de quantidade do gráfico é fixa**, não ajustada aos dados. Com escala móvel, um
  deslocamento de curva ficaria invisível — o eixo se reajustaria embaixo da curva.

**Estilo / UI**

- CSS puro com variáveis em `:root` (`--ink`, `--teal`, `--mint`, `--cream`, `--paper`,
  `--coral`, `--blue`, `--muted`). Use os tokens; não escreva hex solto.
- Tipografia: Playfair Display (títulos), Manrope (texto), DM Mono (rótulos, números).
- O layout é responsivo com breakpoints em 850px e 560px. Mudança estrutural precisa ser
  verificada nos dois.
- Sem Tailwind, sem CSS-in-JS, sem biblioteca de componentes.

**Texto para o aluno**

- Linguagem direta, sem jargão não explicado. O público está aprendendo o vocabulário.
- Toda métrica na tela tem rótulo e unidade. Número solto não ensina nada.

---

## 6. Convenções de commit

**Conventional Commits em português**, assunto no imperativo, sem ponto final:

```
feat: adiciona lab de elasticidade-preço da demanda
fix: corrige cálculo do preço de equilíbrio com deslocamento de oferta
refactor: extrai gráfico SVG para shared/Chart.jsx
docs: documenta convenções do modelo econômico
style: expande styles.css para formato legível
chore: adiciona .gitignore
```

Tipos: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `test`.

Commits **atômicos**: uma mudança conceitual por commit. Apresente o plano de commits para
aprovação antes de executar.

E, repetindo por importância: **sem trailer de co-autoria, sem rodapé de geração
automática** (§1.1).

---

## 7. Estado atual e pendências

**Pendências abertas ficam em [`TODO.md`](TODO.md)**, não aqui. Este arquivo guarda
convenções e o histórico do que já foi resolvido; a lista de trabalho mora lá, em um lugar
só. Ao concluir um item do `TODO.md`, remova-o de lá e registre aqui embaixo se a conclusão
deixar alguma lição que valha carregar.

Já resolvido:

- [x] **Eixo 2 construído** — `labs/equilibrio.jsx`, com folga entre Qd e Qs ao preço
      praticado, ponto de equilíbrio no gráfico e ajuste animado até o novo equilíbrio.
- [x] **Camada `shared/` criada** e consumida pelos dois labs existentes: `modelo.js`,
      `Chart.jsx`, `Slider.jsx`, `formato.js`.
- [x] **Eixos do gráfico corrigidos** — o lab original traçava preço na horizontal e
      quantidade na vertical, mas rotulava os eixos ao contrário (`.axis-y` dizia "PREÇO"
      sobre um eixo que mostrava quantidade). Como a demanda desce nas duas orientações, o
      desenho parecia certo e só as leituras de valor saíam transpostas. Agora é Marshall:
      preço na vertical, quantidade na horizontal, e os rótulos existentes passaram a
      corresponder ao que é plotado.
- [x] **`.gitignore`** — `node_modules/` e `dist/` estavam versionados; removidos do índice
      com `git rm -r --cached` (arquivos preservados no disco).
- [x] **`src/styles.css` expandido** — de 1 linha minificada (9,4 KB) para 918 linhas
      legíveis, com 15 seções comentadas. Equivalência verificada por comparação de AST
      (postcss): 146 regras, 2 at-rules, 417 declarações, idênticas em ordem e conteúdo.
      Nenhuma regra de estilo foi alterada — o CSS compilado pelo Vite ficou **byte a byte
      idêntico** ao do build anterior (mesmo sha256, mesmo hash de nome de arquivo).
- [x] **`vite.config.js` criado** — habilita Fast Refresh no dev. Verificado: build de
      produção emitiu CSS e JS com os mesmos hashes de antes da mudança, ou seja, impacto
      zero em produção. (Os hashes daquele momento não valem para o build de hoje — o código
      mudou desde então; o que fica registrado é o resultado da comparação.)
- [x] **Build consertado** — `npm run build` e `npm run dev` estavam quebrados porque o
      `node_modules/` versionado vinha de uma máquina Windows: o `.bin/vite` estava sem bit
      de execução e só havia bindings nativos win32 de `rolldown` e `lightningcss`. Resolvido
      com `rm -rf node_modules && npm install`. Ambos rodam (Vite 8.3.0, build em ~420ms).

Se o build voltar a falhar com `Permission denied` no `.bin/vite` ou com erro de carga de
binding nativo, a causa é essa e a correção é reinstalar do zero.

Ausências conhecidas: não há CI, deploy nem linter — ver `TODO.md`.
