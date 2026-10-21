import { useEffect, useRef } from 'react'

// Starfield with a warp-speed intro, twinkle, cursor parallax and shooting stars.
export default function Sky() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const root = document.documentElement
    const off = () => root.dataset.motion === 'off'
    const t0 = performance.now()
    let W, H, stars, raf, px = 0, shoot = null
    const clamp = (v) => Math.max(0, Math.min(1, v))

    const resize = () => {
      W = innerWidth; H = innerHeight
      c.width = W * dpr; c.height = H * dpr
      c.style.width = W + 'px'; c.style.height = H + 'px'
      x.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: Math.round((W * H) / 5000) }, () => ({
        x: Math.random(), y: Math.random(), z: Math.random() * 1.6 + 0.3, p: Math.random() * 6.28,
      }))
    }
    const move = (e) => { px = e.clientX - W / 2 }

    const frame = (now) => {
      x.clearRect(0, 0, W, H)
      const still = off()
      const k = still ? 1 : clamp((now - t0) / 1900)
      const e = 1 - Math.pow(1 - k, 3)
      const f = 1 + (1 - e) * 0.9
      for (const s of stars) {
        const tw = still ? 1 : 0.55 + 0.45 * Math.sin(now / 900 + s.p)
        let sx = s.x * W - px * 0.012 * s.z
        let sy = (((s.y * H - scrollY * 0.05 * s.z) % H) + H) % H
        const dx = sx - W / 2, dy = sy - H / 2, d = Math.hypot(dx, dy) || 1
        sx = W / 2 + dx * f; sy = H / 2 + dy * f
        x.globalAlpha = 0.25 + 0.6 * tw * (s.z / 1.9)
        x.fillStyle = x.strokeStyle = s.z > 1.6 ? '#ffc98a' : '#e8ecf4'
        if (k < 1) {
          const len = (1 - e) * 140 * s.z
          x.lineWidth = s.z * 0.8
          x.beginPath(); x.moveTo(sx - (dx / d) * len, sy - (dy / d) * len); x.lineTo(sx, sy); x.stroke()
        } else {
          x.beginPath(); x.arc(sx, sy, s.z * 0.7, 0, 6.28); x.fill()
        }
      }
      if (!still) {
        if (!shoot && Math.random() < 0.004) shoot = { x: Math.random() * W, y: Math.random() * H * 0.45, l: 0 }
        if (shoot) {
          shoot.x += 10; shoot.y += 4.4; shoot.l++
          const g = x.createLinearGradient(shoot.x, shoot.y, shoot.x - 90, shoot.y - 40)
          g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(157,184,255,0)')
          x.globalAlpha = 1 - shoot.l / 55; x.strokeStyle = g; x.lineWidth = 1.6
          x.beginPath(); x.moveTo(shoot.x, shoot.y); x.lineTo(shoot.x - 90, shoot.y - 40); x.stroke()
          if (shoot.l > 55) shoot = null
        }
      }
      x.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }
    resize()
    addEventListener('resize', resize)
    addEventListener('pointermove', move)
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointermove', move) }
  }, [])
  return <canvas id="sky" ref={ref} aria-hidden="true" />
}
