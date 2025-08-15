import AudioPlayer from '@/components/AudioPlayer'
import Page1 from '@/components/alias/Page1'
import Page2, { AvatarPreLoader } from '@/components/alias/Page2'
import Page3 from '@/components/alias/Page3'
import Page4 from '@/components/alias/Page4'
import { useGetTalksAndTracks } from '@/components/hooks/useGetTalksAndTracks'
import { PageCtx, PageCtxProvider } from '@/components/models/pageContext'
import config, { extendConfig } from '@/config'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

function updateCache() {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'UPDATE_CACHE' })
  }
}

function Pages() {
  const router = useRouter()
  const { talkId, eventAbbr } = router.query
  useEffect(() => {
    extendConfig(router.query as Record<string, string>)
  }, [router.query])

  const { current, setTotalPage, goNextPage } = useContext(PageCtx)
  const { isLoading, view } = useGetTalksAndTracks(talkId as string | null)

  const pages = [
    <Page1 key={1} view={view} eventAbbr={eventAbbr as string} />,
    <Page2 key={2} view={view} eventAbbr={eventAbbr as string} />,
    <Page3 key={3} view={view} eventAbbr={eventAbbr as string} />,
    // CM スポンサーなしの場合は page 4 はコメントアウトする (下のshouldPlayAudioも編集が必要)
    <Page4 key={4} view={view} eventAbbr={eventAbbr as string} />,
  ]
  useEffect(() => {
    setTotalPage(pages.length)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const audioSrc = '/cnds2025/cnds2025_intermission.mp3'
  // CM ありの場合
  const shouldPlayAudio = current !== pages.length - 1
  // CM なしの場合
  // const shouldPlayAudio = true

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }
  return (
    <>
      <div>
        <link rel="stylesheet" href="https://use.typekit.net/egz6rzg.css" />
        <link rel="stylesheet" href="https://use.typekit.net/hbv7ezy.css" />
      </div>
      {config.debug && (
        <>
          <button
            onClick={updateCache}
            className="font-bold py-0 px-4 mx-2 my-2 rounded bg-yellow-300 items-right"
          >
            Update Video Cache
          </button>
          <button
            onClick={goNextPage}
            className="font-bold py-0 px-4 mx-2 my-2 rounded bg-blue-300 items-right"
          >
            Go Next
          </button>
        </>
      )}
      <AudioPlayer src={audioSrc} shouldPlay={shouldPlayAudio} />
      <AvatarPreLoader view={view}></AvatarPreLoader>
      <div className="w-[1920px] h-[1080px] bg-[url('/cndw2024/background.png')]">
        {pages[current]}
      </div>
      <div className="w-[1280px] h-[300px] bg-black relative"></div>
    </>
  )
}

export default function Index() {
  return (
    <PageCtxProvider>
      <Pages />
    </PageCtxProvider>
  )
}
