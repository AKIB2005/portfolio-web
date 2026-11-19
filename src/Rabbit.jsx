import { useEffect, useRef, useState } from 'react'

export default function Rabbit() {
  const figure = useRef(null)
  const [enabled, setEnabled] = useState(() => { try { return localStorage.getItem('rabbit') !== 'off' } catch { return true } })
  useEffect(() => {
    const el = figure.current
    const fine = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0, x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0, seen = false, lastMove = 0, surprised = 0
    const tick = now => {
      frame = 0
      if (!enabled || !fine.matches || reduced.matches || document.hidden || !seen) { el.style.opacity = '0'; return }
      const dx = tx - x, dy = ty - y
      vx = (vx + dx * .018) * .86; vy = (vy + dy * .018) * .86
      x += vx; y += vy
      const speed = Math.hypot(vx, vy), distance = Math.hypot(dx, dy)
      const chasing = now - lastMove < 1000 || distance > 8
      const hop = chasing ? Math.abs(Math.sin(now / 115)) * Math.min(9, speed * 1.6) : 0
      const shell = document.querySelector('.shell').getBoundingClientRect()
      const safe = (x + 26 < shell.left || x - 26 > shell.right) && !(x > innerWidth - 140 && y > innerHeight - 85)
      el.style.opacity = safe ? '1' : '0'
      el.style.transform = `translate3d(${x - 22}px,${y - 32 - hop}px,0) rotate(${Math.max(-12, Math.min(12, vx * 1.8))}deg)`
      el.classList.toggle('chasing', chasing)
      el.classList.toggle('catching', distance < 30 && now - lastMove < 900)
      el.classList.toggle('surprised', now < surprised)
      if (chasing || speed > .1 || now < surprised) frame = requestAnimationFrame(tick)
    }
    const move = e => {
      if (!enabled || !fine.matches || reduced.matches) return
      if (seen && Math.hypot(e.clientX - tx, e.clientY - ty) > 110) surprised = performance.now() + 500
      tx = Math.max(24, Math.min(innerWidth - 24, e.clientX - 65)); ty = Math.max(36, Math.min(innerHeight - 24, e.clientY + 30))
      if (!seen) { x = tx; y = ty; seen = true }
      lastMove = performance.now()
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const pause = () => { if (document.hidden || reduced.matches || !fine.matches) { cancelAnimationFrame(frame); frame = 0; el.style.opacity = '0'; seen = false } }
    window.addEventListener('pointermove', move, { passive: true }); document.addEventListener('visibilitychange', pause); fine.addEventListener('change', pause); reduced.addEventListener('change', pause)
    return () => { cancelAnimationFrame(frame); el.style.opacity = '0'; window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', pause); fine.removeEventListener('change', pause); reduced.removeEventListener('change', pause) }
  }, [enabled])
  const toggle = () => setEnabled(value => { try { localStorage.setItem('rabbit', value ? 'off' : 'on') } catch {} return !value })
  return <><button className="rabbit-toggle" type="button" onClick={toggle} aria-pressed={enabled}>Rabbit {enabled ? 'on' : 'off'}</button><div className="rabbit" ref={figure} aria-hidden="true"><svg viewBox="0 0 48 60"><g className="rabbit-ears"><ellipse cx="17" cy="15" rx="5" ry="13"/><ellipse cx="31" cy="15" rx="5" ry="13"/></g><ellipse cx="24" cy="39" rx="16" ry="17"/><g className="rabbit-eyes"><circle cx="19" cy="36" r="1.5"/><circle cx="29" cy="36" r="1.5"/></g><path className="rabbit-mouth" d="M22 42q2 3 4 0"/><path className="rabbit-arms" d="M10 45q-5 2-3 6 M38 45q5 2 3 6"/></svg></div></>
}
