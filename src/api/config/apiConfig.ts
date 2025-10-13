// eventAbbrはイベント毎に変更する.
const eventAbbr = 'cndw2025'

export const apiConfig = {
  talksEndpoint: `https://event.cloudnativedays.jp/api/v1/talks?eventAbbr=${eventAbbr}`,
  talkEndpoint: `https://event.cloudnativedays.jp/api/v1/talks/`,
  speakersEndpoint: `https://event.cloudnativedays.jp/api/v1/speakers?eventAbbr=${eventAbbr}`,
}
