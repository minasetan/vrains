/**
 * Phaser 3 — scenario.json 駆動ノベル（V01 背景 / 描画のみのメッセージ枠 / C01・C02）
 */
(function () {
  var BASE = "../assets/battle/";
  /** 画像・JS の更新後にブラウザキャッシュを避ける（必要なら値だけ上げる） */
  var ASSET_Q = "?v=8";
  var GAME_W = 1280;
  var GAME_H = 720;

  function showDomError(msg) {
    var el = document.getElementById("loadError");
    if (el) {
      el.textContent = msg;
      el.classList.add("is-visible");
    }
  }

  function revealMain() {
    var main = document.getElementById("novelMain");
    if (main) main.hidden = false;
  }

  function textureKey(spriteId) {
    return "spr_" + spriteId;
  }

  function NovelScene() {
    Phaser.Scene.call(this, { key: "NovelScene" });
  }

  NovelScene.prototype = Object.create(Phaser.Scene.prototype);
  NovelScene.prototype.constructor = NovelScene;

  NovelScene.prototype.preload = function () {
    this.load.image("bg_V01", BASE + "V01.png" + ASSET_Q);
    this.load.image(textureKey("C01"), BASE + "C01.png" + ASSET_Q);
    this.load.image(textureKey("C02"), BASE + "C02.png" + ASSET_Q);
    this.load.json("scenario", "data/scenario.json" + ASSET_Q);
    var self = this;
    this.load.once("loaderror", function (file) {
      showDomError(
        "素材の読み込みに失敗しました: " +
          (file && file.key ? file.key : "") +
          " · HTTP で開いているか確認してください。"
      );
    });
  };

  /** メッセージ枠（画像不使用）：ビビッドなアウトライン＋グロー */
  NovelScene.prototype.drawMessageWindow = function (x, y, w, h) {
    var g = this.add.graphics();
    var r = 18;
    var vividA = 0xff00dd;
    var vividB = 0x00fff7;
    var layers = 14;
    var i;
    for (i = layers; i >= 1; i--) {
      var spread = i * 2.2;
      var alpha = 0.04 + (layers + 1 - i) * 0.028;
      if (alpha > 0.62) alpha = 0.62;
      var col = i % 2 === 0 ? vividA : vividB;
      g.lineStyle(Math.max(2.5, i * 0.55), col, alpha);
      g.strokeRoundedRect(
        x - spread,
        y - spread,
        w + spread * 2,
        h + spread * 2,
        r + spread * 0.35
      );
    }

    g.fillStyle(0x000000, 0.48);
    g.fillRoundedRect(x, y, w, h, r);

    var mx = 36;
    var mt = 20;
    var mb = 52;
    g.fillStyle(0x050505, 0.42);
    g.fillRoundedRect(x + mx, y + mt, w - mx * 2, h - mt - mb, 14);

    g.lineStyle(5, vividA, 1);
    g.strokeRoundedRect(x, y, w, h, r);
    g.lineStyle(3, vividB, 1);
    g.strokeRoundedRect(x + 2, y + 2, w - 4, h - 4, r - 2);

    return g.setDepth(10);
  };

  NovelScene.prototype.create = function () {
    var lines = this.cache.json.get("scenario");
    if (!Array.isArray(lines) || lines.length === 0) {
      showDomError("シナリオが空です。");
      return;
    }

    revealMain();

    this.lines = lines;
    this.lineIndex = 0;

    this.cameras.main.setBackgroundColor(0x0d1117);

    this.bg = this.add.image(GAME_W / 2, GAME_H / 2, "bg_V01").setDepth(0);
    this.fitCover(this.bg, GAME_W, GAME_H);

    var frameW = Math.min(1180, GAME_W - 80);
    var frameH = 236;
    var frameBottomY = GAME_H - 20;
    var frameLeftX = GAME_W / 2 - frameW / 2;
    var frameTopY = frameBottomY - frameH;

    /** 足元をウィンドウ下端よりやや下に：下半身がテキスト枠の後ろに回り込む一般的ノベル配置 */
    var charGroundY = Math.min(GAME_H - 8, frameBottomY + 28);

    var charLeftX = GAME_W * 0.28;
    var charRightX = GAME_W * 0.72;

    this.charLeft = this.add
      .image(charLeftX, charGroundY, textureKey("C01"))
      .setOrigin(0.5, 1)
      .setDepth(4)
      .setVisible(false);
    this.charRight = this.add
      .image(charRightX, charGroundY, textureKey("C02"))
      .setOrigin(0.5, 1)
      .setDepth(4)
      .setVisible(false);

    this.msgWindow = this.drawMessageWindow(frameLeftX, frameTopY, frameW, frameH);

    var padL = 56;
    var padR = 56;
    var padTop = 32;
    var nameBlockH = 30;
    var nameBodyGap = 10;

    var innerLeft = frameLeftX + padL;
    var innerTop = frameTopY + padTop;
    var bodyTop = innerTop + nameBlockH + nameBodyGap;
    var wrapW = frameW - padL - padR;

    var fontVN =
      '"Noto Sans JP", "Yu Gothic UI", YuGothic, "Hiragino Sans", Meiryo, sans-serif';

    var textStyleName = {
      fontFamily: fontVN,
      fontSize: "21px",
      color: "#f6f8fa",
      fontStyle: "bold",
      strokeThickness: 0,
    };
    var textStyleBody = {
      fontFamily: fontVN,
      fontSize: "20px",
      color: "#e6edf3",
      fontStyle: "normal",
      strokeThickness: 0,
      wordWrap: { width: wrapW },
      lineSpacing: 8,
    };

    this.nameText = this.add
      .text(innerLeft, innerTop, "", textStyleName)
      .setDepth(20)
      .setOrigin(0, 0);

    this.bodyText = this.add
      .text(innerLeft, bodyTop, "", textStyleBody)
      .setDepth(20)
      .setOrigin(0, 0);

    var hintPadR = 40;
    var hintPadB = 34;
    this.hintText = this.add
      .text(
        frameLeftX + frameW - hintPadR,
        frameBottomY - hintPadB,
        "クリック / Enter / Space で次へ",
        {
          fontFamily: fontVN,
          fontSize: "13px",
          color: "#8b949e",
          strokeThickness: 0,
        }
      )
      .setDepth(20)
      .setOrigin(1, 1);

    var barMax = frameW - padL - padR;
    var barY = frameBottomY - 18;
    this.progressBg = this.add
      .rectangle(GAME_W / 2, barY, barMax, 4, 0x8b949e, 1)
      .setOrigin(0.5, 1)
      .setDepth(21);
    this.progressFill = this.add
      .rectangle(GAME_W / 2 - barMax / 2, barY, 0, 4, 0x0969da, 1)
      .setOrigin(0, 1)
      .setDepth(22);

    var self = this;
    this.input.on("pointerdown", function () {
      self.advance();
    });
    if (this.input.keyboard) {
      this.input.keyboard.on("keydown-ENTER", function () {
        self.advance();
      });
      this.input.keyboard.on("keydown-SPACE", function (e) {
        if (e && e.originalEvent) e.originalEvent.preventDefault();
        self.advance();
      });
    }

    this.renderLine();
  };

  NovelScene.prototype.fitCover = function (img, targetW, targetH) {
    var iw = img.width;
    var ih = img.height;
    var scale = Math.max(targetW / iw, targetH / ih);
    img.setScale(scale);
    img.setPosition(targetW / 2, targetH / 2);
  };

  /** 縦を画面に合わせて大きく表示。横幅が広すぎるときは幅優先で縮小 */
  NovelScene.prototype.fitSpritePortrait = function (sprite, maxH, maxW) {
    var fr = sprite.frame;
    if (!fr) return;
    var ih = fr.height;
    var iw = fr.width;
    if (!ih || !iw) return;
    var h = maxH;
    var w = (iw / ih) * h;
    if (w > maxW) {
      w = maxW;
      h = (ih / iw) * w;
    }
    sprite.setDisplaySize(w, h);
  };

  NovelScene.prototype.renderLine = function () {
    if (!this.lines || !this.lines.length) return;
    var line = this.lines[this.lineIndex];
    var side = line.side || "left";
    var sid = line.sprite || "C01";
    var key = textureKey(sid);

    var maxCharH = Math.round(GAME_H * 0.88);
    var maxCharW = GAME_W * 0.42;
    if (side === "right") {
      this.charRight.setTexture(key);
      this.fitSpritePortrait(this.charRight, maxCharH, maxCharW);
      this.charRight.setVisible(true);
      this.charLeft.setVisible(false);
    } else {
      this.charLeft.setTexture(key);
      this.fitSpritePortrait(this.charLeft, maxCharH, maxCharW);
      this.charLeft.setVisible(true);
      this.charRight.setVisible(false);
    }

    this.nameText.setText(line.speaker || "　");
    this.bodyText.setText(line.text || "");

    var pct = ((this.lineIndex + 1) / this.lines.length) * 100;
    var maxW = this.progressBg.displayWidth;
    this.progressFill.width = (maxW * pct) / 100;
    this.progressFill.x = this.progressBg.x - maxW / 2;
  };

  NovelScene.prototype.advance = function () {
    if (!this.lines || !this.lines.length) return;
    this.lineIndex = (this.lineIndex + 1) % this.lines.length;
    this.renderLine();
  };

  function boot() {
    var config = {
      type: Phaser.AUTO,
      parent: "game-container",
      backgroundColor: "#0d1117",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_W,
        height: GAME_H,
      },
      scene: NovelScene,
      audio: { noAudio: true },
    };

    if (typeof Phaser === "undefined") {
      showDomError("Phaser の読み込みに失敗しました（ネット接続を確認してください）。");
      return;
    }

    try {
      new Phaser.Game(config);
    } catch (e) {
      showDomError(
        "ゲームの初期化に失敗しました。 " + (e && e.message ? e.message : String(e))
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
