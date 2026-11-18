import { Talk } from './types'

/**
 * CloudNative Days Winter 2026 (2026-11-18〜19 / 有明)
 * 出典 (2026-11-18 取得): https://cloudnativedays.jp/timetable/day1, /timetable/day2, /sessions/*
 * Dreamkast API を一時的に使えないため、公式サイトから書き起こしたもの
 *   - id は公式サイトのセッション番号 (/sessions/<id>)
 *   - trackId は A=1 / B=2 / C=3 / D=4、conferenceDayId は Day 1=1 / Day 2=2
 *   - talkCategory はキーノートのみ 'Keynote'、ほかは公式サイトのカテゴリ
 */
export const talks: Talk[] = [
  {
    id: 3276,
    trackId: 1,
    title: 'Agentic AIの本番適用で見えてくる認可の課題とagentgateway',
    abstract:
      'Agentic AIの活用はPoCの段階を超え、本番システムへの適用が進みつつあります。PoC段階では個別に検証されていたAIエージェントも、本番環境では他のAIエージェントや業務システムと連携しながら、重要なデータや機能へアクセスするようになります。そのため、AIエージェントが誰の権限で行動し、どのような操作を許可されるのかを適切に制御する「認可」が重要な課題となります。\n本セッションでは、AIエージェントがツールや他のエージェントと連携するためのプロトコルとして広く利用されているMCP（Model Context Protocol）やA2A（Agent2Agent）における認可の要件や最新動向をご紹介します。\nさらに後半では、認可機能を各AIエージェントやツールへ個別実装しないためのアプローチとして、ゲートウェイアーキテクチャと、その実装の一つであるAgentic AI Foundationのオープンソースプロジェクト agentgatewayをご紹介します。認可を中心とした視点から、Agentic AIを本番環境で活用するために求められる基盤アーキテクチャの方向性を展望します。',
    speakers: [
      {
        id: 2430,
        name: 'Yoshiyuki Tabata',
      },
    ],
    startTime: '2026-11-18T10:30:00+09:00',
    endTime: '2026-11-18T10:50:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Keynote',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3282,
    trackId: 1,
    title:
      'LLMを「動かす」から「みんなで使う」へ — Agent Routerで作るマルチテナント推論基盤',
    abstract:
      'LLMを組織の中で活用するには、単にモデルを動かすだけでは十分ではありません。複数のチームやユースケースにLLMを提供するには、認証・アクセス制御、テナントごとの利用量管理、モデルへのルーティングなど、LLMを「サービス」として提供するための仕組みが必要になります。\n\n本セッションでは、LINEヤフーにおけるLLM Inference Serviceを題材に、なぜLLMをSelf-hostingするのか、なぜMulti-tenancyが必要なのか、そしてなぜAI Gatewayが必要になるのかを紹介します。特に、EnvoyをベースとしたAgent Router（旧 Envoy AI Gateway）を活用し、複数のテナントから共通のLLM Inference Serviceを利用できるようにするアーキテクチャを解説します。\n\nさらに、実際の設計・開発・運用を通じて見えてきた課題や、LLMを組織の中で提供するためにどのような責務をどこに持たせるべきかといった設計上の考え方についても紹介します。',
    speakers: [
      {
        id: 2433,
        name: 'Shingo Omura',
      },
    ],
    startTime: '2026-11-18T10:50:00+09:00',
    endTime: '2026-11-18T11:10:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Keynote',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3278,
    trackId: 1,
    title: 'Kubernetes Schedulingの最前線から見る景色',
    abstract:
      'Kubernetesに5年以上コントリビュートし続け、現在Kubernetes SIG-SchedulingのLeadとして開発をリードしています。AIの話題で持ちきりの今日ですが、Kubernetesも例に漏れずAI/MLワークロード向けの機能が数多く導入されています。DRAをはじめ、直近ではWorkload-aware Schedulingが実装され始めるなど、Kubernetes Schedulerもこの大きな流れの中心にいます。本セッションでは、それらWorkload-aware Schedulingをはじめとする大きな新機能の解説と、それに伴う「Pod schedulingからWorkload schedulingへ」という根本的な概念の遷移について解説します。また、SIG Leadとして普段どのように開発をリードしているかなど、日本語で語られることが少ないSIG Leadとしての責務などについても触れる予定です。',
    speakers: [
      {
        id: 2435,
        name: 'Kensei Nakada',
      },
    ],
    startTime: '2026-11-18T11:10:00+09:00',
    endTime: '2026-11-18T11:30:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Keynote',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3195,
    trackId: 1,
    title:
      '開発組織は「開発する組織」から卒業する "価値提供する組織"に必要な自律的セキュリティ思考',
    abstract:
      'AI駆動開発が一般化し、開発組織の役割は「開発そのもの」から「価値提供」に広がりつつあります。それは、開発の前工程にある"課題の発見"だけでなく、後工程にある"安心・安全なサービス提供"も含む役割定義と言えるでしょう。\n本セッションでは、開発組織が自律的にリリース前・運用中の脆弱性診断を実施する体制をととのえ、製品のことを最もよく知るチームが安全を担保する、新しい開発組織の形を考えていきます。',
    speakers: [
      {
        id: 2350,
        name: 'Kazuma Abe',
      },
    ],
    startTime: '2026-11-18T11:30:00+09:00',
    endTime: '2026-11-18T11:50:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Security',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3288,
    trackId: 1,
    title:
      '稼働20年のエンタープライズシステムにAI駆動開発を導入する～KDDI設備更改の挑戦と現在地～',
    abstract:
      'KDDIでは、20年近く稼働してきたエンタープライズシステムの設備更改にAI駆動開発を導入しました。つぎはぎを重ねたプログラムを従来手法で刷新すれば、工期・工数ともに膨らみ、競争の激しい通信業界では戦えない――その危機感から、既存システムに精通したHCL社、AI駆動開発に知見を持つRed Hat社とワンチーム体制を組み、新たな開発手法に踏み出しました。本講演では、基幹系ならではの難しさに向き合う開発現場から、商用リリースに向けたAI駆動開発の現在地をご紹介します。',
    speakers: [
      {
        id: 2442,
        name: 'Fumiaki Kanayama',
      },
      {
        id: 2443,
        name: 'Koya Matsuda',
      },
      {
        id: 2447,
        name: 'Hirotaka Torigoe',
      },
    ],
    startTime: '2026-11-18T11:50:00+09:00',
    endTime: '2026-11-18T12:10:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Application / Development',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3193,
    trackId: 1,
    title:
      'その修正で本当に速くなったのか？k6とOpenTelemetryで確かめる性能改善',
    abstract:
      '開発側では「速くなった」と報告した修正が、運用側の試験では「まだ遅い」と評価されたら、何を確かめればよいでしょうか。\n\n本セッションでは、k6で負荷をかけ、OpenTelemetryで遅い処理を調べ、修正の効果を再試験で確かめる一連の手順を解説します。同時に処理できる件数を制限したHTTP APIを題材に、開発と運用で試験条件と観測データをそろえます。\n\n応答を待ってから次のリクエストを送る試験では、処理が遅くなると送信頻度も下がります。修正の前後で負荷が変わってしまうと、応答時間の差を修正の効果とは判断できません。そこで一定の頻度で送る試験と比較し、想定した負荷を実際にかけられたかを確認します。\n\n次に、アプリ内の待機時間と呼び出し先の処理時間から修正箇所を絞ります。制限を緩めた後は、呼び出し先に要求が集中して別の待ち時間やエラーを生んでいないかも調べます。同じ条件で再試験し、応答時間とエラーの割合から変更を評価します。\n\n最後に、改善しなかった結果も含めて試験条件と調査記録を共有し、開発と運用が同じデータから性能変更を判断する手順を示します。',
    speakers: [
      {
        id: 2315,
        name: 'Yoshi Yamaguchi',
      },
    ],
    startTime: '2026-11-18T13:10:00+09:00',
    endTime: '2026-11-18T13:40:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Operation / Monitoring / Logging',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3224,
    trackId: 2,
    title:
      'OWASP AI Agentic Top10に準拠するクラウドネイティブなガードレールの実践',
    abstract:
      'AIコーディングエージェントは、指示していないコマンドを平然と実行します。プロンプトインジェクションが刺さると、読み込んだ文書やWebページの指示がPod内の正規MCPツールを乗っ取ります。これはOWASP Top 10 for Agentic Applications の Goal Hijack（ASI01）・Tool Misuse（ASI02）そのものですが、監視は、何も見なかったことになります。\n\nこのセッションでは暴走をデモしたうえで、OWASPの脅威分類に沿ってガードレールを設計します。ツールの最小権限設計、NetworkPolicyのegress制御、Admission Controllerでの事前検証、そしてCNCF Graduatedの Falco と eBPF をDaemonSetで動かすランタイム検知――プロセス・ファイル・ネットワークの実挙動から暴走を止めます。OpenTelemetryのトレースで原因リクエストまでひも解きます。マニフェスト例とOSSデモ一式を持ち帰り試して欲しいです。',
    speakers: [
      {
        id: 2390,
        name: 'Keita Higaki',
      },
    ],
    startTime: '2026-11-18T13:10:00+09:00',
    endTime: '2026-11-18T13:40:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Security',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3164,
    trackId: 3,
    title:
      '信頼性を犠牲にせず、PR マージからデプロイまで人の介入を完全にゼロにするまでの道のり',
    abstract:
      'カウシェでは、この1年でマージされるPRの数が10倍以上になりました。以前はリリースごとに、リリース内容や依存関係の確認、可否の判断、動作確認、リリース後の監視を人が行っていました。短い期間に積まれる変更が増えるほど、1回のリリースにのる変更も依存も増え、何が入っていて何と一緒に出してよいのかを、人が把握しきれなくなっていきました。\n\nこの発表では、PRのマージからデプロイまでを完全に自動化するためにやったことを話します。ただ自動化するだけでは、プロダクト開発メンバーは安心してリリースを任せられません。どうすれば安心して任せられるのか。そのために行ってきたことを順に紹介します。\n\nまずデプロイとリリースを分けました。デプロイは振る舞いを変えないコードを本番に出すこと、リリースは機能を公開することと定義し直しました。この分離を起点に、トランクベース開発への移行、サービス横断で使えるfeature flagシステムの構築、SLI/SLOの制定と運用、ロールアウト条件の定義、カナリアリリースの自動化、と積み重ねてきました。それぞれが何を解決し、どこまで人の判断を置き換えたのかを解説します。',
    speakers: [
      {
        id: 2333,
        name: 'Kenta Takahashi',
      },
    ],
    startTime: '2026-11-18T13:10:00+09:00',
    endTime: '2026-11-18T13:40:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'CI / CD',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3251,
    trackId: 4,
    title:
      'ローカルLLMに閉じずに機密データを扱う — Confidential Computing 入門と導入',
    abstract:
      '「機密だからフロンティアモデルには入れられない」。その代替として選ばれるローカルLLMが守っているのは、実はネットワーク境界だけです。クラウドでは運用者は信頼できる存在として扱われてきましたが、Confidential Computingはこの前提を外し、運用する側からも内容を参照できないアプリケーション実行環境を実現します。\n\n前半はAMD SEV-SNPやNVIDIA Confidential Computingを題材に、ハードウェアが保証する範囲と、起動イメージの正当性や鍵の受け取りなどソフトウェアが補う部分を整理します。後半は、機密データを扱うAIプロダクトへ実際に載せる際に採用した構成と、そこで直面した難しさを紹介します。ハードウェアの制約、更新や運用の手順、開発とテストのやり方まで、載せてみて初めて分かることを扱います。\n\n機密データを扱う基盤の設計者や、Confidential Computingが自分の設計にどう関わるか見極めたい方が対象です。予備知識は不要で、保護の粒度の選び方と、導入前に確認すべき制約を持ち帰れます。',
    speakers: [
      {
        id: 2412,
        name: 'Takumi Hiraoka',
      },
    ],
    startTime: '2026-11-18T13:10:00+09:00',
    endTime: '2026-11-18T13:40:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Security',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3289,
    trackId: 1,
    title:
      'オブザーバビリティを組織とともに成長させる - データと知識をつなぐ場としてのGrafana',
    abstract:
      'サービスを運用していると、メトリクス、ログ、トレースに加えて、設定の変更履歴やセキュリティデータがさまざまなツールや場所に散らばってたまります。散らばったデータはそのままでは活用されません。存在自体に気づかなかったり、何に使えるかを知る人が限られていたりするためです。\n\nGrafanaの特徴は、データを元の場所に置いたまま、多数のデータソースをつなぎ、一箇所で横断的に確認できることです。担当者が持っているデータの知識はデータソースという形でGrafanaにつながれ、その活用方法はダッシュボードという形で残されます。これにより、多くのメンバーがデータの価値に気づき、活用できるようになります。\n\n組織の成長とともに、Grafanaに残る知識も増えます。AIが広く使われる時代には、共有できる形で知識が残っていることの重要性がますます増しています。その知識を人もAIエージェントも使い、新たな価値につなげていけるからです。\n\nこのセッションでは、データをつなぎ、知識を残す考え方と具体例をとおして、自分の組織に眠っているデータを活用するきっかけを得られます。',
    speakers: [
      {
        id: 2400,
        name: 'Mitsuhiro Tanda',
      },
    ],
    startTime: '2026-11-18T14:00:00+09:00',
    endTime: '2026-11-18T14:30:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Operation / Monitoring / Logging',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3291,
    trackId: 2,
    title:
      'AIで加速する攻撃に、クラウドの守りはどこから固めるか ―脆弱性と認証情報から考える、侵入の連鎖を断つ運用ー',
    abstract:
      'AIの活用で攻撃が加速するいま、クラウドの守りはどこから固めるべきでしょうか。既知の脆弱性や漏えいした認証情報を入口に、侵入はクラウド環境の奥へと広がります。\n\n本セッションでは、yamoryのセキュリティエンジニアが公開事例から攻撃の流れをひもとき、ISMAP対応で培った運用の実践を紹介。限られた時間と人手で何を優先し、侵入の連鎖をどこで断つか、現場の視点から考えます。',
    speakers: [
      {
        id: 2467,
        name: 'Satoshi Hara',
      },
    ],
    startTime: '2026-11-18T14:00:00+09:00',
    endTime: '2026-11-18T14:30:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Security',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3275,
    trackId: 3,
    title:
      'AI時代に問い直す「プロダクションミーティング」の価値 〜チームでサービスの信頼性を高める取り組み〜',
    abstract:
      '「プロダクションミーティング」とは、書籍『Site Reliability Engineering』（通称SRE本）にあるチームでサービスを安定運用させるための定期的なミーティングです。はてなの開発チームでは「PWG (Performance Working Group)」の名前で実施しています。\n\nPWGではMackerelのダッシュボードやAPM機能を用い、パフォーマンスやシステムの変化を共有しています。主な効果は以下の通りです。\n\n- パフォーマンスの変化や問題の早期発見、障害の未然防止\n- アプリケーションの変化をインフラエンジニアが把握\n- 開発エンジニアのインフラ・パフォーマンスへの感度や理解の向上\n\n一方昨今のAI Agentの登場により、パフォーマンスの調査や問題修正、状況のまとめなどをAIが担いつつあります。\nこうした時代、エンジニアは何のために集まり話すのでしょうか？\n\n本発表では、はてなでの取り組みを紹介し、AIによる変化と残り続ける価値について考えます。',
    speakers: [
      {
        id: 327500,
        name: 'Mikio Fujita',
      },
    ],
    startTime: '2026-11-18T14:00:00+09:00',
    endTime: '2026-11-18T14:30:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: '組織論',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3284,
    trackId: 4,
    title: '高速開発を止めずに性能を上げる Flyle のシステム刷新と改善の歴史',
    abstract:
      'フライルは2020年から顧客の声を扱うプロダクトFlyleを開発してきました。2024年には事業の転換にあわせてAIネイティブなプロダクトとして新しいシステムを作り始め、いまは新旧2つのシステムを抱えながら機能開発と性能改善を続けています。\n\n本セッションではFlyleの性能改善の取り組みをいままで・現状・これからの3つに分けてお話しします。旧システムで起きた性能問題とその対処、新しいシステムの設計でそれらをどう解消しようとしたか、開発が速くなるなかで起きた問題への向き合い方、性能をチームの目標に入れて運用してみて見えた課題、これからの進め方を紹介します。',
    speakers: [
      {
        id: 2446,
        name: 'Naoya Yoshizawa',
      },
    ],
    startTime: '2026-11-18T14:00:00+09:00',
    endTime: '2026-11-18T14:30:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Application / Development',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3252,
    trackId: 1,
    title:
      'GKEでつくるAgent Platformのアーキテクチャと、OpenTelemetryによる可観測性設計',
    abstract:
      'AIエージェントを本番でどう安全に動かすかが、基盤の新しい課題です。エージェントはマイクロサービスでもバッチでもない"第三のワークロード"です。信頼できない生成コードを実行し、状態を持ち、放置すればループでコストを溶かします。本セッションではこの事故を検証環境で意図的に再現し、なぜ構造的に起きるのかを示した上で、基盤の設計領域を「実行隔離・権限・ネットワーク境界・状態・可観測性と継続的評価」の5つに整理し、2つを深掘りします。(1)実行隔離: Agent Sandbox(gVisor)とwarm pool前後の起動レイテンシ実測。(2)可観測性と継続的評価: OpenTelemetryのGenAI規約による計装、暴走を検知して止めるシグナル設計、本番会話からライブ評価データを作りLLM-as-a-Judgeで「ユーザーの不満」を採点するダッシュボード設計まで。GKEは実装例、土台はコミュニティ標準です。対象はエージェントのPoCを本番基盤に育てたいプラットフォームエンジニア/SRE。5領域の設計チェックリスト、隔離と暴走対策の実測データ、継続的評価ループの設計パターンを持ち帰れます',
    speakers: [
      {
        id: 2413,
        name: 'Tayzar',
      },
    ],
    startTime: '2026-11-18T14:50:00+09:00',
    endTime: '2026-11-18T15:20:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Architecture Design',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3210,
    trackId: 2,
    title:
      '動的アクセス制御の最適解を探して　〜 IaC の自動生成と OPA で実現するスケーラブルな権限管理基盤〜',
    abstract:
      'パブリッククラウドにおける IAM の権限管理は、従来の RBAC からダイナミックで精緻な ABAC へと要件が高度化しています。しかし ABAC は大量のポリシーや適用条件を生み出し、宣言的な IaC（Infrastructure as Code）の表現力だけでは複雑な認可ロジックを管理しきれず、結果として可読性の低下やレビューの限界といった運用上の課題があります。\n本セッションでは弊社のデータ分析基盤のアクセス制御を題材に、この課題にどう立ち向かったのかについてご紹介します。データ基盤はテーブルごと、カラム別、行別などかなり精緻な制御が必要になります。これに対し 私たちが導き出した答えは「Terraform で複雑なロジックを表現する」ことをやめる設計です。利用者はシンプルに YAML を記述し、そこから IaC を自動生成して「人間による Terraform のコードレビューをなくす」という割り切りを行いました。そしてその代償としての統制リスクを、OPA (Open Policy Agent / Rego) のガードレールによって保証するという具体的なアーキテクチャを交えて設計',
    speakers: [
      {
        id: 2380,
        name: 'Yosuke Hojo',
      },
    ],
    startTime: '2026-11-18T14:50:00+09:00',
    endTime: '2026-11-18T15:20:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Architecture Design',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3174,
    trackId: 3,
    title: 'Runtime Contextから見る脆弱性',
    abstract:
      'コンテナイメージを脆弱性スキャンすると、多数の脆弱性が検出されることがあります。しかし、スキャン結果だけでは、その脆弱なパッケージが実際のワークロードで利用されているのかまでは分かりません。\n\nでは、「脆弱性スキャンの結果から見えない情報を、どう補えばよいのでしょうか？」\n\n本セッションでは、CNCF Incubating ProjectのKubescapeを題材に、脆弱性情報へRuntime Contextを加えるアプローチを紹介します。KubescapeのVulnerability Relevancyでは、eBPFで観測したファイルアクセスやプロセス実行とSBOMを結びつけ、実行時の利用状況から脆弱性との関連性を評価します。さらに、Runtime Threat Detection機能では、観測した振る舞いをプロファイル化し、通常とは異なるプロセス実行やファイルアクセスなどを検知します。\n\nKubescapeの仕組みを通して、脆弱性という静的な情報に実行時の振る舞いを重ね、Runtime Contextから脆弱性の見方を考えましょう。',
    speakers: [
      {
        id: 2344,
        name: 'Yoshitaka Fujii',
      },
    ],
    startTime: '2026-11-18T14:50:00+09:00',
    endTime: '2026-11-18T15:20:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Security',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3177,
    trackId: 4,
    title:
      '量子コンピュータを Grafana で監視する — 9割の普通の監視と1割の難しい監視',
    abstract:
      '量子コンピュータの監視、と聞くと特殊な仕組みを想像するかもしれません。しかしクラウドから使う分には、その大半はごく普通の Web サービスの監視で成り立っています。\n\n本講演ではまず、量子コンピュータを説明します。心臓部である QPU（量子チップ）は、回路を実行して測定することしかできず、メモリもストレージも持ちません。冷凍機・制御装置・古典コンピュータが揃って初めて計算機として動きます。つまり本当に「量子」なのは QPU だけで、だからこそ監視の大半は普通の仕組みで足ります。\n\n大阪大学 QIQB の OQTOPUS では、投げられたジョブが AWS の API やコンテナを通り、オンプレの実行サーバーと制御装置を経て、絶対零度近くまで冷やされたチップに届きます。この流れを OpenTelemetry と Grafana で一気通貫に可視化した事例を、デモを交えて紹介します。\n\n監視の9割は既存の仕組みで押さえられます。残る1割──QPU の健全性の監視は、まだ研究の途上です。難しい話はしません。量子は初耳という方も、その監視に興味がある方も、気軽にお越しください。',
    speakers: [
      {
        id: 2347,
        name: 'BIN MATSUI',
      },
    ],
    startTime: '2026-11-18T14:50:00+09:00',
    endTime: '2026-11-18T15:20:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Operation / Monitoring / Logging',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3287,
    trackId: 1,
    title:
      'Organization Engineer への転換：局所最適を抜け出し、全体最適を実現する',
    abstract:
      'LLMの台頭で開発は安く速くなった一方、機能単位の局所最適が加速し、企業が実現したいビジョンとのずれが目立つようになりました。今、エンジニアに求められるのは、担当プロダクトの改善から、組織全体を捉えた価値の実現へと視野を広げることです。Product EngineerからOrganization Engineerへ。その転換に何が必要か、AIとどう働くかを、システム思考に基づき、事例を交えて紹介します。',
    speakers: [
      {
        id: 2449,
        name: 'Kai Makita',
      },
    ],
    startTime: '2026-11-18T15:40:00+09:00',
    endTime: '2026-11-18T16:10:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: '組織論',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3296,
    trackId: 3,
    title: 'Beyond Containers: Secure, Stateful, Elastic Agent Sandboxes',
    abstract:
      'GMI Cloud Agentbox provides cloud-native sandboxes for secure, high-concurrency AI workloads. This session explores MicroVM isolation, rapid provisioning, multi-tenant security, network controls, observability, and credential management. We also cover stateful execution, persistent environments, and multi-cloud portability, examining how to balance security, performance, and cost.',
    speakers: [
      {
        id: 2450,
        name: 'Fred Jhang',
      },
    ],
    startTime: '2026-11-18T15:40:00+09:00',
    endTime: '2026-11-18T16:10:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Application / Development',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3290,
    trackId: 4,
    title:
      'システムプロンプト依存からの脱却: AIエージェントを守る意図ベースの認可とは',
    abstract:
      'AIエージェントを実用的なものにしようとすればするほど、APIやデータベースへの過剰なアクセス権（特権）を渡さざるを得ないというジレンマに直面します。RAGから自律的なエージェントシステムへの移行において、「悪意ある操作はしないでください」というシステムプロンプトに頼る設計は通用しません。また、ユーザー権限の安全な継承、マルチエージェント間の認可制御といった難題にも取り組まなければいけません。これらの課題を解決するためには、プロンプトエンジニアリングではなく、認可の主体を単なる「静的なユーザー権限」から「動的なエージェントの意図（Intent）ベース」へとシフトするアーキテクチャ設計が必要になります。\n\n本セッションでは、AIエージェントを構築する開発者を対象として、「エージェントは何を意図していたのか」、さらには「ユーザーはエージェントに何を実行させようとしていたのか」という意図 (intent) をどのようにエージェントの認可に応用するかについてCNCFプロジェクトであるOpenFGA (https://openfga.dev/)を用いた実装例とともに紹介します。',
    speakers: [
      {
        id: 2423,
        name: 'Daizen Ikehara',
      },
    ],
    startTime: '2026-11-18T15:40:00+09:00',
    endTime: '2026-11-18T16:10:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Security',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3220,
    trackId: 1,
    title:
      '待つ、諦める、やり直す。LLM非同期処理の回復性設計 〜不確実性を前提に考えた生成AI評価システム〜',
    abstract:
      'LLMの処理は、いつ終わるのか、必ず成功するのかをアプリケーション側から予測しにくいものです。\n本講演では、SMCCで内製開発したAI生成テキストの品質・不適切表現評価システムを題材に、不確実なLLMをシステムに組み込むための「待つ・諦める・やり直す」非同期設計の考え方を紹介します\n\nPoCではS3＋Lambda＋Bedrockによる非同期構成を採用し、評価結果をS3へ出力してポーリングで完了を確認していました。\n一方で、処理に失敗した場合や一定時間結果が生成されない場合は、ユーザーが再実行するという割り切った運用となる課題がありました。\n\n本番化では、変更頻度の高い評価用プロンプト管理をECS（FastAPI）へ、実行時間が読みにくいBedrock評価処理をLambdaへ分け、一定時間は待つ、結果がなければ失敗とみなす、必要に応じて自動再実行する、という振る舞いをアプリケーション側に取り込みました。\n\n本セッションでは、この実例をもとに、待機時間、失敗判定、再実行単位、リトライ上限、ユーザーへ戻す条件をどう決めるかを、LLM非同期処理の設計指針として解説します。',
    speakers: [
      {
        id: 322000,
        name: 'Kota Fukuchi',
      },
    ],
    startTime: '2026-11-18T16:30:00+09:00',
    endTime: '2026-11-18T17:00:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Architecture Design',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3266,
    trackId: 2,
    title:
      '全てを疑え！非自明な挙動と異常系から考える堅牢なカスタムコントローラ開発入門',
    abstract:
      'Kubernetes を中心とした分散システムのエコシステムでは、カスタムコントローラーやReconcileと呼ばれる設計パターンを用いることで、結果整合で健全なシステムを実現しています。\n\ncontroller-runtime や Kubebuilder 等のライブラリや開発フレームワーク、それらの解説の登場によってカスタムコントローラーの開発のハードルは低くなっている一方、依然としてプロダクショングレードの堅牢なカスタムコントローラーを開発するハードルは高いことが現状です。\n\n本セッションでは、LINEヤフーで数千Kubernetes Cluster を誇るKubernetes as a Service 基盤の運用を通して得た知見を元に、\n実運用でコントローラーの堅牢性を脅かす異常系や、確率を裏切りAIも見落としてしまう様な非自明な挙動のパターンや実例を紹介します。\n\nエンジニア自らで考え、疑い、開発の審美眼を備えることで、日本のKubernetesコミュニティでカスタムコントローラーの開発を盛り上げていきましょう！',
    speakers: [
      {
        id: 2421,
        name: 'Shotaro Gotanda',
      },
    ],
    startTime: '2026-11-18T16:30:00+09:00',
    endTime: '2026-11-18T17:00:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Application / Development',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3182,
    trackId: 3,
    title: 'SBOM生成ツールで2026 Minimum Elementsはどこまで満たせるのか',
    abstract:
      'ソフトウェアサプライチェーンの可視化や脆弱性管理のため、SBOMの活用が広がっています。SyftやTrivyを使えばSBOM自体は簡単に生成できますが、それだけで十分なのでしょうか。\n\n米国のCISAが策定した 2026 Minimum Elements for a Software Bill of Materialsでは、コンポーネント名やバージョン、依存関係だけでなく、SBOMの生成コンテキスト、署名など、SBOM生成ツールだけでは満たせない要素も求められています。さらに、要素を埋めるための情報がない場合は、SBOM生成者にとって不明なのか、意図的に秘匿にしているのかの明示も求められています。\n\n本セッションでは、2026 Minimum Elementsの各要件と照らし合わせながら、SyftやTrivyなどの実際のSBOM生成ツールでどこまで自動生成できるのかを検証します。その上で、満たせない要素をCI/CDや署名、メタデータ補完で埋める実装例を示し、自動化できる範囲と、人による補完や判断が必要な範囲を整理します。',
    speakers: [
      {
        id: 2354,
        name: 'Kenta Goto',
      },
    ],
    startTime: '2026-11-18T16:30:00+09:00',
    endTime: '2026-11-18T17:00:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Security',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3236,
    trackId: 4,
    title:
      'Lambda MicroVMsでCI実行環境を"使い捨てる" — OSSサプライチェーン攻撃からどうアプリCIに導入する',
    abstract:
      '生成AIやOSS寄稿の増加でCIに流れ込むコードの信頼度は下がる一方、GitHub-hosted runnerでの任意コード実行は依然としてセキュリティ課題です。実際、2025年のNx「s1ngularity」事件や、自己増殖型のnpm「Shai-Hulud」ワームは、`npm install`のpostinstall>フックを悪用してCI環境の認証情報を窃取しました。本セッションでは、2026年に登場したAWS Lambda MicroVMs(Firecracker microVMをLambda上で直接制御できる新機能。)を使い、PRごとに使い捨てのmicroVMで依存関係インストールからテストまでを隔離実行し、マルウェアが混入したパッケージをnpm\ninstallしても外部への情報持ち出しやリリースをさせない仕組みを紹介します。オーケストレーションにLambda Durable Functio使うことで運用コストを最小化する構成です。\n際に手を動かして初めてぶつかった判断ポイントと、その根拠を話します。',
    speakers: [
      {
        id: 2399,
        name: 'Soushi Hiruta',
      },
    ],
    startTime: '2026-11-18T16:30:00+09:00',
    endTime: '2026-11-18T17:00:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'CI / CD',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3180,
    trackId: 1,
    title:
      'ノードが消える前提で設計する! Karpenterで金融システムを止めないためのノウハウ大全',
    abstract:
      'Karpenterによる自動管理で、Kubernetesのワーカーノードは不要になれば消えるものへと変わりました。24時間365日止められない金融システムにとって、この前提は可用性の考え方の見直しを迫るものでした。\n\n本セッションでは、複数のシステムが相乗りする金融機関の共通基盤に、KarpenterのAWSマネージドサービスであるEKS Auto Modeを導入し、ワーカーノードを約50%削減した事例をお話しします。ノードが入れ替わる際に処理中のリクエストをどう守るか、冗長性をどこまで崩してよいかを、Podの停止を何秒待たせるかという値の決め方とあわせて紹介します。さらに、これらの設定を担当者任せにせずリリース時に自動でチェックする仕組みと、その仕組み自体がKubernetesのバージョンアップで前提から崩れた経験から、ガードレールは作って終わりではないという話もお伝えします。\n\nKarpenterやスポットインスタンスの活用を検討しているものの可用性への影響が気になって踏み出せない方、共通基盤の品質を担保する立場の方に聞いて頂きたいです。',
    speakers: [
      {
        id: 2352,
        name: 'Daiki Takasao',
      },
    ],
    startTime: '2026-11-18T17:20:00+09:00',
    endTime: '2026-11-18T17:50:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Architecture Design',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3160,
    trackId: 2,
    title:
      '実測データからサービスの成長余力を測る。負荷シナリオ・テストデータ・限界値の設計',
    abstract:
      '「事業計画が想定する成長を、今のシステムは受け止められるのか」\n\nこの問いに向き合うため、決済サービスで負荷テストに取り組みました。難しかったのは負荷をかけることよりも、その前後にある意思決定です。\n\n数百あるAPIを本番トラフィックの「量」と「重さ」から30本強に絞り込む。本番とのデータ量・分布の違いを調べ、「◯年後相当」のテストデータを準備する。エラー率・レイテンシ・DB CPUから限界を測り、req/sを「ユーザー何万人分か」へ翻訳して事業計画と突き合わせる。\n\n本セッションでは、シナリオ導出、テストデータ準備、限界測定、事業へのレポーティングまで、実測データをもとに負荷テストを設計した取り組みを紹介します。\n\nまた、分析・データ検証・コード生成・結果整理など各工程でAIを活用し、増えた情報や選択肢をどう意思決定につなげたかについても触れます。\n\n「何req/s耐えた」で終わらせず、サービスの成長余力を測るための負荷テストの考え方を持ち帰っていただければと思います。',
    speakers: [
      {
        id: 2330,
        name: 'Kazato Hiei',
      },
    ],
    startTime: '2026-11-18T17:20:00+09:00',
    endTime: '2026-11-18T17:50:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Operation / Monitoring / Logging',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3173,
    trackId: 3,
    title:
      'AIエージェントの「テストは通るのに本番で壊れる」を減らす ― 過程・環境・時間を測る評価手法',
    abstract:
      'AIエージェントを本番に出すと、「テストは高評価なのに本番ではうまくいかない」「テストは通るのに実利用と乖離している」「『確認しました』と報告するが実際は何もしていない」といった、結果出力だけを見る評価では捉えられない不確実性に直面します。\n\n本セッションでは、模範解答との一致に偏りがちな評価を「過程・環境・評価者・時間」の4軸に広げ、エージェントの評価手法を紹介します。\n・ツール呼び出しログへの時相論理アサーション（削除前にバックアップ等）と無駄な手順の検出\n・Predictive Test Selectionと途中状態からの分岐再実行による、遅く高いテストの削減\n・LLM-as-Judgeに「主張ではなく証拠」を判定させる設計とHuman-in-the-loop\n・テスト自体の陳腐化（模擬と実環境のズレ、モデル更新等）の定量的な検知\n\nこうした課題に対し、AIエージェント開発をDevOpsするためのテスト・評価手法について、失敗例を含めて共有します。',
    speakers: [
      {
        id: 2343,
        name: 'Yusuke Shibui',
      },
    ],
    startTime: '2026-11-18T17:20:00+09:00',
    endTime: '2026-11-18T17:50:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'CI / CD',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3265,
    trackId: 4,
    title: 'OCI Artifact による自動運転タクシーに向けた OTA 基盤の構築',
    abstract:
      '自動運転タクシーは「デポ (Depot)」と呼ばれる拠点をベースに運用し、事業を拡大するほど各地のデポに分散した車両が増加します。そのため、各デポの車両へ OS を含めて同じ環境を届ける OTA (Over The Air) が欠かせません。\n車載コンピューターの OS は bootc などのクラウドネイティブな OS 更新の仕組みとは前提が合わない一方、ベンダーが提供する A/B 方式の更新の仕組みを備えています。\n本セッションでは、Web のコンテナイメージ配布や Git を起点に配布する考え方を OCI Artifact で取り入れ、開発車両を対象に OTA 基盤を検証している取り組みをお話しします。\n\n- 車載 OS の更新の仕組みと、OS ごと更新する理由\n- OS イメージを OCI Artifact として署名し、Self-host したレジストリから配る構成\n- デポ間における replication と配布の設計\n- オフライン環境における署名の検証',
    speakers: [
      {
        id: 2422,
        name: 'Shota Iwami',
      },
    ],
    startTime: '2026-11-18T17:20:00+09:00',
    endTime: '2026-11-18T17:50:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'IoT / Edge',
    conferenceDayId: 1,
    showOnTimetable: true,
  },
  {
    id: 3280,
    trackId: 1,
    title:
      '応答性と地域を越えた交流を両立する──ホロライブドリームスのマルチリージョン設計',
    abstract:
      '通常のゲーム操作は近くのリージョンで快適に、フレンド交流やプライベートルームでのマルチプレイは地域を越えて。「ホロライブドリームス」で、この要件を両立するデータ配置とKubernetesによるマルチゲーム基盤の設計を解説します。\n前半では、通常処理をユーザーが近いリージョンのRegional APIに閉じ、共有データを日本に配置したGlobal APIで扱う構成を紹介します。データの鮮度と書き込みの許容遅延を整理し、非同期・同期の部分失敗や複数DB更新の複雑さを避ける一方、地域間通信の遅延をどこで受け入れたかを説明します。\n後半では、世界中のプレイヤーが一緒に遊ぶためのAgones・Open Matchを使ったマルチゲーム基盤の紹介と、安全性とメンテナンス性を考慮したマルチリージョンGKEクラスタ構成を紹介します。\n複数地域にサービスを提供するバックエンドエンジニア・SREに向けて、遅延・鮮度・実装の複雑さからデータ配置を判断する視点と、規模が大きくなる中で運用の複雑さを抑えるための考え方を共有します。',
    speakers: [
      {
        id: 2437,
        name: 'Takuya Yanase',
      },
      {
        id: 2439,
        name: 'Masaya Matsuda',
      },
    ],
    startTime: '2026-11-19T10:30:00+09:00',
    endTime: '2026-11-19T11:00:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Keynote',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3299,
    trackId: 1,
    title: '「自分も参加できる」と思える場所を ― Women Gathering SIGの誕生',
    abstract:
      '日本のクラウドネイティブコミュニティでは、たくさんの先輩たちが「入口」を作り続けてきました。初心者向けのMeetupは「わからない」ままでも参加できる場を作りました。日本語で学べるUpstream Trainingは、言語の壁を越えてコントリビューションへの道を開きました。手ぶらで参加できるハンズオンは、環境構築の壁を取り除きました。こうした積み重ねのおかげで、クラウドネイティブ技術を学ぶ入口は大きく広がっています。\n\n一方で、入口が開いていても「ここに自分がいていいのかな」とためらう人はまだいます。この見えにくい心理的な壁を越える次の一歩として、私たちはWomen Gathering SIGを立ち上げました。\n\n本セッションでは、これまでのコミュニティ活動から学んだこと、SIG立ち上げの経緯、そしてこれから目指す姿をお話しします。コミュニティ全体の裾野を広げ、「Scaling Together」を一緒に実現していきましょう。',
    speakers: [
      {
        id: 2469,
        name: 'Aoi Takahashi',
      },
      {
        id: 2470,
        name: 'Sunyanan Choochotkaew',
      },
    ],
    startTime: '2026-11-19T11:00:00+09:00',
    endTime: '2026-11-19T11:10:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Keynote',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3285,
    trackId: 1,
    title: 'OTelで計測し、個人から組織へ広げるAI協働力',
    abstract:
      'AIエージェントの利用ログを集めても、何を評価し、どこを改善すべきかが分からなければ、組織の成果にはつながりません。AI活用を個人の工夫にとどめず、組織として生産性とセキュリティを継続的に高めるには、実務での使われ方を捉え、評価と改善を繰り返す仕組みが必要です。\n\nハイヤールーは、累計118万件を超えるスキル評価で培った知見をもとに、開発者とAIエージェントの協働を実務ログから計測・評価してきました。個人と組織のAI活用ログをOpenTelemetry（OTel）形式で収集し、多数の評価項目に基づいて可視化しています。その結果をもとに、トークン消費の効率化、ガードレールの整備、繰り返し使う手順の組織共通Skills化、エージェントに必要なコンテキストを提供する仕組みづくりを進めています。\n\n本講演では、HireRoo Skill Assessmentでの取り組みをもとに、OTelで収集したログをどの指標で評価し、改善につなげるかを紹介します。個人の実践を組織共通の仕組みに変え、生産性とセキュリティの両面でAI活用を改善し続けるための考え方と具体例をお伝えします。',
    speakers: [
      {
        id: 2445,
        name: 'Shuhei Shintani',
      },
    ],
    startTime: '2026-11-19T11:10:00+09:00',
    endTime: '2026-11-19T11:30:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Operation / Monitoring / Logging',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3283,
    trackId: 1,
    title: 'AIインファレンスの運用を支えるAkamai LKE-EとApp Platform',
    abstract:
      'KubernetesでAIインファレンス（推論）を運用する、またはこれから始めるインフラ／プラットフォームエンジニア向けの講演です。GPUの有効活用、モデルとアプリのCI/CD、AI Gatewayの3つの観点で運用フェーズの課題と対応を整理し、Akamai Cloud上でLKE EnterpriseとApp Platformを使った、OSS中心の構成例と事例を紹介します。',
    speakers: [
      {
        id: 328300,
        name: 'Yuko Mori',
      },
    ],
    startTime: '2026-11-19T11:30:00+09:00',
    endTime: '2026-11-19T11:50:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Operation / Monitoring / Logging',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3298,
    trackId: 1,
    title:
      'AIの外側に論理的境界を引く — ガバメントクラウドと源内で、どう論理的境界を引いてデータの統制と自律性を両立しているか',
    abstract:
      'クラウドやAIの安全な活用に取り組むエンジニア・情報システム担当者向けの講演です。ガバメントクラウドとガバメントAI 源内の実践例を基に、AIモデルの外側に契約・認証・権限・暗号・環境・証跡の6つの論理的境界を引き、組み合わせて統制するアーキテクチャを解説します。モデルを入れ替えても統制は変わらないため、最新のAIモデルをすぐに取り入れつつ、データの統制とAIエージェントの自律性を両立しています。',
    speakers: [
      {
        id: 2458,
        name: 'Norihito Yamamoto',
      },
    ],
    startTime: '2026-11-19T11:50:00+09:00',
    endTime: '2026-11-19T12:10:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Architecture Design',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3202,
    trackId: 1,
    title:
      '40以上のマイクロサービスを支えるKubernetes JITアクセス — 160以上の恒久RoleBindingを削減',
    abstract:
      '40以上のマイクロサービスが利用するGKE/EKSクラスタに、必要な人へ必要な時間だけKubernetes権限を付与するJIT（Just-in-Time）アクセスを導入し、開発チーム管理の恒久RoleBindingを160以上削減しました。\n\nしかし、正規の申請・承認フローだけでは、承認ステップの欠落、承認済み処理の再実行、GitOps経由の直接作成という3つの迂回経路が残りました。\n\n具体的には、GitHub Environments/Actionsで承認・付与し、Kyvernoで期限切れのRoleBindingを削除します。Kubernetes側では、人へのRoleBindingで参照できるClusterRoleをPlatformチーム提供のものに限定し、RoleBindingの作成主体も制限しています。\n\n講演では、3つの迂回経路をGitHubとKubernetesの両側でどう塞いだか、その設計判断と、期限付き例外を設けて30チームへ段階的に移行した過程を共有します。正規経路の外側まで安全に設計する観点を持ち帰れます。',
    speakers: [
      {
        id: 2372,
        name: 'Koichi Shimada',
      },
    ],
    startTime: '2026-11-19T13:10:00+09:00',
    endTime: '2026-11-19T13:40:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Security',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3269,
    trackId: 2,
    title:
      'Platform Engineering をベースとした Agentic Software Factory の実践',
    abstract:
      'Agentic Software Factory という考え方は、AI エージェントの普及に伴い台頭してきている、SDLC の各工程を AI エージェントが担うソフトウェア開発のあり方です。\nAI エージェントが安定して成果を出すには、再利用できる共通基盤を整える必要があり、Platform Engineering の考え方が活きてきます。\n本セッションでは、Agentic Software Factory を題材に、以下のような内容をお話しします。\n\n- SDLC の各工程に沿った AI エージェントの設計\n- 共通基盤を AI エージェントに認識させるためのソフトウェアカタログの構築\n- 各工程におけるドキュメンテーション\n- Agentic Software Factory による Platform 自体の開発\n- GitHub Actions とコーディングエージェントを用いた Agentic Software Factory の実践例\n- Kubernetes の Agent Sandbox や Agent Substrate による Sandboxing',
    speakers: [
      {
        id: 2418,
        name: 'Yuki Ito',
      },
    ],
    startTime: '2026-11-19T13:10:00+09:00',
    endTime: '2026-11-19T13:40:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Application / Development',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3185,
    trackId: 3,
    title:
      'Kubernetes, Agones, WebRTC, GPU で作るクラウドゲーミング基盤を本番運用に乗せるまで',
    abstract:
      '私たちはPCゲームをスマホで遊べるサービス『viviON GAMES』を2026年にリリースしました。このサービスの裏側にはGPUノードで構成されたKubernetesクラスターが複数あり、マルチクラウドで運用しています。\n\n本セッションでは、クラウドゲーミングという国内では珍しい技術基盤をKubernetesクラスターでどのように実現したか、そしてチームでどのように本番運用に乗せたかを解説します。\n\nリアルタイムに映像を配信するWebRTCをKubernetesで動かす技術、ステートフルなワークロードのスケール戦略、マルチクラウドの差異を吸収するための技術的な工夫を紹介します。また、担当者が一人しかいない状態からどのように複雑な基盤を属人化させずチームで運用できるようにし、サービスローンチを迎えたかをお話します。\n\nこのセッションにより、GPU・リアルタイム通信・ステートフル性を扱うための設計と、その複雑な基盤を属人化させずチームで運用する方法をお持ち帰りいただけます。',
    speakers: [
      {
        id: 2351,
        name: 'Hiroki Awata',
      },
    ],
    startTime: '2026-11-19T13:10:00+09:00',
    endTime: '2026-11-19T13:40:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Application / Development',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3212,
    trackId: 4,
    title:
      '列指向でオブザーバビリティをどう変えるか ーOpenTelemetry Arrow から バックエンドストレージまでー',
    abstract:
      'オブザーバビリティのためにテレメトリーを収集すると、ネットワーク帯域やCPU、メモリなどのリソースを消費します。テレメトリーが増えれば、観測対象のアプリケーションだけでなく、そのデータを収集・転送・処理する基盤への負荷も無視できません。\n\nでは、この問題に「データの持ち方」から向き合ってみませんか？\n\n本セッションでは、OpenTelemetry Arrowを軸に、列指向データがテレメトリー・パイプラインにもたらす変化を考えます。OpenTelemetryで標準的に使われている通信方式「OpenTelemetry Protocol（OTLP）」でも、データをバッチでまとめて送ることはできます。では、バッチの「中身」を列指向で持つと何が変わるのでしょうか。実際の本番事例では、ネットワーク帯域を30〜70%削減した結果も報告されています。簡単なコード例を交え、その違いを紐解きます。\n\nさらにバックエンドの列指向データベースにも目を向け、収集から保存までオブザーバビリティをどこまで変えられるのかを考えます。',
    speakers: [
      {
        id: 2382,
        name: 'Yoshitake Asano',
      },
    ],
    startTime: '2026-11-19T13:10:00+09:00',
    endTime: '2026-11-19T13:40:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Operation / Monitoring / Logging',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3297,
    trackId: 1,
    title:
      'Test Impact Analysis を武器に立ち向かう、AI 時代のテスト増加に対するヌーラボのアプローチ',
    abstract:
      'AI にコードを書かせることが当たり前になった今、増え続けるテストが CI の実行時間と費用を押し上げています。エージェントへの指示を改善し、テストを削減することが王道のアプローチですが、テスト設計の知識をチーム全体へ浸透させるには、教育にも時間と労力がかかります。\n\nヌーラボはこの課題に対して、CI/CD パイプラインとテスト実行のオブザーバビリティを整備することからアプローチしました。そのうえで、個々の開発者の工夫だけに依存せず、プラットフォームとしてアウターループを最適化する手段として、Datadog の CI/CD Optimization の一機能である Test Impact Analysis（TIA）に注目しました。コードカバレッジと変更差分から、影響を受けないテストをスキップし、実行負担を減らします。\n\n本セッションでは、Datadog とヌーラボが、TIA の原理とメリット、導入の背景、時間と費用の削減に向けた実践事例と今後の展望を共有します。',
    speakers: [
      {
        id: 2441,
        name: 'Keisuke Sakasai',
      },
      {
        id: 2448,
        name: 'Yuki Yoshiiwa',
      },
    ],
    startTime: '2026-11-19T14:00:00+09:00',
    endTime: '2026-11-19T14:30:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Operation / Monitoring / Logging',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3286,
    trackId: 4,
    title:
      'さくらのクラウドで実現する クラウドネイティブアプリケーションは、今どこまで来たか？',
    abstract:
      '国産クラウドで今、クラウドネイティブはどこまで実現できるのか。AppRun などのコンテナ基盤、ストレージ、ワークフローエンジン、APIGateway、ロードバランサ、監視サービスを組み合わせた構成例を題材に、さくらのクラウドで「今できること」を率直にお伝えします。',
    speakers: [
      {
        id: 2444,
        name: 'Harunobu Kameda',
      },
    ],
    startTime: '2026-11-19T14:00:00+09:00',
    endTime: '2026-11-19T14:30:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Architecture Design',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3198,
    trackId: 1,
    title:
      'DevSecOps、その前に。「何をどこまで守る？」から始めるセキュリティアーキテクチャ',
    abstract:
      'セキュリティ人材が不足する中、複雑化・分散化するCloud Nativeなシステムを守るために、DevSecOpsは重要なアプローチです。しかしDevSecOpsを進めるとき、開発者の「セキュリティへの苦手意識」が壁になります。\n\nでは、「セキュリティが苦手」な人がどこでつまずいているか、想像できるでしょうか。とある組織で、セキュリティに苦手意識を持つ当事者に、その「苦手」のDomain Expertとして開発へ参加してもらい、トレーニングを作りました。そこで見えてきたのは、問題は必ずしもセキュリティ知識の不足ではない、ということでした。用語や対策を知っていても、それを自分たちのアーキテクチャに結びつけ、「何を、どこまで守るか」を判断できない。必要だったのは、知識を実際の設計に適用し、判断する力でした。\n\n本セッションでは、「セキュリティアレルギー克服」を目指し、セキュリティを専門としない開発者でも基礎的な脅威モデリングができるようにする設計演習を、ツール頼りにならないDevSecOpsの始め方としてご紹介します。',
    speakers: [
      {
        id: 2368,
        name: 'Sachiko Kijima',
      },
    ],
    startTime: '2026-11-19T14:50:00+09:00',
    endTime: '2026-11-19T15:20:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Architecture Design',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3197,
    trackId: 3,
    title:
      '社内アプリ基盤「Quartz」による、非エンジニアとAIに本番デプロイを任せても壊れないプラットフォームの設計',
    abstract:
      '非エンジニアにAIでどこまで任せられるかは、AIの賢さではなく、致命的な失敗を起こさないプラットフォームの有無で決まります。TOKIUMでは全社員にClaude Codeを配布し、非エンジニアも業務改善アプリを作り始めました。しかし成果物の多くは個人利用にとどまりました。公開時の認証・機密情報・脆弱性・コスト・保守責任を組織として担保する経路が無かったためです。そこで、これらを担保しつつ、チャットのみで社内アプリの作成・プレビュー・本番デプロイまで完結する基盤「Quartz」を開発しました。核はプラットフォーム層とアプリ層の分離です。SSOの強制、シークレット・脆弱性走査、予算超過時の自動停止は管理者だけが触れるプラットフォーム層に置き、利用者とAIが触れるのはアプリ層だけに絞ります。危険な操作はその実行環境に存在せず、権限や状態もアプリ単位に閉じるため、失敗の影響はアプリ1個に留まります。本セッションでは、この分離をどんな設計で実現したのか、利用者とAIに解放する部分と管理者が握る部分の切り分け、その境界を越えられないようにした仕組みを、社内AI導入やIDPを検討する方へ共有します。',
    speakers: [
      {
        id: 2367,
        name: 'Shun Kittaka',
      },
    ],
    startTime: '2026-11-19T14:50:00+09:00',
    endTime: '2026-11-19T15:20:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Architecture Design',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3171,
    trackId: 4,
    title: 'CVSS 9.8を含むCVE4件、Fluentdメンテナが経験した脆弱性対応の舞台裏',
    abstract:
      '2026年6月、私たちはFluentd v1.19.3でCVSS 9.8のRCEを含む4件の脆弱性を修正し、CVEを公開しました。本セッションはその対応にあたったOSSメンテナの一次体験談です。\n\n始まりは、同じ脆弱性が示し合わせたように複数の報告者から同時期に届いたことでした。修正中にも報告が届き、トリアージはリリース当日まで続きました。GitHubでCVE IDを取得しアドバイザリを公開しても、記録はcve.orgやNVDに3週間反映されませんでした。GitHub Advisory DatabaseとDependabotは即日動くのに、NVDを参照するスキャナやSBOMツールは脆弱性を認識できない。自社の脆弱性管理がどちらを見ているかで、気づく時期が3週間ずれるという現実です。\n\n報告の受付から修正、採番、開示調整、データベース反映まで、実際に直面した課題を紹介します。設定依存の脆弱性に対し、バージョンだけで判定するスキャナを補うため設定診断ツールを新たに開発した判断と設計も共有します。自社への影響と優先順位を判断する観点と、報告者としてメンテナの検証を助ける伝え方を持ち帰れます。',
    speakers: [
      {
        id: 2342,
        name: 'Shizuo Fujita',
      },
    ],
    startTime: '2026-11-19T14:50:00+09:00',
    endTime: '2026-11-19T15:20:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Security',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3292,
    trackId: 1,
    title:
      '同じ技術でも、なぜ選択が違う？ ― 多様な現場のエンジニアが語るクラウドネイティブの意思決定',
    abstract:
      '「AI時代のクラウドネイティブ」をテーマに、会社の規模や事業領域が異なるエンジニアが集まり、同じ技術・課題への向き合い方の違いを語ります。話すのは、OSSを何を基準に選ぶか、脆弱性対応やupstreamへの還元を含めOSSを誰がどう維持するか、クラウド・オンプレ・閉域網のどれで何を動かすか、の3つです。技術選定や運用方針を決める立場のエンジニア・SREに向けたセッションです。自社とは前提の違う組織が何を決め手にしているかを知り、自分たちの判断軸を見直すきっかけを持ち帰っていただけます。',
    speakers: [
      {
        id: 2331,
        name: 'Kohei Hayama',
      },
      {
        id: 2385,
        name: 'Atsushi Umakatsu',
      },
      {
        id: 2405,
        name: 'Hiroshi Hayakawa',
      },
      {
        id: 2451,
        name: 'Keita Mochizuki',
      },
      {
        id: 2460,
        name: 'Daiki Takasao',
      },
    ],
    startTime: '2026-11-19T15:40:00+09:00',
    endTime: '2026-11-19T16:10:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'その他',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3295,
    trackId: 2,
    title: '学生スカラシップ LT 〜CloudNative に挑戦する学生たち〜',
    abstract:
      'CloudNative Days 学生スカラシップに採択された 5 名の学生が、ショートセッションをリレー形式で発表します。ネットワークの低レイヤからアプリケーションの設計、インフラの運用と自動化、そしてソフトウェアサプライチェーンの研究まで。それぞれが自分の手で作り、動かし、つまずいた経験から得た学びを持ち寄ります。クラウドネイティブを学び始めた方はもちろん、次の世代がどんな挑戦をしているのかを知りたい方にもおすすめです。',
    speakers: [
      {
        id: 2452,
        name: 'WAKATO NAKATA',
      },
      {
        id: 2453,
        name: 'Itsuki Baba',
      },
      {
        id: 2459,
        name: 'Takaharu Nakamura',
      },
      {
        id: 2463,
        name: 'Kenta Hirano',
      },
      {
        id: 2468,
        name: 'Yusuke Moriwaki',
      },
    ],
    startTime: '2026-11-19T15:40:00+09:00',
    endTime: '2026-11-19T16:10:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'その他',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3293,
    trackId: 3,
    title: '初心者向け！新しく触ったクラウドネイティブ技術LT',
    abstract:
      'クラウドネイティブ技術に新しく挑戦した初心者エンジニアたちが、実際に触って得られた学びや発見をお届けします！\n\n初めてだからこそ直面したつまずきや、試行錯誤の中で気づいたことなど、等身大の体験談が盛りだくさん。\n\nこれから新しい技術に挑戦したい方も、同じような経験をしたことがある方も、きっと共感や新たな発見があるはずです。\n\n登壇者たちの挑戦を、ぜひ会場で応援してください！\n\n登壇タイトル：\n1. Sandbox基盤のLLM Proxy選び！LiteLLMとagentgatewayを試して分かったこと（辻田 美咲）\n\n2. Headlampから学ぶ、KubernetesのOIDC認証とコントリビューションの面白さ（山崎 祐輝）\n\n3. 15時間ずっと「進行中」！？新卒エンジニアがGitHub Actionsの最新機能に挑んでハマった話（松浦 麗）\n\n4. TLS共通化から始まったIstio Fault Injectionへの挑戦（岩鶴 京也）\n\n5. 複数ノードになった自宅k8sのデータの扱い方 ― NFS・Longhorn・Garageを比べる（菅家孝太郎）',
    speakers: [
      {
        id: 2454,
        name: 'Kotaro Kanke',
      },
      {
        id: 329301,
        name: 'Kyoya Iwatsuru',
      },
      {
        id: 2462,
        name: 'Misaki Tsujita',
      },
      {
        id: 2464,
        name: 'Yuki Yamasaki',
      },
      {
        id: 329304,
        name: 'Rei Matsuura',
      },
    ],
    startTime: '2026-11-19T15:40:00+09:00',
    endTime: '2026-11-19T16:10:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'その他',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3294,
    trackId: 4,
    title: 'しくじりだってここでなら話せる！配信なしぶっちゃけLT',
    abstract:
      '技術導入での思わぬ落とし穴や、障害対応の裏側、いまだからこそ話せる失敗談など、登壇者たちのリアルな「しくじり」をお届けします！\n\nこのLTは配信なしの会場限定企画。普段はなかなか表に出てこない、ここだけのぶっちゃけ話が飛び出すかもしれません。\n\n成功談だけでは見えてこない学びや、思わず共感してしまうエピソードが盛りだくさん。\n\nここでしか聞けない貴重な体験談を、ぜひ会場でお楽しみください！\n\n登壇タイトル：\n1. ログが6週間消えていたのに誰も気づかなかった話 〜オブザーバビリティの設計判断にしくじりが答えをくれた〜（國本 裕哉）\n\n2. え、塩漬けだったAWSアカウントのコスト、見直すだけでこんなに減るんですか？（中村 昴）\n\n3. 俺のCIDRがこんなに一致しないわけがない 〜ALB Controller 無限Reconcile編〜（じぇまき）\n\n4. Kubernetes (GKE) クラスターの載せ替えに失敗した話（山口 健太）\n\n5. 社内開発者プラットフォームの品質を追求したらGitHub Actionsが止まった話（鈴木 敦）',
    speakers: [
      {
        id: 2391,
        name: 'Jumpei Maki',
      },
      {
        id: 2455,
        name: 'Atsushi Suzuki',
      },
      {
        id: 2456,
        name: 'Yuya Kunimoto',
      },
      {
        id: 2213,
        name: 'Subaru Nakamura',
      },
      {
        id: 2465,
        name: 'Kenta Yamaguchi',
      },
    ],
    startTime: '2026-11-19T15:40:00+09:00',
    endTime: '2026-11-19T16:10:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'その他',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3223,
    trackId: 1,
    title:
      '全社AI活用を「止めずに守る」— MCPプロキシとOpenTelemetryで作るAIガバナンス基盤',
    abstract:
      'Claude Teamを全社導入し利用者が会社全体へ広がる中、AI活用を推進しつつ「誰がどのように使っているか」「業務SaaSにAIから安全に触らせるには」といったガバナンスの課題を抱えていました。この課題に対し、AWSマネージドサービスとTerraformを使って構築した2つの基盤を、設計判断の背景や実装過程で詰まった点などを含めて共有します。\n(1) Claude CodeのOpenTelemetryテレメトリ基盤：CloudWatch LogsのOTLPエンドポイントに直結し、プロンプト本文は許可リスト方式で落として監査用/分析用ロググループを分離\n(2) 社内MCPプロキシ：共通マシンユーザーではなく操作者ごとの3-legged OAuthでSaaSのMCPを叩かせ、監査ログ・破壊的ツールのフィルタ・Auth0 M2M連携を実装\n\n対象はAI活用を組織に広げたいがガバナンスに悩むSREやコーポレートエンジニア。運用工数を最小限に抑えることができるAWSマネージドサービス中心でガバナンスを整えるための実践的なヒントをお伝えします。',
    speakers: [
      {
        id: 2389,
        name: 'Keigo Aoki',
      },
    ],
    startTime: '2026-11-19T16:30:00+09:00',
    endTime: '2026-11-19T17:00:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Architecture Design',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3208,
    trackId: 2,
    title:
      'セキュリティチームはどのコンテナイメージの脆弱性対応を優先すべきか 〜CISA新指針とSCCで作る脆弱性トリアージ〜',
    abstract:
      'セキュリティチームは社内で開発されている膨大な量のコンテナイメージの脆弱性対応に優先度付けをし、開発チームに対して修正を依頼する必要があります。CVE件数は年々増加しており、従来型のCVSSスコアに依存した優先度付けでは、対応件数が膨大になり、本来やるべき開発が行えなくなる問題が発生してしまいます。一方で、必要な脆弱性対応は行わなければいけません。\n\n米CISAは2026年6月、新指令BOD 26-04で脆弱性対応の優先順位付け手法を刷新しました。本セッションでは、この指針を参考に実装したコンテナイメージの脆弱性トリアージの仕組みを、特に以下の点に絞って紹介します。\n\n- KubernetesのマニフェストをAIに辿らせたイメージの外部公開判定\n- 脆弱性情報（EPSS・悪用状況・CVSSなど）を基にした対応優先度付け\n- 開発チームが対応しやすいレポートの自動生成\n\n本セッションは、セキュリティチームだけでなく、日々脆弱性対応に追われる開発チームの方にとっても参考になる発表になると思います。',
    speakers: [
      {
        id: 2378,
        name: 'Takuya Sawada',
      },
    ],
    startTime: '2026-11-19T16:30:00+09:00',
    endTime: '2026-11-19T17:00:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Security',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3216,
    trackId: 3,
    title:
      'そのイメージ、どのCIが作った？Artifact Attestationsで来歴を固定する',
    abstract:
      'そのイメージは本当に共通のCIで作られたのでしょうか。GitHub Artifact Attestationsで証明できます。ただし解説の多くはcosignと公開ログが前提で、privateリポジトリでは署名基盤が変わります。署名はGitHub運用のSigstoreインスタンスが行い、Rekorを通りません。失うのは第三者による監査で、個々の検証は成立します。\n\nAWSアカウントを分けた4環境のKubernetes基盤に、この前提で来歴検証を実装します。ビルドを共通Reusable Workflowへ寄せると、実行元を示すjob_workflow_refがその一本に固定されます。署名証明書とIAM信頼ポリシーの両方がこの値を参照するため、共通CIを通らないビルドはレジストリへpushできません。統制の本体は権限設計で、署名はその裏づけです。\n\nCIの統制と成果物の来歴証明を設計する方に、IAM条件の書き方、ビルド時・環境昇格時・Pod起動時の三段検証、SHA pinを一箇所だけやめた判断を、その根拠ごとお話しします。',
    speakers: [
      {
        id: 2384,
        name: 'Chikahisa Mikata',
      },
    ],
    startTime: '2026-11-19T16:30:00+09:00',
    endTime: '2026-11-19T17:00:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Security',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3188,
    trackId: 4,
    title:
      'Terraform 0 to 100：100個以上のリポジトリを常に最新にし続けるための自動化',
    abstract:
      '2018年の未IaC状態から少しずつ全社展開を進め、現在は100以上のTerraformリポジトリ（AWS/Google Cloud等）を運用しています\n\nリポジトリが増えると色々と問題点も出てきます。\n\n例えばTerraformで使ってるproviderをDependabotで毎月バージョンアップするとしても、リポジトリが100個あれば100個のパッチが作られます。Drift状態でマージしてapplyすると事故の原因になるので自動マージを入れるのも容易ではありません。\nまた、既存ツールだとTerraform本体のバージョンアップができなかったので自分でツールを作る必要がありました。\n\n本トークではリポジトリの数が増えていく各フェーズ（0→1→10→50→100の各フェーズ）においてどのような問題にぶつかったのかと、それを解決するために作ってきた様々な仕組みやツールの話をします。\n\n今回紹介するツールは社内ツールだけではなくOSSとしても公開しているため、Terraformの運用に苦しんでる人が明日から導入して実践することができます。',
    speakers: [
      {
        id: 2358,
        name: 'Go Sueyoshi',
      },
    ],
    startTime: '2026-11-19T16:30:00+09:00',
    endTime: '2026-11-19T17:00:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'CI / CD',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3229,
    trackId: 1,
    title:
      'チームが育つから、基盤はスケールする — EKS/GKEで増え続けるプロダクトを支える組織設計',
    abstract:
      '3年前、モノタロウにコンテナ基盤はありませんでした。4名で始めた基盤は、いまEKS / GKE上で100に迫るプロダクトを載せ、なお増え続けています。一方でチームは6名。耐えているのではなく、運用の大半を自動化し、時間の多くをプラットフォームの改善に使えています。\n\nこれを可能にしたのは増員ではなく、チームが育ったことでした。任せられる領域が増えるほど、人は運用を回す側から自動化する側に回れる。空いた時間が次の改善を生み、プロダクトの成長を支える。プラットフォームの成長速度は人の成長速度で決まる——これが3年間の実感です。\n\n本セッションでは、人とチームを育てるために実践してきたことを、考え方とセットでお話しします。たとえば次のような打ち手です。\n\n・コミュニケーションのパスを増やす\n・全員に発言機会をつくる\n・権限と責任をセットで渡す\n・ビジョンで目線を合わせる\n\n少人数で広い責任範囲を持つプラットフォーム／SREチームのリーダー、これからマネジメントに関わる方が対象です。明日から試せる打ち手と、それがなぜ効くのかを持ち帰れます。',
    speakers: [
      {
        id: 2394,
        name: 'Tadatsugu Kusumoto',
      },
    ],
    startTime: '2026-11-19T17:20:00+09:00',
    endTime: '2026-11-19T17:50:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: '組織論',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3213,
    trackId: 2,
    title: 'AWS DevOps Agentの構造から読み解く、運用AIエージェントの設計原則',
    abstract:
      'AIエージェントを使った運用を設計する際、まず考えたいのは何と接続し、いつ動かし、どう制御するかです。\n\n障害対応では、メトリクスやログだけでなく、クラウド上のリソース、過去の障害情報、ソースコード、デプロイ、CI/CDなど、複数の情報を組み合わせて原因を調査します。また、安全な範囲で調査や操作を実行する仕組みも必要です。\n\n本セッションでは、AWS DevOps Agentを題材に、運用AIエージェントの設計を8つの観点で捉え直します。接続先環境、テレメトリ、ナレッジ、ソースコード、CI/CD、チャットツール、トリガー、ガードレールを整理し、MCPやA2Aなどの接続方法も取り上げます。\n\n私は約5年間AWS CDKを使い、AWSアーキテクチャを再利用可能な形にしてきました。今回はその延長として、これら8つの要素を組み合わせた運用AIエージェントのリファレンスアーキテクチャを考え、AWS CDKで自社環境に持ち帰って試せる形として実装・紹介します。',
    speakers: [
      {
        id: 2355,
        name: 'Tomoki Sato',
      },
    ],
    startTime: '2026-11-19T17:20:00+09:00',
    endTime: '2026-11-19T17:50:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'Operation / Monitoring / Logging',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3219,
    trackId: 3,
    title:
      '持続可能なKubernetes：ジェイテクトは、廃棄予定のワークステーションからクラウドネイティブに踏み出した',
    abstract:
      'IT企業ではないにもかかわらず、トヨタグループの製造業であるジェイテクトでは、社内で開発するアプリケーションが増え続けています。しかし、それらを動かすサーバーはIT部門から提供されなかったため、エンジニアのチームが自ら、廃棄予定のCAD用ワークステーションを再利用して本番のKubernetesクラスターを構築しました。マシンは古いため、故障は想定内です。それでも、Kubernetesによって高可用性を確保し、アプリケーションを止めずに動かし続けています。このオンプレミスクラスターでの実証が、全社向けの複数のアプリケーションでAWS EKSを採用し、Kubernetesを大規模に活用するきっかけとなりました。本セッションでは、製造業のジェイテクトがクラウドネイティブ技術に踏み出した経緯を、再利用ハードウェアの小さなクラスターから全社規模のKubernetesへ広げた道のりとしてお話しします。ハイパースケーラーのリソースがなくても始められること、IT企業でなくてもクラウドネイティブを活用できることをお伝えします。',
    speakers: [
      {
        id: 2377,
        name: 'Maxime Moreillon',
      },
    ],
    startTime: '2026-11-19T17:20:00+09:00',
    endTime: '2026-11-19T17:50:00+09:00',
    talkDifficulty: '初級者',
    talkCategory: 'Architecture Design',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
  {
    id: 3271,
    trackId: 4,
    title:
      '数行の変更でDockerビルドを最大91%高速化～GitLab CIの実行基盤を社内40リポジトリに展開するまで～',
    abstract:
      'クラウド上のコンテナ基盤への移行や活用が進む中、社内の全リポジトリで「キャッシュを最大限利用した高速なビルド」と「サプライチェーン攻撃を意識した安全なビルド環境」を両立できていますか。\n\n私たちの社内では、キャッシュ未設定や特権コンテナを用いた安全でないビルドが過半数を占めていたほか、レジストリキャッシュを導入した大規模なアプリケーションでも、数GBに及ぶキャッシュの転送・展開自体に時間がかかるなど、多くの課題を抱えていました。\n\n本セッションでは、ローカルにキャッシュを永続化したGitLab Runnerを構築し、Docker Bakeを起点とするGitLab CI/CD componentとして社内パッケージを配布した取り組みを紹介します。各チームはCI定義を数行変更するだけで手軽に導入でき、ビルド時間を中央値65%・最大91%短縮、全社約40リポジトリへの展開を達成しました。\n\nまた、実際に各チームにオプトインで使ってもらうためのインターフェース設計や、共用CI基盤でのコンテナセキュリティ・キャッシュ汚染対策など、実践する上で直面した設計の工夫と苦労についてもお話しします。',
    speakers: [
      {
        id: 2402,
        name: 'Noboru Tohda',
      },
    ],
    startTime: '2026-11-19T17:20:00+09:00',
    endTime: '2026-11-19T17:50:00+09:00',
    talkDifficulty: '中級者',
    talkCategory: 'CI / CD',
    conferenceDayId: 2,
    showOnTimetable: true,
  },
]
