import { useEffect, useState } from 'react'

// Estado que sobrevive ao recarregar. Sem backend nem login: fica no navegador
// do aluno. Tudo em try/catch porque em aba anônima ou com storage bloqueado o
// acesso lança — e progresso perdido não pode derrubar o laboratório.
export function usePersistido(chave, inicial) {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave)
      return salvo === null ? inicial : JSON.parse(salvo)
    } catch {
      return inicial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor))
    } catch {
      // storage indisponível: o progresso vale só para esta sessão
    }
  }, [chave, valor])

  return [valor, setValor]
}
