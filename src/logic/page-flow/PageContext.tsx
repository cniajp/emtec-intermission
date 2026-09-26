import {
  now,
  nowAccurate,
  hasSignificantDrift,
  startTimeSync,
} from '@/utils/time'
import { Dayjs } from 'dayjs'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

type PageCtxType = {
  current: number
  totalPage: number
  goNextPage: () => void
  setTotalPage: (totalPage: number) => void
  now: Dayjs
  hasTimeDrift: boolean
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
  now: now(),
  hasTimeDrift: false,
  isNextVideoAvailable: false,
  registerNextVideo: () => {},
  invokeNextVideo: () => {},
  pageEndsAt: null,
  setPageEndsAt: () => {},
})

export const PageCtxProvider = (props: PropsWithChildren) => {
  const [current, setCurrent] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<Dayjs>(now())
  const [timeDrift, setTimeDrift] = useState<boolean>(false)
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

  useEffect(() => {
    // Start time synchronization process (5-second retries for 30 seconds)
    startTimeSync()

    const updateTime = () => {
      const accurateTime = nowAccurate()
      setCurrentTime(accurateTime)
      setTimeDrift(hasSignificantDrift())
    }

    // Initial time update
    updateTime()

    // Regular updates every second (using cached/calculated time)
    const timer = setInterval(updateTime, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const ctx: PageCtxType = {
    current,
    totalPage,
    goNextPage,
    setTotalPage,
    now: currentTime,
    hasTimeDrift: timeDrift,
    isNextVideoAvailable,
    registerNextVideo,
    invokeNextVideo,
    pageEndsAt,
    setPageEndsAt,
  }

  return <PageCtx.Provider value={ctx}>{props.children}</PageCtx.Provider>
}
