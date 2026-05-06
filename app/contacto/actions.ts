'use server'

import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { getResendClient } from '@/lib/resend/client'

const schema = z.object({
  nombre: z.string().min(2).max(100),
  email: z.string().email(),
  mensaje: z.string().min(10).max(2000),
})

export async function sendContactMessage(formData: FormData) {
  const parsed = schema.safeParse({
    nombre: formData.get('nombre'),
    email: formData.get('email'),
    mensaje: formData.get('mensaje'),
  })

  if (!parsed.success) {
    return { error: 'Datos inválidos. Revisá los campos.' }
  }

  const { nombre, email, mensaje } = parsed.data
  const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!

  const supabase = createServiceClient()
  const { error } = await supabase.from('contact_messages').insert({
    tenant_id: TENANT_ID,
    name: nombre,
    email,
    message: mensaje,
    source: 'contact_form',
  })

  if (error) return { error: 'No pudimos enviar tu mensaje. Intentá de nuevo.' }

  // Notificar al negocio si Resend está configurado
  const client = await getResendClient()
  if (client) {
    await client.resend.emails.send({
      from: client.from,
      to: 'contacto@tanosburger.com.ar',
      subject: `Nuevo mensaje de contacto — ${nombre}`,
      html: `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje.replace(/\n/g, '<br>')}</p>
      `,
    }).catch(() => {}) // silencioso si falla
  }

  return { success: true }
}
