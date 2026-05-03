/**
 * Minimal visual novel — scenario.json driven
 */
(function () {
  var BASE_SPRITE = "../assets/battle/";
  var lines = [];
  var index = 0;

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function spritePath(filename) {
    if (!filename) return "";
    if (/^https?:/i.test(filename) || filename.indexOf("/") === 0) return filename;
    return BASE_SPRITE + filename + ".png";
  }

  function bindSprite(img, filename) {
    if (!img) return;
    if (!filename) {
      img.removeAttribute("src");
      img.style.visibility = "hidden";
      return;
    }
    var path = spritePath(filename);
    img.onerror = function () {
      img.style.visibility = "hidden";
    };
    img.onload = function () {
      img.style.visibility = "visible";
    };
    img.src = path;
    img.alt = "";
  }

  function updateSprites(line) {
    var side = line.side || "left";
    var sp = line.sprite || "C01";
    var leftEl = $("spriteLeft");
    var rightEl = $("spriteRight");
    var slotL = $("slotLeft");
    var slotR = $("slotRight");

    if (side === "right") {
      bindSprite(rightEl, sp);
      bindSprite(leftEl, null);
      if (slotL) slotL.classList.add("is-hidden");
      if (slotR) slotR.classList.remove("is-hidden");
    } else {
      bindSprite(leftEl, sp);
      bindSprite(rightEl, null);
      if (slotR) slotR.classList.add("is-hidden");
      if (slotL) slotL.classList.remove("is-hidden");
    }
  }

  function render() {
    if (!lines.length) return;
    var line = lines[index];
    $("dialogName").textContent = line.speaker || "　";
    $("dialogText").innerHTML = escapeHtml(line.text || "").replace(/\n/g, "<br>");
    updateSprites(line);

    var pct = lines.length ? ((index + 1) / lines.length) * 100 : 0;
    var bar = $("dialogProgressBar");
    if (bar) bar.style.width = pct + "%";
  }

  function advance() {
    if (!lines.length) return;
    index = (index + 1) % lines.length;
    render();
  }

  function showError(msg) {
    var el = $("loadError");
    if (el) {
      el.textContent = msg;
      el.classList.add("is-visible");
    }
  }

  async function loadScenario() {
    var res = await fetch("data/scenario.json", { cache: "no-store" });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  async function start() {
    try {
      lines = await loadScenario();
      index = 0;
      $("novelMain").hidden = false;
      render();

      var btn = $("dialogAdvance");
      if (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          advance();
        });
      }
      document.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          advance();
        }
      });
    } catch (err) {
      showError(
        "シナリオの読み込みに失敗しました。ローカルサーバまたは GitHub Pages で開いてください。 " +
          (err && err.message ? err.message : "")
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
