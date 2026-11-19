import { useEffect, useState } from 'react'
import ContactForm from './ContactForm'
import Flower from './Flower'
import Rabbit from './Rabbit'
import CommandPalette from './CommandPalette'
import { PROFILE, FEATURED, STACK } from './data'

const RESUME = 'https://drive.google.com/file/d/1ds7-7qcAAioOBJATNsvAwz_Abu-OUVLb/view?usp=drive_link'
const navigation = [['Home', '#home'], ['Work', '#work'], ['About', '#about'], ['Skills', '#skills'], ['Resume', '#resume'], ['Contact', '#contact']]

function ExternalLink({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></a>
}

function moveButton(event) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.05}px, ${(event.clientY - rect.top - rect.height / 2) * 0.05}px)`
}
function resetButton(event) { event.currentTarget.style.transform = '' }

function Project({ project, index }) {
  return (
    <article id={`project-${project.title.toLowerCase()}`} className={`project${index === 0 ? ' project-featured' : ''}`}>
      <div className="project-topline"><span>{index === 0 ? 'Featured project' : project.status}</span><span>0{index + 1}</span></div>
      <div className="project-heading"><h3>{project.title}</h3><span className="project-arrow" aria-hidden="true">↗</span></div>
      <p>{project.text}</p>
      <ul className="project-points">{project.points.map(point => <li key={point}>{point}</li>)}</ul>
      <ul className="tags" aria-label={`${project.title} technologies`}>{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
      <div className="project-links"><ExternalLink href={project.source}>GitHub</ExternalLink>{project.live && <ExternalLink href={project.live}>Live demo</ExternalLink>}</div>
    </article>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const [resumeView, setResumeView] = useState(() => location.hash === '#resume')
  useEffect(() => {
    const update = () => setResumeView(location.hash === '#resume')
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

          <section id="about" className="section" data-reveal>
            <div className="section-label"><span>01</span><h2>Summary</h2></div>
            <div className="section-content"><p className="summary">I started with the web and kept going deeper: React on the front, Node, Express and MongoDB behind it. I practise DSA so the code I write holds up, and I’m learning to build agents that act.</p></div>
          </section>

          <section id="work" className="section" data-reveal>
            <div className="section-label"><span>02</span><h2>Featured projects</h2></div>
            <div className="section-content"><p className="section-intro">A selection of things I’ve built and explored.</p><div className="projects">{FEATURED.map((project, index) => <Project key={project.title} project={project} index={index} />)}</div></div>
          </section>

          <section id="skills" className="section" data-reveal>
            <div className="section-label"><span>03</span><h2>Skills</h2></div>
            <div className="section-content"><p className="section-intro">Technologies I work with and explore.</p><div className="skill-groups">{STACK.map(([group, items]) => <div className="skill-group" key={group}><h3>{group}</h3><p>{items.join(' · ')}</p></div>)}</div></div>
          </section>

          <section id="achievements" className="section" data-reveal>
            <div className="section-label"><span>04</span><h2>Achievements &amp; Open Source</h2></div>
            <div className="section-content achievement-list">
              <article className="achievement">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" /></svg>
                <div><h3>Hackathon Runner-Up</h3><p className="achievement-meta">Fabtech Technical Campus · Runner-up <span className="achievement-prize">· ₹10,000 prize</span></p><p>Secured runner-up position at a hackathon hosted by Fabtech Technical Campus, earning a cash prize of ₹10,000.</p></div>
              </article>
              <article className="achievement">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></svg>
                <div><h3>GirlScript Summer of Code (GSSoC) 2026</h3><p className="achievement-meta">Open Source Contributor · May 2026 – August 2026</p><p>Contributed to multiple open-source repositories during GSSoC 2026, collaborating on community-driven software projects.</p></div>
              </article>
            </div>
          </section>

          <section id="contact" className="section contact-section" data-reveal>
            <div className="section-label"><span>05</span><h2>Get in touch</h2></div>
            <div className="section-content"><p className="contact-lede">Have a project in mind or want to connect?</p><p className="section-intro">I’m open to collaborations, open-source work and internships.</p><a className="email-link" href={`mailto:${PROFILE.email}`}>{PROFILE.email} <span aria-hidden="true">↗</span></a><div className="social-links"><ExternalLink href={PROFILE.github}>GitHub</ExternalLink><ExternalLink href={PROFILE.linkedin}>LinkedIn</ExternalLink></div><div className="form-wrap"><h3>Send a message</h3><ContactForm /></div></div>
          </section>
          </>}
        </main>
        <footer className="site-footer"><span>© {new Date().getFullYear()} Akib Shaikh</span><a href="#home">Back to top ↑</a></footer>
      </div>
    </>
  )
}
