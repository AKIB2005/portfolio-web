import { useEffect, useRef, useState } from 'react'

function RobotHead() {
  return <svg className="companion-head" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <path fill="#24456d" stroke="#7290a9" strokeWidth="1.2" d="M16 23 12 9l8 4 4-7h16l4 7 8-4-4 14 3 7-3 20-8 8H24l-8-8-3-20Z"/>
    <path fill="#325b87" d="m18 16 7-5h14l7 5-4 12H22Z"/><path fill="#172e4c" d="M28 9h8l2 13-6 4-6-4Z"/>
    <path fill="#a5b2bd" stroke="#d4dce2" strokeWidth=".8" d="m20 34 12-5 12 5-2 14-10 7-10-7Z"/>
    <path fill="#d4dde3" d="m24 36 8-3 8 3-1 9-7 5-7-5Z"/><path fill="none" stroke="#697d8b" strokeWidth="1" d="m26 39 6 2 6-2M27 44h10M32 33v7"/>
    <g className="companion-eyes" fill="#9de9ef"><path d="m20 27 10 2-1 3-8-1Z"/><path d="m44 27-10 2 1 3 8-1Z"/></g>
    <path fill="none" stroke="#90a8ba" strokeWidth="1" d="m15 23 5 2M49 23l-5 2M17 38l3 1M47 38l-3 1"/>
  </svg>
}

export default function Companion({ activeProject, projectHover }) {
  const [open, setOpen] = useState(false)
  const [acknowledge, setAcknowledge] = useState(false)
  const launcher = useRef(null), head = useRef(null), panel = useRef(null), lastProject = useRef(activeProject)

  useEffect(() => {
    if (lastProject.current === activeProject) return undefined
    lastProject.current = activeProject; setAcknowledge(true)
    const timer = setTimeout(() => setAcknowledge(false), 650)
    return () => clearTimeout(timer)
  }, [activeProject])
  useEffect(() => {
    if (!open) return undefined
    panel.current?.querySelector('.companion-close')?.focus()
    const key = event => { if (event.key === 'Escape') { event.preventDefault(); setOpen(false); launcher.current?.focus() } }
    const outside = event => { if (!panel.current?.contains(event.target) && !launcher.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('keydown', key); document.addEventListener('pointerdown', outside)
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside) }
  }, [open])
  useEffect(() => {
    let frame = 0
    const check = () => {
      frame = 0
      const button = launcher.current, rect = button.getBoundingClientRect()
      const blocked = !open && [...document.querySelectorAll('main a, main button, main input, main textarea, main summary, .site-footer a')].some(el => {
        const r = el.getBoundingClientRect()
        return r.width && r.height && r.left < rect.right && r.right > rect.left && r.top < rect.bottom && r.bottom > rect.top
      })
      button.classList.toggle('is-obscuring', Boolean(blocked) && document.activeElement !== button)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(check) }
    schedule(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [open])
  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0, x = 0, y = 0, targetX = 0, targetY = 0
    const update = () => {
      raf = 0
      x += (targetX - x) * .12; y += (targetY - y) * .12
      head.current?.style.setProperty('--look-x', `${x.toFixed(2)}deg`)
      head.current?.style.setProperty('--look-y', `${y.toFixed(2)}deg`)
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > .03) raf = requestAnimationFrame(update)
    }
    const move = event => {
      if (!fine.matches || reduced.matches || document.hidden) return
      const rect = launcher.current.getBoundingClientRect()
      targetX = Math.max(-6, Math.min(6, (event.clientX - rect.left - rect.width / 2) / innerWidth * 12))
      targetY = Math.max(-4, Math.min(4, (event.clientY - rect.top - rect.height / 2) / innerHeight * 8))
      if (!raf) raf = requestAnimationFrame(update)
    }
    const stop = () => { if (document.hidden || reduced.matches || !fine.matches) { cancelAnimationFrame(raf); raf = 0; x = y = targetX = targetY = 0; head.current?.style.removeProperty('--look-x'); head.current?.style.removeProperty('--look-y') } }
    window.addEventListener('pointermove', move, { passive: true }); document.addEventListener('visibilitychange', stop); reduced.addEventListener('change', stop); fine.addEventListener('change', stop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', stop); reduced.removeEventListener('change', stop); fine.removeEventListener('change', stop) }
  }, [])

  return <div className={`companion${projectHover ? ' is-interested' : ''}${acknowledge ? ' is-acknowledging' : ''}`}>
    {open && <div className="companion-panel" id="companion-panel" ref={panel} role="region" aria-label="Portfolio navigation assistant"><div className="companion-header"><div className="companion-avatar"><RobotHead /></div><div><strong>Navigation companion</strong><span>Ready to help</span></div><button type="button" className="companion-close" aria-label="Close companion" onClick={() => { setOpen(false); launcher.current?.focus() }}>×</button></div><p>Hi! Where would you like to go?</p><nav aria-label="Companion navigation">{[['Explore projects', '#work'], ['About Akib', '#about'], ['View resume', '#resume'], ['Contact', '#contact']].map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}</nav></div>}
    <button ref={launcher} className="companion-launcher" type="button" aria-label={open ? 'Close navigation companion' : 'Open navigation companion'} aria-expanded={open} aria-controls={open ? 'companion-panel' : undefined} onClick={() => setOpen(value => !value)}><span className="companion-head-motion" ref={head}><RobotHead /></span></button>
  </div>
}
