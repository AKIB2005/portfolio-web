import { useEffect, useRef } from 'react'

// Full-page starfield: twinkling stars, cursor parallax, an occasional shooting star.
export default function Sky() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let W, H, stars, raf, px = 0, shoot = null

    const resize = () => {
      W = innerWidth; H = innerHeight
      c.width = W * dpr; c.height = H * dpr
      c.style.width = W + 'px'; c.style.height = H + 'px'
      x.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: Math.round((W * H) / 5500) }, () => ({
        x: Math.random(), y: Math.random(), z: Math.random() * 1.6 + 0.3, p: Math.random() * 6.28,
      }))
    }
    const move = (e) => { px = e.clientX - W / 2 }

    const frame = (now) => {
      x.clearRect(0, 0, W, H)
      for (const s of stars) {
        const tw = still ? 1 : 0.55 + 0.45 * Math.sin(now / 900 + s.p)
        const sx = s.x * W - px * 0.012 * s.z
        const sy = (((s.y * H - scrollY * 0.05 * s.z) % H) + H) % H
        x.globalAlpha = 0.25 + 0.6 * tw * (s.z / 1.9)
        x.fillStyle = s.z > 1.6 ? '#ffc98a' : '#e8ecf4'
        x.beginPath(); x.arc(sx, sy, s.z * 0.7, 0, 6.28); x.fill()
      }
      if (!still) {
        if (!shoot && Math.random() < 0.003) shoot = { x: Math.random() * W, y: Math.random() * H * 0.4, l: 0 }
        if (shoot) {
          shoot.x += 9; shoot.y += 4; shoot.l++
          x.globalAlpha = 1 - shoot.l / 50
          x.strokeStyle = '#fff'; x.lineWidth = 1.5
          x.beginPath(); x.moveTo(shoot.x, shoot.y); x.lineTo(shoot.x - 60, shoot.y - 27); x.stroke()
          if (shoot.l > 50) shoot = null
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
