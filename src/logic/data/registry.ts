import type { DataSource, DataSourceName } from './types'
import { staticDataSource } from './static'
import { dreamkastDataSource } from './dreamkast'

const REGISTRY: Record<DataSourceName, DataSource> = {
  static: staticDataSource,
  dreamkast: dreamkastDataSource,
}

export function getDataSource(name: DataSourceName): DataSource {
  return REGISTRY[name]
}
