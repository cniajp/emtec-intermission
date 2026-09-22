# BGMの複数曲連続再生

策定: 2026-09-22（pek2026対応時）

## 決めたこと

| 項目 | 仕様 |
| --- | --- |
| 設定 | brandの`base.audioSrcs`に配列で列挙（`src/staticConfig/*.ts`）。空なら無音 |
| 再生順 | 配列の順。末尾まで来たら先頭に戻る |
| つなぎ目 | クロスフェードなし。`ended`で次のsrcに切り替えるので一瞬の無音が入る |
| Page4中 | 一時停止し、Page1に戻ったら同じ曲の続きから再開（従来どおり） |
| 実装 | `src/components/media/AudioPlayer.tsx`。1つの`<audio>`で`loop`は付けない |
| ファイル | `public/<event>/bgm/NN-name.mp3`。英数字名、mp3 |

debug時は「Next BGM (n/N)」ボタンで曲送りできる。

## 背景

- もとは`audioSrc`1本を`<audio loop>`で回すだけだった。pek2026で3曲用意されたので配列にした。
- 元ファイルはOpus in MP4の`.m4a`で、ファイル名に空白と日本語を含んでいた。Safariで鳴らず、URLエンコードも必要になるのでmp3に変換して英数字名にした。
- 変換時に`loudnorm`で3曲の音量を揃えている。
- ページ周期（約65秒）とBGMの長さは以前から連動していない。BGMはページ遷移と無関係に流れ続ける。
- 本番ではService Workerが`public/`配下を全部プリキャッシュするので、曲を増やすと初回ロードのキャッシュ量がその分増える（pek2026は3曲で約12MB）。

## 曲を差し替えるとき

```
ffmpeg -i in.m4a -af loudnorm=I=-16:TP=-1.5:LRA=11 -codec:a libmp3lame -q:a 2 public/<event>/bgm/NN-name.mp3
```

そのあと`base.audioSrcs`を更新する。
