import React from 'react'

// `value` é sempre o número que o input consome; `exibicao` é o texto opcional
// mostrado ao aluno. Separar os dois evita passar string formatada ao
// <input type="range">, que a descarta em silêncio e trava o thumb no meio da faixa.
export default function Slider({ label, value, exibicao, min, max, step = 1, suffix = '', onChange, hint, disabled = false }) {
  return (
    <div className="control">
      <div className="control-top">
        <label>{label}</label>
        <output>{exibicao ?? value}{suffix}</output>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
      />
      {hint && <small>{hint}</small>}
    </div>
  )
}
