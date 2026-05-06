'use client'

import { useState, useRef } from 'react'
import { sendContactMessage } from './actions'

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const result = await sendContactMessage(formData)

    if (result.success) {
      setState('success')
      formRef.current?.reset()
    } else {
      setState('error')
      setErrorMsg(result.error ?? 'Error desconocido')
    }
  }

  if (state === 'success') {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-12 text-center rounded-[var(--radius-lg)] border"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <span className="text-5xl">✅</span>
        <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          ¡Mensaje enviado!
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Te respondemos a la brevedad por email o WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="text-sm underline mt-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  const inputClass =
    'w-full px-4 py-3 rounded-[var(--radius-md)] border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors'

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="nombre" className="text-sm font-semibold">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          minLength={2}
          placeholder="Tu nombre"
          className={inputClass}
          style={{ borderColor: 'var(--color-border)' }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="tu@mail.com"
          className={inputClass}
          style={{ borderColor: 'var(--color-border)' }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="mensaje" className="text-sm font-semibold">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          minLength={10}
          rows={5}
          placeholder="¿En qué te podemos ayudar?"
          className={`${inputClass} resize-none`}
          style={{ borderColor: 'var(--color-border)' }}
        />
      </div>

      {state === 'error' && (
        <p className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full py-3.5 rounded-[var(--radius-md)] font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--color-secondary)', color: '#fff' }}
      >
        {state === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
