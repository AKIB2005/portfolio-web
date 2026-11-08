import { useEffect, useRef } from 'react'

// Lightweight starfield: ~150 stars drawn in 3 batched paths at 30fps, short warp intro,
// occasional shooting star. Stops drawing when motion is off or the tab is hidden.
export default function Sky() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const root = document.documentElement
    const off = () => root.dataset.motion === 'off'
    const t0 = performance.now()
    const COL = ['#ffffff', '#ffffff', '#ffb3c1']
    let W, H, stars, raf, last = 0, px = 0, shoot = null, dirty = true
    const clamp = (v) => Math.max(0, Math.min(1, v))

    const resize = () => {
      W = innerWidth; H = innerHeight
      c.width = W * dpr; c.height = H * dpr
      c.style.width = W + 'px'; c.style.height = H + 'px'
      x.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: Math.min(150, Math.round((W * H) / 9000)) }, () => {
        const z = Math.random() * 1.5 + 0.4
        return { x: Math.random(), y: Math.random(), z, b: z > 1.5 ? 2 : z > 1 ? 1 : 0 }
      })
      dirty = true
    }
    const move = (e) => { px = e.clientX - W / 2 }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (document.hidden || now - last < 33) return
      const still = off()
      const k = still ? 1 : clamp((now - t0) / 1300)
      if (still && !dirty && k >= 1) return
      last = now; dirty = false
      x.clearRect(0, 0, W, H)
      const e = 1 - Math.pow(1 - k, 3), f = 1 + (1 - e) * 0.8
      for (let b = 0; b < 3; b++) {
        const a = still ? 0.75 : 0.45 + 0.4 * Math.sin(now / 1100 + b * 2.1)
        x.globalAlpha = a
        x.fillStyle = x.strokeStyle = COL[b]
        x.beginPath()
        for (const s of stars) {
          if (s.b !== b) continue
          let sx = s.x * W - px * 0.01 * s.z
          let sy = (((s.y * H - scrollY * 0.04 * s.z) % H) + H) % H
          const dx = sx - W / 2, dy = sy - H / 2, d = Math.hypot(dx, dy) || 1
          sx = W / 2 + dx * f; sy = H / 2 + dy * f
          if (k < 1) { const len = (1 - e) * 110 * s.z; x.moveTo(sx - (dx / d) * len, sy - (dy / d) * len); x.lineTo(sx, sy) }
          else x.rect(sx, sy, s.z, s.z)
        }
        k < 1 ? (x.lineWidth = 1.2, x.stroke()) : x.fill()
      }
      if (!still && k >= 1) {
        if (!shoot && Math.random() < 0.006) shoot = { x: Math.random() * W, y: Math.random() * H * 0.4, l: 0 }
        if (shoot) {
          shoot.x += 12; shoot.y += 5; shoot.l++
          x.globalAlpha = 1 - shoot.l / 40; x.strokeStyle = '#ffb3c1'; x.lineWidth = 1.5
          x.beginPath(); x.moveTo(shoot.x, shoot.y); x.lineTo(shoot.x - 80, shoot.y - 33); x.stroke()
          if (shoot.l > 40) shoot = null
        }
      }
      x.globalAlpha = 1
    }
    const kick = () => { dirty = true }
    resize()
    addEventListener('resize', resize)
    addEventListener('pointermove', move, { passive: true })
    addEventListener('scroll', kick, { passive: true })
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointermove', move); removeEventListener('scroll', kick) }
  }, [])
  return <canvas id="sky" ref={ref} aria-hidden="true" />
}
