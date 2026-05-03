/**
 * Linkcode Deeprun — production battle (data-driven)
 */
(function () {
  var GAME = {
    typeMeta: null,
    cardsById: null,
    synthesis: null,
    overflowLabel: "",
    enemy: null
  };

  var state = {
    hand: [],
    link: [null, null],
    selectedId: null,
    ep: 0,
    epMax: 3,
    playerHp: 80,
    playerMax: 80,
    enemyHp: 45,
    enemyMax: 45,
    intent: 0
  };

  var INTENTS = [
    {
      label: "次ターン: 攻撃",
      svg:
        '<svg viewBox="0 0 24 24" fill="none" stroke="#f85149" stroke-width="2" aria-hidden="true"><path d="M4 12h16"/><path d="M12 4v16"/><path d="M6.5 6.5l11 11"/><path d="M17.5 6.5l-11 11"/></svg>'
    },
    {
      label: "次ターン: 防御",
      svg:
        '<svg viewBox="0 0 24 24" fill="none" stroke="#58a6ff" stroke-width="2" aria-hidden="true"><path d="M12 3l8 4v6c0 5-3 9-8 10-5-1-8-5-8-10V7l8-4z"/></svg>'
    },
    {
      label: "次ターン: バフ",
      svg:
        '<svg viewBox="0 0 24 24" fill="none" stroke="#3fb950" stroke-width="2" aria-hidden="true"><path d="M12 2l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6l2-6z"/></svg>'
    }
  ];

  var el = {
    hand: null,
    slot0: null,
    slot1: null,
    epDots: null,
    playerBar: null,
    playerText: null,
    enemyBar: null,
    enemyText: null,
    intentText: null,
    intentIcon: null,
    toast: null,
    loadError: null,
    battleMain: null,
    enemyImg: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function synthesisKey(t1, t2) {
    return [t1, t2].sort().join("|");
  }

  function typeClass(t) {
    return "type-" + t;
  }

  function rarityClass(r) {
    if (r === "rare") return "rarity-rare";
    if (r === "legend") return "rarity-legend";
    return "rarity-common";
  }

  function findCard(id) {
    for (var i = 0; i < state.hand.length; i++) {
      if (state.hand[i].id === id) return { card: state.hand[i], index: i };
    }
    return null;
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

  function renderHand() {
    if (!el.hand || !GAME.typeMeta) return;
    el.hand.innerHTML = "";
    state.hand.forEach(function (c) {
      var meta = GAME.typeMeta[c.type];
      var lab = meta ? meta.label : c.type;
      var b = document.createElement("button");
      b.type = "button";
      b.className =
        "card-chip " +
        rarityClass(c.rarity) +
        (state.selectedId === c.id ? " is-selected" : "");
      b.dataset.id = c.id;
      b.innerHTML =
        '<span class="card-face">' +
        '<span class="card-name">' +
        escapeHtml(c.name) +
        '</span><div class="card-meta"><span class="type-pill ' +
        typeClass(c.type) +
        '">' +
        escapeHtml(lab) +
        '</span><span>EP ' +
        c.cost +
        "</span></div></span>";
      b.addEventListener("click", function () {
        onSelectCard(c.id);
      });
      el.hand.appendChild(b);
    });
  }

  function renderSlot(slotEl, card, index) {
    if (!slotEl) return;
    slotEl.className = "slot" + (card ? " filled" : "");
    if (!card) {
      slotEl.innerHTML =
        '<span class="slot-hint">' +
        (index === 0 ? "左（1枚目）" : "右（2枚目）") +
        "<br>空き</span>";
      return;
    }
    var meta = GAME.typeMeta[card.type];
    var lab = meta ? meta.label : card.type;
    slotEl.innerHTML =
      '<div class="card-chip ' +
      rarityClass(card.rarity) +
      '" style="cursor:default;width:100%;max-width:11rem;">' +
      '<span class="card-face" style="box-shadow:none;">' +
      '<span class="card-name">' +
      escapeHtml(card.name) +
      '</span><div class="card-meta"><span class="type-pill ' +
      typeClass(card.type) +
      '">' +
      escapeHtml(lab) +
      '</span><span>EP ' +
      card.cost +
      "</span></div></span></div>";
  }

  function renderLink() {
    renderSlot(el.slot0, state.link[0], 0);
    renderSlot(el.slot1, state.link[1], 1);
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

  function renderIntent() {
    var it = INTENTS[state.intent];
    if (el.intentText) el.intentText.textContent = it.label;
    if (el.intentIcon) el.intentIcon.innerHTML = it.svg;
  }

  function onSelectCard(id) {
    state.selectedId = state.selectedId === id ? null : id;
    renderHand();
  }

  function placeInSlot(index) {
    if (!state.selectedId) {
      showToast("手札を選択", "手札のカードを1枚クリックしてからスロットを押してください。", true);
      return;
    }
    var found = findCard(state.selectedId);
    if (!found) return;
    var card = found.card;

    if (index === 1 && !state.link[0]) {
      showToast("左から配置", "リンクは左スロットから順に埋めてください。（GDD §5.4）", true);
      return;
    }
    if (state.link[index]) {
      showToast("スロット使用中", "合成完了またはターン終了で空けてください。", true);
      return;
    }
    if (card.cost > state.ep) {
      showToast("EP不足", "コスト " + card.cost + " に対して EP が足りません。", true);
      return;
    }

    state.hand.splice(found.index, 1);
    state.link[index] = card;
    state.ep -= card.cost;
    state.selectedId = null;

    renderHand();
    renderLink();
    renderEp();

    if (state.link[0] && state.link[1]) resolveLink();
  }

  function resolveLink() {
    var a = state.link[0];
    var b = state.link[1];
    var key = synthesisKey(a.type, b.type);
    var res = GAME.synthesis[key];
    if (res) {
      showToast("リンク合成 成功", res.name + " — 即時発動（デモ）。カードは手札へ戻します。", false);
    } else {
      showToast("オーバーフロー", GAME.overflowLabel, true);
    }

    var refund = a.cost + b.cost;
    state.hand.push(a, b);
    state.link[0] = null;
    state.link[1] = null;
    state.ep = Math.min(state.epMax, state.ep + refund);

    renderHand();
    renderLink();
    renderEp();

    state.enemyHp = Math.max(0, state.enemyHp - (res ? 12 : 4));
    renderBars();
  }

  function endTurn() {
    for (var i = 0; i < 2; i++) {
      if (state.link[i]) state.hand.push(state.link[i]);
      state.link[i] = null;
    }
    state.ep = state.epMax;
    state.selectedId = null;
    renderHand();
    renderLink();
    renderEp();
    showToast("ターン終了", "リンク解除・EP 全快。", false);
  }

  function cycleIntent() {
    state.intent = (state.intent + 1) % INTENTS.length;
    renderIntent();
  }

  function bindEnemyImgFallback() {
    if (!el.enemyImg) return;
    el.enemyImg.addEventListener("error", function once() {
      var fb = el.enemyImg.getAttribute("data-fallback");
      if (fb) {
        el.enemyImg.removeEventListener("error", once);
        el.enemyImg.src = fb;
      }
    });
  }

  function showLoadError(msg) {
    if (el.loadError) {
      el.loadError.textContent = msg;
      el.loadError.classList.add("is-visible");
    }
  }

  function initGameStateFromData() {
    var e = GAME.enemy;
    state.epMax = e.epMax;
    state.ep = e.epMax;
    state.playerMax = e.playerHp;
    state.playerHp = e.playerHp;
    state.enemyMax = e.enemyHp;
    state.enemyHp = e.enemyHp;
    state.intent = 0;

    var ids = e.starterHandIds || [];
    state.hand = [];
    ids.forEach(function (id) {
      var c = GAME.cardsById[id];
      if (c) {
        state.hand.push(Object.assign({}, c));
      }
    });
  }

  function bindUi() {
    el.hand = $("handRow");
    el.slot0 = $("slotL");
    el.slot1 = $("slotR");
    el.epDots = $("epDots");
    el.playerBar = $("playerBarFill");
    el.playerText = $("playerHpText");
    el.enemyBar = $("enemyBarFill");
    el.enemyText = $("enemyHpText");
    el.intentText = $("intentLabel");
    el.intentIcon = $("intentIcon");
    el.toast = $("toast");
    el.loadError = $("loadError");
    el.battleMain = $("battleMain");
    el.enemyImg = $("enemyImg");

    bindEnemyImgFallback();

    $("enemyName").textContent = GAME.enemy.name;

    el.slot0.addEventListener("click", function () {
      placeInSlot(0);
    });
    el.slot1.addEventListener("click", function () {
      placeInSlot(1);
    });
    $("btnEndTurn").addEventListener("click", endTurn);
    $("btnIntent").addEventListener("click", cycleIntent);

    renderHand();
    renderLink();
    renderEp();
    renderBars();
    renderIntent();

    el.battleMain.hidden = false;
  }

  async function loadJson(url) {
    var res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(url + " " + res.status);
    return res.json();
  }

  async function start() {
    try {
      var base = "";
      var cards = await loadJson(base + "data/cards.json");
      var syn = await loadJson(base + "data/synthesis.json");
      var enemy = await loadJson(base + "data/enemy.json");

      GAME.typeMeta = cards.typeMeta;
      GAME.synthesis = syn.table;
      GAME.overflowLabel = syn.overflowLabel;
      GAME.enemy = enemy;

      GAME.cardsById = {};
      cards.cards.forEach(function (c) {
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
