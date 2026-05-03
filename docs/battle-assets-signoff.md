# 本番バトル — 素材割当（デフォルト確定版）

本ドキュメントは [docs/GDD.md](GDD.md) §5・§6 に沿った **V01〜V10 / C01〜C03** の扱いを、リポジトリ内の実装方針として固定する。差し替え時は本表と `assets/battle/`・`battle/battle.css` の変数を更新する。

| ID | 素材 | 方針 | 割当（パスまたは手段） |
|----|------|------|------------------------|
| V01 | バトル背景 | **CSS グラデ＋装飾**（画像差し替え可） | [battle/battle.css](../battle/battle.css) 内 `body.battle-app` 背景。任意で [assets/battle/bg-pattern.svg](../assets/battle/bg-pattern.svg) を重ねる |
| V02 | HUD パネル下地 | **CSS**（角丸＋枠線。9スライス画像は未使用） | `.hud-panel` 等のクラス |
| V03 | HP バー | **CSS**（トラック＋ `transform: scaleX`） | `.bar-track` / `.bar-fill` |
| V04 | EP アイコン | **CSS ドット**（点灯／消灯） | `.ep-dot` / `.ep-dot.on` |
| V05 | リンクゾーン枠 | **CSS**（破線スロット＋ `.filled`） | `.link-slot` |
| V06 | 意図アイコン ×3 | **インライン SVG**（JS で差し替え） | [battle/battle.js](../battle/battle.js) `INTENTS` |
| V07 | ボタン | **CSS**（プライマリ／ゴースト） | `.btn-primary` / `.btn-ghost` |
| V08 | カード枠レア×3 | **既存 PNG を薄く背景**＋レアで色トーン | [assets/concept/card-frame.png](../assets/concept/card-frame.png) を `.card-face` の `background-image`（`battle/battle.css`） |
| V09 | タイプ ×4 | **CSS ラベル**（`.type-pill` + タイプ別色） | `battle/battle.css` |
| V10 | 敵イラスト | **既存コンセプト流用** | [assets/concept/enemy-virus.png](../assets/concept/enemy-virus.png)（フォールバック: `enemy-virus.svg`） |
| C01 | カードサムネ | **初版はタイプ色＋テキストのみ**（イラストは後追い） | JSON の `type` で背景色分け。将来 `thumb` フィールドで画像パスを追加可能 |
| C02 | カード裏面 | **省略**（山札枚数 UI は未実装のため不要） | — |
| C03 | 合成フラッシュ | **トースト＋任意クラス**（オーバーレイ画像は未使用） | `.toast-host` |

## データ素材（JSON）

| ID | ファイル | 役割 |
|----|-----------|------|
| D01 | [battle/data/cards.json](../battle/data/cards.json) | カード定義・タイプメタ |
| D02 | [battle/data/synthesis.json](../battle/data/synthesis.json) | 合成テーブル・オーバーフロー文言 |
| D03 | [battle/data/enemy.json](../battle/data/enemy.json) | 敵・初期 HP・スターター手札 ID |

## オプション素材（未着手）

O01〜O04・A01・A02 は本リポジトリでは **未配置**。追加時は `assets/battle/fx/` / `assets/audio/` を推奨。

---

**確定日:** 実装コミット時点のデフォルト。ユーザー差し替えは上記パスを更新。
