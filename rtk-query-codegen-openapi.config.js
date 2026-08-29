// 参考: https://redux-toolkit.js.org/rtk-query/usage/code-generation
//
// このファイルを .ts ではなく .js にしているのは、rtk-query-codegen-openapi の CLI が
// TS の設定ファイルを読むために ts-node（または esbuild-runner）を必要とするため。
// ts-node は module を CommonJS に強制するので moduleResolution=node10 が必須になり、
// それが TypeScript 7 で動かなくなる。JS にすれば TS ローダー自体が不要になる。
// 型は下の JSDoc でエディタ上のチェックが効く。

/** @type {import('@rtk-query/codegen-openapi').ConfigFile} */
const config = {
  schemaFile: './schemas/swagger.yml',
  apiFile: './src/store/baseApi.ts',
  apiImport: 'baseApi',
  outputFile: './src/generated/dreamkast-api.generated.ts',
  exportName: 'dreamkastApi',
  hooks: true,
  unionUndefined: true,
  tag: true,
}

module.exports = config
