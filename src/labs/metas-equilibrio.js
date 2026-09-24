// Metas do desafio do tema 4.
//
// São predicados puros sobre o retorno de `situacao()` — é o que permite avaliar
// o que o aluno FEZ no laboratório, em vez do que ele lembrou de ler. Ficam fora
// do componente para poderem ser verificadas sem montar React.
//
// `houveChoque` diz se alguma curva foi deslocada; sem isso a última meta seria
// satisfeita por quem apenas equilibrou o cenário inicial, sem deslocar nada.

// Desequilíbrio, em mil unidades, que as metas de escassez e excesso exigem.
// Grande o bastante para ser inequívoco no gráfico e pequeno o bastante para
// ser alcançável dentro da faixa dos sliders.
export const META_FOLGA = 20

export const METAS = [
  {
    id: 'equilibrar',
    texto: 'Leve o mercado ao equilíbrio',
    dica: 'Mova o preço até a folga zerar — ou use o botão de ajuste e observe.',
    ok: m => m.tipo === 'equilibrio',
  },
  {
    id: 'excesso',
    texto: `Provoque um excesso de oferta de ${META_FOLGA} mil un. ou mais`,
    dica: 'Sobra aparece quando o preço praticado está acima do de equilíbrio.',
    ok: m => m.folga <= -META_FOLGA,
  },
  {
    id: 'escassez',
    texto: `Provoque uma escassez de ${META_FOLGA} mil un. ou mais`,
    dica: 'Falta aparece quando o preço praticado está abaixo do de equilíbrio.',
    ok: m => m.folga >= META_FOLGA,
  },
  {
    id: 'choque',
    texto: 'Desloque uma curva e encontre o novo equilíbrio',
    dica: 'Aplique um choque de demanda ou de oferta e ajuste o preço depois.',
    ok: (m, houveChoque) => houveChoque && m.tipo === 'equilibrio',
  },
]
