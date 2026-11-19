import { useEffect, useRef, useState } from 'react'
import { FEATURED } from './data'
import { SOCIALS, copyDiscord, DISCORD_USERNAME } from './SocialLinks'

const commands = [
  ...[['Home', '#home'], ['Work', '#work'], ['Profile', '#profile'], ['About', '#about'], ['Education', '#education'], ['Achievements', '#achievements'], ['Skills', '#skills'], ['Contact', '#contact'], ['Resume', '#resume']].map(([label, href]) => ({ label, href, group: 'Navigation' })),
  ...FEATURED.map(project => ({ label: project.title, href: `#project-${project.title.toLowerCase()}`, group: 'Projects' })),
  ...SOCIALS.filter(social => !social.action).map(social => ({ ...social, group: 'Socials' })),
  { label: 'Copy Discord username', group: 'Actions', action: 'copy-discord', Icon: SOCIALS.find(social => social.label === 'Discord').Icon, keywords: 'Discord akib2885' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [closing, setClosing] = useState(false)
  const [notice, setNotice] = useState('')
  const input = useRef(null), dialog = useRef(null), list = useRef(null), previous = useRef(null)
  const closeTimer = useRef(null)
  const results = commands.filter(command => `${command.label} ${command.group} ${command.keywords || ''}`.toLowerCase().includes(query.trim().toLowerCase()))
  const show = () => { clearTimeout(closeTimer.current); previous.current = document.activeElement; setQuery(''); setActive(0); setClosing(false); setOpen(true) }
  const close = (restore = true) => { if (closing) return; setClosing(true); const delay = document.documentElement.dataset.motion !== 'full' ? 0 : 120; closeTimer.current = setTimeout(() => { setOpen(false); setClosing(false); if (restore) previous.current?.focus({ preventScroll: true }) }, delay) }
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  useEffect(() => {
    const shortcut = event => {
      const target = event.target
      const editing = target instanceof Element && (target.isContentEditable || !!target.closest('input, textarea, select, [contenteditable="true"]'))
      if (!open && !editing && !event.altKey && !event.shiftKey && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); show() }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [open])
  useEffect(() => {
    if (!open) return undefined
    const root = document.documentElement, oldOverflow = root.style.overflow, oldPadding = document.body.style.paddingRight
    const scrollbar = Math.max(0, window.innerWidth - root.clientWidth)
    root.style.overflow = 'hidden'
    if (scrollbar) document.body.style.paddingRight = `${scrollbar}px`
    input.current?.focus({ preventScroll: true })
    return () => { root.style.overflow = oldOverflow; document.body.style.paddingRight = oldPadding }
  }, [open])
  useEffect(() => {
    if (!open || !list.current) return
    const option = document.getElementById(`command-${active}`)
    if (!option) return
    const box = list.current.getBoundingClientRect(), rect = option.getBoundingClientRect()
    if (rect.bottom > box.bottom) list.current.scrollTop += rect.bottom - box.bottom
    else if (rect.top < box.top) list.current.scrollTop -= box.top - rect.top
  }, [active, open, query])

  const run = async command => {
    if (!command) return
    if (command.action === 'copy-discord') { const copied = await copyDiscord(); setNotice(copied ? `Copied Discord username: ${DISCORD_USERNAME}` : `Could not copy. Discord username: ${DISCORD_USERNAME}`); close(); return }
    close(Boolean(command.external || command.href.startsWith('mailto:')))
    if (command.external) window.open(command.href, '_blank', 'noopener,noreferrer')
    else if (command.href.startsWith('mailto:')) window.location.href = command.href
    else { if (window.location.hash === command.href) window.dispatchEvent(new HashChangeEvent('hashchange')); else window.location.hash = command.href; requestAnimationFrame(() => document.getElementById(command.href.slice(1))?.scrollIntoView()) }
  }
  const onKeyDown = event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); return }
    if (event.key === 'Tab') {
      const items = [...dialog.current.querySelectorAll('input, button:not([disabled])')]
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus() }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus() }
      return
    }
    if (event.target !== input.current) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); if (results.length) setActive(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length) }
    if (event.key === 'Enter') { event.preventDefault(); run(results[active]) }
  }

  return <>
    <button className="command-trigger" type="button" onClick={show} aria-label="Open command palette">Search <kbd>Ctrl K</kbd></button>
    <span className="sr-only" role="status" aria-live="polite">{notice}</span>
    {open && <div className={`command-backdrop${closing ? ' is-closing' : ''}`} onMouseDown={event => { if (event.target === event.currentTarget) close() }}>
      <div className="command-dialog" role="dialog" aria-modal="true" aria-labelledby="command-title" ref={dialog} onKeyDown={onKeyDown}>
        <div className="command-header"><label id="command-title" htmlFor="command-search">Command Center</label><button type="button" onClick={() => close()} aria-label="Close command palette">Esc</button></div>
        <div className="command-search-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input ref={input} id="command-search" value={query} onChange={event => { setQuery(event.target.value); setActive(0) }} placeholder="Search pages, projects, socials…" autoComplete="off" role="combobox" aria-expanded="true" aria-controls="command-results" aria-activedescendant={results.length ? `command-${active}` : undefined} /></div>
        <div id="command-results" className="command-results" ref={list} role="listbox" aria-label="Commands">
          {['Navigation', 'Projects', 'Socials', 'Actions'].map(group => { const groupResults = results.filter(command => command.group === group); return groupResults.length ? <div key={group} role="group" aria-label={group}><p>{group}</p>{groupResults.map(command => { const index = results.indexOf(command), Icon = command.Icon; return <div id={`command-${index}`} key={command.label} role="option" aria-selected={index === active} className={index === active ? 'command-option selected' : 'command-option'} onMouseMove={() => setActive(index)} onClick={() => run(command)}><span className="command-option-label"><span className="command-icon" aria-hidden="true">{Icon ? <Icon /> : group === 'Projects' ? '◇' : '↗'}</span>{command.label}</span><span aria-hidden="true">{command.external ? '↗' : '↵'}</span></div> })}</div> : null })}
          {!results.length && <p className="command-empty" role="status">No results found. Try a page, project, or social link.</p>}
        </div>
        <div className="command-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Select</span><span><kbd>Esc</kbd> Close</span></div>
      </div>
    </div>}
  </>
}
