import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './Testimonial.module.css'

export default function Testimonial() {
  const ref = useScrollReveal()

  return (
    <section className={styles.section}>
      <div className="container">
        <div ref={ref} className={`reveal ${styles.content}`}>
          <span className="micro-label">// what they say</span>

          <blockquote className={styles.quote}>
            MarkPDF replaced our entire documentation pipeline overnight. We had been
            fighting with LaTeX for years — this just works. The output quality is
            indistinguishable from documents we painstakingly handcrafted.
          </blockquote>

          <div className={styles.author}>
            <div className={styles.avatar} aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="22" fill="var(--surface-raised)" />
                <circle cx="22" cy="18" r="6.5" stroke="var(--accent)" strokeWidth="1.5" />
                <path d="M9 40c0-7.18 5.82-13 13-13s13 5.82 13 13" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className={styles.name}>Sarah Chen</div>
              <div className={styles.role}>Staff Engineer, Linear</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
