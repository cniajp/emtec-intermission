import { Talk } from './types'

/**
 * Hono Conference in Tokyo 2026 (2026-10-11 / LINEヤフー紀尾井町オフィス)
 * 出典 (2026-10-06 取得):
 *   - タイトル・概要・登壇者: https://fortee.jp/honoconf-2026/api/timetable
 *     (API には時刻・トラックが無い)
 *   - 時刻・トラック・ゲスト/スポンサー枠: https://honoconf.dev/2026 の Timetable
 *   - id 1xx: ユーザートラック / 2xx: ディープトラック（開始時刻順）
 *   - id 9001/9002: Opening（各トラック）/ 9003: Closing（運営枠）
 *   - 204 の OST企画 は公式表の 15:20–16:40 を1枠にまとめたもの
 *   - fortee に無い枠（Keynote・ゲスト・スポンサー）の概要は空
 *   - Keynote のみ talkCategory: 'Keynote'（Page1 Side で1枠に集約される）
 */
export const talks: Talk[] = [
  {
    id: 9001,
    trackId: 1,
    title: 'Opening',
    abstract: '',
    speakers: [
      {
        id: 0,
        name: '運営',
      },
    ],
    startTime: '2026-10-11T12:30:00+09:00',
    endTime: '2026-10-11T12:50:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 9002,
    trackId: 2,
    title: 'Opening',
    abstract: '',
    speakers: [
      {
        id: 0,
        name: '運営',
      },
    ],
    startTime: '2026-10-11T12:30:00+09:00',
    endTime: '2026-10-11T12:50:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 101,
    trackId: 1,
    title: '月間100万人のサービス刷新で、技術選定をHonoに振り切った話',
    abstract:
      '月間100万人が利用する財務・IR情報サービスを、プロパー2名+副業4名で全面刷新しています。期限は数ヶ月、既存サービスの運用も並行で、人手による実装では間に合わない前提からのスタートでした。\n\nそこで、AIエージェントが安定して実装できる開発ハーネスを整えることを技術選定の軸に据えました。モノレポ上のアプリのうちHTTPを受ける16アプリをすべてHonoに統一し、Hono + ZodでAPIの型・バリデーション・実装パターンを揃え、ディレクトリ構成や仕様書のフォーマットまで固定して、AIが実装時に判断する余地を減らしています。\n\n結果、3ヶ月でモノレポはフロントエンドやデータパイプラインも含めて27アプリ・122万行まで拡大し、β版のリリースを達成しています。書く速さだけでなく直す速さも上がっており、複数サービスにまたがるアーキテクチャの組み替えが何度かありましたが、どれも数日で終わっています。顧客からのフィードバックも、軽微な修正であれば即日で反映できています。\n\n本トークでは、次のような話をします。\n- 少人数・短期間で全面刷新することになった事業背景と制約\n- AIエージェントによる開発を前提に、Hono + モノレポへ統一した判断軸\n- 16アプリで共通化しているアーキテクチャとディレクトリ構成\n- 設計から検証までを型化した開発ハーネスの実例\n- Honoを全面採用して良かったこと\n- 122万行まで運用して見えてきた課題と、その対処',
    speakers: [
      {
        id: 1,
        name: 'ばら / bara',
      },
    ],
    startTime: '2026-10-11T12:50:00+09:00',
    endTime: '2026-10-11T13:20:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 102,
    trackId: 1,
    title:
      'RailsモノリスのとなりにHonoで新プロダクトを建てる — 150万ユーザー基盤「TUNAG」新機能のAWS Lambda本番運用記',
    abstract:
      '1,400社・150万ユーザーを抱えるエンゲージメントSaaSの裏側は、Railsモノリス（サービスベースアーキテクチャ）です。\n\n2026年2月、本体から独立した新プロダクトの新規開発を開始し、同年6月に正式リリースを迎えました。弊社において初の本番投入となるHonoアプリケーションです。\n筆者は文系・新卒営業出身で新規コードベースの作成自体が初挑戦だったため、2025年7月発表のAWS AI-DLCを頼りに開発をスタートさせました。\n\nランタイム環境は AWS Lambda（CloudFront → Lambda Function URL → Hono → DynamoDB）。同一のHonoアプリをローカル（`@hono/node-server`）と本番（`hono/aws-lambda` の `streamHandle`）でそれぞれ動かしています。\n\n主なトピックは以下です。\n\n* 認証を「持たない」設計 — 独自ストアを持たずCookie転送でRailsに委譲。`createMiddleware`で作る2種のミドルウェア、Request Coalescingによる外部API結合、Cookieハッシュ化キャッシュキー\n* 組み込みミドルウェア0個・RPC不使用 — CloudFront同一オリジン化でCORSを消去、Zod schemaでのPIIフィルタリング、`app.request()`とインメモリDIで閉じる統合テスト\n* テナント単位FFの実務運用 — 「限定リリース→全社公開→コード撤去」を5機能連続で回し、アクティブFFゼロに戻すまでの軌跡\n\nCloudflare Workers以外の環境で、エンタープライズB2BかつRailsと共存させる文脈における、Hono本番活用の生々しい手触りを持ち帰っていただければ幸いです。',
    speakers: [
      {
        id: 2,
        name: 'mental-space',
      },
    ],
    startTime: '2026-10-11T13:30:00+09:00',
    endTime: '2026-10-11T14:00:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 103,
    trackId: 1,
    title:
      'Hono の Hono による Hono のための Inertia！？ ── Laravel 生まれのプロトコルが、なぜここまで噛み合うのか',
    abstract:
      "Inertia.js は Laravel の世界で生まれた「API を作らずに SPA を作る」ための仕組みです。サーバが「表示すべきコンポーネント名」と「渡す props」を返し、クライアントはそれを描画するだけ。API エンドポイントも、クライアント側のルーティングも要りません。\n\nこの Inertia が Hono に移植されたとき、本家の Laravel や Rails では実現できなかったことが起きました。`c.render('Posts/Show', { post })` と書いたサーバ側の型が、そのままページコンポーネントの props として貫通します。しかもそれを支えているのは、Hono が RPC のために用意していた `ExtractSchema` ── まったく逆向きの目的で作られた機構です。\n\nアダプタ本体はおよそ 60 行。無関係に生まれた 2 つの道具が、最初からセットで設計されていたかのように噛み合います。\n\nこのトークでは、まず MPA と SPA がそれぞれ何を得て何を失ったかを整理し、Inertia がその間に引いた第 3 の線を見ます。そのうえで Hono と組み合わせると何が変わるのか ── 言語が同じになることで縮む「論理的な距離」と、エッジ実行環境で縮む「物理的な距離」── を追い、 60 行のアダプタの中身を解剖します。\n\n実際に`@hono/inertia` の author として、実装しながら見えたことを話します。",
    speakers: [
      {
        id: 3,
        name: 'asahi',
      },
    ],
    startTime: '2026-10-11T14:10:00+09:00',
    endTime: '2026-10-11T14:40:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 104,
    trackId: 1,
    title:
      'ワークアラウンドで終わらせず、OSS を直す ～satto workspace の共同編集で見つけた WebSocket 接続の不具合～',
    abstract: '',
    speakers: [
      {
        id: 4,
        name: 'Gen Tamura',
      },
    ],
    startTime: '2026-10-11T14:45:00+09:00',
    endTime: '2026-10-11T15:00:00+09:00',
    talkCategory: 'スポンサーセッション',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 105,
    trackId: 1,
    title: 'Honoが叶える、いつでも降りられるLambdalith',
    abstract: '',
    speakers: [
      {
        id: 5,
        name: 'kosui',
      },
    ],
    startTime: '2026-10-11T15:00:00+09:00',
    endTime: '2026-10-11T15:15:00+09:00',
    talkCategory: 'スポンサーセッション',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 106,
    trackId: 1,
    title: '個人開発者よ、Honoを使え',
    abstract:
      '個人開発でWebアプリを作ろうとすると、気づけば最初からReactやNext.jsを前提にしがちです。\nしかし、小さなポートフォリオ、ブログ、投稿サービス、管理画面、フォーム中心のアプリでは、本当にそこまでの構成が必要でしょうか。\n\n本セッションでは、登壇者が個人開発で作っている小説投稿サイトを題材に、Next.jsで作った経験と、Honoだけで同種のアプリを組もうとした経験を比較します。\n一覧、詳細、投稿、編集、コメント、管理画面のような機能は、複雑なクライアント状態よりも、サーバー状態を素直にHTMLへ返す構成の方が自然な場面があります。\n\nHono + SSR + HTML Form + 必要なJavaScriptで始めると、fetch、JSON、state更新、hydration、フォーム状態管理などを最初から抱え込まずに済みます。\n一方で、複雑なUI、リッチエディタ、Slackのようなチャット、画面全体が頻繁に変化するアプリではReactやNext.jsを選ぶ理由があります。\n\n「Reactを使うな」ではなく、「Reactを使う理由が生まれるまで使わない」。\nHonoで小さく始め、必要に応じてJavaScript、React、API分離へ進むための判断基準と設計パターンを、個人開発の実体験から共有します。',
    speakers: [
      {
        id: 6,
        name: '田中博悠',
      },
    ],
    startTime: '2026-10-11T15:20:00+09:00',
    endTime: '2026-10-11T15:50:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 107,
    trackId: 1,
    title: '薄いフレームワークの上に、どこまで層を積むべきか',
    abstract:
      'Honoは薄いフレームワークです。ルーティングとミドルウェアと Context しかありません。その薄さが良くて選んだはずなのに、上に「とりあえずDDD風の4層」を敷いてしまい、GET /stores 一本のためにEntityとRepositoryとServiceとDTOを書いている、という状態になったことはありませんか？\n\n自社のマイクロサービス（Hono + Drizzle + Cloud Run）を新規で開発するにあたり、私は最初にその4層構成を採用し、途中でやめました。単純なCRUDにまでDomain層を強制する構成は、Honoの薄さに対して過剰だったからです。最終的に Feature First + 軽量レイヤード（外部境界だけ Ports & Adapters）に落ち着き、その形を社内向けのスターターCLIの既定構成として切り出しました。\n\n本トークでは、実際のコードと、その判断を残したADRをお見せしながら、「どこまで層を積むか」の線引きを以下の観点で解説します。\n\n層の統一ルールを捨てた分、機能ごとに構成が違いうること、レビューのたびに省略ルールへの適合を確認するコストが出ること、interfaceを省いた箇所は後から差し替えるときに手戻りになること。この3つは実際に払っているコストです。\n\n薄いフレームワークの上にどこまで構造を足すか迷ったことのある方に、判断の材料を持ち帰っていただけたら嬉しいです。\n\n【ターゲット】\nHonoで中規模以上のAPIを書いている方、これから書く方\n設計方針を決める立場で、過剰設計と無設計のあいだで迷っている方',
    speakers: [
      {
        id: 7,
        name: 'cochumo',
      },
    ],
    startTime: '2026-10-11T16:00:00+09:00',
    endTime: '2026-10-11T16:30:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 108,
    trackId: 1,
    title: 'Honoでレガシーコードと戦う',
    abstract:
      'Honoはシンプルという点がよく特徴に上げられますが、ルーティングのGroupingやMiddlewareなどレガシーコードを整理するという観点からも有益な機能を持っています。\n本登壇ではコーディングエージェントを用いて実装された「index.ts数千行規模」「テストが実装されていない」「ルーティングが素の正規表現で実装されている」という状態のCloudflare WorkersコードをHonoを用いてリファクタリングする例を元に、Honoがレガシーコードに対してどのように効力を発揮するのか、キャラクタライゼーションテストなどを活用しHonoを用いてレガシーコードとどう戦うのかについて解説します。\nまた、Honoには昨年のHono Confで発表されたHono CLIなど、人間とコーディングエージェントをターゲットにしているツールがあります。\nこれらのコーディングエージェント向けのツールを活用したリファクタリング手法についても紹介します。',
    speakers: [
      {
        id: 8,
        name: 'こまもか/Comamoca',
      },
    ],
    startTime: '2026-10-11T16:40:00+09:00',
    endTime: '2026-10-11T16:50:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 109,
    trackId: 1,
    title: 'トークンレスCSRF対策の現在地 〜Content-Typeヘッダの落とし穴〜',
    abstract:
      'HonoにはCSRF(Cross-Site Request Forgery)対策を行う csrf() ミドルウェアが標準で用意されています。モダンブラウザの仕様を活用することで、旧来定番であったCSRFトークンを用いない方法が採用されています。ステートを持ちにくいエッジ環境と相性がよく、この方式を採用するフレームワークが増加しています。\n私はセキュリティ診断業務の知見をもとに、複数のOSSフレームワークにおけるこの実装を横断的に調査し、その中でHonoの脆弱性を発見・報告しました。迅速にご対応いただき、CVE-2024-48913として公開されており、現在は安心して利用できる状態です。この問題の原因は、危険なリクエストかどうかを判定する仕組みにおける、Content-Typeヘッダの扱いにありました。同種の脆弱性を他の著名なフレームワークでも複数発見しており、特定の実装ではなく仕様の細部に起因する横断的な課題といえます。\n本トークではまず、HTTPリクエスト例を交えつつ、危険なリクエストかどうかの判定がどのような前提の上に成り立っているのかをお話しします。「MIMEタイプの大文字小文字は区別されない」「Content-Typeヘッダは必須ではない」といった、ブラウザの細かい仕様を調べなければ気づきにくい点や、Honoの修正内容などを、CSRFやCORSに馴染みのない方でも追いやすいように解説します。\nそして、脆弱性報告の流れや、その後も実装の改善が重ねられていることをご紹介します。CSRF対策を自分で実装する場合に注意すべきポイント、そしてメンテナンスが活発なフレームワークを選ぶことの価値をお伝えします。',
    speakers: [
      {
        id: 9,
        name: '影白/KageShiron',
      },
    ],
    startTime: '2026-10-11T16:50:00+09:00',
    endTime: '2026-10-11T17:00:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 110,
    trackId: 1,
    title: 'Hono CLI の これまで と これから',
    abstract:
      '昨年のHono Conference 2025 の One More Thingにて、Hono CLIが発表されました。コンセプトは「CLI for Humans and AI with Hono」でした。\n\n私自身、Hono Conference 2025 の One More ThingでHono CLIのデモを見て、そして感銘を受け、その後の動向を追いかけながら、いくつかの貢献を行なってきました。\n\nそんなHono CLIは今、さらなる進化を遂げようとしています。\n\nこのセッションでは、Hono CLIを間近で見てきたContributerとしての私の視点から、\n\n**前半戦** ... Hono CLIのこれまで\n**後半戦** ... Hono CLIのこれから\n\nについてお話しできればと思います。',
    speakers: [
      {
        id: 10,
        name: 'Kanon',
      },
    ],
    startTime: '2026-10-11T17:00:00+09:00',
    endTime: '2026-10-11T17:10:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 111,
    trackId: 1,
    title: 'Keynote',
    abstract: '',
    speakers: [
      {
        id: 11,
        name: 'Yusuke Wada',
      },
    ],
    startTime: '2026-10-11T17:20:00+09:00',
    endTime: '2026-10-11T18:00:00+09:00',
    talkCategory: 'Keynote',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 9003,
    trackId: 1,
    title: 'Closing',
    abstract: '',
    speakers: [
      {
        id: 0,
        name: '運営',
      },
    ],
    startTime: '2026-10-11T18:00:00+09:00',
    endTime: '2026-10-11T18:15:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 201,
    trackId: 2,
    title: 'Routercentrism: On All That Is Reducible to Routing',
    abstract: '',
    speakers: [
      {
        id: 12,
        name: 'Taku Amano',
      },
    ],
    startTime: '2026-10-11T12:50:00+09:00',
    endTime: '2026-10-11T13:20:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 202,
    trackId: 2,
    title: 'HonoユーザーとしてのOSS',
    abstract: '',
    speakers: [
      {
        id: 13,
        name: 'watany',
      },
    ],
    startTime: '2026-10-11T13:30:00+09:00',
    endTime: '2026-10-11T13:50:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 203,
    trackId: 2,
    title: 'Building self healing agents',
    abstract: '',
    speakers: [
      {
        id: 14,
        name: 'Aditya Mathur',
      },
    ],
    startTime: '2026-10-11T14:10:00+09:00',
    endTime: '2026-10-11T14:40:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 204,
    trackId: 2,
    title: 'OST企画',
    abstract: '',
    speakers: [
      {
        id: 0,
        name: '運営',
      },
    ],
    startTime: '2026-10-11T15:20:00+09:00',
    endTime: '2026-10-11T16:40:00+09:00',
    talkCategory: '',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
]
