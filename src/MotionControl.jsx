import { useEffect, useState } from 'react'

export default function MotionControl() {
  const [choice, setChoice] = useState(() => { try { const saved = localStorage.getItem('animation-mode'); return ['full', 'reduced', 'off'].includes(saved) ? saved : 'system' } catch { return 'system' } })
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => { document.documentElement.dataset.motion = choice === 'system' ? (media.matches ? 'reduced' : 'full') : choice }
    apply(); media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [choice])
  const change = event => { const value = event.target.value; setChoice(value); try { if (value === 'system') localStorage.removeItem('animation-mode'); else localStorage.setItem('animation-mode', value) } catch {} }
  return <details className="motion-control"><summary aria-label="Animation settings" title="Animation settings">◌</summary><label>Animation <select value={choice} onChange={change}><option value="system">System default</option><option value="full">Full</option><option value="reduced">Reduced</option><option value="off">Off</option></select></label></details>
}
