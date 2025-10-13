# justfile のタスク一覧を表示
list: 
  just --list

# o11yconjp 2025 用の変換スクリプトを実行
o11yconjp2025:
  npx tsx ./script/o11yconjp2025/convert.ts -y && npm run fmt

# fortee 用の変換スクリプトを実行
fortee:
  npx tsx ./script/fortee/convert.ts -y && npm run fmt