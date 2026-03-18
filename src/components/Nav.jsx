import { useScrolled } from '../hooks/useScrolled'
import styles from './Nav.module.css'

export default function Nav() {
  const scrolled = useScrolled()

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#" className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="26" height="26" rx="5" stroke="var(--accent)" strokeWidth="1.5" />
            <rect x="5" y="8" width="18" height="1.5" rx="0.75" fill="var(--accent)" />
            <rect x="5" y="12" width="14" height="1.5" rx="0.75" fill="var(--text-secondary)" />
            <rect x="5" y="16" width="16" height="1.5" rx="0.75" fill="var(--text-secondary)" />
            <rect x="5" y="20" width="10" height="1.5" rx="0.75" fill="var(--text-tertiary)" />
          </svg>
          <span className={styles.logoText}>Mark2PDF</span>
        </a>

        <div className={styles.links}>
          <a href="#features" className={styles.link}>Features</a>
          <a href="#demo" className={styles.link}>Demo</a>
          <a href="#" className={styles.link}>How it works</a>
          <a href="#" className={styles.link}>About</a>
        </div>

        <a href="#" className={`btn-primary ${styles.cta}`}>
          Convert Now
        </a>
      </div>
    </nav>
  )
}
