// ESLint 9 以降は flat config のみで、`.eslintrc.js` と `.eslintignore` は読まれない。
// 旧 `.eslintrc.js` / `.eslintignore` からの移行:
//   next/core-web-vitals              -> eslint-config-next/core-web-vitals
//   plugin:@typescript-eslint/recommended -> eslint-config-next/typescript
//   plugin:prettier/recommended       -> eslint-plugin-prettier/recommended
// prettier の設定は eslint-plugin-prettier が `.prettierrc` を自動で読むため、
// 旧設定にあった fs.readFileSync による手動読み込みは不要になった。
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    // 旧 .eslintignore の内容。`dist` / `generated` は gitignore 的な
    // 「どの階層でも」の意味だったので `**/` を付けて等価にしている。
    ignores: [
      '**/dist/**',
      '**/generated/**',
      'src/api/**',
      'src/app/**',
      '.next/**',
      '.open-next/**',
      '.wrangler/**',
      '.swc/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettierRecommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // eslint-config-next 16 が持ち込む eslint-plugin-react-hooks 7 の新ルール。
      // 既存コードに 11 箇所該当するが、いずれも今回の依存更新で生じたものではなく
      // React Compiler 前提の新しい指摘。修正はランタイム挙動に踏み込むため別途対応する。
      // それまでは warn に落として可視化だけ維持する（既定は error）。
      'react-hooks/set-state-in-effect': 'warn', // 8 箇所
      'react-hooks/immutability': 'warn', // 2 箇所（delete router.query.confDay）
      'react-hooks/purity': 'warn', // 1 箇所
    },
  },
]
