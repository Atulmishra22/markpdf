import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './Stats.module.css'

const stats = [
  { value: '< 1s', label: '// avg conversion time' },
  { value: '100%', label: '// commonmark compliant' },
  { value: '12+', label: '// export formats' },
  { value: '50k+', label: '// developers trust it' },
]

function StatItem({ value, label, delay }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`reveal reveal-delay-${delay} ${styles.stat}`}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}

export default function Stats() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.grid}`}>
        {stats.map((s, i) => (
          <StatItem key={i} value={s.value} label={s.label} delay={i + 1} />
        ))}
      </div>
    </section>
  )
}
