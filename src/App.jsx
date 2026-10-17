import { useEffect, useRef, useState } from 'react'
import Sky from './Sky'
import { PROFILE, FACTS, PROJECTS } from './data'

function Clock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 30000); return () => clearInterval(i) }, [])
  return <>{t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} in Solapur</>
}

// 3D tilt that follows the pointer. Used on cards only.
function Tilt({ as: Tag = 'article', className = '', children }) {
  const ref = useRef(null)
  const ok = () => matchMedia('(hover:hover) and (min-width:768px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches
  const move = (e) => {
    if (!ok()) return
    const el = ref.current, r = el.getBoundingClientRect()
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -12
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 12
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }
  const leave = () => { ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)' }
  return <Tag ref={ref} className={'glass card ' + className} onPointerMove={move} onPointerLeave={leave}>{children}</Tag>
}

export default function App() {
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
      <Sky />

      <nav className="glass nav" aria-label="Main">
        <a href="#top">Home</a><a href="#about">About</a><a href="#projects">Project</a><a href="#contact">Contact</a>
      </nav>

      <header id="top" className="hero">
        <div className="scene" aria-hidden="true">
          <div className="globe">
            {[0, 1, 2, 3, 4, 5].map((n) => <i key={n} className="m" style={{ '--i': n }} />)}
            <i className="l" style={{ "--w": 1, "--z": 0 }} /><i className="l" style={{ "--w": 0.82, "--z": 0.57 }} /><i className="l" style={{ "--w": 0.82, "--z": -0.57 }} /><i className="l" style={{ "--w": 0.47, "--z": 0.88 }} /><i className="l" style={{ "--w": 0.47, "--z": -0.88 }} />
            <i className="core" />
          </div>
          <div className="orbit"><b /></div>
        </div>
        <div className="wrap">
          <p className="kicker">T.Y. Computer Science Engineering</p>
          <h1>Full Stack Developer</h1>
          <p className="plate glass">AKIB SHAIKH</p>
          <p className="lede">Building web apps with the MERN stack and working toward AI agents. <span>Open to internships and open-source work.</span></p>
          <div className="row">
            <a className="btn" href="#projects">View my work</a>
            <a className="btn ghost" href="#contact">Contact me</a>
          </div>
        </div>
        <div className="limb" aria-hidden="true" />
      </header>

      <main>
        <section id="about" className="wrap about">
          <div>
            <h2>About</h2>
            <p>I started with the web and kept going deeper: React on the front, Node, Express and MongoDB behind it. Along the way I practise DSA so the code I write holds up, and I contribute to open-source repositories to learn from real codebases.</p>
            <p>My long-term goal is agentic AI: software that plans and acts on its own, built on solid fundamentals.</p>
          </div>
          <dl>
            {FACTS.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
          </dl>
        </section>

        <section id="projects" className="wrap">
          <h2>Project</h2>
          {PROJECTS.map((p) => (
            <Tilt key={p.title} className="project">
              <p className="status">{p.status}</p>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <p className="stack">{p.stack}</p>
              <div className="row">
                <a className="btn" href={p.live} target="_blank" rel="noopener noreferrer">Open live site</a>
                <a className="btn ghost" href={p.source} target="_blank" rel="noopener noreferrer">View source</a>
              </div>
            </Tilt>
          ))}
          <p className="more">More of my work, including open-source pull requests, is on <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
        </section>

        <section id="contact" className="wrap">
          <div className="glass contact">
            <h2>Let’s talk</h2>
            <p>Open to collaborations, open-source work and internships.</p>
            <a className="mail" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
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
