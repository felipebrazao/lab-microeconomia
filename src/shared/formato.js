// Formatação numérica no padrão pt-BR: vírgula como separador decimal.
export const num = (valor, casas = 0) => valor.toFixed(casas).replace('.', ',')
