import { useEffect, useRef } from 'react'

// Coordinates describe connected stems in a fixed 240 × 500 drawing space.
const BRANCHES = [
  { base: [-15, 470], control: [54, 395], tip: [125, 311], size: 43, phase: .2 },
  { base: [-12, 380], control: [61, 325], tip: [147, 215], size: 49, phase: 1.7 },
  { base: [-12, 282], control: [39, 222], tip: [108, 131], size: 39, phase: 3.1 },
  { base: [-12, 220], control: [50, 162], tip: [151, 83], size: 34, phase: 4.5 },
]
const STRANDS = Array.from({ length: 27 }, (_, i) => ({ angle: i * Math.PI * 2 / 27, length: .76 + ((i * 17) % 11) / 45, phase: i * 1.73 }))
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export default function Flower() {
  const root = useRef(null)
  const canvas = useRef(null)
  useEffect(() => {
    const element = root.current, ctx = canvas.current.getContext('2d')
    if (!ctx) return undefined
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const fine = matchMedia('(hover: hover) and (pointer: fine)')
    const state = BRANCHES.map(() => ({ bend: 0, velocity: 0, tip: 0, tipVelocity: 0, gust: 0 }))
    let width = 0, height = 0, scale = 1, rect, frame = 0, previous = 0, time = 0, visible = false
    let pointerX = -10000, pointerY = -10000, pointerTime = 0

    const resize = () => {
      rect = element.getBoundingClientRect(); width = rect.width; height = rect.height
      const dpr = Math.min(devicePixelRatio || 1, 1.5)
      canvas.current.width = Math.round(width * dpr); canvas.current.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scale = Math.min(width / 240, height / 500)
      render(true)
    }
    const point = ([x, y]) => [x * scale, y * scale]
    const move = event => {
      if (!visible || reduced.matches || !fine.matches) return
      rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left, y = event.clientY - rect.top, now = performance.now()
      const dt = Math.max(16, now - pointerTime)
      const speed = pointerTime ? Math.min(1, Math.hypot(x - pointerX, y - pointerY) / dt / 1.5) : 0
      pointerX = x; pointerY = y; pointerTime = now
      BRANCHES.forEach((branch, i) => {
        const [bx, by] = point(branch.base), [cx, cy] = point(branch.control), [tx, ty] = point(branch.tip)
        const distance = Math.min(...[0, .25, .5, .75, 1].map(t => Math.hypot(x - ((1-t)**2*bx + 2*(1-t)*t*cx + t*t*tx), y - ((1-t)**2*by + 2*(1-t)*t*cy + t*t*ty))))
        const influence = clamp(1 - distance / (75 * scale), 0, 1)
        state[i].gust = clamp(state[i].gust + influence * speed * (event.movementX >= 0 ? 4 : -4), -7, 7)
      })
    }
    // Damped stem response precedes a slower, secondary tip response.
    const simulate = dt => {
      state.forEach((s, i) => {
        const p = BRANCHES[i].phase
        const wind = Math.sin(time * .55 + p) * 2.2 + Math.sin(time * .23 + p * 1.7) * 1.6
        s.gust *= Math.exp(-dt * 1.1)
        s.velocity += (wind + s.gust - s.bend) * 6 * dt
        s.velocity *= Math.exp(-3.8 * dt); s.bend += s.velocity * dt
        s.tipVelocity += (s.bend * 1.35 - s.tip) * 4 * dt
        s.tipVelocity *= Math.exp(-3 * dt); s.tip += s.tipVelocity * dt
      })
    }
    const render = still => {
      if (!width || !height) return
      ctx.clearRect(0, 0, width, height)
      const light = document.documentElement.dataset.theme === 'light'
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      BRANCHES.forEach((branch, i) => {
        const s = state[i], [bx, by] = point(branch.base), [cx, cy] = point(branch.control), [tx, ty] = point(branch.tip)
        const bend = (still ? 0 : s.bend) * scale, tip = (still ? 0 : s.tip) * scale
        const endX = tx + tip, endY = ty + bend * .2
        ctx.strokeStyle = light ? 'rgba(60,57,51,.40)' : 'rgba(200,207,208,.43)'
        ctx.lineWidth = Math.max(.55, .9 * scale)
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(cx + bend * .45, cy, endX, endY); ctx.stroke()
        // Fine side shoots remain attached to the main stem as it bends.
        const forkX = .25 * bx + .5 * (cx + bend * .45) + .25 * endX
        const forkY = .25 * by + .5 * cy + .25 * endY
        ctx.beginPath(); ctx.moveTo(forkX, forkY); ctx.quadraticCurveTo(forkX + 5 * scale + bend * .2, forkY - 22 * scale, forkX + 18 * scale + tip * .45, forkY - 38 * scale); ctx.stroke()
        STRANDS.forEach((strand, j) => {
          const flutter = still ? 0 : Math.sin(time * .9 + strand.phase + branch.phase) * .045 + s.tip * .003
          const a = strand.angle + flutter, length = branch.size * strand.length * scale * (1 + .1 * Math.sin(strand.phase + branch.phase))
          const ex = endX + Math.cos(a) * length, ey = endY + Math.sin(a) * length
          const mx = endX + Math.cos(a) * length * .65, my = endY + Math.sin(a) * length * .65
          ctx.strokeStyle = light ? 'rgba(66,62,56,.32)' : 'rgba(205,212,213,.34)'
          ctx.lineWidth = Math.max(.45, .58 * scale)
          ctx.beginPath(); ctx.moveTo(endX, endY); ctx.quadraticCurveTo(mx - Math.sin(a) * 2 * scale, my + Math.cos(a) * 2 * scale, ex, ey)
          const fork = 8 * scale
          ctx.moveTo(mx, my); ctx.lineTo(mx + Math.cos(a - .45) * fork, my + Math.sin(a - .45) * fork)
          ctx.moveTo(mx, my); ctx.lineTo(mx + Math.cos(a + .45) * fork, my + Math.sin(a + .45) * fork)
          ctx.moveTo(endX + (ex - endX) * .82, endY + (ey - endY) * .82); ctx.lineTo(ex + Math.cos(a + .55) * fork * .45, ey + Math.sin(a + .55) * fork * .45); ctx.stroke()
          if (j === (i * 7 + 3) % STRANDS.length) {
            const alpha = still ? .55 : .48 + .18 * Math.sin(time * .7 + i * 2)
            ctx.fillStyle = light ? `rgba(151,100,35,${alpha * .65})` : `rgba(235,193,107,${alpha})`
            ctx.shadowColor = light ? 'transparent' : 'rgba(237,184,83,.45)'; ctx.shadowBlur = light ? 0 : 5 * scale
            ctx.beginPath(); ctx.arc(ex, ey, Math.max(.8, 1.25 * scale), 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0
          }
        })
      })
    }
    const tick = now => {
      frame = 0
      if (!visible || document.hidden || reduced.matches) return
      const dt = previous ? Math.min((now - previous) / 1000, .05) : 0
      previous = now; time += dt; simulate(dt); render(false); frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      if (!visible || document.hidden || reduced.matches) { cancelAnimationFrame(frame); frame = 0; previous = 0; if (reduced.matches) render(true) }
      else if (!frame) frame = requestAnimationFrame(tick)
    }
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }) : null
    if (observer) observer.observe(element); else visible = true
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(element)
    const themeObserver = new MutationObserver(() => { if (reduced.matches) render(true) }); themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    resize(); sync()
    window.addEventListener('pointermove', move, { passive: true }); document.addEventListener('visibilitychange', sync); reduced.addEventListener('change', sync)
    return () => { observer?.disconnect(); resizeObserver.disconnect(); themeObserver.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync) }
  }, [])
  return <div className="flower" ref={root} aria-hidden="true"><canvas ref={canvas} /></div>
}
