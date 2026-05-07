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
  // Honeypot: si el campo "website" tiene valor, es un bot
  if (formData.get('website')) {
    return { success: true } // respuesta silenciosa para no alertar al bot
  }

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
      from: 'contacto@sitiohoy.com.ar',
      to: 'sitiohoytl@gmail.com',
      subject: `📬 ${nombre} te escribió desde tanosburger.com.ar`,
      html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${mensaje.substring(0, 90).replace(/\n/g, ' ')}... · Respondé directo desde este email
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#FFA730;padding:28px 32px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#1a1a1a;letter-spacing:-0.5px;">🍔 Tanos Burger</p>
            <p style="margin:6px 0 0;font-size:13px;color:#1a1a1a;opacity:0.75;">Nuevo mensaje desde el formulario de contacto</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 16px;background:#fafafa;border-radius:8px;border-left:4px solid #FFA730;margin-bottom:12px;">
                  <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;">Nombre</p>
                  <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a1a;">${nombre}</p>
                </td>
              </tr>
            </table>

            <div style="height:10px;"></div>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 16px;background:#fafafa;border-radius:8px;border-left:4px solid #FFA730;">
                  <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;">Email</p>
                  <a href="mailto:${email}" style="margin:0;font-size:16px;font-weight:600;color:#C80F2C;text-decoration:none;">${email}</a>
                </td>
              </tr>
            </table>

            <div style="height:10px;"></div>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:16px;background:#fafafa;border-radius:8px;border-left:4px solid #FFA730;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;">Mensaje</p>
                  <p style="margin:0;font-size:15px;color:#333;line-height:1.6;">${mensaje.replace(/\n/g, '<br>')}</p>
                </td>
              </tr>
            </table>

            <div style="height:24px;"></div>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="mailto:${email}" style="display:inline-block;background:#25D366;color:#ffffff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;">
                    Responder por email
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #eeeeee;background:#fafafa;">
            <p style="margin:0;font-size:12px;color:#aaa;text-align:center;">
              Tanos Burger · tanosburger.com.ar · Este email fue generado automáticamente
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    }).catch(() => {}) // silencioso si falla
  }

  return { success: true }
}
