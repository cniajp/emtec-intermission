import type { Brand, BrandName } from './types'
import { staticBrand } from './static'
import { dreamkastBrand } from './dreamkast'

const REGISTRY: Record<BrandName, Brand> = {
  static: staticBrand,
  dreamkast: dreamkastBrand,
}

export function getBrand(name: BrandName): Brand {
  return REGISTRY[name]
}
