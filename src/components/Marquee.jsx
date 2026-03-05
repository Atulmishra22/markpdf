import styles from './Marquee.module.css'

const items = [
  '// inline syntax highlighting',
  '// table & list support',
  '// custom CSS templates',
  '// < 1s conversion',
  '// zero config required',
  '// math equation rendering',
  '// multi-page documents',
  '// code block formatting',
  '// headers & footers',
  '// front-matter metadata',
  '// batch conversion API',
  '// open source core',
  '// 12+ export formats',
  '// cli & web api',
]

export default function Marquee() {
  const doubled = [...items, ...items]

  return (
    <div className={styles.band} aria-hidden="true">
      <div className={styles.track}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.sep}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
