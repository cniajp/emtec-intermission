// jest.config の setupFiles で読み込まれ、テスト用モジュールが import される前に
// 実行される。config.ts は module 読み込み時点で process.env を評価するため、
// ここで defaults を仕込むのが最も影響が小さい。
process.env.NEXT_PUBLIC_EVENT_ABBR =
  process.env.NEXT_PUBLIC_EVENT_ABBR || 'test-event'
process.env.NEXT_PUBLIC_DK_EVENT_ABBR =
  process.env.NEXT_PUBLIC_DK_EVENT_ABBR || 'test-dk-event'
// NEXT_PUBLIC_TRANS_TIME_PAGE* はここでは設定しない。
// ページ表示時間の基本値は brand（staticConfig）側にあり、テストは brand の値を
// 使う経路を検証する。env/クエリの上書き経路は usePage3ViewModel.test が個別に扱う。
// 空文字だと `if (vars.excludedTalks)` 分岐で undefined のまま残ってしまうので、
// 空配列相当の値を渡す (parseInt('0') = 0 が入るが、fixture の talk id は >0 なので影響なし)。
process.env.NEXT_PUBLIC_EXCLUDED_TALKS =
  process.env.NEXT_PUBLIC_EXCLUDED_TALKS || '0'
