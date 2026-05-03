/**
 * Linkcode Deeprun — UI mock behavior
 */
(function () {
  var M = window.MOCK;
  if (!M) return;

  var state = {
    hand: [],
    link: [null, null],
    selectedId: null,
    ep: M.epMax,
    epMax: M.epMax,
    playerHp: M.playerHpStart,
    playerMax: M.playerHpStart,
    enemyHp: M.enemyHpStart,
    enemyMax: M.enemyHpStart,
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
    toast: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function typeClass(t) {
    return "type-" + t;
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
      "<p class=\"toast-title\">" +
      escapeHtml(title) +
      "</p><p class=\"toast-body\">" +
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
    if (!el.hand) return;
    el.hand.innerHTML = "";
    state.hand.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "card-chip" + (state.selectedId === c.id ? " is-selected" : "");
      b.dataset.id = c.id;
      b.innerHTML =
        "<span class=\"card-name\">" +
        escapeHtml(c.name) +
        "</span><div class=\"card-meta\"><span class=\"type-pill " +
        typeClass(c.type) +
        "\">" +
        escapeHtml(M.typeMeta[c.type].label) +
        "</span><span>EP " +
        c.cost +
        "</span></div>";
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
        "<span class=\"slot-hint\">" + (index === 0 ? "左（1枚目）" : "右（2枚目）") + "<br>空き</span>";
    } else {
      slotEl.innerHTML =
        "<div class=\"card-chip\" style=\"cursor:default;box-shadow:none;\">" +
        "<span class=\"card-name\">" +
        escapeHtml(card.name) +
        "</span><div class=\"card-meta\"><span class=\"type-pill " +
        typeClass(card.type) +
        "\">" +
        escapeHtml(M.typeMeta[card.type].label) +
        "</span><span>EP " +
        card.cost +
        "</span></div></div>";
    }
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
      showToast("手札を選択", "先に下の手札カードを1枚クリックして選択してください。", true);
      return;
    }
    var found = findCard(state.selectedId);
    if (!found) return;
    var card = found.card;

    if (index === 1 && !state.link[0]) {
      showToast("左から配置", "GDDどおり、リンクは左スロットから順に埋めてください。", true);
      return;
    }
    if (state.link[index]) {
      showToast("スロット使用中", "一度ターン終了か合成完了で空けてください。", true);
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
    var key = M.synthesisKey(a.type, b.type);
    var res = M.synthesis[key];
    var title;
    var body;
    if (res) {
      title = "リンク合成 成功";
      body = res.name + " — 即時効果（モック）。手札・スロットはデモ用に戻ります。";
      showToast(title, body, false);
    } else {
      title = "オーバーフロー";
      body = M.overflowLabel;
      showToast(title, body, true);
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
    showToast("ターン終了", "リンクゾーンを空にし、EP を回復（見た目モック）。", false);
  }

  function cycleIntent() {
    state.intent = (state.intent + 1) % INTENTS.length;
    renderIntent();
  }

  function initTabs() {
    var tabs = document.querySelectorAll(".tab");
    var panels = document.querySelectorAll(".panel");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("aria-controls");
        tabs.forEach(function (t) {
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        panels.forEach(function (p) {
          p.classList.toggle("is-active", p.id === target);
        });
      });
    });
  }

  function initMapNodes() {
    var nodes = document.querySelectorAll(".node");
    nodes.forEach(function (n) {
      n.addEventListener("click", function () {
        nodes.forEach(function (x) {
          x.classList.remove("is-picked");
        });
        n.classList.add("is-picked");
      });
    });
  }

  function init() {
    state.hand = M.hand.map(function (c) {
      return { id: c.id, name: c.name, cost: c.cost, type: c.type };
    });

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

    $("enemyName").textContent = M.enemyName;

    if ($("slotL"))
      $("slotL").addEventListener("click", function () {
        placeInSlot(0);
      });
    if ($("slotR"))
      $("slotR").addEventListener("click", function () {
        placeInSlot(1);
      });
    if ($("btnEndTurn")) $("btnEndTurn").addEventListener("click", endTurn);
    if ($("btnIntent")) $("btnIntent").addEventListener("click", cycleIntent);

    initTabs();
    initMapNodes();

    renderHand();
    renderLink();
    renderEp();
    renderBars();
    renderIntent();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
