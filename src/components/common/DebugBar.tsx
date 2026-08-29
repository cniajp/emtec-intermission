import config from '@/config'

type Props = {
  onBackToMenu: () => void
  onUpdateCache: () => void
  onGoNext: () => void
  onNextVideo?: (() => void) | null
}

export default function DebugBar({
  onBackToMenu,
  onUpdateCache,
  onGoNext,
  onNextVideo,
}: Props) {
  if (!config.debug) return null
  return (
    <>
      <button
        onClick={onBackToMenu}
        className="font-bold py-0 px-4 mx-2 my-2 rounded-sm bg-red-300 items-right"
      >
        Back to Menu
      </button>
      <button
        onClick={onUpdateCache}
        className="font-bold py-0 px-4 mx-2 my-2 rounded-sm bg-yellow-300 items-right"
      >
        Update Video Cache
      </button>
      <button
        onClick={onGoNext}
        className="font-bold py-0 px-4 mx-2 my-2 rounded-sm bg-blue-300 items-right"
      >
        Go Next
      </button>
      {onNextVideo && (
        <button
          onClick={onNextVideo}
          className="font-bold py-0 px-4 mx-2 my-2 rounded-sm bg-green-300 items-right"
        >
          Next Video
        </button>
      )}
    </>
  )
}
