// Umami analytics — safe wrapper (no-op if script not loaded)
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void
    }
  }
}

export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.umami?.track(event, data)
  }
}
