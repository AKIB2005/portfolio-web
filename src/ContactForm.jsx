import { useState } from 'react'
import { PROFILE } from './data'

const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY

export default function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'sending' || !FORM_KEY) return
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('botcheck')) return
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: FORM_KEY,
          subject: `Portfolio message from ${data.get('name')}`,
          from_name: 'Portfolio contact form',
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
        }),
      })
      const json = await res.json()
      if (json.success) { form.reset(); setStatus('sent') } else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="cform done" role="status">
        <p className="mono">Message sent</p>
        <p className="big">Thanks for reaching out. I’ll reply soon.</p>
        <button className="btn ghost" type="button" onClick={() => setStatus('idle')}>Send another</button>
      </div>
    )
  }

  return (
    <form className="cform" onSubmit={onSubmit}>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
      <div className="cform-row">
        <label>
          <span className="mono">Name</span>
          <input type="text" name="name" required autoComplete="name" />
        </label>
        <label>
          <span className="mono">Your email</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
      </div>
      <label>
        <span className="mono">Message</span>
        <textarea name="message" rows="4" required />
      </label>
      <div className="cform-foot">
        <button className="btn" type="submit" disabled={status === 'sending' || !FORM_KEY}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p className="cstatus mono" role="status" aria-live="polite">
          {!FORM_KEY && 'The form is not configured yet. Please use the email link.'}
          {status === 'error' && <>Couldn’t send. Email me at <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></>}
        </p>
      </div>
    </form>
  )
}
