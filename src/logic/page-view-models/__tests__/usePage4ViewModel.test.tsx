import { renderHook } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import { BrandProvider } from '@/brand/BrandProvider'
import type { Brand } from '@/brand/types'
import { PageCtx } from '@/logic/page-flow/PageContext'
import { usePage4ViewModel } from '@/logic/page-view-models/usePage4ViewModel'
import { makeBrand } from '@/logic/__fixtures__/brandFixtures'
import type { Playlist } from '@/components/media/playlist'
import { pushPageEvent } from '@/lib/faro'
import { now } from '@/utils/time'

jest.mock('@/lib/faro')

function makeWrapper(brand: Brand, goNextPage: jest.Mock) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <BrandProvider brand={brand}>
        <PageCtx.Provider
          value={{
            current: 0,
            totalPage: 4,
            goNextPage,
            setTotalPage: jest.fn(),
            now: now(),
            hasTimeDrift: false,
            isNextVideoAvailable: false,
            registerNextVideo: jest.fn(),
            invokeNextVideo: jest.fn(),
          }}
        >
          {children}
        </PageCtx.Provider>
      </BrandProvider>
    )
  }
}

describe('usePage4ViewModel', () => {
  it('playlist が空: マウント時に page_exit + goNextPage を呼ぶ', () => {
    const goNextPage = jest.fn()
    const brand = makeBrand({ playlist: [] })
    renderHook(() => usePage4ViewModel(), {
      wrapper: makeWrapper(brand, goNextPage),
    })
    expect(goNextPage).toHaveBeenCalledTimes(1)
    expect(pushPageEvent).toHaveBeenCalledWith('Page4', 'page_exit')
  })

  it('playlist が非空: goNextPage は呼ばれず、onEnded を叩いた時のみ呼ばれる', () => {
    const goNextPage = jest.fn()
    const playlist: Playlist = [
      {
        sources: [{ src: 'http://example.com/a.mp4', type: 'video/mp4' }],
      } as unknown as Playlist[number],
    ]
    const brand = makeBrand({ playlist })
    const { result } = renderHook(() => usePage4ViewModel(), {
      wrapper: makeWrapper(brand, goNextPage),
    })

    expect(goNextPage).not.toHaveBeenCalled()
    expect(result.current.playlist).toBe(playlist)

    result.current.onEnded()
    expect(pushPageEvent).toHaveBeenCalledWith('Page4', 'page_exit')
    expect(goNextPage).toHaveBeenCalledTimes(1)
  })
})
