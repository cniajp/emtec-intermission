import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'

let faroInitialized = false

export function initFaro() {
  if (typeof window === 'undefined' || faroInitialized) return

  faroInitialized = true

  initializeFaro({
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
