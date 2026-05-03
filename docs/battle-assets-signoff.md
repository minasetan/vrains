# 本番バトル — 素材割当（V01〜V10 PNG 反映・シンプルルール版）

本ドキュメントは [docs/GDD.md](GDD.md) §5・§6 と、[battle/index.html](../battle/index.html) の実装に合わせて更新する。**リンク・タイプ・合成テーブルは省略**し、画像は `assets/battle/` のエクスポートを参照する。

| ID | 素材ファイル | 用途 | 実装での参照 |
|----|----------------|------|----------------|
| V01 | [assets/battle/V01.png](../assets/battle/V01.png) | バトル背景 | [battle/battle.css](../battle/battle.css) `body.battle-app` |
| V02 | [assets/battle/V02.png](../assets/battle/V02.png) | HUD パネル下地 | `.hud-panel` の `background-image` |
| V03 | [assets/battle/V03.png](../assets/battle/V03.png) | プレイヤー HP バー枠 | `.bar-track--player` |
| V03b | [assets/battle/V03b.png](../assets/battle/V03b.png) | 敵 HP バー枠 | `.bar-track--enemy` |
| V04 | [assets/battle/V04.png](../assets/battle/V04.png) | EP ビジュアル | [battle/index.html](../battle/index.html) の `<img class="ep-art">`（ドット表示と併用） |
| V05 | （なし） | リンクゾーン | **ルール省略のため未使用** |
| V06 | [assets/battle/V06.png](../assets/battle/V06.png) | 意図・説明用装飾 | `<img class="intent-art">`（ランダム AI は未実装） |
| V07 | [assets/battle/V07.png](../assets/battle/V07.png) | ボタン装飾 | `.btn` の `background-image` |
| V08 | [assets/battle/V08.png](../assets/battle/V08.png) | カード枠 | `.card-face` の `background-image` |
| V09 | （なし） | タイプアイコン | **ルール省略のため未使用**（ATK は `.dmg-badge` のテキスト） |
| V10 | [assets/battle/V10.png](../assets/battle/V10.png) | 敵メインイラスト | `#enemyImg` |
| （補助） | [assets/battle/bg-pattern.svg](../assets/battle/bg-pattern.svg) | 旧パターン | 現行 CSS は **V01 を全面**にしたため未使用（削除可） |

## データ素材（JSON）

| ID | ファイル | 役割 |
|----|-----------|------|
| D01 | [battle/data/cards.json](../battle/data/cards.json) | カード（cost, damage, rarity） |
| D02 | ~~synthesis.json~~ | **廃止**（合成なし） |
| D03 | [battle/data/enemy.json](../battle/data/enemy.json) | 敵名・HP・`epMax`・`turnDamage`・`starterHandIds` |

## C01〜C03（カード関連オプション）

| ID | 状態 |
|----|------|
| C01 | カード中央イラストは **未使用**。名前・ATK・EP のみ表示。 |
| C02 | カード裏面 **省略**。 |
| C03 | 合成フラッシュ **省略**。トーストのみ（`.toast-host`）。 |

---

**確定:** バトル簡易ルール実装に合わせて更新。
