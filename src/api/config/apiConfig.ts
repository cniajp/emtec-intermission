// eventAbbrはイベント毎に変更する.
const eventAbbr = 'cndw2025'

// Cloudflare Pages Function プロキシを使用してCORSエラーを回避
const apiProxyBase = '/api/proxy/api/v1'

export const apiConfig = {
  talksEndpoint: `${apiProxyBase}/talks?eventAbbr=${eventAbbr}`,
  talkEndpoint: `${apiProxyBase}/talks/`,
  speakersEndpoint: `${apiProxyBase}/speakers?eventAbbr=${eventAbbr}`,
}
