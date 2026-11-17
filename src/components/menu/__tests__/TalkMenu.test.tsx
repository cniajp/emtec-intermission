import { fireEvent, render, screen, within } from '@testing-library/react'
import { TalkMenu } from '@/components/menu/TalkMenu'
import { adjacentDays, menuDays } from '@/components/menu/DayNavigation'
import { MenuView } from '@/logic/models/talkView'
import type { Talk, Track } from '@/data/types'

jest.mock('next/router', () => ({
  useRouter: () => ({ query: { confDay: '1', transTimePage1: '5' } }),
}))

const tracks: Track[] = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 3, name: 'C' },
] as Track[]

function talk(id: number, trackId: number, hour: number, extra = {}): Talk {
  const hh = String(hour).padStart(2, '0')
  return {
    id,
    trackId,
    title: `Talk ${id}`,
    abstract: '',
    speakers: [{ id, name: `Speaker ${id}` }],
    startTime: `2026-11-18T${hh}:00:00+09:00`,
    endTime: `2026-11-18T${hh}:40:00+09:00`,
    conferenceDayId: 1,
    showOnTimetable: true,
    ...extra,
  }
}

const talks = [
  talk(11, 1, 10),
  talk(12, 2, 10),
  talk(21, 1, 11),
  talk(23, 3, 11, { cancelled: true }),
]

function setup() {
  const view = new MenuView(talks, tracks, [])
  render(
    <TalkMenu
      view={view}
      talkPathname={(id) => `/break/talks/${id}`}
      renderTrackActions={(track) => <button>export {track.name}</button>}
    />
  )
}

describe('TalkMenu', () => {
  it('PC 用の表は、トラックの数だけ列を持つ', () => {
    setup()
    const header = screen.getByText('Time').parentElement!
    // 時刻の列 + 3 トラック
    expect(header.children).toHaveLength(4)
    expect(header.style.gridTemplateColumns).toBe(
      '5.5rem repeat(3, minmax(0, 1fr))'
    )
  })

  it('トークのリンクは、表示時間などのクエリを引き継ぐ（confDay は除く）', () => {
    setup()
    const link = screen.getAllByRole('link', { name: /Talk 11/ })[0]
    expect(link.getAttribute('href')).toBe('/break/talks/11?transTimePage1=5')
  })

  it('スマートフォン用のタブでトラックを切り替えると、そのトラックのトークだけ並ぶ', () => {
    setup()
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((t) => t.textContent)).toEqual(['A', 'B', 'C'])
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')

    const list = screen.getByRole('list')
    const titles = () =>
      within(list)
        .getAllByRole('link')
        .map((a) => a.textContent)
    expect(titles()).toEqual([
      expect.stringContaining('Talk 11'),
      expect.stringContaining('Talk 21'),
    ])

    fireEvent.click(tabs[2])
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
    // C はトークが 11 時の 1 本だけ。トークが無い時間帯は出さない
    expect(titles()).toEqual([expect.stringContaining('Talk 23')])
    expect(within(list).getByText('中止')).toBeTruthy()
  })

  it('1 トラックならタブを出さない', () => {
    const view = new MenuView([talk(11, 1, 10)], [tracks[0]], [])
    render(
      <TalkMenu
        view={view}
        talkPathname={(id) => `/break/talks/${id}`}
        renderTrackActions={() => null}
      />
    )
    expect(screen.queryByRole('tab')).toBeNull()
  })
})

describe('adjacentDays', () => {
  it('直前・直後の日を返す', () => {
    expect(adjacentDays([1, 2, 4], 2)).toEqual({ prev: 1, next: 4 })
    expect(adjacentDays([1, 2, 4], 1)).toEqual({ prev: undefined, next: 2 })
    expect(adjacentDays([1, 2, 4], 4)).toEqual({ prev: 2, next: undefined })
    expect(adjacentDays([], 1)).toEqual({ prev: undefined, next: undefined })
  })
})

describe('menuDays', () => {
  it('talks に出てくる日を重複なし・昇順で返す（日が無いトークは除く）', () => {
    expect(
      menuDays([
        { conferenceDayId: 2 },
        { conferenceDayId: 1 },
        { conferenceDayId: 2 },
        { conferenceDayId: null },
        {},
      ])
    ).toEqual([1, 2])
  })
})
