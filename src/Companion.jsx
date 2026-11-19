import { useEffect, useRef } from 'react'

export default function Companion() {
  const figure = useRef(null)
  useEffect(() => {
    const el = figure.current
    const fine = matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0, x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0, seen = false, last = 0
    const tick = now => {
      frame = 0
      if (!fine.matches || reduced.matches || document.hidden || !seen) { el.style.opacity = '0'; last = 0; return }
      const step = last ? Math.min((now - last) / 16.67, 2) : 1
      last = now
      // The original rabbit's spring and damping, adjusted for frame duration.
      vx += (tx - x) * .018 * step; vy += (ty - y) * .018 * step
      vx *= Math.pow(.86, step); vy *= Math.pow(.86, step)
      x = Math.max(22, Math.min(innerWidth - 22, x + vx * step))
      y = Math.max(22, Math.min(innerHeight - 22, y + vy * step))
      const speed = Math.hypot(vx, vy), distance = Math.hypot(tx - x, ty - y)
      el.style.opacity = '1'
      el.style.transform = `translate3d(${x - 22}px,${y - 22}px,0) rotate(${Math.max(-10, Math.min(10, vx * 1.5))}deg)`
      if (distance > .25 || speed > .05) frame = requestAnimationFrame(tick)
      else { el.style.transform = `translate3d(${tx - 22}px,${ty - 22}px,0)`; x = tx; y = ty; vx = vy = 0; last = 0 }
    }
    const move = event => {
      if (!fine.matches || reduced.matches || document.hidden) return
      tx = Math.max(22, Math.min(innerWidth - 22, event.clientX - 46))
      ty = Math.max(22, Math.min(innerHeight - 22, event.clientY + 30))
      if (!seen) { x = tx; y = ty; seen = true }
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const stop = () => { if (document.hidden || reduced.matches || !fine.matches) { cancelAnimationFrame(frame); frame = 0; last = 0; seen = false; vx = vy = 0; el.style.opacity = '0' } }
    const resize = () => { tx = Math.max(22, Math.min(innerWidth - 22, tx)); ty = Math.max(22, Math.min(innerHeight - 22, ty)); if (seen && !frame) frame = requestAnimationFrame(tick) }
    window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('resize', resize); document.addEventListener('visibilitychange', stop); fine.addEventListener('change', stop); reduced.addEventListener('change', stop)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', stop); fine.removeEventListener('change', stop); reduced.removeEventListener('change', stop) }
  }, [])
  return <div className="cursor-robot" ref={figure} aria-hidden="true"><svg viewBox="0 0 64 64" focusable="false">
    <path fill="#24456d" stroke="#7290a9" strokeWidth="1.2" d="M16 23 12 9l8 4 4-7h16l4 7 8-4-4 14 3 7-3 20-8 8H24l-8-8-3-20Z"/>
    <path fill="#325b87" d="m18 16 7-5h14l7 5-4 12H22Z"/><path fill="#172e4c" d="M28 9h8l2 13-6 4-6-4Z"/>
    <path fill="#a5b2bd" stroke="#d4dce2" strokeWidth=".8" d="m20 34 12-5 12 5-2 14-10 7-10-7Z"/>
    <path fill="#d4dde3" d="m24 36 8-3 8 3-1 9-7 5-7-5Z"/><path fill="none" stroke="#697d8b" strokeWidth="1" d="m26 39 6 2 6-2M27 44h10M32 33v7"/>
    <g className="cursor-robot-eyes" fill="#9de9ef"><path d="m20 27 10 2-1 3-8-1Z"/><path d="m44 27-10 2 1 3 8-1Z"/></g>
    <path fill="none" stroke="#90a8ba" strokeWidth="1" d="m15 23 5 2M49 23l-5 2M17 38l3 1M47 38l-3 1"/>
  </svg></div>
}
