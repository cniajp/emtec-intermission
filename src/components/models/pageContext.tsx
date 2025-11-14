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
  useState,
} from 'react'

type PageCtxType = {
  current: number
  totalPage: number
  goNextPage: () => void
  setTotalPage: (totalPage: number) => void
  now: Dayjs
  hasTimeDrift: boolean
}

export const PageCtx = createContext<PageCtxType>({
  current: 0,
  totalPage: 0,
  goNextPage: () => {},
  setTotalPage: () => {},
  now: now(),
  hasTimeDrift: false,
})

export const PageCtxProvider = (props: PropsWithChildren) => {
  const [current, setCurrent] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<Dayjs>(now())
  const [timeDrift, setTimeDrift] = useState<boolean>(false)

  const goNextPage = useCallback(() => {
    setCurrent((current + 1) % totalPage)
  }, [current, setCurrent, totalPage])

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
  }

  return <PageCtx.Provider value={ctx}>{props.children}</PageCtx.Provider>
}
