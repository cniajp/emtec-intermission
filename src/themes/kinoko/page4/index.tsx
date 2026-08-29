import VideoPlaylist from '@/components/media/VideoPlaylist'
import type { Page4PresenterProps } from '@/themes/types'

export default function Page4Presenter({
  playlist,
  onEnded,
}: Page4PresenterProps) {
  return (
    <div className="w-full h-full">
      {playlist.length > 0 && (
        <VideoPlaylist onEnded={onEnded} playlist={playlist} />
      )}
    </div>
  )
}
