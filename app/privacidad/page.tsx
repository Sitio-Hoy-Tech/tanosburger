import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de privacidad — Tanos Burger',
  robots: { index: false },
}

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        Política de privacidad
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        Última actualización: mayo 2026
      </p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">1. Datos que recopilamos</h2>
          <p>Al realizar un pedido recopilamos: nombre, apellido, email, teléfono y dirección de entrega. Estos datos son necesarios para procesar tu compra y coordinar el envío.</p>
          <p>Al usar el formulario de contacto recopilamos: nombre, email y mensaje.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">2. Cómo usamos tus datos</h2>
          <ul className="list-disc list-inside flex flex-col gap-1" style={{ color: 'var(--color-text-muted)' }}>
            <li>Procesar y gestionar tu pedido</li>
            <li>Enviarte confirmaciones y actualizaciones por email</li>
            <li>Coordinar el envío con Envia.com (Correo Argentino)</li>
            <li>Responder consultas enviadas por el formulario de contacto</li>
            <li>Análisis anónimo del uso del sitio (Umami Analytics, sin cookies de seguimiento)</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">3. Compartición de datos</h2>
          <p>Tus datos son compartidos únicamente con los proveedores necesarios para operar el servicio:</p>
          <ul className="list-disc list-inside flex flex-col gap-1" style={{ color: 'var(--color-text-muted)' }}>
            <li><strong>MercadoPago</strong>: procesamiento de pagos (datos de tarjeta nunca llegan a nuestros servidores)</li>
            <li><strong>Envia.com / Correo Argentino</strong>: datos de envío para gestionar la entrega</li>
            <li><strong>Resend</strong>: envío de emails transaccionales</li>
            <li><strong>Supabase</strong>: almacenamiento seguro de datos (servidores en Brasil / EE.UU.)</li>
          </ul>
          <p>No vendemos ni cedemos tus datos a terceros con fines comerciales.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">4. Seguridad</h2>
          <p>Todos los datos se transmiten mediante HTTPS. Los datos sensibles (contraseñas, tokens) se almacenan cifrados. No almacenamos datos de tarjetas de crédito.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">5. Cookies</h2>
          <p>Usamos cookies de sesión estrictamente necesarias para el funcionamiento del carrito y el checkout. No usamos cookies de seguimiento publicitario. Las analíticas (Umami) son anónimas y no requieren consentimiento de cookies.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">6. Tus derechos (Ley 25.326)</h2>
          <p>Conforme a la Ley de Protección de Datos Personales de Argentina (Ley 25.326), tenés derecho a acceder, rectificar, actualizar y suprimir tus datos personales. Para ejercer estos derechos, escribinos a <a href="mailto:contacto@tanosburger.com.ar" className="underline">contacto@tanosburger.com.ar</a>.</p>
          <p>La Dirección Nacional de Protección de Datos Personales es el órgano de control para el ejercicio de estos derechos.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">7. Retención de datos</h2>
          <p>Conservamos los datos de pedidos durante 5 años por obligaciones impositivas. Los mensajes de contacto se conservan durante 1 año.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">8. Contacto</h2>
          <p>Para consultas sobre privacidad: <a href="mailto:contacto@tanosburger.com.ar" className="underline">contacto@tanosburger.com.ar</a></p>
        </section>
      </div>
    </div>
  )
}
