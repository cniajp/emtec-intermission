import { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import { Layout } from '@/components/Layout'
import {
  clearEverything,
  clearVideoCache,
  formatBytes,
  readCacheEntries,
  readCacheStatus,
  requestVideoCache,
  type CacheEntry,
  type CacheStatus,
} from '@/components/tools/cacheTools'
import { CacheTree } from '@/components/tools/CacheTree'

// 状態を読み直す間隔。動画の保存が進む様子を見られるようにする
const REFRESH_MS = 2000

type Notice = { kind: 'info' | 'error'; text: string }

export default function CacheToolPage() {
  const [status, setStatus] = useState<CacheStatus | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  // 「すべて消す」は 2 回押して実行する。OBS のブラウザソースでは confirm() が
  // 使えないことがあるので、ダイアログではなくボタンで確認する
  const [confirmingClearAll, setConfirmingClearAll] = useState(false)
  // 全キャッシュの中身のツリー。件数が多く、サイズを測るのに本体を読むことがあるので、
  // 2 秒ごとの更新には含めず、開いたとき・ボタンを押したとき・消したときだけ読み直す
  const [entries, setEntries] = useState<CacheEntry[] | null>(null)
  const [isTreeLoading, setIsTreeLoading] = useState(false)

  const refreshTree = useCallback(async () => {
    setIsTreeLoading(true)
    try {
      setEntries(await readCacheEntries())
    } catch (e) {
      setNotice({ kind: 'error', text: `一覧を取得できませんでした: ${e}` })
    } finally {
      setIsTreeLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      setStatus(await readCacheStatus())
    } catch (e) {
      setNotice({ kind: 'error', text: `状態を取得できませんでした: ${e}` })
    }
  }, [])

  useEffect(() => {
    const first = setTimeout(() => {
      refresh()
      refreshTree()
    }, 0)
    const timer = setInterval(refresh, REFRESH_MS)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [refresh, refreshTree])

  const handleCacheNow = async () => {
    const sent = await requestVideoCache()
    setNotice(
      sent
        ? {
            kind: 'info',
            text: '取得を始めました。再生順に1本ずつ保存します（下の一覧が「保存済み」に変わります）。',
          }
        : {
            kind: 'error',
            text: 'Service Worker が登録されていないため、取得できません。',
          }
    )
  }

  const handleClearVideos = async () => {
    await clearVideoCache()
    setNotice({ kind: 'info', text: '動画キャッシュを消しました。' })
    await Promise.all([refresh(), refreshTree()])
  }

  const handleClearAll = async () => {
    if (!confirmingClearAll) {
      setConfirmingClearAll(true)
      return
    }
    await clearEverything()
    window.location.reload()
  }

  const sw = status?.serviceWorker
  const playlistVideos = status?.videos.filter((v) => v.inPlaylist) ?? []
  const cachedCount = playlistVideos.filter((v) => v.cached).length

  return (
    <Layout>
      <Head>
        <title>キャッシュ管理 | EMTEC Intermission</title>
      </Head>

      {/* このサイトの文字サイズ表（tailwind.css の @theme）は 1920x1080 の配信画面向けに大きい
          （text-sm が 20px、text-lg が 28px）。管理画面なので、このページでは px で直接指定する */}
      <div className="mx-auto w-full max-w-4xl text-[14px] leading-[1.6] text-white">
        <h1 className="text-[22px] font-bold mb-2">キャッシュ管理</h1>
        <p className="text-[13px] text-neutral-400 mb-8">
          このブラウザに保存されているキャッシュだけが対象です。OBS
          のブラウザソースは別に保存しているので、OBS
          側を消すときは、ブラウザソースでこのページを開いて「対話」から操作してください。
        </p>

        {notice && (
          <p
            role="status"
            className={`mb-6 rounded-lg border px-4 py-3 text-[13px] ${
              notice.kind === 'error'
                ? 'border-red-500/40 bg-red-500/10 text-red-200'
                : 'border-blue-500/30 bg-blue-500/5 text-neutral-200'
            }`}
          >
            {notice.text}
          </p>
        )}

        <section className="mb-8">
          <h2 className="text-[17px] font-semibold mb-3">
            Page4 の動画
            {status && (
              <span className="ml-3 text-[13px] font-normal text-neutral-400">
                保存済み {cachedCount} / {playlistVideos.length} 本
              </span>
            )}
          </h2>
          <ul className="rounded-lg border border-neutral-700 divide-y divide-neutral-700">
            {status?.videos.map((v) => (
              <li
                key={v.url}
                className="flex flex-col gap-1 px-4 py-3 text-[13px] sm:flex-row sm:items-center sm:gap-4"
              >
                <span
                  className={`shrink-0 w-16 self-start whitespace-nowrap text-center rounded-sm px-2 py-0.5 text-[12px] sm:self-auto ${
                    v.cached
                      ? 'bg-green-600/20 text-green-300'
                      : 'bg-neutral-700 text-neutral-300'
                  }`}
                >
                  {v.cached ? '保存済み' : '未保存'}
                </span>
                <span className="flex-1 min-w-0 break-all">
                  {v.url}
                  {!v.inPlaylist && (
                    <span className="ml-2 text-[12px] text-yellow-300">
                      現在のプレイリスト外
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-neutral-400 sm:w-24 sm:text-right">
                  {v.cached && v.bytes != null ? formatBytes(v.bytes) : '-'}
                </span>
              </li>
            ))}
            {status && status.videos.length === 0 && (
              <li className="px-4 py-3 text-[13px] text-neutral-400">
                動画はありません。
              </li>
            )}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCacheNow}
              className="rounded-sm bg-blue-600 px-4 py-2 text-[13px] font-medium hover:bg-blue-500 transition-colors"
            >
              動画を今すぐキャッシュ
            </button>
            <button
              type="button"
              onClick={handleClearVideos}
              className="rounded-sm bg-neutral-700 px-4 py-2 text-[13px] hover:bg-neutral-600 transition-colors"
            >
              動画キャッシュを消す
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-[17px] font-semibold mb-3">状態</h2>
          <dl className="rounded-lg border border-neutral-700 divide-y divide-neutral-700 text-[13px]">
            <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-0">
              <dt className="shrink-0 text-neutral-400 sm:w-40">
                Service Worker
              </dt>
              <dd>
                {!sw
                  ? '確認中...'
                  : !sw.registered
                    ? '未登録（開発時は無効です）'
                    : [
                        sw.controlled
                          ? 'このページを制御中'
                          : '登録済み（再読み込み後に有効）',
                        sw.waiting ? '新しい版が待機中' : null,
                      ]
                        .filter(Boolean)
                        .join(' / ')}
              </dd>
            </div>
            <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-0">
              <dt className="shrink-0 text-neutral-400 sm:w-40">使用容量</dt>
              <dd>
                {status?.storage
                  ? `${formatBytes(status.storage.usage)} / ${formatBytes(status.storage.quota)}`
                  : '-'}
              </dd>
            </div>
            <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-0">
              <dt className="shrink-0 text-neutral-400 sm:w-40">キャッシュ</dt>
              <dd>
                {status && status.caches.length === 0 && 'なし'}
                {status?.caches.map((c) => (
                  <div key={c.name}>
                    {c.name}（{c.count} 件）
                  </div>
                ))}
              </dd>
            </div>
          </dl>
        </section>

        <CacheTree
          entries={entries}
          isLoading={isTreeLoading}
          onRefresh={refreshTree}
        />

        <section>
          <h2 className="text-[17px] font-semibold mb-3">すべて消す</h2>
          <p className="text-[13px] text-neutral-400 mb-4">
            すべてのキャッシュを消し、Service Worker
            の登録を外してから再読み込みします。デプロイ後も古い画面のままのときに使います。動画も取り直しになります。
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleClearAll}
              className={`rounded-sm px-4 py-2 text-[13px] transition-colors ${
                confirmingClearAll
                  ? 'bg-red-600 font-medium hover:bg-red-500'
                  : 'bg-neutral-700 hover:bg-neutral-600'
              }`}
            >
              {confirmingClearAll
                ? 'もう一度押すと消して再読み込みします'
                : 'すべて消して再読み込み'}
            </button>
            {confirmingClearAll && (
              <button
                type="button"
                onClick={() => setConfirmingClearAll(false)}
                className="rounded-sm bg-neutral-700 px-4 py-2 text-[13px] hover:bg-neutral-600 transition-colors"
              >
                やめる
              </button>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}
