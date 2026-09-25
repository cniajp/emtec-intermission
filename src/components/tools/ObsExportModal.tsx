import { useState } from 'react'
import { useRouter } from 'next/router'
import { useBodyScrollLock } from '@/components/hooks/useBodyScrollLock'
import type { SimulType } from './ObsSceneGenerate'
import { OBS_SCENE } from './obsSceneNames'
import {
  Code,
  CopyUrlButton,
  Field,
  HelpNote,
  HelpSteps,
  ModalButton,
  OptionList,
  OptionRow,
  Segmented,
  TextInput,
  ToolModal,
} from './ToolModal'

type Os = 'windows' | 'mac'

type Props = {
  // 生成ページ (`/break/obs` または `/break-dk/obs`)
  obsPathname: string
  // ローカルファイルのパス (Desktop/{eventAbbr}/...) の表示に使う
  eventAbbr: string
  confDay: string
  track: { id: number; name: string }
  // サイマル URL の候補 (Dreamkast 版はトラックの配信 URL)
  simulUrlSuggestions?: ReadonlyArray<{ label: string; url: string }>
}

const DEFAULT_SIMUL_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

function desktopPath(os: Os, username: string, rest: string) {
  return os === 'mac'
    ? `/Users/${username}/Desktop/${rest}`
    : `C:/Users/${username}/Desktop/${rest}`
}

/**
 * OBS シーン設定 (JSON) のエクスポート設定モーダル。
 * シーンごとに1行で、有効にするとその行の下に URL・ファイルパス・音量が開く
 */
export default function ObsExportModal({
  obsPathname,
  eventAbbr,
  confDay,
  track,
  simulUrlSuggestions = [],
}: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  useBodyScrollLock(isOpen)

  const [os, setOs] = useState<Os>('windows')
  const [username, setUsername] = useState('emtec')
  const [talkVolumeDb, setTalkVolumeDb] = useState('0')
  const [includeCountdown, setIncludeCountdown] = useState(false)
  const [countdownVolumeDb, setCountdownVolumeDb] = useState('0')
  const [includeSimul, setIncludeSimul] = useState(false)
  const [simulType, setSimulType] = useState<SimulType>('vlc')
  const [simulUrl, setSimulUrl] = useState(DEFAULT_SIMUL_URL)
  const [simulVolumeDb, setSimulVolumeDb] = useState('0')
  const [includeAttack, setIncludeAttack] = useState(false)
  const [includeBackground, setIncludeBackground] = useState(false)

  const usesLocalFiles = includeAttack || includeBackground || includeCountdown

  // Generate JSON と「URL をコピー」で同じクエリを使う
  const query = {
    confDay,
    trackId: track.id,
    trackName: track.name,
    os,
    username,
    talkVolumeDb,
    includeCountdown: String(includeCountdown),
    ...(includeCountdown && { countdownVolumeDb }),
    includeSimul: String(includeSimul),
    ...(includeSimul && { simulType, simulUrl, simulVolumeDb }),
    includeAttack: String(includeAttack),
    includeBackground: String(includeBackground),
  }

  const handleGenerate = () => {
    router.push({ pathname: obsPathname, query })
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-sm bg-blue-600/20 px-2 py-1 text-xs text-blue-400 hover:bg-blue-600/30 transition-colors"
      >
        OBS
      </button>
      {isOpen && (
        <ToolModal
          title="OBS シーン設定"
          subtitle={`Track ${track.name}`}
          onClose={() => setIsOpen(false)}
          help={
            <>
              <HelpSteps>
                <li>
                  使うシーンにチェックを入れて <b>Generate JSON</b>{' '}
                  を押すと、このトラック用のシーンコレクション (JSON)
                  がダウンロードされる
                </li>
                <li>
                  OBS の <b>シーンコレクション → インポート</b>{' '}
                  で読み込み、切り替える
                </li>
                <li>
                  カウントダウン・アタック動画・背景画像を使うときは、表示されているパスにファイルを置いておく
                  (パスは OS とユーザー名から組み立てる)
                </li>
              </HelpSteps>
              <HelpNote>
                右端は作られる OBS シーン名。Companion
                のボタンはこの名前でシーンを呼び出すので、Companion
                側で有効にしたボタンに対応するシーンはここでも有効にしておく。
                音量は OBS の音声ミキサーと同じ dB で、0 dB が等倍。
              </HelpNote>
            </>
          }
          footer={
            <>
              <CopyUrlButton
                pathname={obsPathname}
                query={query}
                className="mr-auto"
              />
              <ModalButton onClick={() => setIsOpen(false)}>Cancel</ModalButton>
              <ModalButton variant="primary" onClick={handleGenerate}>
                Generate JSON
              </ModalButton>
            </>
          }
        >
          {/* 実行環境: ローカルファイルのパス生成に使う */}
          <section className="flex items-end gap-3">
            <Field label="OS">
              <Segmented
                value={os}
                onChange={setOs}
                options={[
                  ['windows', 'Windows'],
                  ['mac', 'Mac'],
                ]}
              />
            </Field>
            <Field label="ユーザー名" grow>
              <TextInput
                value={username}
                onChange={setUsername}
                placeholder="OS username"
                disabled={!usesLocalFiles}
              />
            </Field>
          </section>
          {!usesLocalFiles && (
            <p className="-mt-2 text-[11px] text-neutral-500">
              ユーザー名はカウントダウン・アタック動画・背景画像のファイルパスに使います
            </p>
          )}

          <OptionList>
            <OptionRow
              title="トーク"
              description="各トーク枠のインターミッション画面 (ブラウザソース)。音量は BGM の大きさ"
              scene="HH:MM ~"
            >
              <VolumeInput value={talkVolumeDb} onChange={setTalkVolumeDb} />
            </OptionRow>

            <OptionRow
              title="カウントダウン"
              description="開始前のカウントダウン動画。有効にすると OBS 起動時にこのシーンが選ばれる"
              scene={OBS_SCENE.countdown}
              enabled={includeCountdown}
              onToggle={setIncludeCountdown}
            >
              <PathPreview
                path={desktopPath(os, username, `${eventAbbr}/countdown.mp4`)}
              />
              <VolumeInput
                value={countdownVolumeDb}
                onChange={setCountdownVolumeDb}
              />
            </OptionRow>

            <OptionRow
              title="サイマル"
              description={
                <>
                  他トラックの配信を映す。VLC は HLS (.m3u8) を VLC ソースで再生
                  (OBS PC に VLC が必要)、Browser は Web
                  ページをブラウザソースで表示 (非表示中も再生し続ける)
                </>
              }
              badge="Companion: TrackA"
              scene={OBS_SCENE.simul}
              enabled={includeSimul}
              onToggle={setIncludeSimul}
            >
              <Field label="取り込み方">
                <Segmented
                  value={simulType}
                  onChange={setSimulType}
                  options={[
                    ['vlc', 'VLC (HLS)'],
                    ['browser', 'Browser'],
                  ]}
                />
              </Field>
              <Field
                label={
                  simulType === 'browser' ? 'ページ URL' : 'プレイリスト URL'
                }
                action={
                  simulType === 'vlc' && (
                    <a
                      href="https://players.akamai.com/players/hlsjs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-400 hover:underline"
                    >
                      HLSテストプレイヤー ↗
                    </a>
                  )
                }
              >
                <TextInput
                  value={simulUrl}
                  onChange={setSimulUrl}
                  placeholder="https://..."
                  list={
                    simulUrlSuggestions.length > 0
                      ? `simul-urls-${track.id}`
                      : undefined
                  }
                />
                {simulUrlSuggestions.length > 0 && (
                  <datalist id={`simul-urls-${track.id}`}>
                    {simulUrlSuggestions.map((s) => (
                      <option key={s.url} value={s.url}>
                        {s.label}
                      </option>
                    ))}
                  </datalist>
                )}
              </Field>
              <VolumeInput value={simulVolumeDb} onChange={setSimulVolumeDb} />
            </OptionRow>

            <OptionRow
              title="アタック動画"
              description={
                <>
                  各トークの前に流す動画。ファイル名はトーク開始時刻 (
                  <Code>10:40</Code> → <Code>1040.mp4</Code>)
                </>
              }
              scene="Attack_HH:MM"
              enabled={includeAttack}
              onToggle={setIncludeAttack}
            >
              <PathPreview
                path={desktopPath(
                  os,
                  username,
                  `${eventAbbr}/${track.name}/{HHMM}.mp4`
                )}
              />
            </OptionRow>

            <OptionRow
              title="背景画像"
              description="すべてのシーンの最背面に同じ画像を敷く"
              scene="全シーンの最背面"
              enabled={includeBackground}
              onToggle={setIncludeBackground}
            >
              <PathPreview
                path={desktopPath(
                  os,
                  username,
                  `${eventAbbr}/still/LogoOnly_wBG.png`
                )}
              />
            </OptionRow>
          </OptionList>
        </ToolModal>
      )}
    </>
  )
}

function PathPreview({ path }: { path: string }) {
  return (
    <div className="px-2 py-1.5 bg-neutral-900 rounded-sm text-[11px] text-neutral-400 font-mono break-all">
      {path}
    </div>
  )
}

/**
 * 音量 (dB)。OBS の音声ミキサーと同じ単位・範囲にしておくと、現地で見る値とそのまま突き合わせられる
 */
function VolumeInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const n = Number(value)
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-neutral-400 w-8">音量</span>
      <input
        type="range"
        min={-60}
        max={0}
        step={0.5}
        value={Number.isFinite(n) ? Math.max(-60, Math.min(0, n)) : 0}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 accent-blue-500"
      />
      <span className="flex items-center gap-1">
        <input
          type="number"
          step={0.5}
          max={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 px-2 py-1 bg-neutral-900 border border-neutral-600 rounded-sm text-[12px] text-white text-right focus:outline-hidden focus:border-blue-500"
        />
        <span className="text-[11px] text-neutral-400">dB</span>
      </span>
    </div>
  )
}
