import { Resend } from 'resend'
import { getTenantConfig } from '@/lib/supabase/tenant'

export const getResendClient = async () => {
  const config = await getTenantConfig()
  if (!config.resend_api_key) return null
  return {
    resend: new Resend(config.resend_api_key),
    from: `noreply@${new URL(config.url ?? 'https://tanosburger.com.ar').hostname}`,
  }
}
