import styles from './Footer.module.css'

const LogoMark = () => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="26" height="26" rx="5" stroke="var(--accent)" strokeWidth="1.5" />
    <rect x="5" y="8" width="18" height="1.5" rx="0.75" fill="var(--accent)" />
    <rect x="5" y="12" width="14" height="1.5" rx="0.75" fill="var(--text-secondary)" />
    <rect x="5" y="16" width="16" height="1.5" rx="0.75" fill="var(--text-secondary)" />
    <rect x="5" y="20" width="10" height="1.5" rx="0.75" fill="var(--text-tertiary)" />
  </svg>
)

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>

        <div className={styles.brand}>
          <a href="#" className={styles.logo}>
            <LogoMark />
            <span className={styles.logoText}>MarkPDF</span>
          </a>
          <p className={styles.tagline}>
            Markdown rendered<br />with precision.
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.col}>
            <span className={styles.colHead}>Product</span>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Changelog</a>
            <a href="#">Roadmap</a>
          </div>
          <div className={styles.col}>
            <span className={styles.colHead}>Developers</span>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">CLI Guide</a>
            <a href="#">GitHub</a>
          </div>
          <div className={styles.col}>
            <span className={styles.colHead}>Company</span>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>

      </div>

      <div className={`container ${styles.bottom}`}>
        <span className={styles.copy}>© 2026 MarkPDF. Built with precision.</span>
        <span className={styles.copy}>Made for developers, by developers.</span>
      </div>
    </footer>
  )
}
