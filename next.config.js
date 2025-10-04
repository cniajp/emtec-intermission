/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
