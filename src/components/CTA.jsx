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
            <em>starts as Markdown.</em>
          </h2>

          <p className={styles.sub}>
            Join over 50,000 developers and writers who replaced broken export
            pipelines with one reliable, beautiful tool.
          </p>

          <div className={styles.actions}>
            <a href="#" className="btn-primary">
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#" className="btn-ghost">Read the Docs</a>
          </div>
        </div>
      </div>
    </section>
  )
}
