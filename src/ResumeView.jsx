import { useEffect, useState } from 'react'

const PDF = '/resume.pdf'
const DRIVE = 'https://drive.google.com/file/d/1ds7-7qcAAioOBJATNsvAwz_Abu-OUVLb/view?usp=drive_link'

export default function ResumeView() {
  const [status, setStatus] = useState('loading')
  useEffect(() => {
    const controller = new AbortController()
    async function checkPdf() {
      try {
        const response = await fetch(PDF, { headers: { Range: 'bytes=0-4' }, signal: controller.signal })
        if (!response.ok) throw new Error('Resume unavailable')
        const reader = response.body?.getReader()
        const bytes = reader ? (await reader.read()).value : new Uint8Array(await response.arrayBuffer())
        if (reader) reader.cancel()
        if (!bytes || new TextDecoder().decode(bytes.slice(0, 5)) !== '%PDF-') throw new Error('Invalid PDF')
        setStatus('ready')
      } catch (error) {
        if (error.name !== 'AbortError') setStatus('missing')
      }
    }
    checkPdf()
    return () => controller.abort()
  }, [])

  return <section className="resume-view" id="resume">
    <p className="eyebrow">AKIB BUILDS / RESUME</p><h1>Resume</h1>
    {status === 'loading' && <p role="status">Checking resume availability…</p>}
    {status === 'ready' && <>
      <div className="hero-actions resume-actions"><a className="button button-primary" href={PDF} download="Akib_Shaikh_Resume.pdf">Download Resume</a><a className="button button-secondary" href={PDF} target="_blank" rel="noopener noreferrer">Open PDF <span className="sr-only">(opens in a new tab)</span></a><a className="button button-secondary" href="#home">Back to portfolio</a></div>
      <object className="resume-document" data={PDF} type="application/pdf" aria-label="Resume PDF preview"><p>Your browser cannot display the PDF here. <a href={PDF} target="_blank" rel="noopener noreferrer">Open the resume in a new tab</a> or use Download Resume above.</p></object>
      <p className="resume-fallback">Can't see the preview? <a href={PDF} target="_blank" rel="noopener noreferrer">Open the PDF in a new tab</a>.</p>
    </>}
    {status === 'missing' && <><p>The on-site PDF is not available yet. The existing resume is available on Google Drive.</p><div className="hero-actions"><a className="button button-primary" href={DRIVE} target="_blank" rel="noopener noreferrer">Open existing resume <span className="sr-only">(opens in a new tab)</span></a><a className="button button-secondary" href="#home">Back to portfolio</a></div></>}
  </section>
}
