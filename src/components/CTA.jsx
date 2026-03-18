import { useScrollReveal } from '../hooks/useScrollReveal'
import ComposingFrame from './shared/ComposingFrame'
import styles from './CTA.module.css'

export default function CTA() {
  const ref = useScrollReveal()

  return (
    <section className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.motif} aria-hidden="true">
        <ComposingFrame reversed style={{ color: 'var(--accent)' }} />
      </div>

      <div className="container">
        <div ref={ref} className={`reveal ${styles.content}`}>
          <span className="micro-label">// start building</span>

          <h2 className={styles.title}>
            Every great document<br />
            <em>deserves a better PDF.</em>
          </h2>

          <p className={styles.sub}>
            Build polished PDFs without wrestling with export settings,
            templates, or inconsistent rendering.
          </p>

          <div className={styles.actions}>
            <a href="#" className="btn-primary">
              Start Converting
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#demo" className="btn-ghost">Jump to Demo</a>
          </div>
        </div>
      </div>
    </section>
  )
}
