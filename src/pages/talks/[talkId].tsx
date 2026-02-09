import { Speaker, getSpeakers } from '@/api/endpoint/speakers'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Talk, getTalk } from '../../api/endpoint/talks'

// PixiAppを動的にインポートし、SSRを無効にする
const PixiApp = dynamic(() => import('../../components/media/PixiApp'), {
  ssr: false,
})

// Talkコンポーネント
const TalkPage = () => {
  const router = useRouter()
  const { talkId } = router.query
  const [talkData, setTalkData] = useState<Talk | null>(null)
  const [speakersData, setSpeakersData] = useState<Speaker[] | null>(null)

  useEffect(() => {
    if (typeof talkId === 'string') {
      getTalk(talkId).then((talkRes: Talk) => setTalkData(talkRes))
    }
    getSpeakers().then((SpeakersRes: Speaker[]) => setSpeakersData(SpeakersRes))
  }, [talkId])

  if (!talkData || !speakersData) return <div>Loading...</div> // ローディング表示

  console.log(talkData.title)
  console.log(speakersData[0].name)

  return (
    <div>
      {/* PixiAppコンポーネントにデータを渡す */}
      <link rel="stylesheet" href="https://use.typekit.net/egz6rzg.css"></link>
      <PixiApp
        talkData={talkData}
        speakersData={speakersData}
        onEnded={() => {}}
      />
    </div>
  )
}

export default TalkPage
