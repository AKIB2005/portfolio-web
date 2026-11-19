import { useEffect, useRef, useState } from 'react'
import { FEATURED, PROFILE } from './data'

const commands = [
  ...[['Home', '#home'], ['Work', '#work'], ['Profile', '#profile'], ['About', '#about'], ['Education', '#education'], ['Achievements', '#achievements'], ['Skills', '#skills'], ['Contact', '#contact'], ['Resume', '#resume']].map(([label, href]) => ({ label, href, group: 'Navigation' })),
  ...FEATURED.map(project => ({ label: project.title, href: `#project-${project.title.toLowerCase()}`, group: 'Projects' })),
  ...[['GitHub', PROFILE.github], ['LinkedIn', PROFILE.linkedin]].map(([label, href]) => ({ label, href, group: 'External links', external: true })),
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef(null), dialog = useRef(null), previous = useRef(null)
  const results = commands.filter(command => `${command.label} ${command.group}`.toLowerCase().includes(query.trim().toLowerCase()))
  const show = () => { previous.current = document.activeElement; setQuery(''); setActive(0); setOpen(true) }
  const close = () => { setOpen(false); requestAnimationFrame(() => previous.current?.focus()) }

  useEffect(() => {
    const shortcut = event => {
      const target = event.target
      const editing = target instanceof Element && (target.isContentEditable || !!target.closest('input, textarea, select, [contenteditable="true"]'))
      if (!open && !editing && !event.altKey && !event.shiftKey && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); show() }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [open])
  useEffect(() => { if (open) input.current?.focus() }, [open])
  useEffect(() => { if (open && results[active]) document.getElementById(`command-${active}`)?.scrollIntoView({ block: 'nearest' }) }, [active, open, query])

  const run = command => {
    if (!command) return
    close()
    if (command.external) window.open(command.href, '_blank', 'noopener,noreferrer')
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
    {open && <div className="command-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) close() }}>
      <div className="command-dialog" role="dialog" aria-modal="true" aria-labelledby="command-title" ref={dialog} onKeyDown={onKeyDown}>
        <div className="command-header"><label id="command-title" htmlFor="command-search">Search portfolio</label><button type="button" onClick={close} aria-label="Close command palette">Esc</button></div>
        <input ref={input} id="command-search" value={query} onChange={event => { setQuery(event.target.value); setActive(0) }} placeholder="Search pages, projects, links…" autoComplete="off" role="combobox" aria-expanded="true" aria-controls="command-results" aria-activedescendant={results.length ? `command-${active}` : undefined} />
        <div id="command-results" className="command-results" role="listbox" aria-label="Commands">
          {['Navigation', 'Projects', 'External links'].map(group => { const groupResults = results.filter(command => command.group === group); return groupResults.length ? <div key={group} role="group" aria-label={group}><p>{group}</p>{groupResults.map(command => { const index = results.indexOf(command); return <div id={`command-${index}`} key={command.label} role="option" aria-selected={index === active} className={index === active ? 'command-option selected' : 'command-option'} onMouseMove={() => setActive(index)} onClick={() => run(command)}>{command.label}<span aria-hidden="true">{command.external ? '↗' : '↵'}</span></div> })}</div> : null })}
          {!results.length && <p className="command-empty" role="status">No matching commands.</p>}
        </div>
        <div className="command-footer">↑ ↓ to navigate <span>↵ to select</span></div>
      </div>
    </div>}
  </>
}
