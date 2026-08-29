import { createContext, useContext, type PropsWithChildren } from 'react'
import type { Brand } from './types'

const BrandContext = createContext<Brand | null>(null)

export function BrandProvider({
  brand,
  children,
}: PropsWithChildren<{ brand: Brand }>) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
}

export function useBrand(): Brand {
  const brand = useContext(BrandContext)
  if (!brand) {
    throw new Error('useBrand must be called inside a <BrandProvider>')
  }
  return brand
}
