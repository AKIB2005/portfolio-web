import { useEffect, useRef } from 'react'
import { NODES, EDGES } from './data'

// Full-page starfield plus the "stack" constellation. Hover a star to light its links.
export default function Sky() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const x = c.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const t0 = performance.now()
    let W, H, stars, box, raf
    let ptr = { x: -999, y: -999 }
    let hover = -1

    const resize = () => {
      W = innerWidth; H = innerHeight
      c.width = W * dpr; c.height = H * dpr
      c.style.width = W + 'px'; c.style.height = H + 'px'
      x.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: Math.round((W * H) / 5500) }, () => ({
        x: Math.random(), y: Math.random(), z: Math.random() * 1.6 + 0.3, p: Math.random() * 6.28,
      }))
      box = W < 800
        ? { x: W * 0.1, y: H * 0.62, w: W * 0.78, h: H * 0.26 }
        : { x: W * 0.52, y: H * 0.2, w: W * 0.4, h: H * 0.56 }
    }
    const at = (n) => ({ x: box.x + n.x * box.w, y: box.y + n.y * box.h - scrollY })
    const clamp = (v) => Math.max(0, Math.min(1, v))

    const move = (e) => {
      ptr = { x: e.clientX, y: e.clientY }
      hover = -1
      let best = 40
      NODES.forEach((n, i) => {
        const p = at(n)
        const d = Math.hypot(p.x - ptr.x, p.y - ptr.y)
        if (d < best) { best = d; hover = i }
      })
    }

    const frame = (now) => {
      const t = (now - t0) / 1000
      x.clearRect(0, 0, W, H)
      for (const s of stars) {
        const tw = still ? 1 : 0.55 + 0.45 * Math.sin(now / 900 + s.p)
        const px = s.x * W - (ptr.x > -900 ? (ptr.x - W / 2) * 0.012 * s.z : 0)
        const py = (((s.y * H - scrollY * 0.05 * s.z) % H) + H) % H
        x.globalAlpha = 0.25 + 0.6 * tw * (s.z / 1.9)
        x.fillStyle = s.z > 1.6 ? '#ffc98a' : '#e8ecf4'
        x.beginPath(); x.arc(px, py, s.z * 0.7, 0, 6.28); x.fill()
      }
      const fade = clamp(1 - scrollY / (H * 0.75))
      if (fade > 0) {
        const prog = still ? 1 : clamp(t / 2.4)
        x.lineWidth = 1
        EDGES.forEach(([a, b, dash], i) => {
          const k = clamp(prog * EDGES.length - i)
          if (!k) return
          const A = at(NODES[a]), B = at(NODES[b])
          const lit = hover === a || hover === b
          x.globalAlpha = fade * (lit ? 0.95 : 0.3)
          x.strokeStyle = lit ? '#ffc98a' : '#9db8ff'
          x.setLineDash(dash ? [4, 6] : [])
          x.beginPath(); x.moveTo(A.x, A.y); x.lineTo(A.x + (B.x - A.x) * k, A.y + (B.y - A.y) * k); x.stroke()
        })
        x.setLineDash([])
        NODES.forEach((n, i) => {
          const a = still ? 1 : clamp((t - i * 0.25) / 0.6)
          if (!a) return
          const p = at(n), on = hover === i
          const g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, on ? 26 : 16)
          g.addColorStop(0, on ? 'rgba(255,201,138,.8)' : 'rgba(157,184,255,.55)')
          g.addColorStop(1, 'rgba(157,184,255,0)')
          x.globalAlpha = fade * a
          x.fillStyle = g; x.beginPath(); x.arc(p.x, p.y, on ? 26 : 16, 0, 6.28); x.fill()
          x.fillStyle = on ? '#ffc98a' : '#fff'
          x.beginPath(); x.arc(p.x, p.y, on ? 3.6 : 2.6, 0, 6.28); x.fill()
          x.globalAlpha = fade * a * (on ? 1 : 0.6)
          x.fillStyle = '#e8ecf4'
          x.font = `${on ? 600 : 400} 13px 'Hanken Grotesk', sans-serif`
          x.fillText(n.id, p.x + 12, p.y + 4)
        })
      }
      x.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    resize()
    addEventListener('resize', resize)
    addEventListener('pointermove', move)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', move)
    }
  }, [])
  return <canvas id="sky" ref={ref} aria-hidden="true" />
}
