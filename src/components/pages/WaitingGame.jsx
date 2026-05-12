import { useEffect, useRef, useState } from 'react'

// ─── Constants ───────────────────────────────────────────────────────────────

const T   = 32
const CW  = 800
const CH  = 13 * T   // 416
const COLS = 70
const ROWS = 13

const DEFAULT_CFG = {
  playerSpeed:  2.1,
  gravity:      0.55,
  jumpForce:    13,    // stored positive, applied as negative vy
  enemySpeed:   0.84,
  coyoteFrames: 8,
  jumpBuffer:   8,
}

const CFG_FIELDS = [
  { key: 'playerSpeed',  label: 'Player Speed',   step: 0.1,  min: 0.3, max: 8  },
  { key: 'gravity',      label: 'Gravity',         step: 0.05, min: 0.1, max: 2  },
  { key: 'jumpForce',    label: 'Jump Force',      step: 0.5,  min: 4,   max: 20 },
  { key: 'enemySpeed',   label: 'Enemy Speed',     step: 0.1,  min: 0.2, max: 4  },
  { key: 'coyoteFrames', label: 'Coyote Frames',   step: 1,    min: 0,   max: 20 },
  { key: 'jumpBuffer',   label: 'Jump Buffer',     step: 1,    min: 0,   max: 20 },
]

// ─── Level data ──────────────────────────────────────────────────────────────

const LEVELS = [
  {
    name: 'Level 1', subtitle: 'Grasslands',
    map: [
      '......................................................................',
      '......................................................................',
      '.......####...................####.................####................',
      '......................................................................',
      '..........####.........####.......................####.................',
      '......................................................................',
      '....####.............####..........####................................',
      '......................................................................',
      '..........####...................####...........####............####...',
      '......................................................................',
      '......................................................................',
      '######################################################################',
      '######################################################################',
    ],
    enemies: [
      { tx: 7, ty: 10 }, { tx: 19, ty: 10 }, { tx: 31, ty: 10 },
      { tx: 43, ty: 10 }, { tx: 55, ty: 10 },
      { tx: 8, ty: 1 }, { tx: 36, ty: 5 },
    ],
    coins: [
      ...[3,4,5].map(tx=>({tx,ty:10})),
      ...[13,14].map(tx=>({tx,ty:10})),
      ...[8,9].map(tx=>({tx,ty:1})),
      ...[24,25].map(tx=>({tx,ty:3})),
      ...[33,34].map(tx=>({tx,ty:10})),
      ...[46,47,48].map(tx=>({tx,ty:10})),
      ...[57,58].map(tx=>({tx,ty:7})),
      ...[62,63,64].map(tx=>({tx,ty:10})),
    ],
  },
  {
    name: 'Level 2', subtitle: 'Rolling Hills',
    map: [
      '......................................................................',
      '......................................................................',
      '....####..........####..........####..........####..........####......',
      '......................................................................',
      '.......####......####.......####......####.......####.................',
      '......................................................................',
      '....##....####.....##....####.....##....####.....##...........##......',
      '......................................................................',
      '....####.......####.......####.......####.......####.......####.......',
      '......................................................................',
      '......................................................................',
      '######################################################################',
      '######################################################################',
    ],
    enemies: [
      { tx: 8,  ty: 10 }, { tx: 16, ty: 10 }, { tx: 24, ty: 10 },
      { tx: 32, ty: 10 }, { tx: 40, ty: 10 }, { tx: 50, ty: 10 }, { tx: 60, ty: 10 },
      { tx: 9,  ty: 1  }, { tx: 38, ty: 3  },
    ],
    coins: [
      ...[2,3,4].map(tx=>({tx,ty:10})),
      ...[9,10].map(tx=>({tx,ty:1})),
      ...[12,13].map(tx=>({tx,ty:10})),
      ...[21,22].map(tx=>({tx,ty:10})),
      ...[36,37].map(tx=>({tx,ty:3})),
      ...[43,44].map(tx=>({tx,ty:10})),
      ...[55,56,57].map(tx=>({tx,ty:10})),
      ...[64,65].map(tx=>({tx,ty:7})),
    ],
  },
  {
    name: 'Level 3', subtitle: 'Mind the Gap',
    // Gap 1: cols 14-18  |  Gap 2: cols 44-48
    map: [
      '......................................................................',
      '......................................................................',
      '....####.................####.................####..................####',
      '......................................................................',
      '.......####........####.........####.........####.....................',
      '......................................................................',
      '..####.........####.........####.........####...........####..........',
      '......................................................................',
      '....####......####..####....####....####.......####..####.........####',
      '......................................................................',
      '......................................................................',
      '##############.....#########################.....#####################',
      '##############.....#########################.....#####################',
    ],
    enemies: [
      { tx: 3,  ty: 10 }, { tx: 10, ty: 10 }, { tx: 21, ty: 10 },
      { tx: 29, ty: 10 }, { tx: 36, ty: 10 }, { tx: 51, ty: 10 }, { tx: 62, ty: 10 },
      { tx: 8,  ty: 1  }, { tx: 30, ty: 5  }, { tx: 50, ty: 5  },
    ],
    coins: [
      ...[2,3].map(tx=>({tx,ty:10})),
      ...[8,9].map(tx=>({tx,ty:1})),
      ...[15,16].map(tx=>({tx,ty:7})),   // above gap 1
      ...[25,26].map(tx=>({tx,ty:10})),
      ...[33,34].map(tx=>({tx,ty:3})),
      ...[45,46].map(tx=>({tx,ty:7})),   // above gap 2
      ...[53,54].map(tx=>({tx,ty:10})),
      ...[64,65].map(tx=>({tx,ty:10})),
    ],
  },
  {
    name: 'Level 4', subtitle: 'Broken Ground',
    // Gap 1: cols 10-14  |  Gap 2: cols 30-34  |  Gap 3: cols 50-54
    map: [
      '......................................................................',
      '......................................................................',
      '.....####..........####..........####..........####..........####.....',
      '......................................................................',
      '........##.......####.......##.......####.......##.......####.........',
      '......................................................................',
      '...####.....##....####.....##....####.....##....####.....##...........',
      '......................................................................',
      '.....####....##....####....##....####....##....####....##...........##',
      '......................................................................',
      '......................................................................',
      '##########.....###############.....###############.....###############',
      '##########.....###############.....###############.....###############',
    ],
    enemies: [
      { tx: 3,  ty: 10 }, { tx: 7,  ty: 10 }, { tx: 17, ty: 10 },
      { tx: 22, ty: 10 }, { tx: 37, ty: 10 }, { tx: 42, ty: 10 },
      { tx: 57, ty: 10 }, { tx: 63, ty: 10 },
      { tx: 6,  ty: 1  }, { tx: 24, ty: 3  }, { tx: 48, ty: 5  },
    ],
    coins: [
      { tx: 2, ty: 10 },
      ...[11,12].map(tx=>({tx,ty:7})),  // above gap 1
      ...[19,20].map(tx=>({tx,ty:10})),
      ...[31,32].map(tx=>({tx,ty:7})),  // above gap 2
      ...[39,40].map(tx=>({tx,ty:3})),
      ...[51,52].map(tx=>({tx,ty:7})),  // above gap 3
      ...[60,61].map(tx=>({tx,ty:10})),
      { tx: 66, ty: 10 },
    ],
  },
  {
    name: 'Level 5', subtitle: 'Gauntlet',
    // Gaps at cols 8-12, 22-26, 38-42, 55-61
    map: [
      '......................................................................',
      '......................................................................',
      '...##....##....##....##....##....##....##....##....##....##....##.....',
      '......................................................................',
      '.....####...##...####...##...####...##...####...##...####...##...####.',
      '......................................................................',
      '..###.....####..###.....####..###.....####..###.....####..###.....####',
      '......................................................................',
      '....##.....###....##.....###....##.....###....##.....###....##.....###',
      '......................................................................',
      '......................................................................',
      '########.....#########.....###########.....############.......########',
      '########.....#########.....###########.....############.......########',
    ],
    enemies: [
      { tx: 3,  ty: 10 }, { tx: 14, ty: 10 }, { tx: 28, ty: 10 },
      { tx: 44, ty: 10 }, { tx: 63, ty: 10 },
      { tx: 4,  ty: 1  }, { tx: 17, ty: 3  }, { tx: 30, ty: 5  },
      { tx: 43, ty: 3  }, { tx: 57, ty: 1  },
      { tx: 20, ty: 10 }, { tx: 35, ty: 10 }, { tx: 50, ty: 10 },
    ],
    coins: [
      { tx: 2, ty: 10 },
      ...[9,10].map(tx=>({tx,ty:7})),
      ...[15,16].map(tx=>({tx,ty:1})),
      ...[23,24].map(tx=>({tx,ty:7})),
      ...[31,32].map(tx=>({tx,ty:3})),
      ...[39,40].map(tx=>({tx,ty:7})),
      ...[47,48].map(tx=>({tx,ty:5})),
      ...[56,57].map(tx=>({tx,ty:7})),
      ...[65,66].map(tx=>({tx,ty:10})),
    ],
  },
]

// ─── World helpers ───────────────────────────────────────────────────────────

let currentMap = LEVELS[0].map

function solid(col, row) {
  if (row >= ROWS) return true
  if (row < 0 || col < 0 || col >= COLS) return false
  return (currentMap[row]?.[col] ?? '.') === '#'
}

function resolve(x, y, vx, vy, w, h) {
  let nx = x + vx, ny = y + vy, og = false
  for (const r of [Math.floor(y/T), Math.floor((y+h-1)/T)])
    for (const c of [Math.floor(nx/T), Math.floor((nx+w-1)/T)])
      if (solid(c,r)) { nx = vx > 0 ? c*T - w : (c+1)*T; vx = 0 }
  for (const c of [Math.floor(nx/T), Math.floor((nx+w-1)/T)])
    for (const r of [Math.floor(ny/T), Math.floor((ny+h-1)/T)])
      if (solid(c,r)) {
        if (vy > 0) { ny = r*T - h; vy = 0; og = true }
        else        { ny = (r+1)*T; vy = 0 }
      }
  return { x: nx, y: ny, vx, vy, onGround: og }
}

function aabb(a, b) {
  return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y
}

function initState(levelIdx, cfg) {
  const lvl = LEVELS[levelIdx]
  currentMap = lvl.map
  return {
    player:  { x: 2*T, y: 9*T, vx: 0, vy: 0, w: 22, h: 30, onGround: false, facingRight: true },
    enemies: lvl.enemies.map(({tx,ty}) => ({ x: tx*T, y: ty*T-26, vx: cfg.enemySpeed, w: 28, h: 26, vy: 0, alive: true })),
    coins:   lvl.coins.map(({tx,ty})   => ({ x: tx*T+8, y: ty*T+4, w: 18, h: 18, collected: false })),
    cam: 0, score: 0, lives: 3, phase: 'playing', levelIdx,
  }
}

// ─── Drawing ─────────────────────────────────────────────────────────────────

function drawBg(ctx, cam) {
  const g = ctx.createLinearGradient(0, 0, 0, CH)
  g.addColorStop(0, '#080b12'); g.addColorStop(1, '#141829')
  ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH)
  ctx.fillStyle = 'rgba(232,234,240,0.55)'
  for (let i = 0; i < 30; i++) {
    const sx = ((i*137 - cam*0.2) % CW + CW) % CW
    const sy = (i*73) % (CH-60) + 10
    ctx.fillRect(sx, sy, i%3===0 ? 1.5 : 1, i%3===0 ? 1.5 : 1)
  }
  ctx.fillStyle = '#1a2035'
  for (let i = 0; i < 5; i++) {
    const hx = ((i*220 - cam*0.35) % (CW+200) + CW+200) % (CW+200) - 100
    ctx.beginPath(); ctx.ellipse(hx, CH-T*2, 120, 60, 0, Math.PI, 0); ctx.fill()
  }
}

function drawTile(ctx, col, row, cam) {
  const x = col*T - cam; if (x > CW+T || x < -T) return
  const y = row*T
  ctx.fillStyle = '#3d2b1a'; ctx.fillRect(x, y, T, T)
  ctx.fillStyle = '#4e3826'; ctx.fillRect(x+1, y+1, T-2, 5)
  ctx.strokeStyle = '#271a0f'; ctx.lineWidth = 0.5; ctx.strokeRect(x+0.5, y+0.5, T-1, T-1)
}

function drawPlayer(ctx, pl, cam, tick) {
  const sx = Math.round(pl.x - cam), sy = Math.round(pl.y)
  ctx.save(); ctx.translate(sx+pl.w/2, sy+pl.h/2)
  if (!pl.facingRight) ctx.scale(-1, 1)
  const hw = pl.w/2, hh = pl.h/2
  const lo = pl.onGround ? Math.sin(tick*0.25)*4 : 0
  ctx.fillStyle = '#334155'
  ctx.fillRect(-hw+1, hh-8, 8, 8+lo); ctx.fillRect(hw-9, hh-8, 8, 8-lo)
  ctx.fillStyle = '#e8eaf0'; ctx.fillRect(-hw, -hh, pl.w, pl.h-6)
  ctx.fillStyle = '#6ee7b7'; ctx.fillRect(-hw, -hh+8, pl.w, 5)
  ctx.fillRect(-hw-3, -hh-6, pl.w+6, 6)
  ctx.fillStyle = '#059669'; ctx.fillRect(-hw+3, -hh-14, pl.w-6, 10)
  ctx.fillStyle = '#0f1117'; ctx.fillRect(hw-9, -hh+7, 4, 4); ctx.fillRect(hw-17, -hh+7, 4, 4)
  ctx.fillStyle = '#fff'; ctx.fillRect(hw-8, -hh+8, 2, 2)
  ctx.restore()
}

function drawEnemy(ctx, e, cam, tick) {
  if (!e.alive) return
  const sx = Math.round(e.x - cam); if (sx > CW+T || sx < -T) return
  ctx.save(); ctx.translate(sx+e.w/2, e.y+e.h/2)
  if (e.vx < 0) ctx.scale(-1, 1)
  const hw = e.w/2, hh = e.h/2
  ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.ellipse(0, hh*0.3, hw, hh, 0, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = '#78350f'
  const st = Math.sin(tick*0.2)*3
  ctx.fillRect(-hw+2, hh-4+st, 9, 5); ctx.fillRect(hw-11, hh-4-st, 9, 5)
  ctx.fillStyle = '#1c0a00'
  ctx.beginPath(); ctx.arc(-hw*0.25, -hh*0.3, 4, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(hw*0.35,  -hh*0.3, 4, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-hw*0.25+1, -hh*0.3-1, 1.5, 0, Math.PI*2); ctx.fill()
  ctx.strokeStyle = '#1c0a00'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(-hw*0.5,-hh*0.55); ctx.lineTo(-hw*0.05,-hh*0.45); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(hw*0.15,-hh*0.45); ctx.lineTo(hw*0.6,-hh*0.55); ctx.stroke()
  ctx.restore()
}

function drawCoin(ctx, coin, cam, tick) {
  if (coin.collected) return
  const sx = coin.x - cam; if (sx > CW+T || sx < -T) return
  const bob = Math.sin(tick*0.06 + coin.x*0.05)*3
  const cx = sx+coin.w/2, cy = coin.y+coin.h/2+bob
  ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.ellipse(cx, cy, 9, 11, 0, 0, Math.PI*2); ctx.fill()
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.stroke()
  ctx.fillStyle = '#92400e'; ctx.fillRect(cx-5, cy-2, 10, 6)
  ctx.fillStyle = '#fef3c7'; ctx.font = 'bold 5px sans-serif'; ctx.textAlign = 'center'
  ctx.fillText('S', cx, cy+3); ctx.textAlign = 'left'
}

function drawHUD(ctx, state) {
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, CW, 38)
  ctx.fillStyle = '#e8eaf0'; ctx.font = 'bold 15px "Segoe UI", sans-serif'
  ctx.fillText(`Score: ${state.score}`, 16, 25)
  ctx.fillText(`Lives: ${'♥'.repeat(Math.max(0, state.lives))}`, 220, 25)
  const got = state.coins.filter(c=>c.collected).length
  ctx.fillText(`Jars: ${got}/${state.coins.length}`, 440, 25)
  ctx.fillStyle = '#6b7280'; ctx.font = '13px "Segoe UI", sans-serif'
  ctx.fillText(LEVELS[state.levelIdx].name, 630, 25)
}

function drawOverlay(ctx, title, sub) {
  ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fillRect(0, 0, CW, CH)
  ctx.fillStyle = '#6ee7b7'; ctx.font = 'bold 42px "Segoe UI", sans-serif'
  ctx.textAlign = 'center'; ctx.fillText(title, CW/2, CH/2-18)
  ctx.fillStyle = '#9ca3af'; ctx.font = '18px "Segoe UI", sans-serif'
  ctx.fillText(sub, CW/2, CH/2+18); ctx.textAlign = 'left'
}

// ─── Component ───────────────────────────────────────────────────────────────

const p = {
  bg: '#0f1117', surface: '#1a1d27', border: '#2a2d3a',
  accent: '#6ee7b7', accentDim: 'rgba(110,231,183,0.1)', muted: '#6b7280', text: '#e8eaf0',
}

export default function WaitingGame() {
  const canvasRef      = useRef(null)
  const cfgRef         = useRef(DEFAULT_CFG)
  const pendingLvlRef  = useRef(null)

  const [cfg, setCfg]           = useState(DEFAULT_CFG)
  const [activeLvl, setActiveLvl] = useState(0)

  // Keep ref in sync so game loop always reads latest values
  useEffect(() => { cfgRef.current = cfg }, [cfg])

  function goToLevel(i) {
    pendingLvlRef.current = i
    setActiveLvl(i)
  }

  function updateCfg(key, raw) {
    const val = parseFloat(raw)
    if (!isNaN(val)) setCfg(c => ({ ...c, [key]: val }))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    canvas.focus()

    let state      = initState(0, cfgRef.current)
    let jumpQueued = false
    let jumpBuffer = 0
    let coyoteTime = 0
    let tick       = 0
    let raf

    const JUMP_KEYS = new Set([' ', 'ArrowUp', 'w', 'W'])

    const onDown = e => {
      if (JUMP_KEYS.has(e.key))  { jumpQueued = true; jumpBuffer = cfgRef.current.jumpBuffer; e.preventDefault() }
      if (e.key === 'ArrowDown') e.preventDefault()
    }
    const onUp = e => { /* noop — movement uses keydown events */ }

    // track held keys separately for movement
    const held = {}
    const onHeldDown = e => { held[e.key] = true }
    const onHeldUp   = e => { held[e.key] = false }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keydown', onHeldDown)
    window.addEventListener('keyup',   onHeldUp)

    function step() {
      tick++
      const cfg = cfgRef.current

      // Level switch requested from UI
      if (pendingLvlRef.current !== null) {
        state = initState(pendingLvlRef.current, cfg)
        pendingLvlRef.current = null
        jumpQueued = false; jumpBuffer = 0; coyoteTime = 0
      }

      const { player: pl, enemies, coins } = state

      // Restart on R
      if ((held['r'] || held['R']) && state.phase !== 'playing') {
        state = initState(state.levelIdx, cfg); return
      }
      if (state.phase !== 'playing') return

      // Coyote & buffer
      if (pl.onGround) { coyoteTime = cfg.coyoteFrames } else if (coyoteTime > 0) { coyoteTime-- }
      if (jumpBuffer > 0) jumpBuffer--
      if ((jumpQueued || jumpBuffer > 0) && coyoteTime > 0) {
        pl.vy = -cfg.jumpForce; coyoteTime = 0; jumpBuffer = 0
      }
      jumpQueued = false

      // Movement
      const left  = held['ArrowLeft']  || held['a'] || held['A']
      const right = held['ArrowRight'] || held['d'] || held['D']
      pl.vx = right ? cfg.playerSpeed : left ? -cfg.playerSpeed : 0
      if (pl.vx > 0) pl.facingRight = true
      if (pl.vx < 0) pl.facingRight = false

      pl.vy += cfg.gravity
      const rp = resolve(pl.x, pl.y, pl.vx, pl.vy, pl.w, pl.h)
      pl.x = Math.max(0, Math.min(rp.x, COLS*T - pl.w))
      pl.y = rp.y; pl.vx = rp.vx; pl.vy = rp.vy; pl.onGround = rp.onGround

      state.cam = Math.max(0, Math.min(pl.x - CW/3, COLS*T - CW))

      if (pl.y > CH + 60) {
        state.lives--
        if (state.lives <= 0) { state.phase = 'dead'; return }
        const fresh = initState(state.levelIdx, cfg)
        fresh.score = state.score; fresh.lives = state.lives; state = fresh; return
      }

      for (const e of enemies) {
        if (!e.alive) continue
        e.vy += cfg.gravity
        const re = resolve(e.x, e.y, e.vx, e.vy, e.w, e.h)
        e.x = Math.max(0, Math.min(re.x, COLS*T - e.w))
        e.y = re.y; e.vy = re.vy
        if (re.vx === 0) e.vx = -e.vx
        const ahead = Math.floor((e.x + (e.vx > 0 ? e.w+1 : -1)) / T)
        const foot  = Math.floor((e.y + e.h + 1) / T)
        if (re.onGround && !solid(ahead, foot)) e.vx = -e.vx
      }

      for (const e of enemies) {
        if (!e.alive || !aabb(pl, e)) continue
        if (pl.vy > 1 && pl.y+pl.h < e.y+e.h*0.6+6) {
          e.alive = false; pl.vy = -9; state.score += 200
        } else {
          state.lives--
          if (state.lives <= 0) { state.phase = 'dead'; return }
          const fresh = initState(state.levelIdx, cfg)
          fresh.score = state.score; fresh.lives = state.lives; state = fresh; return
        }
      }

      for (const c of coins)
        if (!c.collected && aabb(pl, c)) { c.collected = true; state.score += 100 }

      if (coins.every(c => c.collected)) {
        const next = state.levelIdx + 1
        if (next < LEVELS.length) {
          // auto-advance to next level, carry score
          const fresh = initState(next, cfg)
          fresh.score = state.score; fresh.lives = state.lives
          state = fresh
          pendingLvlRef.current = null
          setActiveLvl(next)
        } else {
          state.phase = 'win'
        }
      }
    }

    function draw() {
      drawBg(ctx, state.cam)
      const sc = Math.floor(state.cam / T)
      const ec = Math.min(COLS, sc + Math.ceil(CW/T) + 2)
      for (let r = 0; r < ROWS; r++)
        for (let c = sc; c < ec; c++)
          if ((currentMap[r]?.[c] ?? '.') === '#') drawTile(ctx, c, r, state.cam)
      for (const c of state.coins)   drawCoin(ctx, c, state.cam, tick)
      for (const e of state.enemies) drawEnemy(ctx, e, state.cam, tick)
      drawPlayer(ctx, state.player, state.cam, tick)
      drawHUD(ctx, state)
      if (state.phase === 'dead') drawOverlay(ctx, 'Game Over', 'Press R to restart')
      if (state.phase === 'win')  drawOverlay(ctx, 'Du vant! 🎉', `Final score: ${state.score}  —  R to restart`)
    }

    function loop() { step(); draw(); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keydown', onHeldDown)
      window.removeEventListener('keyup',   onHeldUp)
    }
  }, [])

  // ── UI ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ padding: '1.5rem 2rem 0.75rem' }}>
        <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: 700 }}>Waiting Game</h2>
        <p style={{ margin: 0, color: p.muted, fontSize: '0.82rem' }}>
          ← → move &nbsp;·&nbsp; ↑ / Space jump &nbsp;·&nbsp; stomp enemies &nbsp;·&nbsp; collect all jars to advance &nbsp;·&nbsp; R restart
        </p>
      </div>

      <canvas
        ref={canvasRef} width={CW} height={CH} tabIndex={0}
        style={{ display: 'block', outline: 'none', cursor: 'none', maxWidth: '100%' }}
      />

      {/* Level selector */}
      <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem 2rem 0.5rem', flexWrap: 'wrap' }}>
        {LEVELS.map((lvl, i) => (
          <button key={i} onClick={() => goToLevel(i)} style={{
            padding: '0.45rem 1rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
            background: activeLvl === i ? p.accent : p.surface,
            color:      activeLvl === i ? '#0f1117' : p.muted,
            border:     `1px solid ${activeLvl === i ? p.accent : p.border}`,
          }}>
            {lvl.name}<span style={{ fontWeight: 400, opacity: 0.7 }}> · {lvl.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Config panel */}
      <div style={{ margin: '0.75rem 2rem 2rem', background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: '1.25rem 1.5rem' }}>
        <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', fontWeight: 600, color: p.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Konfigurasjon
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {CFG_FIELDS.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: p.muted, marginBottom: '0.3rem', letterSpacing: '0.03em' }}>
                {f.label}
              </label>
              <input
                type="number" step={f.step} min={f.min} max={f.max}
                value={cfg[f.key]}
                onChange={e => updateCfg(f.key, e.target.value)}
                style={{
                  width: '100%', padding: '0.45rem 0.6rem', boxSizing: 'border-box',
                  background: p.bg, border: `1px solid ${p.border}`, borderRadius: 6,
                  color: p.text, fontSize: '0.9rem', outline: 'none',
                }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => { setCfg(DEFAULT_CFG); goToLevel(activeLvl) }}
          style={{ marginTop: '1rem', padding: '0.4rem 1rem', background: 'transparent', border: `1px solid ${p.border}`, borderRadius: 6, color: p.muted, cursor: 'pointer', fontSize: '0.8rem' }}
        >
          Reset to defaults
        </button>
      </div>
    </div>
  )
}
