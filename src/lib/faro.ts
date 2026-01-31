import {
  Faro,
  getWebInstrumentations,
  initializeFaro,
} from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'

let faro: Faro | null = null

export function initFaro() {
  if (typeof window === 'undefined' || faro) return

  faro = initializeFaro({
    url: 'https://faro-collector-prod-us-central-0.grafana.net/collect/eb4a949e510aaf8acc2cebbd3656e800',
    app: {
      name: 'emtec intermission',
      version: '1.0.0',
      environment: 'production',
    },
    instrumentations: [
      ...getWebInstrumentations(),
      new TracingInstrumentation(),
    ],
  })
}

export function getFaro(): Faro | null {
  return faro
}

export function pushPageMeasurement(
  pageName: string,
  duration: number,
  context?: Record<string, string>
) {
  if (!faro) return

  faro.api.pushMeasurement({
    type: 'page_render',
    values: {
      duration,
    },
    context: {
      page: pageName,
      ...context,
    },
  })
}

export function pushPageEvent(
  pageName: string,
  eventName: string,
  attributes?: Record<string, string>
) {
  if (!faro) return

  faro.api.pushEvent(eventName, {
    page: pageName,
    ...attributes,
  })
}
