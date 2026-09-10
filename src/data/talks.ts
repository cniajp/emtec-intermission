import { Talk } from './types'

/**
 * Go Conference 2026 (2026-09-11 / 中野セントラルパークカンファレンス)
 * 出典: https://github.com/GoCon/2026
 *   - src/components/timetable/data.json (Sessionize 由来)
 *   - src/components/timetable/manualSessions.ts (基調講演・スポンサー)
 *   - src/components/timetable/sessionGrid.ts / schedule.ts (時刻・部屋)
 */
export const talks: Talk[] = [
  {
    id: 9002,
    trackId: 1,
    title: 'オープニング',
    abstract: '',
    speakers: [{ id: 24, name: '運営' }],
    startTime: '2026-09-11T10:15:00+09:00',
    endTime: '2026-09-11T10:30:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 9003,
    trackId: 1,
    title: 'Open Source, Open World',
    abstract:
      '「OSSをやっている人って、なんかかっこいい。」\nそんな単純な憧れから始めたOSS活動。英語も得意ではなく、知り合いもいない状態からKubernetesへのコントリビューションを始め、気づけば数年間にわたって活動を続けてきました。\n\nなぜOSSを続けてきたのか。OSSに時間を使うことで何が得られるのか。その先にどんな世界があったのか。自身の経験を振り返りながら、OSSに関わり続けることの価値について考えます。',
    speakers: [{ id: 23, name: 'sanposhiho' }],
    startTime: '2026-09-11T10:30:00+09:00',
    endTime: '2026-09-11T11:10:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 1251905,
    trackId: 1,
    title:
      '海上で動くGoサーバー: goroutineとchannelでさばく航行データストリーム',
    abstract:
      '日本周辺では毎年1,700〜1,800隻規模の船舶事故が発生しており、その多くを小型船舶が占めています。事故を減らすには、操船者が周囲の船舶、位置、針路、速度、水深、風などを継続的に把握し、安全な航行判断につなげる仕組みが必要です。\n一方で、海上では通信が不安定で、クラウドや外部APIに常時頼れるとは限りません。このセッションでは、小型船舶や実験艇の船上で動くGoサーバーを想定し、船内や周囲から届く航行データをローカルで処理する設計と実装を紹介します。\n\nサーバーの入力として、AISとNMEA 0183を扱います。AISは、周囲の船舶がVHF帯の電波で送信する位置・針路・速度などの情報を受信する仕組みです。NMEA 0183は、GPS、電子コンパス、水深計、風向風速計などの船内機器が使うテキストベースの通信フォーマットです。これらをAIS受信機、シリアル接続、USB変換、複数の船内機器の信号をまとめる装置などを通じてGoサーバーへ取り込みます。\nこれらのデータは形式、頻度、信頼度が異なり、値が古い、複数の情報源が矛盾する、といった状態も起こります。そのため、単に保存するだけではなく、欠損、遅延、古い情報、根拠含めて判断できる形に整える必要があります。\n\nGoは、標準ライブラリによるI/O処理、goroutineとchannelによる並行処理、contextによる停止制御を組み合わせやすく、複数のリアルタイム入力を扱うローカルサーバーに向いています。AIS/NMEAのparser、複数入力をgoroutineとchannelでまとめる構成、最新状態の集約、古くなった情報の判定などをコードモ踏まえて説明します。\n\nこの発表では、海事ドメインを題材にしながら、不完全でリアルタイムに流れ続けるデータをGoでどう受け、どう使い、どう繋げるかを扱います。IoT、設備監視など、複数の不完全な入力を扱うGoアプリケーションにも応用できる内容です。\n',
    speakers: [{ id: 1, name: 'Atsuki Seo' }],
    startTime: '2026-09-11T11:25:00+09:00',
    endTime: '2026-09-11T12:05:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 9101,
    trackId: 1,
    title: '株式会社ミラティブ: 動画配信サーバーにおけるGC負荷低減の取り組み',
    abstract:
      '動画配信サーバーでは、動画セグメントの処理ごとに、大きく短命なメモリ領域の高頻度な割り当てが発生します。こういったワークロードにおいて、Goランタイムからのメモリ割り当てではオブジェクト数とサイズが爆発し、GCのスキャンやGCアシストによる負荷が激増、結果的にスループットが低下します。上記の問題に対応するためにとっている、mmapによる手動メモリ管理の手法と類似する手法、それによるアプリケーションの性能向上について紹介いたします。',
    speakers: [{ id: 2, name: '八谷航太（ヤタガイ コウタ）' }],
    startTime: '2026-09-11T12:20:00+09:00',
    endTime: '2026-09-11T12:35:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 9102,
    trackId: 1,
    title:
      '株式会社エウレカ: Podは生きているのにGoだけが落ちる：GOGCとGOMEMLIMITで追うInvisible OOM Killの謎',
    abstract:
      '【ショートセッション／中級者向け】\n\n我々が提供するペアーズの本番運用中のGo APIサーバーで、まれにtarget 5xxが発生しGoプロセスだけがpanic logなしに落ちる事象が続いていました。一方で、PodはOOMKilledにならず、同じコンテナ内のNginxは生き続けており、Kubernetes上の状態や通常のアプリケーションログだけでは原因を特定しづらい、いわゆる“Invisible OOM Kill”と呼べる状態でした。\n\n本セッションでは、この見えにくい障害を、Goランタイム・Kubernetes・コンテナ内の複数プロセスという複数のレイヤーから一つずつ紐解いていきます。なぜPodは生きているように見えたのか、なぜGoプロセスだけが落ちたのか、なぜメモリ使用量が少なく見えていたのにOOMが起きたのか。調査の過程で見えてきたGOGCとGOMEMLIMITの関係、Go以外のメモリを考慮した値決め、GCやレイテンシに与える影響について、実際のメトリクスと意思決定を交えて紹介します。\n最終的には、本番APIサーバーの安定性を高めながらmemory limitを8GBから3GBへ削減しました。その過程で得られた、Goアプリケーションをコンテナ環境で安全かつ効率的に動かすための監視・設定・ロールアウトの考え方を共有します。',
    speakers: [{ id: 3, name: 'Takeshi Watanabe' }],
    startTime: '2026-09-11T12:45:00+09:00',
    endTime: '2026-09-11T13:00:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 9103,
    trackId: 1,
    title:
      'エムスリー株式会社: 更なる可用性を求めて、5年間運用したKotlinのアプリケーションをGoでリプレイスする話',
    abstract:
      'クリニック向けの予約・受付・キャッシュレス決済サービス「デジスマ診療」では長らくKotlinのアプリケーションをKubernetes上で運用してきました。\nデジスマ診療はクリニックの診療オペレーションに組み込まれており、高い水準のシステムの可用性が求められます。そこで更なる可用性の向上のため、KotlinのアプリケーションをGoでリプレイスする意思決定をしました。\n本セッションでは、Kotlin（JVM）アプリケーションを運用して見つかった課題と、それをGoでリプレイスする意思決定に至った経緯や効果についてお話しします。',
    speakers: [{ id: 4, name: '田口 健介' }],
    startTime: '2026-09-11T13:10:00+09:00',
    endTime: '2026-09-11T13:25:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 1264506,
    trackId: 1,
    title: 'Go における FFI のこれまでとこれから',
    abstract:
      'FFI ( Foreign Function Interface ) とは、他言語で実装された機能を呼び出すための仕組みです。とりわけ、C/C++言語で実装されたライブラリの機能を別の言語から呼び出す用途で広く利用されています。\n\nある言語から他の言語で実装された機能を呼び出すためには、引数や返り値を変換したり、メモリ管理やコールバックのようなトランポリンを適切に処理する必要があります。\n加えて、C/C++ のような言語の場合はコンパイルが必要になるため、どのコンパイラ・リンカを使ってどのようなオプションでビルドし、その成果物をどうやって利用するかを考える必要があります。\n\nGo 言語では cgo を利用することで C/C++ 言語の機能を利用することができ、C/C++言語向けのコンパイラやリンカの設定を適切に行うことで、Go のビルド時に同時に C/C++ 言語のコンパイルやリンク処理を行うことができます。\nそれだけでなく、コンパイルに必要な C/C++ のソースコードを Go コードと一緒に配布し、Go ビルド時に同時にコンパイルしたC/C++の成果物を Go コードの成果物と合わせて静的リンクすることで、単一バイナリとして配布することも可能です。\nこのような仕組みは、RubyやPerlのように動的リンクが必要なスクリプト言語でFFIを利用する場合と比べて、ポータビリティが高く、シングルバイナリを作成することが得意な Go との相性も抜群です。\ncgo が使いやすいこともあり、cgo を利用した Go のライブラリは多く作られ、広く利用されてきました。\nしかし、cgo を利用する以上、Go だけでビルドが完結する世界を作ることはできません。clang などの C/C++ コンパイラがインストールされている必要があるだけでなく、Go の長所のひとつであるクロスコンパイルを利用したマルチアーキテクチャに対応することも困難です。 このことから、cgo は最良の選択肢とまでは言えませんでした。\n\nしかし近年、WebAssembly が普及したことで、Go の FFI のあり方が変わりつつあります。\nC/C++ ライブラリをあらかじめ WebAssembly に変換し、Go では WebAssembly のランタイムを組み込みつつ、変換した WebAssembly を embed パッケージを使って埋め込んで実行時にロードすることで、シングルバイナリで配布するメリットはそのままに、cgo を使わず、クロスコンパイルも可能なライブラリを作ることができるようになったのです。\nこれにより、WebAssembly を利用した FFI を採用した Go のライブラリが増えています。\n私自身、過去にこの方法を利用してライブラリを作成しました。\nしかし、このアーキテクチャも完璧とは言えません。WebAssembly を利用することによるパフォーマンス面でのオーバーヘッドやメモリ管理の問題はありますし、そもそも C/C++ ライブラリを Go から利用しやすい形の WebAssembly に変換するのも大変です。\n\nそこで私は、C/C++ ライブラリから Go から利用しやすい形の WebAssembly を自動的に作るためのツールの作成や、生成された WebAssembly を Goコード(とPlan9 Assembly) に自動変換する仕組みを作成することで、C/C++ ライブラリから Go + asm に自動的に変換するパイプラインをCI上で完結できる仕組みを作りました。\n\nこれらを利用することで、WebAssembly の課題だったパフォーマンスの側面を解決しつつ、C/C++ の機能を Go から利用できる新しい FFI のアーキテクチャを構築できるのではないかと考えています。\n\n本発表では、過去に Perl や Ruby、Go などいくつかの言語で FFI を利用してライブラリを開発してきた経験や、先に挙げたツールを作成したことによる知見を活かし、Go と FFI がいままでどのように付き合ってきて、これからどうなっていくのかを自分なりにまとめた結果を発表したいと考えています。\n\nただ、自身が開発したツールを使えばこうできます、という話ではなく、FFI とはどのようなもので、ライブラリを作るにはどのような注意が必要なのか、Go でそれを解決するにはどのように実装する必要があり、必要となる作業をできるだけ簡単にするためにどんなものを作り、それによって何が解決したのかといったように、経験から得た知見を体系的に説明します。\n\nこの発表を聞くことで、自分で Go で FFI を利用したライブラリを開発するにはどのような技術・知識が必要かを知るとともに、過去、そして未来のアーキテクチャについて理解を深めることで、自分なりの Go と FFI のあり方について考える機会になっていただければ嬉しいです。',
    speakers: [{ id: 5, name: 'goccy' }],
    startTime: '2026-09-11T14:00:00+09:00',
    endTime: '2026-09-11T14:40:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 1264549,
    trackId: 1,
    title: 'synctest時代のhttptest: Go 1.27で変わるHTTPサーバテストの裏側',
    abstract:
      'Go 1.25 で正式導入された `testing/synctest` は、並行処理コードのテストを決定的に扱うための仕組みです。`synctest` の bubble 内では goroutine の待機状態を観測でき、時間の経過も fake clock によって制御できます。\n\n一方で Go 1.26 までの`net/http/httptest.Server` は通常のサーバと同じく OS のネットワークスタックを使うため、`synctest` と組み合わせにくい場面がありました。そのため、HTTP サーバや API クライアントのテストでタイムアウトやバックオフを扱いたくても、`synctest` による時間制御の恩恵を受けにくい問題がありました。\n\nGo 1.27 では `net/http/httptest` の `synctest` 対応により、HTTP サーバや API クライアントのテストを `synctest` の bubble 内で扱いやすくなります。この変更を支えるのが、標準ライブラリ内部に追加された `internal/nettest` による in-memory fake networking 実装です。\n\nhttps://github.com/golang/go/issues/76608\n\n本発表では、まず `synctest` がどのように時刻とgoroutineの待機状態を扱うのか軽くおさらいします。そのうえで、従来の `httptest.Server` がなぜ `synctest` と組み合わせにくかったのかを確認し、Go 1.27 で追加される `httptest` の `synctest` 対応によって、Web サーバや API クライアントのテストをどのように書けるようになるのかを紹介します。\n\n後半では `internal/nettest` の実装を読み解き、`internal/nettest`のインメモリネットワークがどのように `httptest` と `synctest` をつないでいるのかを解説します。\n\n### タイムライン\n\nこの発表ではGo 1.27から変わる`synctest`を使ったHTTPサーバテストについて以下の順に話す予定です。\n\n- synctestが何をしているのかおさらい\n- Go 1.26 以前の `httptest` がなぜ `synctest` と組み合わせにくかったのか\n- Go 1.27 の `httptest` の `synctest` 対応で書けるようになるテスト例\n- `internal/nettest` deep dive: fake listener / fake connection の設計\n- まとめ\n\n### 本セッションで得られること\n\nこのセッションでは、以下を持ち帰れます。\n\n- `httptest` と `synctest` を使って、より速く安定した HTTP/API テストを書くための考え方\n- OS の I/O wait を介さない in-memory なネットワークモデルの仕組み\n- `internal/nettest` が `httptest` と `synctest` をどのようにつないでいるのか',
    speakers: [{ id: 6, name: 'budougumi0617' }],
    startTime: '2026-09-11T15:05:00+09:00',
    endTime: '2026-09-11T15:25:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 1264524,
    trackId: 1,
    title: '標準パッケージに uuid が追加された背景から見る Go らしい意思決定',
    abstract:
      'Go 1.27 からは標準パッケージに uuid 実装が追加されることが予定されています。\n\nが、この uuid 実装の追加についてのプロポーザル自体は 2018 年ころから出ており、一度クローズされています。\nhttps://github.com/golang/go/issues/23789\n\nhttps://go.dev/doc/faq#x_in_std にもある通り、Go がある処理を標準パッケージとして実装するためには、それが標準パッケージたりうる理由を満たす必要があります。これらを説明しつつ、このプロポーザルがクローズされた理由に触れます。\n\nしかし Go 1.27 でリリース予定なことからわかる通り、その後別の uuid 実装のプロポーザルが再提案され、そちらは議論を経て accept されています。\nhttps://github.com/golang/go/issues/62026\n\n時を経てどのように状況が変化し標準パッケージで実装するに足る価値を示したのか、またどのような議論を経て accept され実装につながったのかを解説します。\n\nまた、上記プロポーザルでは言及されていませんが、uuid に関するありがちな実装ミスとしては rand source の選択や利用方法の誤りがなど挙げられます。例えば著名なOSSである https://github.com/satori/go.uuid では過去に rand 処理の誤った利用に起因する CVE-2021-3538 が発生しました。この内容についても軽く触れ、セキュリティの目線でも標準ライブラリとして実装することの意義を補強することを試みます。\n\n実際に実装された処理群なども非常に Go らしい特徴を備えていて、主に uuid v4 および uuid v7 のサポートのみとなっています。これらについては実際の利用傾向などを踏まえてメンテ可能な必要最小限の仕様を実装するような議論がありました。関連する議論の流れやどのように意思決定したのかをご紹介できればと思います。\n\n総じて標準パッケージへの uuid の追加を例に取り上げながら、 Go が標準パッケージに価値ある処理群を実装していくための考え方などを紹介できればと思います。',
    speakers: [{ id: 7, name: 'convto' }],
    startTime: '2026-09-11T15:40:00+09:00',
    endTime: '2026-09-11T16:00:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 1263399,
    trackId: 1,
    title: 'OpenTelemetry eBPF Instrumentationの舞台裏',
    abstract:
      'OpenTelemetryの「ゼロコード計装」はeBPFを使えばアプリのコードを1行も変えずにHTTPやgRPCのトレースが取れる、と魔法のように語られます。ですが、その魔法をGoバイナリに対して実現するのは、他のどの言語よりも困難です。\n\n本セッションでは、Grafana BeylaがOpenTelemetryプロジェクトへ寄贈され生まれた OpenTelemetry eBPF Instrumentation (OBI) を題材に、「GoバイナリにeBPFで計装する」という行為がGoランタイムのどんな性質と衝突するのかを詳細に解説します。\n\n具体的には、(1) Goの可動スタックゆえにuretprobeが使えずクラッシュする問題と、関数内の全RET命令にuprobeを置く回避策、(2) Go 1.17以降のレジスタベース呼び出し規約（ABIInternal）と、現在のgoroutineを指すgポインタがレジスタに保持される仕組み、(3) Goのバージョンごとに変わる内部構造体のフィールドオフセットを、外部のオフセットテーブルで追従し続ける運用、(4) goroutineの親子関係を辿ってコンテキストを伝搬する手法とその制約、を順に見ていきます。\n\n最後に、これらの困難に対してGo本体側（ランタイム）がどう向き合ってきた／こなかったのかを、flight recorderやgoroutine leak profileなど近年のオブザーバビリティ向上と対比して議論します。\n\nGoとオブザーバビリティ製品に長らく関わってきた経験により、Go Conferenceであまり触れられてこなかったeBPFに関して、参加者の理解を高める発表にします。',
    speakers: [{ id: 8, name: 'ymotongpoo' }],
    startTime: '2026-09-11T16:25:00+09:00',
    endTime: '2026-09-11T17:05:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 1255534,
    trackId: 1,
    title:
      'range over func 2年間の軌跡 — Issue #56413 はGoのエコシステムをどう変えたか',
    abstract:
      '「コレクションを走査する」という、どのGoコードにも存在する処理。なのに、filepath.Walk・sync.Map.Range・flag.Visitはすべてシグネチャが異なります。なぜGoには長年、統一されたイテレーション方法がなかったのか。そして2022年にGitHubに立てられたDiscussion#56413から始まった議論が、Go 1.23の range over func として結実するまでに何が起きたのか。\n\n本セッションでは、IssueとPRの議論を丹念に追うことで見えてくる「設計の決断」と、リリースから2年間でGo本体・標準ライブラリ・OSSエコシステムが実際にどう変化したかを、Before/Afterのコードで具体的に示します。\n\n業務でまだ使えていない方にこそ聞いてほしいセッションです。\n変化の全体像を知ることで、「自分のコードのどこに使えるか」が見えてくるはずです。\n\n【扱う内容】\n・Before: なぜ統一されたイテレーション方法がなかったか\n・設計の決断: なぜinterfaceではなく関数型になったのか\n・After(1): 標準ライブラリに加わったiter.Seq対応API\n・After(2): OSSエコシステムの2年間の変化と現在地\n・実践: []T返しとiter.Seqの使い分け判断基準',
    speakers: [{ id: 9, name: '國分 竜二' }],
    startTime: '2026-09-11T17:20:00+09:00',
    endTime: '2026-09-11T17:40:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 9004,
    trackId: 1,
    title: 'クロージング',
    abstract: '',
    speakers: [{ id: 24, name: '運営' }],
    startTime: '2026-09-11T17:45:00+09:00',
    endTime: '2026-09-11T18:00:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 1251920,
    trackId: 2,
    title:
      'When Goroutines Are Not Enough: Runtime Locality in High-Throughput Go',
    abstract:
      'Goでは、goroutineによってOS threadやCPU coreをほとんど意識せずに並行処理を書けます。この実行場所を隠す抽象化は、Goの大きな強みです。\n\n一方で、通信トラヒック、メトリクス、ログ、message queueのような高スループットなデータストリーム処理では、どのデータをどのqueueで受け、どのgoroutineが読み、どのCPU coreで実行されるかが性能差として現れることがあります。goroutineは並行性を表現する単位ですが、実行場所やローカリティを保証する単位ではないためです。\n\n本発表では、自作のpacket capture toolを題材に、高スループットが求められるGoプログラムを改善していく過程を紹介します。このツールでは、Linuxのper-CPU BPF ring bufferからpacket eventを読み出します。BPF側ではCPUごとにqueueが分かれ、Go側ではreader goroutineが各queueを読みます。この構造では、reader goroutineを増やすだけでは性能が伸びず、queue、goroutine、OS thread、CPU coreの対応関係が性能に効くようになりました。\n\nまた、高負荷時にはpprof上でruntime.asyncPreemptが大きく目立つようになりました。本発表では、これを単にGo runtimeの遅さとして読むのではなく、hot loop、非同期プリエンプション、scheduler、CPU profileの見え方としてどう解釈するかを整理します。\n\nこの事例から持ち帰れるのは、runtime.LockOSThread()やCPU affinityの使い方そのものではありません。Goの抽象を通常の設計の前提としながら、どの条件で必要最小限だけ下の層を見るべきかを判断するための考え方です。pprofに現れるruntime関数の読み方や、データの分割単位がqueue、goroutine、CPU coreへどう対応しているかを、実測に基づいた学びを提供します。\n\n## 想定している話の流れ\n0-4分: 問いの提示\ngoroutineは並行性の単位だが、ローカリティの単位ではない\n\n4-8分: 普通のGo設計\nflow、shard、partition、queueをgoroutineへ分散する設計\n\n8-13分: 自作ツールの構造\nper-CPU BPF ring bufferとreader goroutineの対応関係\n\n13-20分: 最初の限界\nreader goroutineを増やすだけでは性能が伸びない理由を、drop、latency、pprofから見る\n\n20-27分: pprofとruntime.asyncPreemptの読み方\nruntime関数が見えたときに、原因と現象をどう切り分けるか\n\n27-35分: 実行場所を制御する\nLockOSThread、CPU affinity、same-CPU reader、split-coreの効果と副作用\n\n35-40分: 一般化\nmetrics、logs、message queueなどのsharded consumerへ応用する\n\n## 想定している聴講者\n- Goで高スループットなサーバーやデータ処理基盤を書いているエンジニア\n- flow、shard、partition単位でgoroutineへ処理を分散している人\n- pprofでruntimeやschedulerまわりの関数が目立ったとき、解釈に悩んだことがある人\n- Go runtimeの抽象とOS scheduler、CPU coreの境界に興味がある人',
    speakers: [{ id: 10, name: 'Takeru Hayasaka' }],
    startTime: '2026-09-11T11:25:00+09:00',
    endTime: '2026-09-11T12:05:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 1236917,
    trackId: 2,
    title:
      'Go におけるコンソールゲーム開発最前線 〜非対応環境でランタイムを動かす技術〜',
    abstract:
      '# 概要\n\nGo はサーバーサイドや CLI ツールで広く使われています。しかし、 Nintendo Switch や Xbox などのゲームコンソールには対応していません。そんな中、 Go の 2D ゲームエンジン「Ebitengine [1]」は Nintendo Switch 及び Xbox への対応を果たしました。 2026 年 5 月時点で、発売予定を含め 10 本以上のコンソールゲームに採用されています [2]。\n\n本セッションでは、本来非対応であるコンソール環境で、どのように Go ランタイムを動かしているのかを解説します。 Ebitengine の開発者であり、 Odencat 株式会社の CTO として実際にゲームをリリースし続けている立場から、その技術的な裏側と実装について詳しく説明します。\n\n[1] https://ebitengine.org\n[2] https://ebitengine.org/ja/showcase.html\n\n# 主なトーク内容\n\n* Go ランタイムの仕組みとコンソール対応の現実\n* `-overlay` フラグを使ったシステムコールの書き換え\n* グラフィックスライブラリの対応\n* プラットフォームごとの対応\n* 開発からリリースまでの流れ\n* 今後の課題\n\n# 対象聴衆\n\n* Go のランタイムや低レイヤ、システムコールに関心がある方\n* `-overlay` などのビルドオプションに興味がある方\n* Go によるクロスプラットフォーム開発や、ゲーム開発の可能性を知りたい方',
    speakers: [{ id: 11, name: 'Hajime Hoshi' }],
    startTime: '2026-09-11T14:00:00+09:00',
    endTime: '2026-09-11T14:20:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 1237370,
    trackId: 2,
    title:
      'Goと一緒に育つCLI — 9年のOSS保守で見た標準ライブラリとtestingの進化',
    abstract:
      '標準入力を受け取り、チャットサービスへ通知する小さなGo製CLIを、約9年にわたって保守してきました。\n\nこの発表では、そのCLIの実装と変更履歴を題材に、Go本体・標準ライブラリ・testingの進化が、小さなCLIの設計と保守をどのように変えてきたかを紹介します。\n\n初期の実装では、goroutine、channel、timer、signal handlingを手組みし、非同期処理のテストも `runtime.GOMAXPROCS(1)` や短い `time.Sleep` に頼っていました。また、ホームディレクトリ取得やエラーのwrapなど、今では標準ライブラリで自然に書ける処理にも外部パッケージを使っていました。\n\nそこから、`os.UserHomeDir`、Go 1.13のerror wrapping、`signal.NotifyContext`、`context.WithoutCancel`、`T.Setenv`、`T.Context()`、そして `testing/synctest` へと移り変わる中で、コードは少しずつ「外部依存や偶然に頼るもの」から「Goの標準機能で意図を表現できるもの」へ変わっていきました。\n\n特に中心に置くのは、非同期処理のテストです。かつてはruntime schedulerの挙動に依存していたテストが、`testing/synctest` によって、goroutineの停止状態を明示的に待てるテストへ変わった過程を、実際のコードの変遷をもとに紹介します。\n\nGoの互換性と標準ライブラリの継続的な進化は、大きなプロダクトだけでなく、個人が長く保守する小さなCLIにも届いています。この発表では、ひとつのツールを9年保守してきた経験を通じて、Goと一緒に遠くまで進むとはどういうことかを具体的に示します。\n\n## 参加者が得られるもの\n\n* goroutine / channel / timerを含むCLI処理のテスト設計\n* `runtime.GOMAXPROCS(1)` や `time.Sleep` に頼る非同期テストの問題点\n* `testing/synctest` による非同期テストの改善例\n* `signal.NotifyContext` を使ったCLI shutdown設計\n* `context.WithoutCancel` を使うべき場面と、timeoutを戻す注意点\n* `os.UserHomeDir` やGo 1.13 error wrappingなど、標準ライブラリの進化による外部依存削減\n* `T.Setenv` / `T.TempDir` / `T.Context()` などによるテスト保守性の改善\n* 小さなOSSや社内ツールを、Goの進化に合わせて長く保守していく考え方\n\n## 対象者\n\n* GoでCLIや小さなツールを書いている人\n* goroutine / channel / context を使った処理のテストに悩んだことがある人\n* 社内ツールやOSSを長く保守している、またはこれから保守していきたい人\n* Goの標準ライブラリやtestingの進化を、実例ベースで知りたい人\n\n## 対象レベル\n\n**中級者**\n\ngoroutine、channel、context、testingの基本を知っていると理解しやすい内容です。\nただし、個別のAPIは背景から説明するため、CLIやテスト改善に関心がある初級者にも役立つ構成にします。',
    speakers: [{ id: 12, name: 'Tatsuya Kaneko' }],
    startTime: '2026-09-11T14:35:00+09:00',
    endTime: '2026-09-11T14:55:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  // {
  //   id: 1257333,
  //   trackId: 2,
  //   title: 'Goコンパイラを作ってGoをもっと理解する',
  //   abstract:
  //     'プログラミング言語を学ぶ 1 つの手段として、コンパイラの自作があります。既存の言語のコンパイラを学習目的で自分で書くような場合は、C 言語を題材とすることが多く、Go のコンパイラを書く例は非常に少ないです。しかし、Go エンジニアにとって Go コンパイラ自作は、普段何気なく使っている構文、型、スコープ、ポインタ、関数呼び出しなどを、実装する側から見直せる有効な学習手段です。\n発表者は Go のソースコードの小さなサブセットを受け取ってアセンブリを出力するコンパイラを Go で実装し、セルフホストを達成しました。この経験をもとに、Go エンジニアが Go の仕様を知り、Go をもっと好きになるための手段としての Go コンパイラ自作を紹介します。セッション後には、参加者が自分でも Go コンパイラを書き始めようと思うような状態を目指します。\n\nセッションでは以下の内容の発表を行います。\n\n1. 前提知識の導入\n\n実際に自作コンパイラが動く様子を示しながら、コンパイラの役割やその簡単な仕組み、セルフホストの意味などの前提知識を説明します。\n\n2. 自作 Go コンパイラを作るにあたっての課題\n\nGo コンパイラを完成させるために、様々な課題を解決する必要がありました。その中でも、特に Go とのかかわりが深い課題とその解決策を紹介することで、Go コンパイラを作る過程の一部を追体験してもらうことを考えています。例として、「言語機能の実装コストとコンパイラ記述の楽さのトレードオフ」や、「ローカル変数のポインタをスコープ外で扱えるようにするためのエスケープ解析」があります。\n\n3. Go コンパイラを作ると得られるもの\n\nGo のコンパイラを書くと、普段 Go を使うだけでは得られない多くの学びがありました。得られた学びはアセンブリやシステムコールなど、Go に関するものに限りませんが、このセッションでは特に Go の仕様について得られた知識と、それがコンパイラ実装でどのように生かされたかを紹介します。\n\n\n本セッションは中級者向けであり、Go や Go コンパイラの内部実装に関する深い知識は要求されません。Go の基本的な機能をコンパイラの実装対象として見直すことで、コンパイラ自作の第一歩とすることを目指します。',
  //   speakers: [{ id: 13, name: 'ikura-hamu' }],
  //   startTime: '2026-09-11T15:05:00+09:00',
  //   endTime: '2026-09-11T15:25:00+09:00',
  //   talkDifficulty: '',
  //   talkCategory: '',
  //   conferenceDayId: 1,
  //   showOnTimetable: true,
  // },
  {
    id: 1263610,
    trackId: 2,
    title: 'TinyGo 開発サイクルを高速化する：Go で作るエミュレータ入門',
    abstract:
      '# 概要\nTinyGo で組み込み開発をしていると、コードを書くたびに実機へ書き込んで確認するサイクルが開発体験のボトルネックになります。私はこの課題を解決するために TinyGo 向けの開発エミュレータを Go で自作し、設計の失敗と改善を繰り返してきました。\n\n辿り着いたのは build tag・net/rpc・Ebitengine という Go の仕組みだけを組み合わせた設計です。同じコードがそのまま実機でもエミュレータでも動き、ファイルを保存するたびに即座に動作確認できるホットリロード開発体験を実現しました。\n\n本セッションでは「作っては壁にぶつかり、設計を作り直す」実体験を通じて、TinyGo の開発サイクルを高速化するアプローチと、Go のエコシステムを活かした開発ツール設計の勘所を共有します。\n\n# 対象者\n1. Go を学び始めて 1〜2 年ほどの方\n2. TinyGo や組み込み開発に興味があるが何から始めればいいかわからない\n3. Go を使って開発ツールを作ることに興味がある\n\n# 詳細説明\n1. なぜこのテーマか\nTinyGo は Go の知識をそのまま組み込み開発に活かせるツールチェーンですが、コード変更のたびに実機へ書き込むフィードバックループが開発速度の足を引っ張ります。このサイクルを短縮するために、デスクトップ上で動作するエミュレータを自作しました。その過程で向き合った設計の選択と失敗が、このセッションの主な題材です。\n\n2. TinyGo と Go の違いを理解する\nbuild tag による実機/デスクトップの切り替え・標準ライブラリの制約など、TinyGo 固有の事情を整理します。この違いを理解することが、エミュレータ設計の出発点になります。\n\n3. v1：AST 書き換えアプローチとその限界\n最初の実装は Go の AST を使って TinyGo 固有の import をスタブに書き換える方式でした。ユーザーのコードを無改変のまま動かすシンプルな発想でしたが、対応パッケージのハードコード・起動のたびに走る go mod tidy の通信コスト・ウィンドウが閉じるホットリロードなど、実用上の限界が積み上がりました。この失敗の過程が、次の設計判断の土台になります。\n\n4. 設計の刷新：build tag × net/rpc × Ebitengine\n課題を受けて設計を根本から見直しました。Ebitengine で Wio Terminal の UI を表示するサーバーと、build tag で実機/デスクトップを切り替えるクライアントラッパーを分離する構成です。net/rpc・build tag・Ebitengine という Go 標準・エコシステムの組み合わせだけで、ユーザーは import を変えるだけで同じコードが実機でもエミュレータでも動きます。\n\nUI に Ebitengine を採用した理由はシンプルな API や Go 界隈での実績だけではありません。TinyGo 向けゲームエンジン koebiten は Ebitengine にインスパイアされた API を持つため、koebiten で書いた TinyGo コードがほぼそのまま PC でも Ebitengine として動きます。この対称性があるからこそ、「実機用のコードをそのままデスクトップで確認する」 という体験が自然に成立します。\n\n\n5. ホットリロードで変わる開発体験\nサーバーを起動したままユーザーコードだけを再起動することで、ファイル保存 → エミュレータ上で即動作確認というサイクルを実現します。実機への書き込みは最終確認だけで済み、普段の Go 開発と変わらないスピード感で TinyGo を書けるようになります。\n\n6. 今日から始めるには\n```\ngo install github.com/kurakura967/wiodisplay/cmd/wio-emu@latest\n```\n実装リポジトリ：https://github.com/kurakura967/wiodisplay\n\n\n# 聴講者が持ち帰れること\n1. TinyGo と通常の Go の違い（build tag・標準ライブラリの制約）\n2. build tag を使って実機/デスクトップを同一コードで切り替える設計パターン\n3. koebiten × Ebitengine の対称性を活かした実機/PC 共通コードの設計パターン\n4. Go のエコシステムを組み合わせて開発ツールを設計するアプローチ\n\n\n# セッション構成（20分）\n時間/内容\n1分/自己紹介\n3分/TinyGo とは・通常の Go との違い\n2分/課題：実機依存の開発サイクルのボトルネック\n3分/AST 書き換えとその限界\n5分/設計の刷新：build tag × net/rpc × Ebitengine\n3分/ホットリロードで変わる開発体験\n3分/まとめ・go install で今日から始めるには\n\n# レベル\n初級者向け\n',
    speakers: [{ id: 14, name: '倉澤大樹 Hiroki Kurasawa' }],
    startTime: '2026-09-11T15:40:00+09:00',
    endTime: '2026-09-11T16:00:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 1263912,
    trackId: 2,
    title:
      '標準ライブラリをどこまで信じるか — 900アプリを支えるプラットフォームへのファイルアップロード導入から学ぶ io・mime・multipart',
    abstract:
      'ユーザーが画像をアップロードできるようにする——ありふれた要件に見えて、いざ本番に載せようとすると不安は次々わいてきます。巨大なファイルでメモリは膨らまないか、拡張子を偽装されないか、見慣れない形式が来たら壊れないか。\n\nこのセッションを通して伝えたいことは、こうした不安に対して「手軽な標準APIをそのまま信じるか、それとも一段下りて挙動を自分の目で確かめるか」をどう判断するか、という設計の勘所です。\nio・mime・multipart の挙動を一つずつ読み解きながら、その判断の拠り所を一緒に考えていきます。\n\n題材は、900以上のアプリが同居するモバイルアプリ基盤に、ユーザーからのファイルアップロードを初めて導入した実装です。\n一つの実装をすべてのアプリが共有するため、どれか一つの考慮事項を見逃しても影響は全アプリに波及するため、その対応は自ずと慎重にならざるを得ません。\nただ、扱う課題の多くはファイルアップロードを書いたことのあるGoエンジニアなら出会うものです。\n実装で向き合った勘所のうち3つを、要点を抜き出したサンプルコードを交えて共有します。\n\n\n1. r.ParseMultipartForm() に丸投げしてよいか — メモリと向き合うストリーミング処理\n\nParseMultipartForm() は手軽で、多くのユースケースでは妥当な選択肢です。一方でリクエスト全体をメモリ／一時ファイルに展開するため、不特定多数からのファイルを受ける今回の要件では別の手段を選びました。\n代わりとして採用した、パートを1つずつストリーミング処理し、io.EOF を検知する前にサイズを累積チェックして上限超過を即座に弾く実装を紹介します。\n\n\n2. ファイルの拡張子を信じてよいか — content sniffing による MIME 判定\n\nファイル名の拡張子は攻撃者が自由に詐称できます。\n先頭512バイトのバイナリから実際の中身を判定する content sniffing（mimetype.Detect）の実装と、io.LimitReader での先頭読み出し、検証後に Seek(0, io.SeekStart) で位置を巻き戻す副作用の管理などを解説します。\nまた、おまけ要素として拡張子を偽装したファイルをテストでどう弾いているかなども合わせて示します。\n\n\n3. mime はどこまで面倒を見てくれるのか — HEIC が教えてくれた OS 依存の設計\n\n多様なアプリのユーザーが集まるプラットフォームでは、iPhone から送られてくる HEIC/HEIF は「例外的な形式」ではなく、日常的に受け止めなければならない入力です。\n\nところが、この iPhone 標準フォーマットは Go 標準 mime パッケージの組み込みテーブルには登録されていません。\n\n調査を進める中で分かったのは、mime.ExtensionsByType が不足分を OS 上の MIME データベース（/etc/mime.types など）から補う設計になっていることでした。そのため、実行環境によっては同じ MIME Type に対して拡張子を解決できたりできなかったりします。\n\nこれは欠陥ではなく、mime パッケージがどのように MIME 情報を管理するかという設計によるものです。本セッションではソースコードを追いながら、mime がどこから MIME 情報を取得し、なぜ環境によって結果が変わるのかを確認します。\n\nまた、900以上のアプリが利用する共通基盤において、このような環境依存性をどのように評価し、どのような選択肢を検討したのかについてもお話しします。\n\n\n以上三章構成で、io・mime・multipart というベーシックな標準パッケージの挙動を一つずつ確かめていくという地味で実直な積み重ねが、900以上のアプリを持つプラットフォームを支える堅牢なファイルアップロードの基盤になるというお話を持ってきました。\n\nファイルのアップロードについてはあくまで一例にすぎず、いかなる実装においても同様かと思いますが、便利な標準パッケージの関数やメソッドをそのまま信じるて使う前にその挙動を自分の手で確かめてみる姿勢によって、コードの品質が劇的に向上するかもしれません。\n\nこのセッションが、あなたの次の実装を一歩堅牢に、かつ高品質にするヒントになれば嬉しいです。',
    speakers: [{ id: 15, name: 'Takuya Sakamoto' }],
    startTime: '2026-09-11T16:25:00+09:00',
    endTime: '2026-09-11T17:05:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 1264230,
    trackId: 2,
    title:
      'そのリトライ、死んだコネクションを使い回していませんか ── GoのHTTPクライアントとHTTP/2を実プロダクト障害から学び直す',
    abstract:
      'グループ会社で内製している基盤サービスを呼び出す自社製のGo Client SDKで、ある日突然、HTTP/2コネクション起因のタイムアウトが断続的に発生するようになりました。対策前は1日数十件オーダーで手動対応が必要となる状態でした。根本原因をすぐに特定することはできませんでしたが、k8sのpodごとのログを観察するうちに「何らかの理由で死んだコネクションを net/http が再利用し続けている」という仮説にたどり着きました。実際、リトライを追加するだけでは、同じ死んだコネクションでもう一度失敗するだけで、問題は解決しませんでした。\n\n本セッションでは、この障害の調査から解決までを追体験する形で、GoでHTTPクライアントを実装・運用する際の判断ポイントを共有します。\n\n扱う内容:\n\n- HTTPコネクションの基本と、HTTP/2のコネクション管理の特徴（本障害の理解に必要な範囲で）\n- net/http のコネクションプールの仕組み\n- GoでHTTPクライアントを実装するうえでの勘所と落とし穴:\n    - 単純にリトライしても、死んだコネクションを再利用してまた失敗するという罠\n    - SendPingTimeout + PingTimeout < リクエストのcontextタイムアウト のように、各パラメータを根拠を持って決める方法\n\n仮説に基づく対策を入れた経路では問題が収束し、入れていない経路では再発し続けたことで、見立ての正しさを確認できました。コネクション断自体は今も起きていますが、この設計に変えてからは手動対応が一切不要となり、障害件数ゼロを維持しています。コネクション断は起きる前提で、障害にしないための設計と設定値の決め方を、同じ問題に直面しうるチームがそのまま使える形で持ち帰ってもらいます。\n\n前提知識: net/http でAPIを呼び出した経験があれば十分です。HTTP/2の事前知識は不要で、セッション内で必要な範囲を説明します。',
    speakers: [{ id: 16, name: 'Yusa Matsuda' }],
    startTime: '2026-09-11T17:20:00+09:00',
    endTime: '2026-09-11T17:40:00+09:00',
    talkDifficulty: '',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
]
