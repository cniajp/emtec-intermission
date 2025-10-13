# justfile のタスク一覧を表示
list: 
  just --list

# o11yconjp 2025 用の変換スクリプトを実行
o11yconjp:
  npx tsx ./script/o11y_2025_convert.ts -y && npm run fmt