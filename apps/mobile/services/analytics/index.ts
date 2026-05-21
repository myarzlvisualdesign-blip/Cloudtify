import type { AnalyticsEvent } from '@cloudtify/types'

const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = 'https://app.posthog.com'

export const analyticsService = {
  track: async (event: AnalyticsEvent) => {
    if (!POSTHOG_KEY) return
    try {
      await fetch(`${POSTHOG_HOST}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: POSTHOG_KEY,
          event: event.event,
          properties: event.properties,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch {
      // Analytics should never crash the app
    }
  },

  identify: async (userId: string, traits?: Record<string, unknown>) => {
    if (!POSTHOG_KEY) return
    try {
      await fetch(`${POSTHOG_HOST}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: POSTHOG_KEY,
          event: '$identify',
          distinct_id: userId,
          $set: traits,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch {
      // Silent
    }
  },
}
