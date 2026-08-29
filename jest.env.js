// jest.config の setupFiles で読み込まれ、テスト用モジュールが import される前に
// 実行される。config.ts は module 読み込み時点で process.env を評価するため、
// ここで defaults を仕込むのが最も影響が小さい。
process.env.NEXT_PUBLIC_EVENT_ABBR =
  process.env.NEXT_PUBLIC_EVENT_ABBR || 'test-event'
process.env.NEXT_PUBLIC_DK_EVENT_ABBR =
  process.env.NEXT_PUBLIC_DK_EVENT_ABBR || 'test-dk-event'
process.env.NEXT_PUBLIC_TRANS_TIME_PAGE1 =
  process.env.NEXT_PUBLIC_TRANS_TIME_PAGE1 || '10'
process.env.NEXT_PUBLIC_TRANS_TIME_PAGE2 =
  process.env.NEXT_PUBLIC_TRANS_TIME_PAGE2 || '10'
process.env.NEXT_PUBLIC_TRANS_TIME_PAGE3 =
  process.env.NEXT_PUBLIC_TRANS_TIME_PAGE3 || '10'
// 空文字だと `if (vars.excludedTalks)` 分岐で undefined のまま残ってしまうので、
// 空配列相当の値を渡す (parseInt('0') = 0 が入るが、fixture の talk id は >0 なので影響なし)。
process.env.NEXT_PUBLIC_EXCLUDED_TALKS =
  process.env.NEXT_PUBLIC_EXCLUDED_TALKS || '0'
