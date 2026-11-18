import { useState } from 'react'
import { useBodyScrollLock } from '@/components/hooks/useBodyScrollLock'
import type { Talk } from '@/data/types'
import {
  buildCompanionConfig,
  companionConfigFile,
  companionOptionsToQuery,
  companionZipName,
  type CompanionConfig,
  type CompanionOptions,
} from './CompanionConfigGenerate'
import CompanionPreview from './CompanionPreview'
import { ALL_TRACKS, downloadExportFiles } from './exportAll'
import {
  OBS_SCENE,
  attackSceneName,
  sceneTimesOf,
  talkSceneName,
} from './obsSceneNames'
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
  ToolModal,
} from './ToolModal'

type Device = CompanionConfig['device']

type Props = {
  // 生成ページ (`/break/companion` または `/break-dk/companion`)
  companionPathname: string
  // ファイル名に使う
  eventAbbr: string
  confDay: string
  // 1トラック分を出すときの対象。allTracks とどちらか一方を渡す
  track?: { id: number; name: string }
  // 全トラック分をまとめて (ZIP で) 出すときの対象。同じ設定を全トラックに使う
  allTracks?: ReadonlyArray<{ id: number; name: string }>
  talks: Talk[]
}

const DEVICE_LABEL: Record<Device, string> = {
  gostream: 'GoStream',
  vr6hd: 'VR-6HD',
}

/**
 * Companion ボタン設定のエクスポートモーダル。
 * 設定 → プレビュー → Export の2段階。行の右端はボタンが呼び出す OBS シーン名
 */
export default function CompanionExportModal({
  companionPathname,
  eventAbbr,
  confDay,
  track,
  allTracks,
  talks,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  useBodyScrollLock(isOpen)
  // 対象トラックごとのプレビュー (1トラックのときは1件)
  const [previews, setPreviews] = useState<
    { trackName: string; config: CompanionConfig }[] | null
  >(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const preview = previews?.[previewIndex]?.config ?? null
  const [device, setDevice] = useState<Device>('gostream')
  const [includeCount, setIncludeCount] = useState(true)
  const [includeTrackA, setIncludeTrackA] = useState(false)
  const [includeSlido, setIncludeSlido] = useState(false)
  const [includeAttack, setIncludeAttack] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
    setPreviews(null)
  }

  const isAll = !track
  const targets = track ? [track] : (allTracks ?? [])
  const subtitle = track
    ? `Track ${track.name}`
    : `全トラック (${targets.map((t) => t.name).join(' / ')})`

  const options: CompanionOptions = {
    device,
    specialButtons: {
      count: includeCount,
      trackA: includeTrackA,
      slido: includeSlido,
    },
    includeAttack,
  }
  // 開くとこの設定で Export されるページの URL (「URL をコピー」用)
  const copyUrl = (
    <CopyUrlButton
      pathname={companionPathname}
      query={{
        confDay,
        ...(track
          ? { trackId: track.id, trackName: track.name }
          : { trackId: ALL_TRACKS }),
        ...companionOptionsToQuery(options),
      }}
      className="mr-auto"
    />
  )

  const handleBuildPreview = () => {
    setPreviews(
      targets.map((target) => ({
        trackName: target.name,
        config: buildCompanionConfig({
          ...options,
          times: sceneTimesOf(
            talks.filter((talk) => talk.trackId === target.id)
          ),
        }),
      }))
    )
    setPreviewIndex(0)
  }

  const handleExport = () => {
    if (!previews) return
    downloadExportFiles(
      previews.map((p) =>
        companionConfigFile(p.config, {
          eventAbbr,
          confDay,
          trackName: p.trackName,
        })
      ),
      companionZipName(eventAbbr, confDay, device)
    )
    closeModal()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title={
          isAll
            ? '全トラックの Companion 設定をまとめてダウンロード'
            : undefined
        }
        className="rounded-sm bg-green-600/20 px-2 py-1 text-xs text-green-400 hover:bg-green-600/30 transition-colors"
      >
        Companion
      </button>
      {isOpen && !preview && (
        <ToolModal
          title="Companion ボタン設定"
          subtitle={subtitle}
          onClose={closeModal}
          help={
            <>
              <HelpSteps>
                <li>
                  使うスイッチャーとボタンを選んで <b>Preview</b>{' '}
                  でボタン配置を確認し、<b>Export</b> で{' '}
                  <Code>.companionconfig</Code> をダウンロードする
                  {isAll &&
                    ' (全トラック分をトラックごとのファイルにして ZIP 1つにまとめる。設定は全トラック共通)'}
                </li>
                <li>
                  Companion の <b>Import / Export → Import</b> で読み込む
                </li>
                <li>
                  接続先を現地に合わせる。スイッチャーは{' '}
                  <Code>192.168.179.129</Code>、OBS は{' '}
                  <Code>localhost:4455</Code> (WebSocket・パスワードなし)
                  が初期値
                </li>
              </HelpSteps>
              <HelpNote>
                各ボタンはスイッチャーの入力切替 (GoStream はマクロ、VR-6HD
                はコマンド) と OBS
                のシーン切替を同時に行う。右端はそのボタンが呼び出す OBS
                シーン名なので、OBS
                側のエクスポートでも同じシーンを有効にしておく。1段目の Slide /
                Futae / Person / Logo / End はレイアウト切替で、常に入る。
              </HelpNote>
            </>
          }
          footer={
            <>
              {copyUrl}
              <ModalButton onClick={closeModal}>Cancel</ModalButton>
              <ModalButton variant="primary" onClick={handleBuildPreview}>
                Preview
              </ModalButton>
            </>
          }
        >
          <Field label="スイッチャー">
            <Segmented
              value={device}
              onChange={setDevice}
              options={[
                ['gostream', DEVICE_LABEL.gostream],
                ['vr6hd', DEVICE_LABEL.vr6hd],
              ]}
            />
          </Field>

          <OptionList>
            <OptionRow
              title="時刻"
              description="トーク開始時刻ごとのボタン。そのトーク枠のインターミッションに切り替える。6個を超えるとページが分かれる"
              scene={talkSceneName('HH:MM')}
            />
            <OptionRow
              title="Count"
              description="カウントダウン動画に切り替える"
              scene={OBS_SCENE.countdown}
              enabled={includeCount}
              onToggle={setIncludeCount}
            />
            <OptionRow
              title="TrackA"
              description="サイマル (他トラックの配信) に切り替える"
              scene={OBS_SCENE.simul}
              enabled={includeTrackA}
              onToggle={setIncludeTrackA}
            />
            <OptionRow
              title="Slido"
              description="スイッチャーを Slido 用の設定に切り替え、OBS は空シーンにする"
              scene={OBS_SCENE.separator}
              enabled={includeSlido}
              onToggle={setIncludeSlido}
            />
            <OptionRow
              title="アタック動画"
              description="時刻ボタンの下段に各トークのアタック動画ボタンを並べる (1ページ3枠になる)"
              scene={attackSceneName('HH:MM')}
              enabled={includeAttack}
              onToggle={setIncludeAttack}
            />
          </OptionList>
        </ToolModal>
      )}
      {isOpen && preview && (
        <ToolModal
          title="Companion ボタン設定 — プレビュー"
          subtitle={`${subtitle} / ${DEVICE_LABEL[device]}`}
          widthClass="w-[1100px]"
          onClose={closeModal}
          footer={
            <>
              <ModalButton onClick={() => setPreviews(null)}>
                ← Back
              </ModalButton>
              {copyUrl}
              <ModalButton onClick={closeModal}>Cancel</ModalButton>
              <ModalButton variant="primary" onClick={handleExport}>
                {previews && previews.length > 1 ? 'Export ZIP' : 'Export'}
              </ModalButton>
            </>
          }
        >
          {previews && previews.length > 1 && (
            <Field label="プレビューするトラック">
              <Segmented
                value={String(previewIndex)}
                onChange={(v) => setPreviewIndex(Number(v))}
                options={previews.map((p, i) => [String(i), p.trackName])}
              />
            </Field>
          )}
          <CompanionPreview config={preview} />
        </ToolModal>
      )}
    </>
  )
}
