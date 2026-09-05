const envVars = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  eventAbbr: process.env.NEXT_PUBLIC_EVENT_ABBR ?? '',
  dkEventAbbr: process.env.NEXT_PUBLIC_DK_EVENT_ABBR ?? '',
  // ページ表示時間の一時上書き（秒）。基本値は staticConfig（brand）側にあるので
  // 未設定なら空のままにして config に載せない。PAGE3 は「1枚あたり」の秒数。
  transTimePage1: process.env.NEXT_PUBLIC_TRANS_TIME_PAGE1 ?? '',
  transTimePage2: process.env.NEXT_PUBLIC_TRANS_TIME_PAGE2 ?? '',
  transTimePage3: process.env.NEXT_PUBLIC_TRANS_TIME_PAGE3 ?? '',
  debug: process.env.NEXT_PUBLIC_DEBUG ?? '',
  excludedTalks: process.env.NEXT_PUBLIC_EXCLUDED_TALKS ?? '',
}

export type EnvVars = typeof envVars

export type Config = {
  apiBaseUrl: string
  eventAbbr: string
  dkEventAbbr: string
  // 一時上書き用。基本値は brand.page1.seconds / page2.seconds / page3.secondsPerImage
  transTimePage1?: number
  transTimePage2?: number
  transTimePage3?: number
  debug: boolean
  excludedTalks: number[]
}

const config = makeConfig(envVars) as Config

function makeConfig(vars: Partial<EnvVars>): Partial<Config> {
  const conf: Partial<Config> = {}
  if (vars.apiBaseUrl) {
    conf.apiBaseUrl = vars.apiBaseUrl
  }
  if (vars.eventAbbr) {
    conf.eventAbbr = vars.eventAbbr
  }
  if (vars.dkEventAbbr) {
    conf.dkEventAbbr = vars.dkEventAbbr
  }
  if (vars.transTimePage1) {
    conf.transTimePage1 = parseFloat(vars.transTimePage1)
  }
  if (vars.transTimePage2) {
    conf.transTimePage2 = parseFloat(vars.transTimePage2)
  }
  if (vars.transTimePage3) {
    conf.transTimePage3 = parseFloat(vars.transTimePage3)
  }
  if (vars.debug) {
    conf.debug = !!vars.debug
  }
  if (vars.excludedTalks) {
    conf.excludedTalks =
      vars.excludedTalks.split(',').map((t) => parseInt(t)) || []
  }
  return conf
}

export function extendConfig(query: Record<string, string>) {
  Object.assign(config, makeConfig(query))
}

export default config
