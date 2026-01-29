'use client'

import dynamic from 'next/dynamic'
import { useContext } from 'react'
import { ContentContext } from '../context'

const PixiApp = dynamic(() => import('../../../components/media/PixiApp'), {
  ssr: false,
})

export default function Page() {
  const { content, setContent } = useContext(ContentContext)

  return (
    <div>
      <h1>Pixi App in NextJs</h1>
      <p>10秒アニメーションを再生したら、自動でビデオに切り替わる</p>
      <PixiApp
        onEnded={() => {
          setContent('videoPlaylist')
        }}
        talkData={null}
        speakersData={null}
      />
      <p>
        次の finish
        をクリックすると、強制的にアニメーションを終了してビデオを再生
      </p>
      <button
        onClick={() => {
          setContent('videoPlaylist')
        }}
      >
        finish
      </button>
    </div>
  )
}
