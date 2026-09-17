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

## 2. Os três eixos de conteúdo

O projeto se organiza em três eixos. Cada um é um laboratório próprio, com seus controles,
sua visualização e sua leitura de cenário.

| # | Eixo | Estado | Escopo |
|---|------|--------|--------|
| 1 | **Produtos substitutos e complementares** | Implementação inicial, em evolução | Efeito do preço de um bem relacionado sobre a demanda do bem analisado; deslocamento (não movimento) da curva |
| 2 | **Equilíbrio de mercado** | A construir | Encontro de oferta e demanda; escassez e excesso; ajuste até o novo equilíbrio após um choque |
| 3 | **Elasticidades** | A construir | Elasticidade-preço da demanda e da oferta, elasticidade-renda, elasticidade-cruzada; relação com receita total |

Hoje o eixo 1 está **embutido** no lab de oferta/demanda de `main.jsx` (sliders "Preço do
substituto" e "Preço do complementar"), não isolado como lab próprio. Separá-lo é parte da
evolução prevista — ver §7.

---

## 3. Stack e comandos

- **Vite** + **React 19**, JavaScript puro (sem TypeScript), ES modules.
- **Versões fixadas exatas** no `package.json` (React 19.3.0, React-DOM 19.3.0, Vite 8.3.0,
  `@vitejs/plugin-react` 6.1.1) — sem `^` e sem `latest`. Num projeto sem testes, um salto de
  major silencioso só apareceria em runtime. Atualizar é ato deliberado: mude a versão e
  verifique. Não afrouxe para faixas sem combinar.
- Sem testes, sem linter, sem formatter configurados.
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

**Hoje:**

```
index.html        # shell HTML, fontes do Google (Manrope, Playfair Display, DM Mono)
vite.config.js    # plugin do React (Fast Refresh)
src/main.jsx      # TUDO: componente App, dados dos conceitos, modelo econômico, SVG
src/styles.css    # folha de estilo única, ~918 linhas, seccionada por comentários
```

**Alvo — um módulo por eixo, com camada compartilhada:**

```
src/
  main.jsx              # só casca: layout da página, navegação entre eixos
  labs/
    substitutos.jsx     # eixo 1
    equilibrio.jsx      # eixo 2
    elasticidades.jsx   # eixo 3
  shared/
    Slider.jsx          # controles reutilizáveis
    Chart.jsx           # gráfico SVG, eixos, gridlines, escalas
    modelo.js           # funções do modelo econômico (curvas, equilíbrio, elasticidade)
```

Regra: **nenhum lab reimplementa o que já está em `shared/`.** Se dois eixos precisam da
mesma curva ou do mesmo gráfico, a lógica sobe para `shared/` — não é copiada.

A migração para essa estrutura acontece de forma incremental, conforme cada eixo é
construído. Não refatore tudo de uma vez sem combinar antes.

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

Pendências:

- [ ] **Migrar para `labs/` + `shared/`** conforme os eixos 2 e 3 forem construídos.
- [ ] **Isolar o eixo 1** em lab próprio, hoje embutido no lab de oferta/demanda.

Já resolvido:

- [x] **`.gitignore`** — `node_modules/` e `dist/` estavam versionados; removidos do índice
      com `git rm -r --cached` (arquivos preservados no disco).
- [x] **`src/styles.css` expandido** — de 1 linha minificada (9,4 KB) para 918 linhas
      legíveis, com 15 seções comentadas. Equivalência verificada por comparação de AST
      (postcss): 146 regras, 2 at-rules, 417 declarações, idênticas em ordem e conteúdo.
      Nenhuma regra de estilo foi alterada — o CSS compilado pelo Vite ficou **byte a byte
      idêntico** ao do build anterior (mesmo sha256, mesmo hash de nome de arquivo).
- [x] **`vite.config.js` criado** — habilita Fast Refresh no dev. Verificado: build de
      produção emite CSS e JS com os mesmos hashes de antes (`index-CGsELB_C.css`,
      `index-DmjvtJI1.js`), ou seja, impacto zero em produção.
- [x] **Build consertado** — `npm run build` e `npm run dev` estavam quebrados porque o
      `node_modules/` versionado vinha de uma máquina Windows: o `.bin/vite` estava sem bit
      de execução e só havia bindings nativos win32 de `rolldown` e `lightningcss`. Resolvido
      com `rm -rf node_modules && npm install`. Ambos rodam (Vite 8.3.0, build em ~420ms).

Se o build voltar a falhar com `Permission denied` no `.bin/vite` ou com erro de carga de
binding nativo, a causa é essa e a correção é reinstalar do zero.

Outras observações:

- Não há CI, nem deploy configurado.
- O CSS usa bastante hex solto fora dos tokens de `:root` (`#53666a`, `#647476`, `#5d6c6e`…).
  Consolidar em variáveis é uma melhoria possível, mas envolve decisão de design — combine
  antes de mexer.
