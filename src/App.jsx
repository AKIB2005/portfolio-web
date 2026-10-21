import { useEffect, useRef, useState } from 'react'
import Sky from './Sky'
import { PROFILE, FACTS, PROJECTS } from './data'

const STACK = ['MongoDB', 'Express', 'React', 'Node.js', 'JavaScript', 'DSA', 'Git', 'Agentic AI']
const LAT = [[1, 0], [0.82, 0.57], [0.82, -0.57], [0.47, 0.88], [0.47, -0.88]]
const LINKS = [['#top', 'Home'], ['#about', 'About'], ['#projects', 'Project'], ['#contact', 'Contact']]

// Headline words that slide up out of a mask.
const Words = ({ t }) => t.split(' ').map((w, i) => (
  <span key={i}><span className="wm"><span style={{ '--i': i }}>{w}</span></span>{' '}</span>
))
// Headline letters that fall into place, then catch a travelling glint.
const Letters = ({ t }) => {
  let n = 0
  return t.split(' ').map((w, wi) => (
    <span key={wi} className="w">
      {[...w].map((ch) => { const i = n++; return <span key={i} className="ltr" style={{ '--i': i }} aria-hidden="true">{ch}</span> })}{' '}
    </span>
  ))
}

// 3D tilt that follows the pointer. Used on cards only.
function Tilt({ className = '', children }) {
  const ref = useRef(null)
  const ok = () => matchMedia('(hover:hover) and (min-width:768px)').matches && document.documentElement.dataset.motion !== 'off'
  const move = (e) => {
    if (!ok()) return
    const el = ref.current, r = el.getBoundingClientRect()
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -10
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 10
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`
  }
  const leave = () => { ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)' }
  return <article ref={ref} className={'glass card edge ' + className} onPointerMove={move} onPointerLeave={leave}>{children}</article>
}

function Clock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 30000); return () => clearInterval(i) }, [])
  return <>{t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} in Solapur</>
}

export default function App() {
  const [off, setOff] = useState(() => {
    try { return matchMedia('(prefers-reduced-motion: reduce)').matches || localStorage.getItem('motion') === 'off' } catch { return false }
  })
  const [boot, setBoot] = useState(true)
  const [out, setOut] = useState(false)

  useEffect(() => { document.documentElement.dataset.motion = off ? 'off' : 'on' }, [off])
  const toggle = () => setOff((v) => { try { localStorage.setItem('motion', v ? 'on' : 'off') } catch {} return !v })

  // Launch sequence: warp-speed stars, then the hero assembles.
  useEffect(() => {
    const r = document.documentElement
    if (off) { r.classList.add('ready'); setBoot(false); return }
    const a = setTimeout(() => { r.classList.add('ready'); setOut(true) }, 1500)
    const b = setTimeout(() => setBoot(false), 2300)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const q = (s) => document.querySelector(s)
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.2 })
    document.querySelectorAll('[data-r]').forEach((el) => io.observe(el))
    const links = [...document.querySelectorAll('.nav a')]
    const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((l) => l.classList.toggle('on', l.hash === '#' + e.target.id)) }), { rootMargin: '-45% 0px -50% 0px' })
    document.querySelectorAll('header[id],section[id]').forEach((s) => so.observe(s))

    const m = { x: -100, y: -100, cx: -100, cy: -100, tx: 0, ty: 0, rx: 0, ry: 0 }
    const onMove = (e) => {
      m.x = e.clientX; m.y = e.clientY
      m.tx = e.clientX / innerWidth - 0.5; m.ty = e.clientY / innerHeight - 0.5
      document.body.classList.toggle('hot', !!e.target.closest?.('a,button,.card'))
      if (root.dataset.motion === 'off') return
      document.querySelectorAll('.mag').forEach((el) => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2)
        el.style.transform = Math.hypot(dx, dy) < r.width / 2 + 70 ? `translate(${dx * 0.25}px,${dy * 0.35}px)` : ''
      })
    }
    const onScroll = () => {
      const h = root.scrollHeight - innerHeight
      root.style.setProperty('--sp', h > 0 ? (scrollY / h).toFixed(4) : 0)
      root.style.setProperty('--sy', Math.round(scrollY))
    }
    let raf
    const loop = () => {
      m.cx += (m.x - m.cx) * 0.18; m.cy += (m.y - m.cy) * 0.18
      m.rx += (m.ty * -12 - m.rx) * 0.06; m.ry += (m.tx * 18 - m.ry) * 0.06
      const ring = q('.cur-ring'), dot = q('.cur-dot'), sw = q('.sway')
      if (ring) ring.style.transform = `translate(${m.cx}px,${m.cy}px)`
      if (dot) dot.style.transform = `translate(${m.x}px,${m.y}px)`
      if (sw) sw.style.transform = root.dataset.motion === 'off' ? '' : `rotateX(${m.rx}deg) rotateY(${m.ry}deg)`
      raf = requestAnimationFrame(loop)
    }
    addEventListener('pointermove', onMove)
    addEventListener('scroll', onScroll, { passive: true })
    onScroll(); raf = requestAnimationFrame(loop)
    return () => { io.disconnect(); so.disconnect(); cancelAnimationFrame(raf); removeEventListener('pointermove', onMove); removeEventListener('scroll', onScroll) }
  }, [])

  // Light that follows the pointer across any glass surface.
  useEffect(() => {
    const m = (e) => {
      const g = e.target.closest?.('.glass')
      if (!g) return
      const r = g.getBoundingClientRect()
      g.style.setProperty('--mx', e.clientX - r.left + 'px')
      g.style.setProperty('--my', e.clientY - r.top + 'px')
    }
    addEventListener('pointermove', m)
    return () => removeEventListener('pointermove', m)
  }, [])

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="lens" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="4" result="n" />
          <feGaussianBlur in="n" stdDeviation="3" result="b" />
          <feDisplacementMap in="SourceGraphic" in2="b" scale="38" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="aurora" aria-hidden="true" />
      <Sky />
      <div className="prog" aria-hidden="true" />
      <div className="cur-ring" aria-hidden="true" /><div className="cur-dot" aria-hidden="true" />
      {boot && <div className={'boot' + (out ? ' out' : '')} aria-hidden="true"><div><b>AKIB SHAIKH</b><i /></div></div>}

      <button className="glass motion" onClick={toggle} aria-pressed={!off} aria-label={off ? 'Turn motion on' : 'Turn motion off'} title={off ? 'Motion off' : 'Motion on'}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">{off ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}</svg>
      </button>

      <nav className="glass nav" aria-label="Main">
        {LINKS.map(([h, t]) => (
          <a key={h} href={h}><span className="roll"><i>{t}</i><i aria-hidden="true">{t}</i></span></a>
        ))}
      </nav>

      <header id="top" className="hero">
        <div className="scene" aria-hidden="true">
          <div className="sway">
            <div className="globe">
              {[0, 1, 2, 3, 4, 5].map((n) => <i key={n} className="m" style={{ '--i': n }} />)}
              {LAT.map(([w, z], n) => <i key={n} className="l" style={{ '--w': w, '--z': z }} />)}
              <i className="core" />
            </div>
            <div className="orbit"><b /></div>
            <div className="orbit b"><b /></div>
          </div>
        </div>
        <div className="wrap">
          <p className="kicker">T.Y. Computer Science Engineering</p>
          <h1 aria-label="Full Stack Developer"><Letters t="Full Stack Developer" /></h1>
          <p className="plate glass edge">AKIB SHAIKH</p>
          <p className="lede">Building web apps with the MERN stack and working toward AI agents. <span>Open to internships and open-source work.</span></p>
          <div className="row">
            <a className="btn mag" href="#projects">View my work</a>
            <a className="btn ghost mag" href="#contact">Contact me</a>
          </div>
        </div>
        <div className="limb" aria-hidden="true" />
        <div className="scroll" aria-hidden="true"><i /></div>
      </header>

      <div className="marquee" aria-hidden="true">
        <div className="track">
          {[...STACK, ...STACK, ...STACK, ...STACK].map((s, i) => <span key={i}>{s}<em>✦</em></span>)}
        </div>
      </div>

      <main>
        <section id="about" className="wrap about">
          <div>
            <h2 className="hd" data-r><Words t="About" /></h2>
            <p className="r" data-r style={{ '--d': 1 }}>I started with the web and kept going deeper: React on the front, Node, Express and MongoDB behind it. Along the way I practise DSA so the code I write holds up, and I contribute to open-source repositories to learn from real codebases.</p>
            <p className="r" data-r style={{ '--d': 2 }}>My long-term goal is agentic AI: software that plans and acts on its own, built on solid fundamentals.</p>
          </div>
          <dl>
            {FACTS.map(([k, v], i) => (<div key={k} className="r" data-r style={{ '--d': i }}><dt>{k}</dt><dd>{v}</dd></div>))}
          </dl>
        </section>

        <section id="projects" className="wrap">
          <h2 className="hd" data-r><Words t="Project" /></h2>
          {PROJECTS.map((p) => (
            <div key={p.title} className="r" data-r>
              <Tilt className="project">
                <div>
                  <p className="status">{p.status}</p>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <p className="stack">{p.stack}</p>
                  <div className="row">
                    <a className="btn mag" href={p.live} target="_blank" rel="noopener noreferrer">Open live site</a>
                    <a className="btn ghost mag" href={p.source} target="_blank" rel="noopener noreferrer">View source</a>
                  </div>
                </div>
                <div className="mock" aria-hidden="true">
                  <span className="beam" />
                  <p>Subject: You’ve <mark style={{ '--t': 0.6 }}>won</mark> a <mark style={{ '--t': 0.75 }}>free</mark> prize</p>
                  <p>Hi team, notes from today’s meeting are attached.</p>
                  <p><mark style={{ '--t': 2.7 }}>Claim</mark> your reward <mark style={{ '--t': 2.85 }}>now</mark>, limited offer</p>
                  <small>Illustration: the words that push a score toward spam get highlighted.</small>
                </div>
              </Tilt>
            </div>
          ))}
          <p className="more r" data-r>More of my work, including open-source pull requests, is on <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
        </section>

        <section id="contact" className="wrap">
          <div className="glass contact r" data-r>
            <h2>Let’s talk</h2>
            <p>Open to collaborations, open-source work and internships.</p>
            <a className="mail mag" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <ul>
              <li><a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href={PROFILE.x} target="_blank" rel="noopener noreferrer">X</a></li>
              <li><a href={PROFILE.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="wrap"><span>© 2026 {PROFILE.name}</span><span><Clock /></span></footer>
    </>
  )
}
