# コンセプトアート用プロンプト集

**作品:** *Linkcode Deeprun*（仮）向け。  
**用途:** Midjourney / DALL·E / Stable Diffusion 等。英語本文は生成品質のため。  
**禁止事項:** 既存IPの固有名・ロゴ・トレードマークを画像に入れない。本文に **no text / no logo** を含める。

各項目に **狙い（日本語）**、**Positive prompt（英語）**、**Negative prompt（任意・英語）** を記載。

---

## 1. キービジュアル（16:9）

**狙い:** ネットの深層に浮かぶホログラムのカードと回路。タイトル画面やストア訴求用の横長ビジュアル。キャラの特定IP連想を避け、シルエットは抽象的でよい。

**Aspect ratio:** 16:9（ツールに応じて `--ar 16:9` 等）

**Positive prompt:**

```
Key visual for an original sci-fi deckbuilding roguelite video game, deep cyberspace canyon made of neon circuit boards and floating data shards, holographic playing cards hovering in perspective trail lines suggesting a link chain, cyan and magenta rim light, subtle purple fog, high contrast, cinematic wide shot, clean readable silhouettes, stylized 3D render, cel-shaded look, game key art, no characters from existing franchises, empty center space for optional UI title, ultra detailed environment, dramatic perspective
```

**Negative prompt:**

```
text, logo, watermark, subtitles, real corporate logos, Yu-Gi-Oh, trademark characters, photorealistic human face, gore, horror, lowres, blurry, messy composition, cluttered UI, Windows desktop, browser chrome
```

---

## 2. プレイ画面 UI（モック）

**狙い:** 手札・リンクゾーン（2スロット）・敵シルエット・HPバーを含む **架空のゲームUI**。実OSやブラウザは出さない。

**Positive prompt:**

```
Fictional video game battle UI mockup for a sci-fi card duel, dark futuristic HUD frame, lower area shows a curved hand of holographic cards, center has two adjacent empty slots labeled as abstract symbols not letters, top shows enemy silhouette placeholder and HP bars with hexagonal icons, neon cyan and magenta accents on charcoal background, clean vector-like shapes, game UI only, not a screenshot of a real operating system, high readability, 1920x1080 layout concept, stylized flat-shaded UI art
```

**Negative prompt:**

```
Windows, macOS, Linux taskbar, real application icons, Chrome, Firefox, smartphone notch, stock photo, illegible tiny text, watermark, IP characters, real world photos
```

---

## 3. カード枠テンプレート（フレームのみ）

**狙い:** 実カードイラストは入れず、**枠・装飾・レア度差**がわかるデザイン。中央は空白または単色。

**Positive prompt:**

```
Trading card frame template design, central empty rectangle for artwork, futuristic cyberpunk border filigree, thin glowing circuit lines, corner ornaments like microchips, rarity variant concept with subtle gem-like inserts, dark metallic base with cyan glow edges, orthogonal front view, symmetrical frame, no illustration inside, no text, vector-friendly shapes, game asset concept, crisp edges
```

**Negative prompt:**

```
text, letters, numbers, watermark, photo inside frame, character art, busy noise, skewed perspective, low contrast, 3D tilted card photography
```

---

## 4. 雑魚敵「ウイルス系」（オリジナル）

**狙い:** 小さめの敵アイコン。ワーム／バグの **抽象シルエット**。かわいさより脅威の軽さ。

**Positive prompt:**

```
Original game enemy concept art, small virus worm creature made of segmented neon tubes and glitch sparks, floating in cyberspace, simple readable silhouette, menacing but stylized, no face details, abstract eyes as two slits, trailing particle bits, side view full body, dark background with subtle grid, cel-shaded game enemy sprite concept, single character, no reference to existing media
```

**Negative prompt:**

```
real insect macro photo, gore, realistic worm flesh, text, logo, famous character, cluttered background, human body, robot with cockpit
```

---

## 5. 中ボス「ファイアウォール」（建造物風）

**狙い:** **壁・門・セキュリティ装置**のような巨大オブジェクト。プレイヤー一人と対比できるスケール感。

**Positive prompt:**

```
Original giant boss concept, architectural firewall guardian, massive vertical gate structure made of layered hexagonal shields and orange barrier fields, embedded rotating security rings, glowing cracks of cyan energy, brutalist sci-fi monument style, mid boss scale, dramatic low angle shot, stylized 3D concept art, storm of small data fragments around it, no readable text, game boss silhouette readable at small icon size
```

**Negative prompt:**

```
castle fantasy, medieval, dragon, human knight, real building photo, tiny unreadable text labels, watermark, corporate logos, cluttered tiny UI
```

---

## 6. 最終ボス「コア」（球体・発光）

**狙い:** 球体コア＋コロナ状の光。**シンプルなシルエット**でアイコン化しやすく。

**Positive prompt:**

```
Original final boss concept art, enormous spherical core entity hovering in a dark void, molten glass-like shell with pulsing inner light, corona rings of holographic code ribbons, minimal silhouette, high contrast glow magenta and cyan, epic scale, symmetrical composition, stylized semi-realistic render, game final boss read, no humanoid shape, no faces, no text, cosmic cyber aesthetic
```

**Negative prompt:**

```
planet Earth, moon photo, human face in clouds, eyeball motif, text, logo, busy details at silhouette edge, photorealistic NASA imagery, gore
```

---

## 使い方メモ

- **Midjourney:** 末尾に `--ar 16:9` や `--style raw` / `--stylize` を調整。V6/V7 は `--no text` も併用可。
- **DALL·E 3:** 1024 または 1792 の横長を選択し、プロンプト冒頭に `wide cinematic key art` 等を足す。
- **SDXL:** Negative を別欄に貼り付け、Sampler はチーム好みで。

生成物を公開する際は、利用ツールの **商用利用条項** と **学習データに関するポリシー** を確認すること。
