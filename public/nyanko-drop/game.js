(() => {
  "use strict";

  const SIZE = 8;
  const PIECES = [
    { id: "paw", icon: "🐾", label: "肉球" },
    { id: "bell", icon: "🔔", label: "鈴" },
    { id: "teaser", icon: "🪄", label: "猫じゃらし" },
    { id: "yarn", icon: "🧶", label: "毛糸玉" },
    { id: "fish", icon: "🐟", label: "魚" },
    { id: "can", icon: "🥫", label: "猫缶" },
  ];

  const boardEl = document.querySelector("#board");
  const effectLayer = document.querySelector("#effectLayer");
  const scoreEl = document.querySelector("#score");
  const chainEl = document.querySelector("#chain");
  const statusEl = document.querySelector("#status");
  const resetButton = document.querySelector("#resetButton");
  const runnerEl = document.querySelector("#runner");

  const state = {
    board: [],
    selected: null,
    score: 0,
    currentChain: 0,
    busy: false,
    touchStart: null,
    audioContext: null,
  };

  function init() {
    buildBoard();
    render();
    updateHud();
    bindEvents();
  }

  function bindEvents() {
    boardEl.addEventListener("click", handleBoardClick);
    boardEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    boardEl.addEventListener("touchend", handleTouchEnd, { passive: true });
    resetButton.addEventListener("click", resetGame);
  }

  function buildBoard() {
    do {
      state.board = Array.from({ length: SIZE }, (_, row) =>
        Array.from({ length: SIZE }, (_, col) => randomPieceAvoiding(row, col)),
      );
    } while (!hasAvailableMove());
  }

  function randomPieceAvoiding(row, col) {
    const candidates = PIECES.map((piece) => piece.id);

    while (candidates.length > 0) {
      const index = Math.floor(Math.random() * candidates.length);
      const pieceId = candidates.splice(index, 1)[0];
      const horizontal =
        col >= 2 && state.board[row]?.[col - 1] === pieceId && state.board[row]?.[col - 2] === pieceId;
      const vertical =
        row >= 2 && state.board[row - 1]?.[col] === pieceId && state.board[row - 2]?.[col] === pieceId;

      if (!horizontal && !vertical) {
        return pieceId;
      }
    }

    return randomPiece();
  }

  function randomPiece() {
    return PIECES[Math.floor(Math.random() * PIECES.length)].id;
  }

  function render(clearing = new Set()) {
    const fragment = document.createDocumentFragment();

    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        const cell = document.createElement("button");
        const piece = getPiece(state.board[row][col]);
        const key = cellKey(row, col);

        cell.type = "button";
        cell.className = "cell";
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-label", `${row + 1}行 ${col + 1}列 ${piece.label}`);
        cell.textContent = piece.icon;

        if (state.selected && state.selected.row === row && state.selected.col === col) {
          cell.classList.add("selected");
        }

        if (clearing.has(key)) {
          cell.classList.add("clearing");
        }

        fragment.appendChild(cell);
      }
    }

    boardEl.replaceChildren(fragment);
    boardEl.classList.toggle("busy", state.busy);
  }

  function getPiece(id) {
    return PIECES.find((piece) => piece.id === id) || PIECES[0];
  }

  function handleBoardClick(event) {
    const cell = event.target.closest(".cell");

    if (!cell || state.busy) {
      return;
    }

    activateAudio();
    handleCellPick(Number(cell.dataset.row), Number(cell.dataset.col));
  }

  function handleCellPick(row, col) {
    const picked = { row, col };

    if (!state.selected) {
      selectCell(picked);
      return;
    }

    if (sameCell(state.selected, picked)) {
      state.selected = null;
      setStatus("選択を解除したよ");
      render();
      return;
    }

    if (!isAdjacent(state.selected, picked)) {
      selectCell(picked);
      return;
    }

    tryMove(state.selected, picked);
  }

  function selectCell(cell) {
    state.selected = cell;
    setStatus("隣のピースをタップして入れ替えよう");
    render();
  }

  async function tryMove(from, to) {
    state.busy = true;
    state.selected = null;
    swap(from, to);
    render();
    await wait(120);

    const matches = findMatches();
    if (matches.length === 0) {
      swap(from, to);
      render();
      nudgeCell(from);
      nudgeCell(to);
      playTone("miss");
      setStatus("そろわなかったので戻したよ");
      state.busy = false;
      boardEl.classList.remove("busy");
      return;
    }

    await resolveMatches(1, matches);
    state.busy = false;
    boardEl.classList.remove("busy");
    setStatus("ピースをタップして、隣のピースと入れ替えよう");
  }

  async function resolveMatches(chain, initialMatches = null) {
    let matches = initialMatches || findMatches();

    while (matches.length > 0) {
      state.currentChain = chain;
      updateHud();

      const clearing = new Set(matches.flatMap((match) => match.cells.map(({ row, col }) => cellKey(row, col))));
      addScore(matches, chain);
      render(clearing);
      showEffects(clearing, chain);
      playChainSound(chain);
      await wait(280);

      clearCells(clearing);
      collapseBoard();
      render();
      await wait(170);

      matches = findMatches();
      chain += 1;
    }

    state.currentChain = 0;
    updateHud();

    if (!hasAvailableMove()) {
      buildBoard();
      render();
      setStatus("動ける場所がなくなったので、盤面を混ぜたよ");
    }
  }

  function findMatches() {
    const matches = [];

    for (let row = 0; row < SIZE; row += 1) {
      let runStart = 0;

      for (let col = 1; col <= SIZE; col += 1) {
        const current = col < SIZE ? state.board[row][col] : null;
        const previous = state.board[row][col - 1];

        if (current !== previous) {
          const length = col - runStart;
          if (previous && length >= 3) {
            matches.push(makeMatch("row", row, runStart, length));
          }
          runStart = col;
        }
      }
    }

    for (let col = 0; col < SIZE; col += 1) {
      let runStart = 0;

      for (let row = 1; row <= SIZE; row += 1) {
        const current = row < SIZE ? state.board[row][col] : null;
        const previous = state.board[row - 1][col];

        if (current !== previous) {
          const length = row - runStart;
          if (previous && length >= 3) {
            matches.push(makeMatch("col", col, runStart, length));
          }
          runStart = row;
        }
      }
    }

    return matches;
  }

  function makeMatch(axis, fixed, start, length) {
    const cells = Array.from({ length }, (_, offset) =>
      axis === "row"
        ? { row: fixed, col: start + offset }
        : { row: start + offset, col: fixed },
    );

    return { length, cells };
  }

  function addScore(matches, chain) {
    const base = matches.reduce((total, match) => total + scoreForLength(match.length), 0);
    const gained = Math.round(base * multiplierForChain(chain));
    state.score += gained;
    updateHud();
    setStatus(chain > 1 ? `${chain}連鎖！ +${gained}` : `いい感じ！ +${gained}`);
  }

  function scoreForLength(length) {
    if (length >= 5) return 100;
    if (length === 4) return 50;
    return 30;
  }

  function multiplierForChain(chain) {
    if (chain >= 4) return 3;
    if (chain === 3) return 2;
    if (chain === 2) return 1.5;
    return 1;
  }

  function clearCells(clearing) {
    clearing.forEach((key) => {
      const { row, col } = parseCellKey(key);
      state.board[row][col] = null;
    });
  }

  function collapseBoard() {
    for (let col = 0; col < SIZE; col += 1) {
      const remaining = [];

      for (let row = SIZE - 1; row >= 0; row -= 1) {
        if (state.board[row][col]) {
          remaining.push(state.board[row][col]);
        }
      }

      for (let row = SIZE - 1; row >= 0; row -= 1) {
        state.board[row][col] = remaining.shift() || randomPiece();
      }
    }
  }

  function hasAvailableMove() {
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        const current = { row, col };
        const right = { row, col: col + 1 };
        const down = { row: row + 1, col };

        if ((isInside(right) && wouldCreateMatch(current, right)) || (isInside(down) && wouldCreateMatch(current, down))) {
          return true;
        }
      }
    }

    return false;
  }

  function wouldCreateMatch(a, b) {
    swap(a, b);
    const matched = findMatches().length > 0;
    swap(a, b);
    return matched;
  }

  function showEffects(clearing, chain) {
    const cells = Array.from(clearing).map(parseCellKey);
    const sampleRate = chain >= 2 ? 1 : Math.max(1, Math.ceil(cells.length / 5));

    cells.forEach((cell, index) => {
      if (index % sampleRate === 0) {
        spawnEffect(chain >= 3 ? "spark-pop" : "paw-pop", chain >= 3 ? "✦" : "🐾", cell);
      }

      if (chain >= 2 && index % 2 === 0) {
        spawnEffect("paw-pop", "🐾", cell, 18);
      }
    });

    if (chain >= 2) {
      spawnEffect("chain-word", `${chain}連鎖`, cells[Math.floor(cells.length / 2)] || { row: 3, col: 3 });
    }

    if (chain >= 4) {
      runnerEl.classList.remove("run");
      void runnerEl.offsetWidth;
      runnerEl.classList.add("run");
    }
  }

  function spawnEffect(className, text, cell, offset = 0) {
    const effect = document.createElement("span");
    const x = ((cell.col + 0.5) / SIZE) * 100;
    const y = ((cell.row + 0.5) / SIZE) * 100;

    effect.className = className;
    effect.textContent = text;
    effect.style.left = `calc(${x}% + ${offset}px)`;
    effect.style.top = `calc(${y}% - ${offset / 2}px)`;
    effectLayer.appendChild(effect);
    effect.addEventListener("animationend", () => effect.remove(), { once: true });
  }

  function playChainSound(chain) {
    if (chain >= 3) {
      playTone("spark");
    } else if (chain === 2) {
      playTone("nya");
    } else {
      playTone("bell");
    }
  }

  function activateAudio() {
    if (!state.audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        state.audioContext = new AudioContext();
      }
    }

    if (state.audioContext?.state === "suspended") {
      state.audioContext.resume();
    }
  }

  function playTone(type) {
    const ctx = state.audioContext;
    if (!ctx) return;

    const patterns = {
      bell: [880, 1175],
      nya: [520, 700],
      spark: [980, 1320, 1660],
      miss: [190],
    };
    const notes = patterns[type] || patterns.bell;

    notes.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + index * 0.045;
      const duration = type === "miss" ? 0.08 : 0.07;

      oscillator.type = type === "miss" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(type === "miss" ? 0.035 : 0.055, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    });
  }

  function handleTouchStart(event) {
    const cell = event.target.closest(".cell");
    if (!cell || state.busy) return;

    const touch = event.changedTouches[0];
    state.touchStart = {
      row: Number(cell.dataset.row),
      col: Number(cell.dataset.col),
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  function handleTouchEnd(event) {
    if (!state.touchStart || state.busy) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - state.touchStart.x;
    const dy = touch.clientY - state.touchStart.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 28) {
      state.touchStart = null;
      return;
    }

    const target = { row: state.touchStart.row, col: state.touchStart.col };
    if (Math.abs(dx) > Math.abs(dy)) {
      target.col += dx > 0 ? 1 : -1;
    } else {
      target.row += dy > 0 ? 1 : -1;
    }

    const from = { row: state.touchStart.row, col: state.touchStart.col };
    state.touchStart = null;

    if (isInside(target)) {
      activateAudio();
      state.selected = null;
      tryMove(from, target);
    }
  }

  function swap(a, b) {
    const temp = state.board[a.row][a.col];
    state.board[a.row][a.col] = state.board[b.row][b.col];
    state.board[b.row][b.col] = temp;
  }

  function sameCell(a, b) {
    return a.row === b.row && a.col === b.col;
  }

  function isAdjacent(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  function isInside(cell) {
    return cell.row >= 0 && cell.row < SIZE && cell.col >= 0 && cell.col < SIZE;
  }

  function nudgeCell(cell) {
    const button = boardEl.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
    if (!button) return;

    button.classList.add("hint");
    button.addEventListener("animationend", () => button.classList.remove("hint"), { once: true });
  }

  function updateHud() {
    scoreEl.textContent = String(state.score);
    chainEl.textContent = String(state.currentChain);
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function resetGame() {
    state.score = 0;
    state.currentChain = 0;
    state.selected = null;
    state.busy = false;
    effectLayer.replaceChildren();
    buildBoard();
    render();
    updateHud();
    setStatus("新しい盤面だよ。さっそく遊ぼう");
  }

  function cellKey(row, col) {
    return `${row}:${col}`;
  }

  function parseCellKey(key) {
    const [row, col] = key.split(":").map(Number);
    return { row, col };
  }

  function wait(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  init();
})();
