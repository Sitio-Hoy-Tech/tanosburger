import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y condiciones — Tanos Burger',
  robots: { index: false },
}

export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        Términos y condiciones
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        Última actualización: mayo 2026
      </p>

      <div className="prose-custom flex flex-col gap-6 text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">1. Aceptación de los términos</h2>
          <p>Al realizar una compra en Tanos Burger (tanosburger.com.ar), aceptás estos términos y condiciones en su totalidad. Si no estás de acuerdo, no uses nuestros servicios.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">2. Productos y disponibilidad</h2>
          <p>Los productos ofrecidos están sujetos a disponibilidad. Tanos Burger se reserva el derecho de modificar el menú, precios y disponibilidad sin previo aviso. Los precios se expresan en pesos argentinos (ARS) e incluyen IVA.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">3. Proceso de compra y pago</h2>
          <p>Los pagos se procesan a través de MercadoPago. Tanos Burger no almacena datos de tarjetas de crédito ni débito. Al confirmar tu pedido, aceptás los términos de MercadoPago.</p>
          <p>Una vez confirmado el pago, recibirás un email de confirmación con los detalles de tu pedido y un enlace para hacer seguimiento.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">4. Envíos</h2>
          <p>Los envíos se gestionan a través de Envia.com (Correo Argentino). Los tiempos de entrega son estimativos y pueden variar según la zona y disponibilidad del servicio. Tanos Burger no se responsabiliza por demoras ocasionadas por el servicio de correo.</p>
          <p>También ofrecemos la opción de retiro en el local sin costo de envío.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">5. Naturaleza del producto</h2>
          <p>Los productos comercializados son alimentos perecederos preparados al momento. Por su naturaleza, no se admiten devoluciones por cambio de opinión una vez preparado el pedido. Ver política de devoluciones para excepciones.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">6. Responsabilidad</h2>
          <p>Tanos Burger no se responsabiliza por daños indirectos derivados del uso del sitio. La responsabilidad máxima en caso de reclamo está limitada al monto del pedido en cuestión.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">7. Modificaciones</h2>
          <p>Estos términos pueden actualizarse en cualquier momento. Las modificaciones entran en vigencia desde su publicación en el sitio.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">8. Contacto</h2>
          <p>Para consultas: <a href="mailto:contacto@tanosburger.com.ar" className="underline">contacto@tanosburger.com.ar</a> o WhatsApp 3329 404361.</p>
        </section>
      </div>
    </div>
  )
}
