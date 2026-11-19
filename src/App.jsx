import { useEffect, useState } from 'react'
import ContactForm from './ContactForm'
import Flower from './Flower'
import Rabbit from './Rabbit'
import CommandPalette from './CommandPalette'
import { PROFILE, FEATURED, STACK } from './data'

const RESUME = 'https://drive.google.com/file/d/1ds7-7qcAAioOBJATNsvAwz_Abu-OUVLb/view?usp=drive_link'
const navigation = [['Home', '#home'], ['Work', '#work'], ['Profile', '#profile'], ['Resume', '#resume'], ['Contact', '#contact']]

function ExternalLink({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></a>
}

function moveButton(event) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.05}px, ${(event.clientY - rect.top - rect.height / 2) * 0.05}px)`
}
function resetButton(event) { event.currentTarget.style.transform = '' }

function Project({ project, index, expanded, onSelect }) {
  const id = `project-${project.title.toLowerCase()}`
  return (
    <article id={id} className={`project project-accordion${expanded ? ' is-expanded' : ''}${index === 0 ? ' project-featured' : ''}`}>
      <h3 className="project-accordion-heading"><button type="button" className="project-toggle" aria-expanded={expanded} aria-controls={`${id}-details`} onClick={onSelect}><span className="project-number">0{index + 1}</span><span className="project-name">{project.title}</span><span className="project-toggle-icon" aria-hidden="true">{expanded ? '−' : '+'}</span></button></h3>
      <div className="project-details" id={`${id}-details`} hidden={!expanded}>
      <div className="project-topline"><span>{index === 0 ? 'Featured project' : project.status}</span></div>
      <p>{project.text}</p>
      <ul className="project-points">{project.points.map(point => <li key={point}>{point}</li>)}</ul>
      <ul className="tags" aria-label={`${project.title} technologies`}>{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
      <div className="project-links"><ExternalLink href={project.source}>GitHub</ExternalLink>{project.live && <ExternalLink href={project.live}>Live demo</ExternalLink>}</div>
      </div>
    </article>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const [resumeView, setResumeView] = useState(() => location.hash === '#resume')
  const [activeProject, setActiveProject] = useState(() => FEATURED.find(p => location.hash === `#project-${p.title.toLowerCase()}`)?.title || FEATURED[0].title)
  const tabs = ['education', 'achievements', 'skills']
  const [profileTab, setProfileTab] = useState(() => tabs.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'education')
  useEffect(() => {
    const update = () => { const hash = location.hash.slice(1); setResumeView(hash === 'resume'); if (tabs.includes(hash)) setProfileTab(hash); const project = FEATURED.find(p => hash === `project-${p.title.toLowerCase()}`); if (project) setActiveProject(project.title) }
    addEventListener('hashchange', update)
    return () => removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    if (!resumeView && location.hash && location.hash !== '#home') requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView())
  }, [resumeView])
  const toggleTheme = () => setTheme(current => {
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch {}
    return next
  })
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const elements = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target) }
    }), { threshold: 0.08 })
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [resumeView])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Rabbit />
      <div className="shell">
        <header className="site-header" id="home">
          <a className="brand" href="#home" aria-label="Akib Builds, home">AKIB <span>BUILDS</span><i>.</i></a>
          <nav aria-label="Main navigation"><ul>{navigation.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul></nav>
          <CommandPalette />
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? '☼' : '☾'}</button>
        </header>

        <main id="main">
          {resumeView ? <section className="resume-view" id="resume"><p className="eyebrow">AKIB BUILDS / RESUME</p><h1>Resume</h1><p>View the current resume in Google Drive.</p><div className="hero-actions"><a className="button button-primary" href={RESUME} target="_blank" rel="noopener noreferrer">Open resume <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a><a className="button button-secondary" href="#home">Back to portfolio</a></div></section> : <>
          <section className="hero" aria-labelledby="hero-title">
            <Flower />
            <p className="eyebrow hero-reveal">PORTFOLIO <span>/</span> AKIB BUILDS</p>
            <h1 id="hero-title" className="hero-reveal">Akib Shaikh<span className="heading-dot">.</span></h1>
            <p className="hero-role hero-reveal">Full stack developer <span>/</span> Agentic AI</p>
            <p className="hero-copy hero-reveal">I build web apps with the MERN stack and I’m working toward AI agents that act.</p>
            <p className="availability hero-reveal"><span aria-hidden="true" /> Open to internships and open-source work</p>
            <div className="hero-actions hero-reveal"><a className="button button-primary" href="#work" onPointerMove={moveButton} onPointerLeave={resetButton}>View projects <span aria-hidden="true">↗</span></a><a className="button button-secondary" href="#resume" onPointerMove={moveButton} onPointerLeave={resetButton}>View resume <span aria-hidden="true">↗</span></a></div>
            <div className="social-links hero-social"><ExternalLink href={PROFILE.github}>GitHub</ExternalLink><ExternalLink href={PROFILE.linkedin}>LinkedIn</ExternalLink></div>
          </section>

          <section id="work" className="section" data-reveal>
            <div className="section-label"><span>01</span><h2>Selected work</h2></div>
            <div className="section-content"><p className="section-intro">A selection of things I’ve built and explored.</p><div className="projects">{FEATURED.map((project, index) => <Project key={project.title} project={project} index={index} expanded={activeProject === project.title} onSelect={() => setActiveProject(project.title)} />)}</div></div>
          </section>

          <section id="profile" className="section" data-reveal>
            <div className="section-label"><span>02</span><h2>Profile</h2></div>
            <div className="section-content"><p id="about" className="summary">I started with the web and kept going deeper: React on the front, Node, Express and MongoDB behind it. I practise DSA so the code I write holds up, and I’m learning to build agents that act.</p>
            <div className="profile-tabs" role="tablist" aria-label="Profile information" onKeyDown={event => { const current = tabs.indexOf(profileTab); let next; if (event.key === 'ArrowRight') next = (current + 1) % tabs.length; else if (event.key === 'ArrowLeft') next = (current + tabs.length - 1) % tabs.length; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = tabs.length - 1; else return; event.preventDefault(); setProfileTab(tabs[next]); document.getElementById(`tab-${tabs[next]}`).focus() }}>
              {tabs.map(tab => <button key={tab} id={`tab-${tab}`} type="button" role="tab" aria-selected={profileTab === tab} aria-controls={tab} tabIndex={profileTab === tab ? 0 : -1} onClick={() => setProfileTab(tab)}>{tab[0].toUpperCase() + tab.slice(1)}</button>)}
            </div>
            <div id="education" role="tabpanel" aria-labelledby="tab-education" tabIndex="0" hidden={profileTab !== 'education'}><ol className="education-timeline">
              <li><h3>N. K. Orchid College of Engineering &amp; Technology, Solapur</h3><p className="education-degree">Bachelor of Technology (B.Tech) in Computer Science and Engineering</p><p className="education-meta">2024–2028 (Expected) · <strong>Current CGPA: 8.85/10</strong></p></li>
              <li><h3>V.V.P. Junior College, Soregaon</h3><p>Higher Secondary Education (Class XII)</p><p className="education-meta">Completed 2024 · 80%</p></li>
              <li><h3>Indian Model School, Solapur</h3><p>Secondary Education (Class X), CBSE</p><p className="education-meta">Completed 2022 · 85%</p></li>
            </ol></div>

            <div id="achievements" className="achievement-list" role="tabpanel" aria-labelledby="tab-achievements" tabIndex="0" hidden={profileTab !== 'achievements'}>
              <article className="achievement achievement-featured">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" /></svg>
                <div><h3>KURUKSHETRA 2.0</h3><p className="achievement-subtitle">24-Hour Hackathon — Runner-Up</p><p className="achievement-meta">Fabtech Technical Campus, College of Engineering &amp; Research<br />Sangola, Maharashtra · October 30–31, 2026</p><div className="achievement-result"><span>2nd Place</span><span>₹10,000 <small>cash prize</small></span></div></div>
              </article>
              <article className="achievement">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></svg>
                <div><h3>GirlScript Summer of Code (GSSoC) 2026</h3><p className="achievement-meta">Open Source Contributor · May–August 2026</p><p>Contributed to multiple open-source repositories.</p></div>
              </article>
            </div>
            <div id="skills" role="tabpanel" aria-labelledby="tab-skills" tabIndex="0" hidden={profileTab !== 'skills'}><p className="section-intro">Technologies I work with and explore.</p><div className="skill-groups">{STACK.map(([group, items]) => <div className="skill-group" key={group}><h3>{group}</h3><p>{items.join(' · ')}</p></div>)}</div></div>
            </div>
          </section>

          <section id="contact" className="section contact-section" data-reveal>
            <div className="section-label"><span>03</span><h2>Get in touch</h2></div>
            <div className="section-content"><p className="contact-lede">Have a project in mind or want to connect?</p><p className="section-intro">I’m open to collaborations, open-source work and internships.</p><a className="email-link" href={`mailto:${PROFILE.email}`}>{PROFILE.email} <span aria-hidden="true">↗</span></a><div className="social-links"><ExternalLink href={PROFILE.github}>GitHub</ExternalLink><ExternalLink href={PROFILE.linkedin}>LinkedIn</ExternalLink></div><details className="form-wrap"><summary>Send a message</summary><ContactForm /></details></div>
          </section>
          </>}
        </main>
        <section className="footer-quotes" aria-label="Personal quotes">
          <figure className="quote-block" data-reveal><figcaption className="quote-label">01 <span>—</span> DISCIPLINE</figcaption><blockquote>“Consistency is boring. It's very tough.”</blockquote><p className="quote-author">— Virat Kohli</p></figure>
          <figure className="quote-block" data-reveal><figcaption className="quote-label">02 <span>—</span> PASSION</figcaption><blockquote>“The only way to do great work is to love what you do.”</blockquote><p className="quote-author">— Steve Jobs</p></figure>
        </section>
        <footer className="site-footer"><span>© {new Date().getFullYear()} Akib Shaikh</span><a href="#home">Back to top ↑</a></footer>
      </div>
    </>
  )
}
