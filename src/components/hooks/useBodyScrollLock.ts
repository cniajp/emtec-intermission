import { useEffect } from 'react'

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isLocked])
}
