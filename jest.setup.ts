// Jest 各テスト前後のグローバル準備。
// - モジュールモックのリセット
// - タイマーはテストごとに明示宣言する方針なので afterEach で戻す
afterEach(() => {
  jest.clearAllMocks()
  jest.useRealTimers()
})
