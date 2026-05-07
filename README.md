# 🍔 Tanos Burger — Sitio Web

> Tienda online completa con delivery, MercadoPago, cotización de envíos en tiempo real y panel de seguimiento de pedidos.

**Live:** [tanos-burger.vercel.app](https://tanos-burger.vercel.app) · **Repo:** [Sitio-Hoy-Tech/tanosburger](https://github.com/Sitio-Hoy-Tech/tanosburger)

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 App Router + TypeScript strict |
| Base de datos | Supabase (PostgreSQL + RLS multitenant) |
| Auth | Supabase Auth |
| Estilos | Tailwind CSS v4 + CSS custom properties |
| Animaciones | Motion (Framer Motion) |
| Pagos | MercadoPago Bricks |
| Envíos | Envia.com (cotización en tiempo real) |
| Emails | Resend |
| Analytics | Umami |
| Deploy | Vercel |
| Fuentes | Bricolage Grotesque + DM Sans (next/font) |

---

## Arquitectura

```
app/
├── layout.tsx                  # Root layout — fonts, metadata global, JSON-LD
├── page.tsx                    # Home (ISR 1h)
├── (store)/
│   ├── menu/                   # Catálogo con filtros por categoría
│   ├── menu/[slug]/            # Detalle de producto (ISR 1h, SSG)
│   ├── checkout/               # Flujo de pago multi-step
│   └── seguimiento/            # Tracking de pedido por token
├── contacto/                   # Formulario con honeypot antispam
├── nosotros/                   # Página institucional
└── api/
    ├── checkout/payment/       # Server Action → MercadoPago
    └── webhooks/mercadopago/   # Webhook de pagos

components/
├── layout/          # Header, Footer, MobileMenu, WhatsAppButton, SitioHoyBadge
├── home/            # Hero, FeaturedProducts, TrustBadges, WhatsAppCTA, HeroContent
├── cart/            # CartSidebar, CartButton, CartItem
├── checkout/        # CheckoutFlow, PaymentBrick, PurchaseTracker
├── products/        # ProductCard, AddToCartButton, ProductViewTracker
└── ui/              # FadeIn (componente de animación reutilizable)

lib/
├── supabase/        # server.ts, client.ts, tenant.ts
├── envia/           # client.ts, provinces.ts
├── resend/          # client.ts, emails/
├── products.ts      # queries cacheadas con unstable_cache
├── cache-tags.ts    # TAGS centralizados para revalidación
└── umami.ts         # trackEvent() wrapper

store/
└── cart.ts          # Zustand persist (localStorage)
```

---

## Flujo del checkout

```
1. Usuario agrega productos  →  Zustand (localStorage)
2. Abre checkout             →  Paso 1: datos personales + dirección
3. Si delivery               →  cotiza envío en tiempo real via Envia.com
4. Aplica cupón (opcional)   →  valida server-side
5. Confirma orden            →  Server Action crea `orders` + `order_items`
6. Paso 2: MercadoPago Brick →  procesamiento seguro
7. Webhook recibe aprobación →  actualiza `orders.payment_status`
8. Email de confirmación     →  via Resend
9. Redirect                  →  /checkout/success con tracking token
```

---

## Base de datos (Supabase)

Arquitectura multitenant — todas las tablas filtran por `tenant_id`:

```
tenants              → config del negocio, credenciales, origen de envío
user_tenants         → relación usuarios ↔ tenants
categories           → categorías del catálogo
subcategories        → subcategorías opcionales
products             → productos con precio, stock, featured
product_images       → imágenes con posición
product_variants     → variantes con price_modifier
orders               → pedidos con estado y tracking token
order_items          → líneas del pedido (precio verificado server-side)
coupons              → cupones de descuento con reglas
shipping_zones       → zonas de envío (fallback si no usa Envia.com)
contact_messages     → leads del formulario de contacto
order_events         → auditoría de cambios de estado
payment_events       → payloads crudos de webhooks MercadoPago
```

**RLS:** habilitado en todas las tablas. Queries públicas filtran por `tenant_id`. Service role solo en server.

---

## Variables de entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Tenant
NEXT_PUBLIC_TENANT_ID=
NEXT_PUBLIC_SITE_NAME=
NEXT_PUBLIC_URL=

# Seguridad
REVALIDATION_SECRET=
MP_WEBHOOK_SECRET=

# Envia.com
ENVIA_API_URL=https://api.envia.com   # usar api-test.envia.com en desarrollo

# Analytics (opcional)
NEXT_PUBLIC_UMAMI_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
```

> Las credenciales de MercadoPago, Resend y Envia.com **no van en `.env`** — se guardan en la tabla `tenants` de Supabase.

---

## Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# completar .env.local con valores reales

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Build de producción (para Lighthouse real — nunca medir sobre dev)
npm run build && npm start

# 5. Validación del proyecto
npm run sitiohoy:validate
```

---

## Integraciones

### MercadoPago
- Credenciales en tabla `tenants` → `mp_access_token`, `mp_public_key`
- Webhook en `/api/webhooks/mercadopago`
- Totales **siempre** verificados server-side antes de crear preferencia
- `PaymentBrick` cargado con `next/dynamic` (lazy) para no inflar el bundle principal

### Envia.com
- Token en tabla `tenants` → `envia_access_token`
- Cotización en `app/(store)/checkout/actions.ts → quoteShipping()`
- Conversión de provincias argentinas → códigos ISO en `lib/envia/provinces.ts`
- Si no hay token: flujo continúa sin cotización (sin error visible)

### Resend
- API key en tabla `tenants` → `resend_api_key`
- Email de confirmación de compra: `lib/resend/emails/order-confirmation.ts`
- Email de cambio de estado: `lib/resend/emails/order-status.ts`
- Email de contacto: `app/contacto/actions.ts`
- Si no hay API key: silencioso — el lead igual se guarda en `contact_messages`

### Umami
- `NEXT_PUBLIC_UMAMI_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID` en env vars
- `trackEvent()` en `lib/umami.ts` — wrapper seguro para SSR
- Eventos: `product_viewed`, `purchase`, `checkout_started`, `coupon_applied`

---

## Patrones clave

### Cache y revalidación
```typescript
// Tags centralizados en lib/cache-tags.ts
export const TAGS = { PRODUCTS: 'products', CATEGORIES: 'categories', ... }

// Cache con unstable_cache
export const getFeaturedProducts = unstable_cache(fn, ['featured-products'], {
  tags: [TAGS.PRODUCTS], revalidate: 3600
})

// Revalidación on-demand
revalidateTag(TAGS.PRODUCTS)
```

### Seguridad del checkout
- Precios nunca se confían del cliente — recalculados server-side desde BD
- Cupones verificados server-side antes de aplicar descuento
- Pedido se crea en BD **antes** de generar preferencia MercadoPago
- Webhook actualiza estado solo si `tenant_id` coincide

### Antispam
- Campo honeypot oculto (`name="website"`) en el formulario de contacto
- Si llega con valor → bot detectado → descarte silencioso (responde `success: true`)

### Animaciones
- `motion` (Framer Motion) — solo en Client Components
- `whileInView` + `viewport={{ once: true }}` para fade-in al scrollear
- `prefers-reduced-motion` respetado via `styles/tokens.css`
- Componente reutilizable: `components/ui/FadeIn.tsx`

---

## Deploy

Push a `main` → Vercel deploya automáticamente.

```bash
# Deploy manual
vercel deploy --prod
```

### Checklist go-live

- [ ] Apuntar dominio `tanosburger.com.ar` → Vercel Settings → Domains
- [ ] Actualizar `NEXT_PUBLIC_URL` en Vercel env vars
- [ ] Cambiar credenciales MercadoPago a producción en tabla `tenants`
- [ ] Registrar webhook MP: `https://tanosburger.com.ar/api/webhooks/mercadopago`
- [ ] Configurar `MP_WEBHOOK_SECRET` en Vercel
- [ ] Crear sitio en Umami y cargar `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- [ ] Cambiar `ENVIA_API_URL` a `https://api.envia.com`

---

## Desarrollado por

[**SitioHoy**](https://sitiohoy.com.ar) — Plan Empresa · 2026
