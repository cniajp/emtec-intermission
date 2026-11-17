import {
  now,
  nowAccurate,
  hasSignificantDrift,
  startTimeSync,
} from '@/utils/time'
import { Dayjs } from 'dayjs'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'

type ClockCtxType = {
  now: Dayjs
  hasTimeDrift: boolean
}

// 毎秒変わる値は PageCtx と分ける。PageCtx に載せると、ページ遷移しか見ていない
// コンポーネント（ページ全体）まで毎秒再レンダーされる。
export const ClockCtx = createContext<ClockCtxType>({
  now: now(),
  hasTimeDrift: false,
})

export const ClockCtxProvider = (props: PropsWithChildren) => {
  const [currentTime, setCurrentTime] = useState<Dayjs>(now())
  const [timeDrift, setTimeDrift] = useState<boolean>(false)

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

  return (
    <ClockCtx.Provider value={{ now: currentTime, hasTimeDrift: timeDrift }}>
      {props.children}
    </ClockCtx.Provider>
  )
}
