// Forteeのプロポーザルデータを元に、セッション・スピーカー情報を生成するスクリプト
// 変換元API: https://fortee.jp/{EVENT_ALIAS}/api/proposals/accepted
// 変換先フォーマット: src/data/xxx.ts (Track, Speaker, Talk)
// 実行コマンド: just fortee
// もしくは
// 実行コマンド: npx tsx ./script/fortee/convert.ts -y && npm run fmt
//
// fortee 側にタイムテーブルが入っていないことがある。その場合は
// script/fortee/src/overrides.json で時刻・トラックを補完する。
// 雛形は公式サイトから自動生成できる: just fortee-scaffold

import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  forteeProposal,
  forteeTimetableItem,
  ForteeOverrides,
  OverridesTimetable,
  OverridesSessionSpeaker,
  OverridesExtra,
} from './type.js'
import { Track, Speaker, Talk } from '../../src/data/types.js'
import { exportEventData } from '../common/utils.js'

const EVENT_ALIAS: string = 'pdeconf-2026'

// overrides の雛形生成元。fortee の uuid が data-session-modal-target に入っている
const TIMETABLE_PAGE_URL: string = 'https://product-engineering.jp/2026/'

const TZ_OFFSET: string = '+09:00'

// 全ホール共通(col-span-3)の枠を入れるトラック
const FULL_WIDTH_TRACK: string = 'A'

// 出力しない枠（運営連絡枠・休憩枠など）。タイトルの部分一致で判定する。
// ここに足したものは overrides.json の enabled によらず talks.ts に出ない。
// scaffold 実行時には既存エントリの enabled も false に揃えられる
const EXTRA_DISABLED_TITLES: string[] = [
  'スポンサー受付開始',
  '開場',
  '参加者完全撤収',
  'coffee break',
  // 'ワークショップ',
]

/**
 * EXTRA_DISABLED_TITLES に該当する（＝出力しない）枠かどうか
 */
function isExcludedExtra(title: string): boolean {
  return EXTRA_DISABLED_TITLES.some((t) => title.includes(t))
}

// まとめた枠のタイトルの言い換え。
// 1ホール4本を1件にまとめる都合上、プラン名(Platinum/Gold)がそのまま
// セッション名として画面に出てしまうので統一する
const GROUPED_TITLE_RULES: { match: RegExp; title: string }[] = [
  { match: /Sponsor Session/i, title: 'スポンサーセッション' },
]

// extras に割り当てるIDの開始値
const EXTRA_ID_BASE: number = 9000

// 公式サイトから取り込んだアバターの保存先（public/ 配下）
const SPEAKER_ASSET_DIR: string = 'pde2026/speakers'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const overrides_path = path.join(__dirname, './src/overrides.json')

// const eventImageUrl: string = `https://fortee.jp/files/${EVENT_ALIAS}/image/avatar.jpg`
const eventImageUrl: string = `/pde2026/logo-bg-white.png`

const conferenceDays = [{ id: 1, date: '2026-09-05' }]

// Track情報を生成する
const tracks: Track[] = [
  { id: 1, name: 'A', hashTag: 'a' },
  { id: 2, name: 'B', hashTag: 'b' },
  { id: 3, name: 'C', hashTag: 'c' },
]

// 手動で追加するトーク（最小限の情報）
// IDは 9000番台を使用して自動生成されるIDと重複を避ける
//
// NOTE: 公式サイトのタイムテーブルに載っている枠（オープニング・スポンサーセッション等）は
// overrides.json の extras に自動生成されるので、ここに書く必要はない。
// ここはサイトにすら載っていない枠を足したいとき用。IDは extras と衝突させないこと
const manualTalks: Partial<Talk>[] = [
  // {
  //   id: 9001,
  //   trackId: 1,
  //   title: 'オープニング',
  //   abstract: '',
  //   speakers: [{ id: 0, name: '運営' }],
  //   startTime: '2026-06-28T11:30:00+09:00',
  //   endTime: '2026-06-28T11:50:00+09:00',
  //   conferenceDayId: 1,
  // },
  // {
  //   id: 9002,
  //   trackId: 1,
  //   title: 'クロージング',
  //   abstract: '',
  //   speakers: [{ id: 0, name: '運営' }],
  //   startTime: '2026-06-28T18:00:00+09:00',
  //   endTime: '2026-06-28T18:20:00+09:00',
  //   conferenceDayId: 1,
  // },
]

/**
 * メイン処理関数
 */
async function main() {
  // APIからデータを取得する
  const dataTalks: forteeProposal[] = await fetchProposalData()
  // const dataTalks: forteeTimetableItem[] = await fetchTimetableData()

  // 時刻の補完データを読み込む
  const overrides: ForteeOverrides = loadOverrides()

  // Speaker情報を生成する（id:0で運営を追加）
  const forteeSpeakers: Speaker[] = [
    {
      id: 0,
      name: '運営',
      avatarUrl: eventImageUrl,
    },
    ...convertToSpeakers(dataTalks, overrides),
  ]
  // fortee外の枠が独自のスピーカーを持つ場合（招待講演など）を足す
  const speakers: Speaker[] = [
    ...forteeSpeakers,
    ...convertExtraSpeakers(overrides, forteeSpeakers),
  ]

  // Talk情報を生成する
  const forteeTalks: Talk[] = convertToTalks(dataTalks, speakers, overrides)
  const extraTalks: Talk[] = convertExtraTalks(overrides, speakers)
  const talks: Talk[] = [...forteeTalks, ...extraTalks]

  reportTimetableStatus(dataTalks, forteeTalks, extraTalks, overrides)

  // 時刻が1件も解決できていない場合は talks.ts を空で上書きしない
  if (forteeTalks.length === 0) {
    console.error(
      `\n時刻を解決できたトークが0件のため中断しました。` +
        `\n${overrides_path} に時刻を追記してください（雛形生成: just fortee-scaffold）。`
    )
    process.exit(1)
  }

  // 手動で追加したトークをマージ
  const allTalks: Talk[] = [...(manualTalks as Talk[]), ...talks].sort(
    (a, b) => {
      if (a.startTime < b.startTime) return -1
      if (a.startTime > b.startTime) return 1
      return 0
    }
  )

  // 最終データを組み立てる
  exportEventData({ tracks, speakers, talks: allTalks })
}

/**
 * ForteeのAPIからプロポーザルデータを取得する
 */
async function fetchProposalData(): Promise<forteeProposal[]> {
  const forteeApiProposalsUrl: string = `https://fortee.jp/${EVENT_ALIAS}/api/proposals/accepted`

  const data: { proposals: forteeProposal[] } = await fetch(
    forteeApiProposalsUrl
  ).then((res) => res.json())

  return data.proposals
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchTimetableData(): Promise<forteeTimetableItem[]> {
  const forteeApiTimetableUrl: string = `https://fortee.jp/${EVENT_ALIAS}/api/timetable`

  const data: { timetable: forteeTimetableItem[] } = await fetch(
    forteeApiTimetableUrl
  ).then((res) => res.json())

  return data.timetable
}

/**
 * 時刻の補完データ(overrides.json)を読み込む。無ければ空で返す
 */
function loadOverrides(): ForteeOverrides {
  if (!fs.existsSync(overrides_path)) {
    console.warn(`overrides が見つかりません: ${overrides_path}`)
    return { sessions: {} }
  }
  const raw = fs.readFileSync(overrides_path, 'utf-8')
  const parsed: ForteeOverrides = JSON.parse(raw)
  return { ...parsed, sessions: parsed.sessions || {} }
}

type ResolvedTimetable = {
  trackName: string
  startsAt: string
  lengthMin: number
  source: 'overrides' | 'fortee'
}

/**
 * トークの時刻・トラックを解決する
 * 1. overrides に track/starts_at/length_min が揃っていればそれを使う（overrides 優先）
 * 2. fortee 側に timetable があればそれを使う
 * 3. どちらも無ければ null
 */
function resolveTimetable(
  talk: forteeProposal | forteeTimetableItem,
  overrides: ForteeOverrides
): ResolvedTimetable | null {
  const ov: OverridesTimetable | undefined = overrides.sessions[talk.uuid]
  if (ov && ov.track && ov.starts_at && ov.length_min != null) {
    return {
      trackName: ov.track,
      startsAt: ov.starts_at,
      lengthMin: ov.length_min,
      source: 'overrides',
    }
  }

  // forteeTimetableの場合
  if ('starts_at' in talk && talk.starts_at && talk.track) {
    return {
      trackName: talk.track.name,
      startsAt: talk.starts_at,
      lengthMin: talk.length_min,
      source: 'fortee',
    }
  }

  // forteeProposalの場合
  if ('timetable' in talk && talk.timetable && talk.timetable.starts_at) {
    return {
      trackName: talk.timetable.track,
      startsAt: talk.timetable.starts_at,
      lengthMin: talk.timetable.length_min,
      source: 'fortee',
    }
  }

  return null
}

/**
 * トラック名を大文字小文字・空白を無視して突き合わせる
 * (公式サイトは "Hall A"、tracks は "HALL A")
 */
function findTrack(name: string): Track | undefined {
  const norm = (s: string) => s.replace(/\s+/g, '').toUpperCase()
  return tracks.find((t) => norm(t.name) === norm(name))
}

/**
 * DateをJSTのISO文字列(+09:00付き)に変換する
 * startTime と表記を揃えるため toISOString() (UTC) は使わない
 */
function toJstIso(date: Date): string {
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  const p = (n: number) => String(n).padStart(2, '0')
  return (
    `${jst.getUTCFullYear()}-${p(jst.getUTCMonth() + 1)}-${p(jst.getUTCDate())}` +
    `T${p(jst.getUTCHours())}:${p(jst.getUTCMinutes())}:${p(jst.getUTCSeconds())}${TZ_OFFSET}`
  )
}

/**
 * プロポーザルデータからSpeaker情報を生成する
 */
function convertToSpeakers(
  proposals: forteeProposal[] | forteeTimetableItem[],
  overrides: ForteeOverrides
): Speaker[] {
  const DEFAULT_IMAGE_PATH: string = eventImageUrl

  const speakers: Speaker[] = []
  proposals.forEach((talk, index) => {
    // speakerが存在する場合のみ処理（timeslotにはspeakerがない）
    if ('speaker' in talk && talk.speaker) {
      const ov = overrides.sessions[talk.uuid]?.speaker
      speakers.push({
        id: index + 1,
        name: resolveSpeakerName(talk, overrides),
        // fortee のアバターは 400x400、公式サイトは 112px なので fortee を優先し、
        // fortee に無いものだけサイトから補う
        avatarUrl:
          talk.speaker.avatar_url || ov?.avatarUrl || DEFAULT_IMAGE_PATH,
      } as Speaker)
    }
  })
  return speakers
}

/**
 * 登壇者の表示名を決める。公式サイトの表記（overrides）を fortee より優先する
 * (fortee は「柳川慶太」「前田　和樹」のように詰まっていたり全角スペースだったりする)
 *
 * convertToSpeakers と convertToTalks の突き合わせは必ずこの関数を通すこと
 */
function resolveSpeakerName(
  talk: forteeProposal | forteeTimetableItem,
  overrides: ForteeOverrides
): string {
  const ov = overrides.sessions[talk.uuid]?.speaker
  return ov?.name || ('speaker' in talk ? talk.speaker?.name || '' : '')
}

/**
 * プロポーザルデータからTalk情報を生成する
 */
function convertToTalks(
  proposals: forteeProposal[] | forteeTimetableItem[],
  speakers: Speaker[],
  overrides: ForteeOverrides
): Talk[] {
  const convertedTalks: Talk[] = []
  const trackIndexMap = new Map<number, number>()

  // 時刻を解決できたものだけを開始時刻順に並べる
  const resolved = (proposals as (forteeProposal | forteeTimetableItem)[])
    .map((talk) => ({ talk, tt: resolveTimetable(talk, overrides) }))
    .filter(
      (r): r is { talk: forteeProposal | forteeTimetableItem; tt: ResolvedTimetable } =>
        r.tt !== null
    )
    .sort((a, b) => {
      if (a.tt.startsAt < b.tt.startsAt) return -1
      if (a.tt.startsAt > b.tt.startsAt) return 1
      return 0
    })

  resolved.forEach(({ talk, tt }) => {
    const track = findTrack(tt.trackName)
    if (!track) {
      console.warn(
        `トラック "${tt.trackName}" が tracks に見つかりません: ${talk.title}`
      )
      return
    }
    // speakerが存在しない場合はスキップ（timeslot等）
    if (!('speaker' in talk) || !talk.speaker) {
      return
    }

    const speaker = speakers.find(
      (s) => s.name === resolveSpeakerName(talk, overrides)
    )
    if (!speaker) {
      console.warn(`No speaker found for talk: ${talk.title}`)
      return
    }

    // トラックごとのインデックスを取得・更新
    const trackIndex = trackIndexMap.get(track.id) || 0
    trackIndexMap.set(track.id, trackIndex + 1)

    // startTimeとendTimeを計算
    const startTime = tt.startsAt
    const endTime = toJstIso(
      new Date(new Date(tt.startsAt).getTime() + tt.lengthMin * 60000)
    )

    convertedTalks.push({
      id: track.id * 100 + trackIndex + 1,
      trackId: track.id,
      title: talk.title,
      abstract: talk.abstract?.replace(/[\r\t\n]/g, '') || '',
      speakers: [{ id: speaker.id, name: speaker.name }],
      startTime,
      endTime,
      conferenceDayId: conferenceDays.find((day) =>
        tt.startsAt.startsWith(day.date)
      )?.id,
    } as Talk)
  })

  return convertedTalks
}

/**
 * 出力対象の extras（enabled かつ時刻が揃っているもの）を開始時刻順で返す
 */
function enabledExtras(overrides: ForteeOverrides): OverridesExtra[] {
  return Object.values(overrides.extras || {})
    .filter((e) => e.enabled && !isExcludedExtra(e.title))
    .filter((e) => e.track && e.starts_at && e.length_min != null)
    .sort((a, b) => (a.starts_at! < b.starts_at! ? -1 : 1))
}

/**
 * fortee外の枠が持つ独自スピーカー（招待講演など）をSpeakerに変換する
 * スピーカーを持たない枠は id:0 の「運営」を使うのでここには出てこない
 */
function convertExtraSpeakers(
  overrides: ForteeOverrides,
  baseSpeakers: Speaker[]
): Speaker[] {
  let nextId = Math.max(...baseSpeakers.map((s) => s.id)) + 1

  const speakers: Speaker[] = []
  enabledExtras(overrides).forEach((extra) => {
    const name = extra.speaker?.name
    if (!name) return
    // 同名のスピーカーが既にいれば使い回す
    if (baseSpeakers.some((s) => s.name === name)) return
    if (speakers.some((s) => s.name === name)) return

    speakers.push({
      id: nextId++,
      name,
      company: extra.speaker?.company || null,
      avatarUrl: eventImageUrl,
    })
  })
  return speakers
}

/**
 * fortee外の枠をTalkに変換する
 */
function convertExtraTalks(
  overrides: ForteeOverrides,
  speakers: Speaker[]
): Talk[] {
  const talks: Talk[] = []

  enabledExtras(overrides).forEach((extra) => {
    const track = findTrack(extra.track!)
    if (!track) {
      console.warn(
        `トラック "${extra.track}" が tracks に見つかりません: ${extra.title}`
      )
      return
    }

    const speakerName = extra.speaker?.name
    const speaker =
      (speakerName && speakers.find((s) => s.name === speakerName)) ||
      speakers.find((s) => s.id === 0)!

    const startTime = extra.starts_at!
    const endTime = toJstIso(
      new Date(new Date(startTime).getTime() + extra.length_min! * 60000)
    )

    talks.push({
      id: extra.id,
      trackId: track.id,
      title: extra.title,
      abstract: extra.abstract?.replace(/[\r\t\n]/g, '') || '',
      speakers: [{ id: speaker.id, name: speaker.name }],
      startTime,
      endTime,
      conferenceDayId: conferenceDays.find((day) =>
        startTime.startsWith(day.date)
      )?.id,
    } as Talk)
  })

  return talks
}

/**
 * 時刻の解決状況を出力する
 */
function reportTimetableStatus(
  proposals: forteeProposal[] | forteeTimetableItem[],
  talks: Talk[],
  extraTalks: Talk[],
  overrides: ForteeOverrides
) {
  const missing = (proposals as (forteeProposal | forteeTimetableItem)[]).filter(
    (talk) => resolveTimetable(talk, overrides) === null
  )
  missing.forEach((talk) => {
    console.warn(`⚠️ 時刻情報なし: ${talk.title} (${talk.uuid})`)
  })

  // 適用された overrides に _todo が残っていれば知らせる
  const todos: { title: string; todo: string }[] = []
  ;(proposals as (forteeProposal | forteeTimetableItem)[]).forEach((talk) => {
    const ov = overrides.sessions[talk.uuid]
    if (ov?._todo) todos.push({ title: talk.title, todo: ov._todo })
  })
  enabledExtras(overrides).forEach((extra) => {
    if (extra._todo) todos.push({ title: extra.title, todo: extra._todo })
  })

  if (todos.length > 0) {
    console.warn(`\n⚠️ 未解決のTODOが ${todos.length} 件あります:`)
    todos.forEach(({ title, todo }) => {
      console.warn(`  - ${title}\n      ${todo}`)
    })
    console.warn(`  修正後は該当エントリの "_todo" を削除してください。`)
  }

  const disabled = Object.values(overrides.extras || {}).filter(
    (e) => !e.enabled
  ).length

  console.log(
    `\nトーク: ${talks.length + extraTalks.length}件` +
      `（fortee ${talks.length}件 / 取得 ${proposals.length}件・時刻情報なし ${missing.length}件` +
      ` + fortee外 ${extraTalks.length}件・無効 ${disabled}件）`
  )
}

// ---------------------------------------------------------------------------
// scaffold モード: 公式サイトのタイムテーブルから overrides.json の雛形を作る
// ---------------------------------------------------------------------------

// PCレイアウトの1コマ = このクラスを持つ div。ここで分割すると1チャンク=1コマになる
// (モバイル複製はこのクラスを使わないので重複除去も兼ねる)
const ROW_DELIMITER = 'grid grid-cols-[104px_1fr_1fr_1fr_128px]'

type ScrapedSlot = {
  uuid: string
  trackName: string
  startsAt: string
  lengthMin: number
  blockLabel: string
  siblings: number
}

// 各コマのボタン。id は fortee の uuid のこともあれば
// スポンサー枠の合成ID(sp-b5-a-0)のこともあるので形では絞らない
const BUTTON_PATTERN =
  '<button[^>]*data-session-modal-target="session-([0-9a-z-]+)"[^>]*aria-label="([^"]*)"'
// aria-label の先頭「Hall A 11:30〜12:00 ...」。
// SPタブの aria-label="ホール切替" などを弾く役割も兼ねる
const LABEL_PATTERN = '^(Hall\\s+[A-Z])\\s+(\\d{1,2}:\\d{2})〜(\\d{1,2}:\\d{2})\\s+(.*)$'
// コマの左端の時刻
const ROW_START_PATTERN = 'text-sm font-semibold text-pde-blue">\\s*(\\d{1,2}:\\d{2})\\s*</span>'
const ROW_END_PATTERN = 'text-xs text-pde-muted">〜\\s*(\\d{1,2}:\\d{2})\\s*</span>'

/**
 * 同じタイムテーブルがPC用とモバイル用で二重に出力されているので、
 * 最初のレイアウト分だけに切り詰める。
 * (同じIDのボタンが2度目に現れた位置で切る = レイアウトのクラス名に依存しない)
 */
function trimToFirstLayout(html: string): string {
  const re = /data-session-modal-target="session-([0-9a-z-]+)"/g
  const seen = new Set<string>()
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    if (seen.has(m[1])) return html.slice(0, m.index)
    seen.add(m[1])
  }
  return html
}

/**
 * HTMLを1コマ=1要素に分割する（先頭の見出し行より前は捨てる）
 */
function splitRows(html: string): string[] {
  return trimToFirstLayout(html).split(ROW_DELIMITER).slice(1)
}

function decodeHtml(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&(?:#x27|apos);/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim()
}

/**
 * コマの開始・終了時刻を取り出す
 */
function parseRowTime(chunk: string): { start: string; end?: string } | null {
  const s = new RegExp(ROW_START_PATTERN).exec(chunk)
  if (!s) return null
  const e = new RegExp(ROW_END_PATTERN).exec(chunk)
  return { start: s[1], end: e?.[1] }
}

/**
 * 公式サイトのHTMLからfortee側セッションの時刻を抽出する
 */
function scrapeTimetable(
  html: string,
  date: string,
  forteeIds: Set<string>
): Map<string, ScrapedSlot> {
  const result = new Map<string, ScrapedSlot>()

  splitRows(html).forEach((chunk) => {
    const buttonRe = new RegExp(BUTTON_PATTERN, 'g')
    const labelRe = new RegExp(LABEL_PATTERN)

    // 備考欄の「Hall C 12:05終了予定」= そのホールの実際の終了時刻
    const noteEnds = new Map<string, string>()
    const noteRe = /Hall\s+([A-Z])\s+(\d{1,2}:\d{2})終了予定/g
    let note: RegExpExecArray | null
    while ((note = noteRe.exec(chunk)) !== null) {
      noteEnds.set(`Hall ${note[1]}`, note[2])
    }

    const slots: ScrapedSlot[] = []
    let m: RegExpExecArray | null
    while ((m = buttonRe.exec(chunk)) !== null) {
      const [, id, label] = m
      if (!forteeIds.has(id)) continue
      const parsed = labelRe.exec(decodeHtml(label))
      if (!parsed) continue
      const [, rawTrack, start, labelEnd] = parsed
      const trackName = rawTrack.replace(/\s+/g, ' ')
      const end = noteEnds.get(trackName) || labelEnd
      const startsAt = toIsoFromHm(date, start)
      slots.push({
        uuid: id,
        trackName,
        startsAt,
        lengthMin: diffMin(startsAt, toIsoFromHm(date, end)),
        blockLabel: `${trackName} ${start}〜${end}`,
        siblings: 1,
      })
    }

    // 同じコマの同じホールに複数セッションが入っている場合は分割が必要
    slots.forEach((slot) => {
      slot.siblings = slots.filter((s) => s.trackName === slot.trackName).length
      if (!result.has(slot.uuid)) result.set(slot.uuid, slot)
    })
  })

  return result
}

type ScrapedSpeaker = {
  name: string
  avatarUrl?: string
}

/**
 * 公式サイトのセッションモーダルから登壇者名とアバターURLを拾う
 * モーダルはタイムテーブルのコマの外にあるので、行チャンクとは別に走査する
 */
function scrapeSpeakers(html: string): Map<string, ScrapedSpeaker> {
  const result = new Map<string, ScrapedSpeaker>()

  const dialogRe = /<dialog id="session-([0-9a-z-]+)"[^>]*>([\s\S]*?)<\/dialog>/g
  let m: RegExpExecArray | null
  while ((m = dialogRe.exec(html)) !== null) {
    const [, id, body] = m
    const name = /text-sm font-semibold text-pde-text">([^<]*)<\/p>/.exec(
      body
    )?.[1]
    if (!name) continue

    const img = /<img src="([^"]+)"(?:[^>]*srcset="([^"]*)")?/.exec(body)
    let avatarUrl: string | undefined
    if (img) {
      // srcset があれば一番大きいものを使う
      const candidates = (img[2] || '')
        .split(',')
        .map((s) => s.trim().split(/\s+/))
        .filter((p) => p.length === 2)
      const best = candidates.sort(
        (a, b) => parseInt(a[1]) - parseInt(b[1])
      ).pop()
      avatarUrl = new URL(best?.[0] || img[1], TIMETABLE_PAGE_URL).toString()
    }

    result.set(id, { name: decodeHtml(name), avatarUrl })
  }

  return result
}

/**
 * 公式サイトのアバターを public/ に保存し、参照用のパスを返す
 * サイトの画像URLはビルドごとに変わるハッシュ付きなので、ホットリンクせず取り込む
 */
async function downloadAvatar(
  url: string,
  uuid: string
): Promise<string | null> {
  const ext = path.extname(new URL(url).pathname) || '.webp'
  const publicDir = path.join(__dirname, '../../public', SPEAKER_ASSET_DIR)
  const file = path.join(publicDir, `${uuid}${ext}`)
  const publicPath = `/${SPEAKER_ASSET_DIR}/${uuid}${ext}`

  if (fs.existsSync(file)) return publicPath

  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`アバターの取得に失敗: ${url} (${res.status})`)
    return null
  }
  fs.mkdirSync(publicDir, { recursive: true })
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
  console.log(`  アバターを取得: ${publicPath}`)
  return publicPath
}

type ScrapedExtra = {
  key: string
  trackName: string
  startsAt: string
  lengthMin: number | null
  title: string
  abstract: string
  speaker: { name: string; company: null } | null
  todo?: string
}

/**
 * 公式サイトのHTMLから、fortee に存在しない枠を抽出する
 * - col-span-3 の全ホール共通枠（オープニング・招待講演・クロージング等）
 * - uuid を持たないホール別ボタン（スポンサーセッション）はホールごとに1件へまとめる
 */
function scrapeExtras(
  html: string,
  date: string,
  forteeIds: Set<string>
): ScrapedExtra[] {
  const rows = splitRows(html)
  const rowTimes = rows.map((chunk) => parseRowTime(chunk))
  const extras: ScrapedExtra[] = []

  const keyOf = (start: string, trackName: string) => {
    const [h, m] = start.split(':')
    return `${h.padStart(2, '0')}${m}-${trackName.toLowerCase().replace(/\s+/g, '-')}`
  }

  // 終了時刻が書かれていない行は次の行の開始時刻を仮置きする
  const fallbackEnd = (rowIndex: number): string | undefined =>
    rowTimes.slice(rowIndex + 1).find((t) => t)?.start

  rows.forEach((chunk, i) => {
    const time = rowTimes[i]
    if (!time) return

    const startsAt = toIsoFromHm(date, time.start)
    const guessedEnd = time.end ? undefined : fallbackEnd(i)
    const end = time.end || guessedEnd
    const lengthMin = end ? diffMin(startsAt, toIsoFromHm(date, end)) : null

    let todo: string | undefined
    if (!time.end) {
      todo = end
        ? `終了時刻がサイトにありません。次の枠の開始(${end})を仮置きしています`
        : `終了時刻がサイトにありません。length_min を手で入れてください`
    }

    // (a) 全ホール共通の枠
    const spanIdx = chunk.indexOf('col-span-3')
    if (spanIdx >= 0) {
      // チャンク末尾には次のレイアウトの断片が紛れ込むので、この枠のdivだけに絞る
      const closeIdx = chunk.indexOf('<div></div>', spanIdx)
      const block = chunk.slice(spanIdx, closeIdx > 0 ? closeIdx : undefined)

      const title = /<p class="text-sm font-medium text-pde-(?:blue|text)">([^<]*)<\/p>/.exec(
        block
      )?.[1]
      if (!title) return
      const speakerText = /<p class="text-xs text-pde-text">([^<]*)<\/p>/.exec(
        block
      )?.[1]
      const badge = /text-\[10px\] font-bold text-white">([^<]*)<\/span>/.exec(
        block
      )?.[1]

      extras.push({
        key: keyOf(time.start, FULL_WIDTH_TRACK),
        trackName: FULL_WIDTH_TRACK,
        startsAt,
        lengthMin,
        title: decodeHtml(title),
        abstract: badge ? decodeHtml(badge) : '',
        speaker: speakerText
          ? { name: decodeHtml(speakerText), company: null }
          : null,
        todo,
      })
      return
    }

    // (b) uuid を持たないホール別ボタン → ホールごとに1件へまとめる
    const grouped = new Map<
      string,
      { start: string; end: string; items: string[] }
    >()
    const buttonRe = new RegExp(BUTTON_PATTERN, 'g')
    const labelRe = new RegExp(LABEL_PATTERN)
    let m: RegExpExecArray | null
    while ((m = buttonRe.exec(chunk)) !== null) {
      const [, id, rawLabel] = m
      if (forteeIds.has(id)) continue
      const parsed = labelRe.exec(decodeHtml(rawLabel))
      if (!parsed) continue
      const [, rawTrack, s, e, rest] = parsed
      const trackName = rawTrack.replace(/\s+/g, ' ')
      const g = grouped.get(trackName) || { start: s, end: e, items: [] }
      g.items.push(rest.trim())
      grouped.set(trackName, g)
    }

    grouped.forEach((g, trackName) => {
      // 「Platinum Sponsor Session① 株式会社mento様」を丸数字で分割し、
      // 左をシリーズ名、右を社名として扱う
      const split = g.items.map((item) => item.split(/[①-⑳]/, 2))
      const series = split[0].length > 1 ? split[0][0].trim() : g.items[0]
      const names = split.filter((p) => p.length > 1).map((p) => p[1].trim())

      const renamed = GROUPED_TITLE_RULES.find((r) => r.match.test(series))
      const groupStart = toIsoFromHm(date, g.start)

      extras.push({
        key: keyOf(g.start, trackName),
        trackName,
        startsAt: groupStart,
        lengthMin: diffMin(groupStart, toIsoFromHm(date, g.end)),
        title: renamed ? renamed.title : series,
        abstract: (names.length > 0 ? names : g.items).join(' / '),
        speaker: null,
      })
    })
  })

  return extras
}

function toIsoFromHm(date: string, hm: string): string {
  const [h, m] = hm.split(':')
  return `${date}T${h.padStart(2, '0')}:${m}:00${TZ_OFFSET}`
}

function diffMin(startIso: string, endIso: string): number {
  return Math.round(
    (new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000
  )
}

/**
 * 公式サイトから overrides.json の雛形を生成する
 * 既存のエントリは手で直した値を尊重して一切上書きしない
 */
async function scaffold() {
  const proposals = await fetchProposalData()
  console.log(`fortee: ${proposals.length}件`)

  const forteeIds = new Set(proposals.map((p) => p.uuid))
  const html = await fetch(TIMETABLE_PAGE_URL).then((res) => res.text())
  const date = conferenceDays[0].date
  const scraped = scrapeTimetable(html, date, forteeIds)
  const scrapedExtras = scrapeExtras(html, date, forteeIds)
  const scrapedSpeakers = scrapeSpeakers(html)
  console.log(
    `${TIMETABLE_PAGE_URL}: セッション ${scraped.size}件 / fortee外 ${scrapedExtras.length}件`
  )

  const existing = loadOverrides()
  const sessions: Record<string, OverridesTimetable> = {}

  let added = 0
  let kept = 0
  let todo = 0

  // 公式サイトの登壇者情報（表記が fortee より整っている・アバターを補える）
  const resolveSiteSpeaker = async (
    proposal: forteeProposal
  ): Promise<OverridesSessionSpeaker | undefined> => {
    const site = scrapedSpeakers.get(proposal.uuid)
    if (!site) return undefined

    const speaker: OverridesSessionSpeaker = { name: site.name }
    // fortee にアバターがある場合はそちらが高解像度なので取り込まない
    if (!proposal.speaker?.avatar_url && site.avatarUrl) {
      speaker.avatarUrl =
        (await downloadAvatar(site.avatarUrl, proposal.uuid)) || null
    }
    return speaker
  }

  for (const proposal of proposals) {
    const prev = existing.sessions[proposal.uuid]
    if (prev) {
      // speaker は後から足したフィールドなので、未設定の既存エントリだけ埋める
      // (手で直した時刻やTODOには触らない)
      sessions[proposal.uuid] =
        prev.speaker === undefined
          ? { ...prev, speaker: await resolveSiteSpeaker(proposal) }
          : prev
      kept++
      if (prev._todo) todo++
      continue
    }

    const slot = scraped.get(proposal.uuid)
    const entry: OverridesTimetable = {
      _title: proposal.title,
      speaker: await resolveSiteSpeaker(proposal),
    }

    if (!slot) {
      entry._todo = `no timetable entry found: ${TIMETABLE_PAGE_URL} に該当セッションが見つかりません。track/starts_at/length_min を手で埋めてください`
      entry.track = null
      entry.starts_at = null
      entry.length_min = null
      todo++
    } else {
      if (slot.siblings > 1) {
        entry._todo =
          `split: ${slot.blockLabel} に${slot.siblings}セッション。` +
          `実際の区切りを手で入れてください（現在はブロック全体の時刻）`
        todo++
      }
      entry.track = slot.trackName
      entry.starts_at = slot.startsAt
      entry.length_min = slot.lengthMin
    }

    sessions[proposal.uuid] = entry
    added++
  }

  // 開始時刻順に並べて読みやすくする（時刻未定は末尾）
  const sorted: Record<string, OverridesTimetable> = {}
  Object.entries(sessions)
    .sort(([, a], [, b]) => {
      const key = (v: OverridesTimetable) =>
        `${v.starts_at || '9999'}|${v.track || ''}|${v._title || ''}`
      return key(a).localeCompare(key(b))
    })
    .forEach(([uuid, value]) => {
      sorted[uuid] = value
    })

  // fortee に存在しない枠(extras)
  const extras: Record<string, OverridesExtra> = {}
  let extraAdded = 0
  let extraKept = 0
  let extraDisabled = 0

  let nextExtraId =
    Math.max(
      EXTRA_ID_BASE,
      ...Object.values(existing.extras || {}).map((e) => e.id)
    ) + 1

  scrapedExtras.forEach((extra) => {
    const prev = existing.extras?.[extra.key]
    if (prev) {
      // EXTRA_DISABLED_TITLES に後から足された枠は enabled を落として揃える
      const excluded = isExcludedExtra(prev.title)
      if (excluded && prev.enabled) {
        console.log(`  除外リストに該当するため無効化: ${prev.title}`)
      }
      extras[extra.key] = excluded ? { ...prev, enabled: false } : prev
      extraKept++
      // 無効な枠は出力されないのでTODOには数えない
      if (prev._todo && prev.enabled && !excluded) todo++
      if (!prev.enabled || excluded) extraDisabled++
      return
    }

    const enabled = !isExcludedExtra(extra.title)
    if (!enabled) extraDisabled++
    if (extra.todo && enabled) todo++

    extras[extra.key] = {
      ...(extra.todo ? { _todo: extra.todo } : {}),
      enabled,
      id: nextExtraId++,
      track: extra.trackName,
      starts_at: extra.startsAt,
      length_min: extra.lengthMin,
      title: extra.title,
      abstract: extra.abstract,
      speaker: extra.speaker,
    }
    extraAdded++
  })

  const sortedExtras: Record<string, OverridesExtra> = {}
  Object.entries(extras)
    .sort(([, a], [, b]) =>
      `${a.starts_at || '9999'}|${a.track || ''}`.localeCompare(
        `${b.starts_at || '9999'}|${b.track || ''}`
      )
    )
    .forEach(([key, value]) => {
      sortedExtras[key] = value
    })

  const output: ForteeOverrides = {
    _note:
      'fortee に timetable がないセッションの時刻を補完する。' +
      'sessions は fortee のトーク(uuidキー)で、track/starts_at/length_min が揃っている項目は fortee より優先される。' +
      'extras は fortee に無い枠(オープニング・スポンサーセッション等)で、enabled:false のものは出力されない。' +
      'アンダースコア始まりのキーは注釈で、変換時は無視される。' +
      '雛形の再生成: just fortee-scaffold（既存エントリは上書きされない）',
    sessions: sorted,
    extras: sortedExtras,
  }

  fs.mkdirSync(path.dirname(overrides_path), { recursive: true })
  fs.writeFileSync(
    overrides_path,
    JSON.stringify(output, null, 2) + '\n',
    'utf-8'
  )

  console.log(`\n${overrides_path}`)
  console.log(`  sessions: 追加 ${added}件 / 既存維持 ${kept}件`)
  console.log(
    `  extras:   追加 ${extraAdded}件 / 既存維持 ${extraKept}件 / 無効 ${extraDisabled}件`
  )
  console.log(`  要手動 ${todo}件`)
  if (todo > 0) {
    console.log(`  "_todo" が付いたエントリを手で修正してから just fortee を実行してください。`)
  }
}

if (process.argv.includes('--scaffold')) {
  scaffold().catch(console.error)
} else {
  main().catch(console.error)
}
