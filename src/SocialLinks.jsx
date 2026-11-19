import { useState } from 'react'
import { PROFILE } from './data'
import { GitHubIcon, LinkedInIcon, XIcon, InstagramIcon, DiscordIcon, GlobeIcon, EmailIcon } from './Icons'

export const DISCORD_USERNAME = 'akib2885'
export const SOCIALS = [
  { label: 'GitHub', href: PROFILE.github, Icon: GitHubIcon, external: true },
  { label: 'LinkedIn', href: PROFILE.linkedin, Icon: LinkedInIcon, external: true },
  { label: 'X', href: PROFILE.x, Icon: XIcon, external: true },
  { label: 'Instagram', href: PROFILE.instagram, Icon: InstagramIcon, external: true },
  { label: 'Discord', action: 'copy-discord', Icon: DiscordIcon },
  { label: 'Website', href: 'https://akibbuilds.tech', Icon: GlobeIcon, external: true },
  { label: 'Email', href: `mailto:${PROFILE.email}`, Icon: EmailIcon },
]

export async function copyDiscord() {
  try { await navigator.clipboard.writeText(DISCORD_USERNAME); return true } catch { return false }
}

export default function SocialLinks() {
  const [message, setMessage] = useState('')
  const copy = async () => setMessage(await copyDiscord() ? `Copied Discord username: ${DISCORD_USERNAME}` : `Could not copy. Discord username: ${DISCORD_USERNAME}`)
  return <div className="hero-social-wrap hero-reveal"><div className="hero-social" role="group" aria-label="Social and contact links">{SOCIALS.map(({ label, href, Icon, external, action }) => action ? <button key={label} type="button" className="social-icon" onClick={copy} aria-label={`Copy Discord username ${DISCORD_USERNAME}`} data-tooltip={`Discord: ${DISCORD_USERNAME}`}><Icon /></button> : <a key={label} className="social-icon" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label={`${label}${external ? ' (opens in a new tab)' : ''}`} data-tooltip={label}><Icon /></a>)}</div><p className="social-feedback" role="status" aria-live="polite">{message}</p></div>
}
