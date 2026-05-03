/**
 * Linkcode Deeprun — UI mock data (GDD §5 準拠のダミー)
 */
(function (w) {
  w.MOCK = {
    epMax: 3,
    playerHpStart: 80,
    enemyHpStart: 45,
    enemyName: "スパムワーム",
    typeMeta: {
      kernel: { label: "Kernel", short: "K" },
      packet: { label: "Packet", short: "P" },
      virus: { label: "Virus", short: "V" },
      shield: { label: "Shield", short: "S" }
    },
    hand: [
      { id: "c1", name: "Init Stack", cost: 0, type: "kernel" },
      { id: "c2", name: "Burst Frame", cost: 1, type: "packet" },
      { id: "c3", name: "Crawl Node", cost: 2, type: "virus" },
      { id: "c4", name: "Stack Guard", cost: 1, type: "shield" },
      { id: "c5", name: "Null Route", cost: 0, type: "packet" }
    ],
    synthesisKey: function (t1, t2) {
      return [t1, t2].sort().join("|");
    },
    /** 組み合わせ表（キーはソート済みタイプ） */
    synthesis: {
      "kernel|packet": { name: "シンセ: バッファ溢出" },
      "kernel|virus": { name: "シンセ: ルートキット撃" },
      "kernel|shield": { name: "シンセ: カーネル障壁" },
      "packet|shield": { name: "シンセ: 暗号ペイロード" },
      "packet|virus": { name: "シンセ: ワーム中継" },
      "shield|virus": { name: "シンセ: 隔離突破" }
    },
    overflowLabel: "オーバーフロー（微弱ダメージ＋小ドロー想定）"
  };
})(window);
