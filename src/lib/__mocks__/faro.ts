// テスト用 stub — 各テストで jest.mock('@/lib/faro') を呼ぶと自動で採用される。
export const pushPageMeasurement = jest.fn()
export const pushPageEvent = jest.fn()
export const initFaro = jest.fn()
export const getFaro = jest.fn(() => null)
