# Player Character Asset Spec

主人公は `AnimatedSprite2D` で管理します。
現在は仮PNGを使っていますが、同じファイル名でPNGを差し替えれば見た目を更新できます。

## Character Concept

- 小柄なサイバー忍者風の少年
- 横向きシルエットが分かりやすい主人公
- 近未来スーツ、軽装アーマー、青系の発光ライン
- 腕部ブラスター装備
- かわいい寄りだが戦える雰囲気

## Frame Spec

- 1フレーム: 96x96px
- 向き: 右向き基準
- 左向き: `AnimatedSprite2D.flip_h` で対応
- 背景: 透過PNG
- 当たり判定: 画像とは分離し、`scenes/player/player.tscn` の `CollisionShape2D` を使用

## Required Files

- `idle_0.png`
- `idle_1.png`
- `run_0.png`
- `run_1.png`
- `run_2.png`
- `jump_0.png`
- `shoot_0.png`
- `charge_0.png`
- `hurt_0.png`
- `death_0.png`
- `victory_0.png`

## Animation Mapping

- `idle`: `idle_0.png`, `idle_1.png`
- `run`: `run_0.png`, `run_1.png`, `run_2.png`
- `jump`: `jump_0.png`
- `shoot`: `shoot_0.png`
- `charge`: `charge_0.png`
- `hurt`: `hurt_0.png`
- `death`: `death_0.png`
- `victory`: `victory_0.png`
