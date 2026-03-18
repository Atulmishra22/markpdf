import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './Features.module.css'

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="19" x2="18" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="22" cy="22" r="5" fill="var(--bg)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 22l1.5 1.5L24 20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: '// simplicity',
    title: 'Zero Config, Always',
    body: 'Drop in your content. Get a PDF. No template wrestling, no fragile export settings, no hidden configuration walls.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 8v6.5l3.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 14h1.5M21 14h1.5M14 5.5v1.5M14 21v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: '// speed',
    title: 'Under One Second',
    body: 'Sub-second rendering at any document length. No server round-trips, no queue, no waiting. Local-first with optional cloud API for large batch workloads.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 3L4 8v7c0 5.25 4.3 9.16 10 10.5C19.7 24.16 24 20.25 24 15V8L14 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 14l2.5 2.5L18 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: '// reliability',
    title: 'Consistent Output',
    body: 'Designed for repeatable, deterministic rendering so your PDFs look the same every time across machines and environments.',
  },
]

function FeatureCard({ feature, delay }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`reveal reveal-delay-${delay} ${styles.card}`}>
      <div className={styles.icon}>{feature.icon}</div>
      <span className={`micro-label ${styles.cardLabel}`}>{feature.label}</span>
      <h3 className={styles.cardTitle}>{feature.title}</h3>
      <p className={styles.cardBody}>{feature.body}</p>
    </div>
  )
}

export default function Features() {
  const titleRef = useScrollReveal()

  return (
    <section id="features" className={styles.section}>
      <div className="container">
        <div ref={titleRef} className={`reveal ${styles.header}`}>
          <span className="micro-label">// three pillars</span>
          <h2 className={styles.title}>
            Engineered to a<br />
            <em>single standard.</em>
          </h2>
        </div>

        <div className={styles.grid}>
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
