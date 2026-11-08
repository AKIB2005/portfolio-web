import { useEffect, useRef, useState } from 'react'
import Sky from './Sky'
import { PROFILE, FACTS, FEATURED, MORE, OSS, HACKS, STACK } from './data'

const LINKS = [['#about', 'About'], ['#work', 'Work'], ['#community', 'Community'], ['#stack', 'Stack'], ['#contact', 'Contact']]
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
          <p className="mono role">Full stack developer <span>/</span> T.Y. CSE <span>/</span> Solapur</p>
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
              <p className="muted r" data-r style={{ '--d': 1 }}>I started with the web and kept going deeper: React on the front, Node, Express and MongoDB behind it. I practise DSA so the code I write holds up, and I contribute to open-source repositories to learn from real codebases.</p>
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
          <div className="more">
            {MORE.map((m, i) => (
              <div key={m.title} className="mrow r" data-r style={{ '--d': i }}>
                <span className="mono n">0{i + 3}</span>
                <div><h3>{m.title}</h3><span className="mono tag">{m.tag}</span></div>
                <p className="muted">{m.text}</p>
                <span className="mono st">{m.stack}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="community" className="wrap">
          <Head n="03" title="Community" />
          <div className="two">
            <div>
              <h4 className="mono sub r" data-r>Open source / GSSoC 2026</h4>
              {OSS.map(([repo, what], i) => <div key={repo} className="li r" data-r style={{ '--d': i }}><b className="mono">{repo}</b><p className="muted">{what}</p></div>)}
              <a className="more-link mono" href={PROFILE.github} target="_blank" rel="noopener noreferrer">More on GitHub ↗</a>
            </div>
            <div>
              <h4 className="mono sub r" data-r>Hackathons</h4>
              {HACKS.map(([d, t, w], i) => <div key={t} className="li r" data-r style={{ '--d': i }}><b className="mono">{d}</b><h5>{t}</h5><p className="muted">{w}</p></div>)}
            </div>
          </div>
        </section>

        <section id="stack" className="wrap">
          <Head n="04" title="Stack" />
          <div className="cols">
            {STACK.map(([g, items], i) => (
              <div key={g} className="r" data-r style={{ '--d': i }}>
                <h4 className="mono sub">{g}</h4>
                <div className="chips">{items.map((s) => <span key={s} className="tagx mono">{s}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="wrap">
          <Head n="05" title="Contact" />
          <p className="big r" data-r>Open to collaborations, open-source work and internships.</p>
          <a className="mail r" data-r href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <ul className="socials r" data-r>
            {[['GitHub', PROFILE.github], ['LinkedIn', PROFILE.linkedin], ['X', PROFILE.x], ['Instagram', PROFILE.instagram]].map(([t, h]) => (
              <li key={t}><a className="mono" href={h} target="_blank" rel="noopener noreferrer">{t} ↗</a></li>
            ))}
          </ul>
        </section>
      </main>

      <div className="bigname r" data-r aria-hidden="true">AKIB SHAIKH</div>
      <footer className="wrap mono"><span>© 2026 {PROFILE.name}</span><span><Clock /></span></footer>
    </>
  )
}
