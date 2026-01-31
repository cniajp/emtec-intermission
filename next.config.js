/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const FaroSourceMapUploaderPlugin = require('@grafana/faro-webpack-plugin')

const nextConfig = {
  optimizeFonts: false,
  productionBrowserSourceMaps: true,
  webpack: (config, { isServer }) => {
    if (
      !isServer &&
      process.env.NODE_ENV === 'production' &&
      process.env.FARO_API_KEY
    ) {
      config.plugins.push(
        new FaroSourceMapUploaderPlugin({
          appName: 'emtec intermission',
          endpoint: 'https://faro-api-prod-us-central-0.grafana.net/faro/api/v1',
          appId: '2651',
          stackId: '146945',
          verbose: true,
          apiKey: process.env.FARO_API_KEY,
          gzipContents: true,
        })
      )
    }
    return config
  },
}

const isDev = process.env.NODE_ENV !== 'production'
const withPWA = require('next-pwa')({
  dest: 'public',
  swSrc: 'src/service-worker.js',

  // https://github.com/shadowwalker/next-pwa/issues/424#issuecomment-1857499715
  exclude: [
    // add buildExcludes here
    ({ asset }) => {
      if (
        asset.name.startsWith('server/') ||
        asset.name.match(
          /^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/
        )
      ) {
        return true
      }
      if (isDev && !asset.name.startsWith('static/runtime/')) {
        return true
      }
      return false
    },
  ],
})

module.exports = withPWA(nextConfig)
