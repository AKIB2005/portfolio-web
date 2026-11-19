import { useRef, useState } from 'react'
import { PROFILE } from './data'

const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY

export default function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})
  const sending = useRef(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (sending.current || !FORM_KEY) return
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('botcheck')) return
    const name = data.get('name').trim()
    const email = data.get('email').trim()
    const message = data.get('message').trim()
    const nextErrors = {}
    if (!name) nextErrors.name = 'Please enter your name.'
    if (!email) nextErrors.email = 'Please enter your email address.'
    else if (form.elements.email.validity.typeMismatch) nextErrors.email = 'Please enter a valid email address.'
    if (!message) nextErrors.message = 'Please enter a message.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { form.elements[Object.keys(nextErrors)[0]].focus(); return }
    sending.current = true
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: FORM_KEY,
          subject: `Portfolio message from ${name}`,
          from_name: 'Portfolio contact form',
          name,
          email,
          message,
        }),
      })
      const json = await res.json()
      if (res.ok && json.success === true) { form.reset(); setStatus('sent') } else setStatus('error')
    } catch {
      setStatus('error')
    } finally {
      sending.current = false
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
    <form className="cform" onSubmit={onSubmit} noValidate aria-busy={status === 'sending'}>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
      <div className="cform-row">
        <label>
          <span className="mono">Name</span>
          <input type="text" name="name" required maxLength={80} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} onChange={() => setErrors(previous => ({ ...previous, name: '' }))} />
          {errors.name && <span className="cform-error" id="name-error">{errors.name}</span>}
        </label>
        <label>
          <span className="mono">Your email</span>
          <input type="email" name="email" required maxLength={120} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} onChange={() => setErrors(previous => ({ ...previous, email: '' }))} />
          {errors.email && <span className="cform-error" id="email-error">{errors.email}</span>}
        </label>
      </div>
      <label>
        <span className="mono">Message</span>
        <textarea name="message" rows="4" required maxLength={2000} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} onChange={() => setErrors(previous => ({ ...previous, message: '' }))} />
        {errors.message && <span className="cform-error" id="message-error">{errors.message}</span>}
      </label>
      <div className="cform-foot">
        <button className="btn" type="submit" disabled={status === 'sending' || !FORM_KEY}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
          <span className="send-arrow" aria-hidden="true">↗</span>
        </button>
        <p className="cstatus mono" role="status" aria-live="polite">
          {!FORM_KEY && 'The form is not configured yet. Please use the email link.'}
          {status === 'sending' && 'Sending your message…'}
          {status === 'error' && <>Couldn’t send. Email me at <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></>}
        </p>
      </div>
    </form>
  )
}
