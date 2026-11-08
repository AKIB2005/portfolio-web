import { useEffect, useRef, useState } from 'react'
import Sky from './Sky'
import ContactForm from './ContactForm'
import { ICONS } from './Icons'
import { PROFILE, FACTS, FEATURED, STACK, STACK_ROW_1, STACK_ROW_2 } from './data'

const LINKS = [['#about', 'About'], ['#work', 'Work'], ['#stack', 'Stack'], ['#contact', 'Contact']]
const MARQUEE = ['MongoDB', 'Express', 'React', 'Node.js', 'TypeScript', 'Python', 'Flutter', 'Firebase', 'Flask', 'DSA', 'Agentic AI']
const LAT = [[1, 0], [0.8, 0.6], [0.8, -0.6]]
const motionOn = () => document.documentElement.dataset.motion !== 'off'

// Name letters slide up out of a mask, one by one.
function Name() {
  let n = 0
  return ['AKIB', 'SHAIKH'].map((word) => (
    <span key={word} className="ln">
      {[...word].map((ch) => { const i = n++; return <span key={i} className="ltr" style={{ '--i': i }} aria-hidden="true">{ch}</span> })}
    </span>
  ))
}

// Flat glass card with a light 3D tilt (transform only, rect cached on enter).
function Tilt({ className = '', children }) {
  const ref = useRef(null), rect = useRef(null)
  const enter = () => { rect.current = ref.current.getBoundingClientRect() }
  const move = (e) => {
    if (!rect.current || !motionOn() || innerWidth < 900) return
    const r = rect.current
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -5
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 5
    ref.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }
  const leave = () => { ref.current.style.transform = '' }
  return <article ref={ref} className={'proj ' + className} onPointerEnter={enter} onPointerMove={move} onPointerLeave={leave}>{children}</article>
}

const Head = ({ n, title }) => (
  <div className="sh r" data-r><span className="mono">{n}</span><h2>{title}</h2><i className="rule" /></div>
)

function Clock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 30000); return () => clearInterval(i) }, [])
  return <>{t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} IST</>
}

function StackSection() {
  const pinRef = useRef(null)
  const stageRef = useRef(null)
  const originalRefs = useRef([])
  const duplicateRefs = useRef([])
  const rowsRef = useRef([])
  const ghostRef = useRef(null)
  const coreRef = useRef(null)
  const shockRef = useRef(null)
  const counterRef = useRef(null)

  useEffect(() => {
    const pin = pinRef.current
    const stage = stageRef.current
    const ghost = ghostRef.current
    const core = coreRef.current
    const shock = shockRef.current
    const counter = counterRef.current
    if (!pin || !stage || !ghost || !core || !shock || !counter) return undefined

    let active = false
    let ticking = false
    let eligible = innerWidth >= 700
    let pinTop = 0
    let pinHeight = 0
    let viewportHeight = innerHeight
    let centers = []
    let lastP = -1
    let lastScrollY = scrollY
    let lastTime = performance.now()
    let decayFrame = 0
    let stopTimer = 0
    const tracks = rowsRef.current.map((row) => row?.querySelector('.stack-track'))
    const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)')
    const isMotionEnabled = () => motionOn() && !reduceQuery.matches && innerWidth >= 700
    const clamp = (n, min, max) => Math.min(max, Math.max(min, n))
    const easeOutCubic = (n) => 1 - ((1 - n) ** 3)
    const easeInCubic = (n) => n ** 3
    const easeInOutCubic = (n) => n < 0.5 ? 4 * n ** 3 : 1 - ((-2 * n + 2) ** 3) / 2
    const easeOutBack = (n) => {
      const c1 = 1.2
      const c3 = c1 + 1
      return 1 + c3 * (n - 1) ** 3 + c1 * (n - 1) ** 2
    }

    const measure = () => {
      originalRefs.current.forEach((el) => { el.style.transform = ''; el.style.opacity = ''; el.style.willChange = '' })
      duplicateRefs.current.forEach((el) => { el.style.opacity = '' })
      rowsRef.current.forEach((el) => el?.classList.remove('live'))
      const pinRect = pin.getBoundingClientRect()
      const stageRect = stage.getBoundingClientRect()
      pinTop = pinRect.top + scrollY
      pinHeight = pin.offsetHeight
      viewportHeight = innerHeight
      centers = originalRefs.current.map((el) => {
        const rect = el.getBoundingClientRect()
        return { dx: rect.left + rect.width / 2 - (stageRect.left + stageRect.width / 2), dy: rect.top + rect.height / 2 - (stageRect.top + stageRect.height / 2) }
      })
      lastP = -1
    }

    const reset = () => {
      originalRefs.current.forEach((el) => { el.style.transform = ''; el.style.opacity = ''; el.style.willChange = '' })
      duplicateRefs.current.forEach((el) => { el.style.opacity = '' })
      rowsRef.current.forEach((el) => el?.classList.remove('live'))
      ghost.style.transform = ''
      core.style.transform = ''
      core.style.opacity = ''
      shock.style.transform = ''
      shock.style.opacity = ''
      counter.textContent = ''
      lastP = -1
    }

    const decay = () => {
      decayFrame = 0
      let done = true
      tracks.forEach((track) => {
        if (!track) return
        const animation = track.getAnimations()[0]
        if (!animation) return
        const current = Number(animation.playbackRate) || 1
        const next = current + (1 - current) * 0.18
        animation.playbackRate = next
        if (Math.abs(next - 1) > 0.02) done = false
        else animation.playbackRate = 1
      })
      if (!done) decayFrame = requestAnimationFrame(decay)
    }

    const apply = (velocity) => {
      ticking = false
      if (!active || !eligible || !isMotionEnabled()) { reset(); return }
      const range = Math.max(1, pinHeight - viewportHeight)
      const p = clamp((scrollY - pinTop) / range, 0, 1)
      if (lastP >= 0 && Math.abs(p - lastP) < 0.0005) return
      lastP = p
      ghost.style.transform = `translateX(${(p - 0.5) * -12}vw)`
      if (p >= 0.8) {
        originalRefs.current.forEach((el) => { el.style.transform = ''; el.style.opacity = ''; el.style.willChange = '' })
        rowsRef.current.forEach((el) => el?.classList.add('live'))
        duplicateRefs.current.forEach((el) => { el.style.opacity = '' })
        counter.textContent = '22 / 22 technologies'
        const rate = 1 + clamp(Math.abs(velocity) / 30, 0, 5)
        tracks.forEach((track) => {
          const animation = track?.getAnimations()[0]
          if (animation) animation.playbackRate = rate
        })
        if (decayFrame) cancelAnimationFrame(decayFrame)
        if (Math.abs(velocity) < 0.02) decayFrame = requestAnimationFrame(decay)
        return
      }
      rowsRef.current.forEach((el) => el?.classList.remove('live'))
      const orbit = clamp(p / 0.25, 0, 1)
      const compress = clamp((p - 0.25) / 0.13, 0, 1)
      const supernova = clamp((p - 0.38) / 0.14, 0, 1)
      const coreOpacity = p < 0.42 ? clamp((p - 0.2) / 0.15, 0, 1) : 1 - clamp((p - 0.42) / 0.1, 0, 1)
      core.style.opacity = String(coreOpacity)
      core.style.transform = `translate(-50%,-50%) scale(${0.6 + 1.2 * coreOpacity})`
      shock.style.transform = `translate(-50%,-50%) scale(${0.1 + supernova * 4.2})`
      shock.style.opacity = String((1 - supernova) * 0.9)
      const radius = Math.min(innerWidth * (innerWidth < 900 ? 0.32 : 0.34), innerWidth < 900 ? 150 : 300)
      const compressedRadius = radius * (1 - 0.88 * easeInCubic(compress))
      const radiusA = radius * (0.55 + 0.45 * easeOutCubic(clamp(p / 0.2, 0, 1)))
      const sphereRadius = p < 0.25 ? radiusA : compressedRadius
      const finalAngle = orbit * Math.PI * 4 + compress * compress * Math.PI * 2
      let burstCount = 0
      originalRefs.current.forEach((el, i) => {
        const y0 = 1 - (i / 21) * 2
        const sphereRadius = Math.sqrt(1 - y0 * y0)
        const theta = i * 2.399963
        const x0 = Math.cos(theta) * sphereRadius
        const z0 = Math.sin(theta) * sphereRadius
        const xSphere = x0 * Math.cos(finalAngle) + z0 * Math.sin(finalAngle)
        const zSphere = -x0 * Math.sin(finalAngle) + z0 * Math.cos(finalAngle)
        const sx = xSphere * sphereRadius * (p < 0.25 ? radiusA : 0.12 * radius)
        const sy = y0 * (p < 0.25 ? radiusA : 0.12 * radius) * 0.9
        const sz = zSphere * (p < 0.25 ? radiusA : 0.12 * radius)
        const depth = (zSphere + 1) / 2
        const sphereOpacity = (0.3 + 0.7 * depth) * clamp(p / 0.08, 0, 1)
        const sphereScale = 0.75 + 0.25 * depth
        const u = clamp(((p - 0.38) / 0.4 - (i / 22) * 0.18) / 0.82, 0, 1)
        const e = easeOutBack(u)
        const speed = Math.sin(Math.PI * u)
        const side = i < STACK_ROW_1.length ? -1 : 1
        const center = centers[i] || { dx: 0, dy: 0 }
        const x = p < 0.38 ? sx - center.dx : (sx - center.dx) * (1 - e)
        const y = p < 0.38 ? sy - center.dy : (sy - center.dy) * (1 - e) - side * speed * (110 + (i % 5) * 16)
        const z = p < 0.38 ? sz : sz * (1 - e)
        const scaleX = p < 0.38 ? sphereScale : (0.75 + 0.25 * e) * (1 + 0.5 * speed)
        const scaleY = p < 0.38 ? sphereScale : (0.75 + 0.25 * e) * (1 - 0.12 * speed)
        el.style.transform = `translate3d(${x}px,${y}px,${z}px) scale(${scaleX},${scaleY})`
        el.style.opacity = String(p < 0.38 ? sphereOpacity : sphereOpacity + (1 - sphereOpacity) * e)
        el.style.willChange = p > 0 && p < 0.8 ? 'transform' : ''
        if (u >= 1) burstCount += 1
      })
      const count = Math.min(22, burstCount)
      if (counter.textContent !== `${String(count).padStart(2, '0')} / 22 technologies`) counter.textContent = `${String(count).padStart(2, '0')} / 22 technologies`
    }
    const onScroll = () => {
      const now = performance.now()
      const velocity = (scrollY - lastScrollY) / Math.max(16, now - lastTime) * 16
      lastScrollY = scrollY
      lastTime = now
      clearTimeout(stopTimer)
      stopTimer = window.setTimeout(() => {
        if (active && lastP >= 0.8 && !decayFrame) decayFrame = requestAnimationFrame(decay)
      }, 100)
      if (!ticking) { ticking = true; requestAnimationFrame(() => apply(velocity)) }
    }
    const setActive = (next) => {
      active = next
      if (active) {
        measure()
        addEventListener('scroll', onScroll, { passive: true })
        onScroll()
      } else {
        removeEventListener('scroll', onScroll)
        reset()
      }
    }
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '20% 0px' })
    const ro = new ResizeObserver(() => { eligible = innerWidth >= 700; measure(); if (!eligible) reset(); else if (active) onScroll() })
    const onMotionChange = () => { if (!isMotionEnabled()) reset(); else if (active) onScroll() }
    io.observe(pin)
    ro.observe(pin)
    ro.observe(stage)
    reduceQuery.addEventListener?.('change', onMotionChange)
    const observer = new MutationObserver(onMotionChange)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] })
    measure()
    if (!isMotionEnabled()) reset()
    return () => {
      io.disconnect()
      ro.disconnect()
      observer.disconnect()
      reduceQuery.removeEventListener?.('change', onMotionChange)
      removeEventListener('scroll', onScroll)
      if (decayFrame) cancelAnimationFrame(decayFrame)
      clearTimeout(stopTimer)
    }
  }, [])

  const renderRow = (items, rowIndex) => (
    <div ref={(el) => { rowsRef.current[rowIndex] = el }} className="stack-row">
      <div className="stack-track">
        {items.map((tag, i) => <span ref={(el) => { originalRefs.current[rowIndex ? STACK_ROW_1.length + i : i] = el }} key={`original-${tag}`} className="stack-tag mono">{tag}</span>)}
        {items.map((tag, i) => <span ref={(el) => { duplicateRefs.current[rowIndex ? STACK_ROW_1.length + i : i] = el }} key={`duplicate-${tag}`} className="stack-tag duplicate mono" aria-hidden="true">{tag}</span>)}
      </div>
    </div>
  )

  return (
    <>
      <section id="stack" ref={pinRef} className="stack-pin">
        <div ref={stageRef} className="stack-stage wrap">
          <div ref={ghostRef} className="stack-ghost" aria-hidden="true">STACK</div>
          <div ref={coreRef} className="stack-core" aria-hidden="true" />
          <div ref={shockRef} className="stack-shock" aria-hidden="true" />
          <Head n="03" title="Stack" />
          <p ref={counterRef} className="stack-counter mono">00 / 22 technologies</p>
          <div className="stack-rows">
            {renderRow(STACK_ROW_1, 0)}
            {renderRow(STACK_ROW_2, 1)}
          </div>
          <ul className="visually-hidden">{[...STACK_ROW_1, ...STACK_ROW_2].map((tag) => <li key={tag}>{tag}</li>)}</ul>
        </div>
      </section>
      <div className="stack-static wrap">
        <div className="cols">
          {STACK.map(([group, items], i) => (
            <div key={group} className="r" data-r style={{ '--d': i }}>
              <h4 className="mono sub">{group}</h4>
              <div className="chips">{items.map((tag) => <span key={tag} className="tagx mono">{tag}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default function App() {
  const [off, setOff] = useState(() => {
    try { return matchMedia('(prefers-reduced-motion: reduce)').matches || localStorage.getItem('motion') === 'off' } catch { return false }
  })
  const [boot, setBoot] = useState(true)
  const [out, setOut] = useState(false)

  useEffect(() => { document.documentElement.dataset.motion = off ? 'off' : 'on' }, [off])
  const toggle = () => setOff((v) => { try { localStorage.setItem('motion', v ? 'on' : 'off') } catch {} return !v })

  useEffect(() => {
    const r = document.documentElement
    if (off) { r.classList.add('ready'); setBoot(false); return }
    const a = setTimeout(() => { r.classList.add('ready'); setOut(true) }, 1200)
    const b = setTimeout(() => setBoot(false), 1900)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])

  useEffect(() => {
    const q = (s) => document.querySelector(s)
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.15 })
    document.querySelectorAll('.r').forEach((el) => io.observe(el))
    const links = [...document.querySelectorAll('.nav a[href^="#"]')]
    const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((l) => l.classList.toggle('on', l.hash === '#' + e.target.id)) }), { rootMargin: '-45% 0px -50% 0px' })
    document.querySelectorAll('section[id]').forEach((s) => so.observe(s))

    // Scroll: one rAF-throttled handler that writes straight to three elements (no CSS variables).
    const prog = q('.prog'), par = q('.par'), hero = q('.hero .wrap')
    let ticking = false
    const apply = () => {
      ticking = false
      const y = scrollY, h = document.documentElement.scrollHeight - innerHeight
      prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`
      if (y < innerHeight * 1.3 && motionOn()) {
        par.style.transform = `translate3d(0,${y * 0.2}px,0)`
        hero.style.opacity = Math.max(0, 1 - y / (innerHeight * 0.75))
        hero.style.transform = `translate3d(0,${-y * 0.08}px,0)`
      }
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply) } }

    // Globe tilt follows the pointer; the loop stops itself once it settles.
    const sway = q('.sway'); const t = { x: 0, y: 0, cx: 0, cy: 0, run: false }
    const tilt = () => {
      t.cx += (t.x - t.cx) * 0.08; t.cy += (t.y - t.cy) * 0.08
      sway.style.transform = `rotateX(${t.cy}deg) rotateY(${t.cx}deg)`
      if (Math.abs(t.x - t.cx) + Math.abs(t.y - t.cy) > 0.02) requestAnimationFrame(tilt); else t.run = false
    }
    let mag = null
    const onMove = (e) => {
      if (!motionOn()) return
      if (scrollY < innerHeight) {
        t.x = (e.clientX / innerWidth - 0.5) * 16; t.y = (e.clientY / innerHeight - 0.5) * -10
        if (!t.run) { t.run = true; requestAnimationFrame(tilt) }
      }
      const el = e.target.closest?.('.mag')
      if (mag && mag !== el) mag.style.transform = ''
      mag = el || null
      if (el) {
        const r = el.getBoundingClientRect()
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`
      }
    }
    addEventListener('pointermove', onMove, { passive: true })
    addEventListener('scroll', onScroll, { passive: true })
    apply()
    return () => { io.disconnect(); so.disconnect(); removeEventListener('pointermove', onMove); removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <>
      <a className="skip-link mono" href="#about">Skip to content</a>
      <div className="gridbg" aria-hidden="true" />
      <Sky />
      <div className="prog" aria-hidden="true" />
      {boot && <div className={'boot' + (out ? ' out' : '')} aria-hidden="true"><div><b className="mono">AKIB SHAIKH</b><i /></div></div>}

      <button className="motion" onClick={toggle} aria-pressed={!off} aria-label={off ? 'Turn motion on' : 'Turn motion off'} title={off ? 'Motion off' : 'Motion on'}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">{off ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}</svg>
      </button>

      <nav className="nav" aria-label="Main">
        <a href="#top" className="logo mono">AS<span>/</span>2026</a>
        <div className="links">
          {LINKS.map(([h, t]) => <a key={h} href={h} className="mono"><span className="roll"><i>{t}</i><i aria-hidden="true">{t}</i></span></a>)}
        </div>
      </nav>

      <header id="top" className="hero">
        <div className="scene" aria-hidden="true">
          <div className="par"><div className="sway">
            <div className="globe">
              {[0, 1, 2, 3].map((n) => <i key={n} className="m" style={{ '--i': n }} />)}
              {LAT.map(([w, z], n) => <i key={n} className="l" style={{ '--w': w, '--z': z }} />)}
            </div>
            <div className="orbit"><b /></div>
          </div></div>
        </div>
        <div className="wrap">
          <p className="mono over">Portfolio / 2026<i className="caret" /></p>
          <h1 aria-label="Akib Shaikh"><Name /></h1>
          <p className="mono role">Full stack developer <span>/</span> Agentic AI</p>
          <p className="lede">I build web apps with the MERN stack and I’m working toward AI agents that act. Open to internships and open-source work.</p>
          <div className="row">
            <a className="btn mag" href="#work">View my work</a>
            <a className="btn ghost mag" href="#contact">Contact me</a>
          </div>
        </div>
        <p className="mono scroll" aria-hidden="true">Scroll<i /></p>
      </header>

      <div className="marquee" aria-hidden="true">
        <div className="track">{[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((s, i) => <span key={i} className="mono">{s}<em>/</em></span>)}</div>
      </div>

      <main>
        <section id="about" className="wrap">
          <Head n="01" title="About" />
          <div className="about">
            <div>
              <p className="big r" data-r>I build web apps with the MERN stack, and I’m learning to build agents that act.</p>
              <p className="muted r" data-r style={{ '--d': 1 }}>I started with the web and kept going deeper: React on the front, Node, Express and MongoDB behind it. I practise DSA so the code I write holds up.</p>
            </div>
            <dl>
              {FACTS.map(([k, v, href], i) => (
                <div key={k} className="r" data-r style={{ '--d': i }}><dt className="mono">{k}</dt><dd>{href ? <a href={href} target="_blank" rel="noopener noreferrer">{v}</a> : v}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        <section id="work" className="wrap">
          <Head n="02" title="Work" />
          {FEATURED.map((p, i) => (
            <div key={p.title} className="r" data-r>
              <Tilt className={i % 2 ? 'flip' : ''}>
                <div>
                  <span className="chip mono">{p.status}</span>
                  <h3>{p.title}</h3>
                  <p className="muted">{p.text}</p>
                  <ul className="points">{p.points.map((t) => <li key={t}>{t}</li>)}</ul>
                  <div className="row">
                    <a className="btn mag" href={p.live} target="_blank" rel="noopener noreferrer">Open live site</a>
                    <a className="btn ghost mag" href={p.source} target="_blank" rel="noopener noreferrer">View source</a>
                  </div>
                </div>
                {p.kind === 'spam' ? (
                  <div className="mock" aria-hidden="true">
                    <span className="beam" />
                    <p>Subject: You’ve <mark style={{ '--t': 0.6 }}>won</mark> a <mark style={{ '--t': 0.75 }}>free</mark> prize</p>
                    <p>Hi team, notes from today’s meeting are attached.</p>
                    <p><mark style={{ '--t': 2.7 }}>Claim</mark> your reward <mark style={{ '--t': 2.85 }}>now</mark>, limited offer</p>
                    <small className="mono">Illustration: words that push a score toward spam</small>
                  </div>
                ) : (
                  <div className="mock" aria-hidden="true">
                    {[['Merit scholarship', 'Strong match', 0.92], ['Need-based grant', 'Possible match', 0.62], ['Field-specific award', 'Check criteria', 0.36]].map(([n, l, w], j) => (
                      <div key={n} className="gr"><div className="gt"><span>{n}</span><em className="mono">{l}</em></div><div className="bar"><i style={{ '--w': w, '--j': j }} /></div></div>
                    ))}
                    <small className="mono">Illustration: matches ranked by eligibility</small>
                  </div>
                )}
              </Tilt>
            </div>
          ))}
        </section>

        <StackSection />

        <section id="contact" className="wrap">
          <Head n="04" title="Contact" />
          <div className="contact-grid">
            <div>
              <p className="big r" data-r>Open to collaborations, open-source work and internships.</p>
              <a className="mail r" data-r href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              <ul className="socials r" data-r>
                {[['GitHub', PROFILE.github], ['LinkedIn', PROFILE.linkedin], ['X', PROFILE.x], ['Instagram', PROFILE.instagram]].map(([t, h]) => {
                  const Icon = ICONS[t]
                  return (
                    <li key={t}>
                      <a className="mono" href={h} target="_blank" rel="noopener noreferrer" aria-label={`${t} (opens in a new tab)`}><Icon />{t}<span aria-hidden="true">↗</span></a>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="r" data-r style={{ '--d': 1 }}>
              <p className="mono sub">Or send a message</p>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <div className="bigname r" data-r aria-hidden="true">AKIB SHAIKH</div>
      <footer className="wrap mono"><span>© 2026 {PROFILE.name}</span><span><Clock /></span></footer>
    </>
  )
}
