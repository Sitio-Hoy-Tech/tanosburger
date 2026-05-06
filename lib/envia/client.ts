import { getTenantConfig } from '@/lib/supabase/tenant'
import { toProvinceCode } from './provinces'

const ENVIA_API = `${process.env.ENVIA_API_URL ?? 'https://api.envia.com'}/ship`

export interface ShippingRate {
  carrier: string
  service: string
  serviceDescription: string
  days: number
  totalPrice: number
}

export interface ShippingDestination {
  name: string
  email?: string
  phone?: string
  address: string
  city: string
  state: string
  postalCode: string
}

export const getShippingRates = async (
  destination: ShippingDestination
): Promise<ShippingRate[]> => {
  const config = await getTenantConfig()

  if (!config.envia_access_token) return []

  const origin = {
    name: config.origin_name ?? 'Tanos Burger',
    phone: config.origin_phone ?? '',
    address: config.origin_address ?? '',
    city: config.origin_city ?? '',
    state: toProvinceCode(config.origin_state ?? 'Buenos Aires'),
    postalCode: config.origin_postal_code ?? '',
    country: 'AR' as const,
  }

  const dest = {
    ...destination,
    state: toProvinceCode(destination.state),
    country: 'AR' as const,
  }

  try {
    const res = await fetch(`${ENVIA_API}/rate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.envia_access_token}`,
      },
      body: JSON.stringify({
        origin,
        destination: dest,
        packages: [
          {
            content: 'Comida',
            amount: 1,
            type: 'box',
            weight: 1,
            dimensions: { length: 30, width: 20, height: 15 },
          },
        ],
        shipment: { carrier: 'correoargentino', type: 1 },
        settings: { currency: 'ARS' },
      }),
    })

    if (!res.ok) return []
    const data = await res.json()
    return data.data ?? []
  } catch {
    return []
  }
}
