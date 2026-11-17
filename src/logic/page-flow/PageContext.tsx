import {
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ClockCtxProvider } from './ClockContext'

type PageCtxType = {
  current: number
  totalPage: number
  goNextPage: () => void
  setTotalPage: (totalPage: number) => void
  isNextVideoAvailable: boolean
  registerNextVideo: (handler: (() => void) | null) => void
  invokeNextVideo: () => void
  // 表示中のページが次へ遷移する予定時刻（performance.now() 基準の ms）。
  // 終わりが決まっていないページ（動画の Page4 など）では null。BGM のフェードアウトに使う
  pageEndsAt: number | null
  setPageEndsAt: (endsAt: number | null) => void
}

export const PageCtx = createContext<PageCtxType>({
  current: 0,
  totalPage: 0,
  goNextPage: () => {},
  setTotalPage: () => {},
  isNextVideoAvailable: false,
  registerNextVideo: () => {},
  invokeNextVideo: () => {},
  pageEndsAt: null,
  setPageEndsAt: () => {},
})

export const PageCtxProvider = (props: PropsWithChildren) => {
  const [current, setCurrent] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [isNextVideoAvailable, setIsNextVideoAvailable] = useState(false)
  const nextVideoRef = useRef<(() => void) | null>(null)
  const [pageEndsAt, setPageEndsAt] = useState<number | null>(null)

  const goNextPage = useCallback(() => {
    setCurrent((current + 1) % totalPage)
  }, [current, setCurrent, totalPage])

  const registerNextVideo = useCallback((handler: (() => void) | null) => {
    nextVideoRef.current = handler
    setIsNextVideoAvailable(handler !== null)
  }, [])

  const invokeNextVideo = useCallback(() => {
    nextVideoRef.current?.()
  }, [])

  // 現在時刻は ClockCtx 側に分けてある（毎秒の更新でページ全体を再レンダーしないため）。
  // ここの値はページ遷移などでしか変わらないので、useMemo で参照を保つ。
  const ctx: PageCtxType = useMemo(
    () => ({
      current,
      totalPage,
      goNextPage,
      setTotalPage,
      isNextVideoAvailable,
      registerNextVideo,
      invokeNextVideo,
      pageEndsAt,
      setPageEndsAt,
    }),
    [
      current,
      totalPage,
      goNextPage,
      isNextVideoAvailable,
      registerNextVideo,
      invokeNextVideo,
      pageEndsAt,
    ]
  )

  return (
    <PageCtx.Provider value={ctx}>
      <ClockCtxProvider>{props.children}</ClockCtxProvider>
    </PageCtx.Provider>
  )
}
