/**
 * Linkcode Deeprun — simple battle (no types, no link synthesis)
 */
(function () {
  var GAME = {
    cardsById: null,
    enemy: null
  };

  var state = {
    hand: [],
    ep: 0,
    epMax: 3,
    playerHp: 80,
    playerMax: 80,
    enemyHp: 45,
    enemyMax: 45,
    ended: false
  };

  var el = {
    hand: null,
    epDots: null,
    playerBar: null,
    playerText: null,
    enemyBar: null,
    enemyText: null,
    toast: null,
    loadError: null,
    battleMain: null,
    btnEndTurn: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function rarityClass(r) {
    if (r === "rare") return "rarity-rare";
    if (r === "legend") return "rarity-legend";
    return "rarity-common";
  }

  function buildHandFromStarter() {
    var ids = GAME.enemy.starterHandIds || [];
    state.hand = [];
    ids.forEach(function (id) {
      var c = GAME.cardsById[id];
      if (c) state.hand.push(Object.assign({}, c));
    });
  }

  function showToast(title, body, isError) {
    if (!el.toast) return;
    el.toast.className = "toast-host is-visible" + (isError ? " is-error" : "");
    el.toast.innerHTML =
      '<p class="toast-title">' +
      escapeHtml(title) +
      '</p><p class="toast-body">' +
      escapeHtml(body || "") +
      "</p>";
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      el.toast.classList.remove("is-visible");
    }, 3200);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setEnded(won) {
    state.ended = true;
    document.body.classList.add("battle-ended");
    if (el.btnEndTurn) el.btnEndTurn.disabled = true;
    showToast(won ? "勝利" : "敗北", won ? "敵を撃破しました。" : "プレイヤー HP が 0 になりました。", !won);
  }

  function renderHand() {
    if (!el.hand) return;
    el.hand.innerHTML = "";
    state.hand.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "card-chip " + rarityClass(c.rarity);
      if (state.ended) b.disabled = true;
      b.dataset.id = c.id;
      b.innerHTML =
        '<span class="card-face">' +
        '<span class="card-name">' +
        escapeHtml(c.name) +
        '</span><div class="card-meta">' +
        '<span class="dmg-badge">ATK ' +
        c.damage +
        "</span>" +
        '<span>EP ' +
        c.cost +
        "</span></div></span>";
      b.addEventListener("click", function () {
        playCard(c.id);
      });
      el.hand.appendChild(b);
    });
  }

  function renderEp() {
    if (!el.epDots) return;
    el.epDots.innerHTML = "";
    for (var i = 0; i < state.epMax; i++) {
      var d = document.createElement("span");
      d.className = "ep-dot" + (i < state.ep ? " on" : "");
      d.setAttribute("aria-hidden", "true");
      el.epDots.appendChild(d);
    }
    var cap = $("epCap");
    if (cap) cap.textContent = state.ep + " / " + state.epMax;
  }

  function renderBars() {
    if (el.playerBar) {
      var pr = state.playerHp / state.playerMax;
      el.playerBar.style.transform = "scaleX(" + Math.max(0, Math.min(1, pr)) + ")";
    }
    if (el.playerText) el.playerText.textContent = state.playerHp + " / " + state.playerMax;
    if (el.enemyBar) {
      var er = state.enemyHp / state.enemyMax;
      el.enemyBar.style.transform = "scaleX(" + Math.max(0, Math.min(1, er)) + ")";
    }
    if (el.enemyText) el.enemyText.textContent = state.enemyHp + " / " + state.enemyMax;
  }

  function playCard(id) {
    if (state.ended) return;
    var idx = -1;
    for (var i = 0; i < state.hand.length; i++) {
      if (state.hand[i].id === id) {
        idx = i;
        break;
      }
    }
    if (idx < 0) return;
    var card = state.hand[idx];
    if (card.cost > state.ep) {
      showToast("EP不足", "コスト " + card.cost + " に対して EP が足りません。", true);
      return;
    }

    state.ep -= card.cost;
    state.enemyHp = Math.max(0, state.enemyHp - card.damage);
    state.hand.splice(idx, 1);

    renderHand();
    renderEp();
    renderBars();

    showToast("カード発動", card.name + " — " + card.damage + " ダメージ", false);

    if (state.enemyHp <= 0) {
      setEnded(true);
      renderHand();
    }
  }

  function endTurn() {
    if (state.ended) return;

    var dmg = GAME.enemy.turnDamage != null ? GAME.enemy.turnDamage : 8;
    state.playerHp = Math.max(0, state.playerHp - dmg);
    state.ep = state.epMax;

    buildHandFromStarter();

    renderHand();
    renderEp();
    renderBars();

    showToast("ターン終了", "敵の反撃 " + dmg + " ダメージ。EP 回復・手札を再構築。", false);

    if (state.playerHp <= 0) {
      setEnded(false);
      renderHand();
    }
  }

  function showLoadError(msg) {
    if (el.loadError) {
      el.loadError.textContent = msg;
      el.loadError.classList.add("is-visible");
    }
  }

  function bindUi() {
    el.hand = $("handRow");
    el.epDots = $("epDots");
    el.playerBar = $("playerBarFill");
    el.playerText = $("playerHpText");
    el.enemyBar = $("enemyBarFill");
    el.enemyText = $("enemyHpText");
    el.toast = $("toast");
    el.loadError = $("loadError");
    el.battleMain = $("battleMain");
    el.btnEndTurn = $("btnEndTurn");

    $("enemyName").textContent = GAME.enemy.name;

    el.btnEndTurn.addEventListener("click", endTurn);

    renderHand();
    renderEp();
    renderBars();

    el.battleMain.hidden = false;
  }

  function initGameStateFromData() {
    var e = GAME.enemy;
    state.epMax = e.epMax;
    state.ep = e.epMax;
    state.playerMax = e.playerHp;
    state.playerHp = e.playerHp;
    state.enemyMax = e.enemyHp;
    state.enemyHp = e.enemyHp;
    state.ended = false;
    document.body.classList.remove("battle-ended");
    buildHandFromStarter();
  }

  async function loadJson(url) {
    var res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(url + " " + res.status);
    return res.json();
  }

  async function start() {
    try {
      var cardsDoc = await loadJson("data/cards.json");
      var enemy = await loadJson("data/enemy.json");

      GAME.enemy = enemy;
      GAME.cardsById = {};
      cardsDoc.cards.forEach(function (c) {
        GAME.cardsById[c.id] = c;
      });

      initGameStateFromData();
      bindUi();
    } catch (err) {
      showLoadError(
        "データの読み込みに失敗しました。GitHub Pages またはローカルサーバで開いてください。（file:// では fetch がブロックされることがあります） " +
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
