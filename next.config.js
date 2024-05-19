/** @type {import('next').NextConfig} */
const nextConfig = {}

const isDev = process.env.NODE_ENV !== "production";
const withPWA = require('next-pwa')({
  dest: 'public',
  swSrc: 'src/service-worker.js',

  // https://github.com/shadowwalker/next-pwa/issues/424#issuecomment-1857499715
  exclude: [
    // add buildExcludes here
    ({ asset, compilation }) => {
      if (
        asset.name.startsWith("server/") ||
        asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/)
      ) {
        return true;
      }
      if (isDev && !asset.name.startsWith("static/runtime/")) {
        return true;
      }
      return false;
    }
  ],
});

module.exports = withPWA(nextConfig)
