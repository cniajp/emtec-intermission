export type Playlist = {
  sources: {
    src: string
    type: string
  }[]
}[]

export const toPlaylist = (
  items: ReadonlyArray<{ src: string; type: string }>
): Playlist => items.map((item) => ({ sources: [item] }))
