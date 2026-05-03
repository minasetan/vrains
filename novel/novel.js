/**
 * Phaser 3 — scenario.json 駆動ノベル（V01 背景 / V02 枠 / C01・C02）
 */
(function () {
  var BASE = "../assets/battle/";
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
    this.load.image("bg_V01", BASE + "V01.png");
    this.load.image("frame_V02", BASE + "V02.png");
    this.load.image(textureKey("C01"), BASE + "C01.png");
    this.load.image(textureKey("C02"), BASE + "C02.png");
    this.load.json("scenario", "data/scenario.json");
    var self = this;
    this.load.once("loaderror", function (file) {
      showDomError(
        "素材の読み込みに失敗しました: " +
          (file && file.key ? file.key : "") +
          " · HTTP で開いているか確認してください。"
      );
    });
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

    this.charLeft = this.add
      .image(280, GAME_H - 40, textureKey("C01"))
      .setOrigin(0.5, 1)
      .setDepth(5)
      .setVisible(false);
    this.charRight = this.add
      .image(GAME_W - 280, GAME_H - 40, textureKey("C02"))
      .setOrigin(0.5, 1)
      .setDepth(5)
      .setVisible(false);

    var frameW = Math.min(1180, GAME_W - 80);
    var frameH = 200;
    this.dialogFrame = this.add
      .image(GAME_W / 2, GAME_H - 24, "frame_V02")
      .setOrigin(0.5, 1)
      .setDepth(10)
      .setDisplaySize(frameW, frameH);

    var textStyleName = {
      fontFamily: '"Segoe UI", "Hiragino Sans", Meiryo, sans-serif',
      fontSize: "20px",
      color: "#f0f6fc",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 5,
    };
    var textStyleBody = {
      fontFamily: '"Segoe UI", "Hiragino Sans", Meiryo, sans-serif',
      fontSize: "19px",
      color: "#ffffff",
      fontStyle: "normal",
      stroke: "#000000",
      strokeThickness: 4,
      wordWrap: { width: frameW - 80 },
      lineSpacing: 6,
    };

    this.nameText = this.add
      .text(GAME_W / 2 - frameW / 2 + 36, GAME_H - frameH - 18, "", textStyleName)
      .setDepth(11)
      .setOrigin(0, 0);

    this.bodyText = this.add
      .text(GAME_W / 2 - frameW / 2 + 36, GAME_H - frameH + 14, "", textStyleBody)
      .setDepth(11)
      .setOrigin(0, 0);

    this.hintText = this.add
      .text(GAME_W / 2 + frameW / 2 - 24, GAME_H - 44, "クリック / Enter / Space で次へ", {
        fontFamily: '"Segoe UI", Meiryo, sans-serif',
        fontSize: "14px",
        color: "rgba(255,255,255,0.82)",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setDepth(11)
      .setOrigin(1, 1);

    var barMax = frameW - 48;
    this.progressBg = this.add
      .rectangle(GAME_W / 2, GAME_H - 10, barMax, 4, 0x30363d, 1)
      .setOrigin(0.5, 1)
      .setDepth(12);
    this.progressFill = this.add
      .rectangle(GAME_W / 2 - barMax / 2, GAME_H - 10, 0, 4, 0x58a6ff, 1)
      .setOrigin(0, 1)
      .setDepth(13);

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

  NovelScene.prototype.fitSpriteHeight = function (sprite, maxH) {
    var frame = sprite.frame;
    if (!frame) return;
    var ih = frame.height;
    var iw = frame.width;
    if (!ih) return;
    var h = Math.min(maxH, ih * 1.1);
    var w = (iw / ih) * h;
    sprite.setDisplaySize(w, h);
  };

  NovelScene.prototype.renderLine = function () {
    if (!this.lines || !this.lines.length) return;
    var line = this.lines[this.lineIndex];
    var side = line.side || "left";
    var sid = line.sprite || "C01";
    var key = textureKey(sid);

    var maxCharH = 420;
    if (side === "right") {
      this.charRight.setTexture(key);
      this.fitSpriteHeight(this.charRight, maxCharH);
      this.charRight.setVisible(true);
      this.charLeft.setVisible(false);
    } else {
      this.charLeft.setTexture(key);
      this.fitSpriteHeight(this.charLeft, maxCharH);
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
