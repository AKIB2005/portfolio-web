import { useEffect, useState } from 'react'

const PDF = '/resume.pdf'

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

  return <section className="resume-view" id="resume" aria-labelledby="resume-title">
    <a className="resume-back" href="#home"><span aria-hidden="true">←</span> Back to portfolio</a>
    <header className="resume-header">
      <div className="resume-heading"><p className="eyebrow">AKIB BUILDS / DOCUMENT</p><h1 id="resume-title">Resume</h1><p>Akib Shaikh <span aria-hidden="true">·</span> <span className="resume-file-type">PDF</span></p></div>
      {status === 'ready' && <div className="resume-actions">
        <a className="button button-secondary" href={PDF} target="_blank" rel="noopener noreferrer">Open in New Tab <span className="resume-action-icon" aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
        <a className="button button-primary" href={PDF} download="Akib_Shaikh_Resume.pdf">Download Resume <span className="resume-action-icon" aria-hidden="true">↓</span></a>
      </div>}
    </header>
    <div className="resume-workspace">
      <div className="resume-workspace-label"><span>DOCUMENT PREVIEW</span><span>PDF</span></div>
      {status === 'loading' && <p className="resume-state" role="status">Preparing document preview…</p>}
      {status === 'missing' && <p className="resume-state" role="alert">The resume PDF is currently unavailable. Please try again later.</p>}
      {status === 'ready' && <object className="resume-document" data={PDF} type="application/pdf" aria-label="Akib Shaikh’s resume PDF preview"><p>Your browser cannot display the PDF here. <a href={PDF} target="_blank" rel="noopener noreferrer">Open the resume in a new tab</a> or use Download Resume above.</p></object>}
    </div>
    {status === 'ready' && <p className="resume-fallback">Having trouble viewing the document? <a href={PDF} target="_blank" rel="noopener noreferrer">Open the PDF in a new tab</a>.</p>}
  </section>
}
