# Preparação da apresentação

O que fazer antes de subir ao palco, e o que fazer se a demonstração falhar.

---

## Na véspera

- [ ] `npm install` e `npm run build` rodando sem erro na máquina que vai ser usada.
- [ ] Um **ensaio completo com cronômetro**, com as quatro pessoas e a troca de fala. As
      passagens costumam custar mais tempo do que parece.
- [ ] Durante o ensaio, **tire um print** de cada momento de "Na tela" do roteiro. É o plano B.
- [ ] Combinar **quem pilota o computador** (ver abaixo).

## Quem pilota

Duas opções, e vale decidir no ensaio:

- **Uma pessoa pilota a apresentação inteira**, seguindo as deixas do roteiro, enquanto as
  outras falam. Recomendado: sem troca de lugar, sem procurar o cursor, sem perder tempo na
  passagem.
- **Cada um pilota a própria parte.** Mais natural para quem fala, mas cada troca custa uns
  15 segundos — um minuto inteiro somando as três.

## No dia, 15 minutos antes

- [ ] `npm run dev` e confirmar que abre em `http://localhost:5173`.
- [ ] Abrir o lab numa **janela anônima** (veja o porquê abaixo).
- [ ] Confirmar que as **fontes carregaram**: os títulos devem estar em letra serifada e
      elegante, não em Times ou Arial. Se estiverem em fonte genérica, falta internet.
- [ ] Ajustar o **zoom do navegador** para o projetor — 125% costuma funcionar bem para quem
      está no fundo da sala.
- [ ] Desligar notificações do sistema e fechar abas que não sejam do lab.
- [ ] Deixar a página rolada até a faixa de abas, que é onde a Parte 1 começa.

### Por que janela anônima

O lab **guarda o progresso no navegador**: seções concluídas, metas cumpridas, rodadas de
desafio. Depois do ensaio, uma janela normal vai abrir com módulos já marcados como concluídos
— e a demonstração perde o sentido.

A janela anônima começa sempre do zero e apaga tudo ao fechar. De quebra, costuma vir sem
extensões, o que evita bloqueador de anúncios derrubando as fontes.

**Para zerar entre dois ensaios:** feche a janela anônima e abra outra.

---

## Se algo der errado

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Títulos em fonte genérica | Sem internet: as fontes vêm do Google | Seguir normalmente — o lab funciona igual, só a tipografia muda |
| Módulos já aparecem concluídos | Janela normal, com progresso do ensaio | Abrir uma janela anônima |
| `npm run dev` não sobe, ou dá `Permission denied` | `node_modules/` de outra máquina | `rm -rf node_modules && npm install` |
| Dev server instável | Qualquer problema do modo de desenvolvimento | `npm run build` e `npm run preview`, que serve a versão de produção |
| Nada funciona | — | Seguir pelos prints do ensaio, narrando o que cada um mostra |

A regra é **não parar a apresentação para consertar**. Quem estiver falando segue com os
prints enquanto outra pessoa tenta subir o lab de novo.

---

## Valores de referência

Os números que o roteiro manda apontar, conferidos **no navegador**, seguindo o roteiro passo a
passo numa janela sem progresso salvo. Se a tela mostrar outra coisa, algum controle não está
na posição inicial — use **Restaurar cenário**.

Os números aparecem como a tela os formata: arredondados, sem separador de milhar, e com hífen
no lugar do sinal de menos. Aponte para a tela e leia o que estiver lá.

Um detalhe do tema 4: o ajuste automático **para em R$ 25,0**, não em R$ 24,86. Ele para assim
que a diferença entre as quantidades fica menor que meia mil unidade — perto o bastante para ser
equilíbrio, mas sem cair exatamente no valor. O preço exato aparece na métrica de equilíbrio.

| Tema | Situação | Valor esperado |
|---|---|---|
| 1 | Escolhendo a loja | custo de oportunidade R$ 380 · ganho líquido R$ 40 |
| 1 | Escolhendo o aluguel | ganho líquido R$ -40 |
| 2 | Preço R$ 9 | compra 4 un. · gasto R$ 36 · excedente R$ 18 |
| 3 | Bem inferior, renda −20% | equilíbrio de R$ 24,86 para R$ 27,57 |
| 4 | Preço R$ 34 | excesso de oferta de 34 mil un. |
| 4 | Depois de "Deixar o mercado ajustar" | slider em R$ 25,0 · métrica de equilíbrio R$ 24,86 |
| 5 | Preço de R$ 20 para R$ 30 | elasticidade -0,63 · receita de R$ 1280 para R$ 1320 mil |
| 5 | Preço de R$ 25,5 para R$ 26,5 | elasticidade -0,96 · unitária · receita igual |
| 5 | Oferta, R$ 20 → 30, condições de produção 0 / −15% / −30% | 0,74 inelástica · 1,00 unitária · 1,55 elástica |
| 5 | Renda, bem inferior | elasticidade-renda -0,78 |
| 6 | Muitos × muitos, produto idêntico → diferenciado | concorrência perfeita → monopolista |
