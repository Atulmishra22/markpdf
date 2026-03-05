export default function ComposingFrame({ reversed = false, style = {} }) {
  const animationName = reversed ? 'heroRotateReverse' : 'heroRotate'

  return (
    <svg
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: `${animationName} 120s linear infinite`,
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Outer frame */}
      <rect x="20" y="20" width="560" height="560" stroke="currentColor" strokeWidth="1.5" />
      {/* Inner dashed frame */}
      <rect x="46" y="46" width="508" height="508" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 10" />

      {/* Corner registration marks */}
      <path d="M20 52 L20 20 L52 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M548 20 L580 20 L580 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M580 548 L580 580 L548 580" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 580 L20 580 L20 548" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* Horizontal rule lines */}
      <line x1="46" y1="218" x2="554" y2="218" stroke="currentColor" strokeWidth="0.6" />
      <line x1="46" y1="300" x2="554" y2="300" stroke="currentColor" strokeWidth="1" />
      <line x1="46" y1="382" x2="554" y2="382" stroke="currentColor" strokeWidth="0.6" />

      {/* Vertical rule lines */}
      <line x1="195" y1="46" x2="195" y2="554" stroke="currentColor" strokeWidth="0.6" />
      <line x1="405" y1="46" x2="405" y2="554" stroke="currentColor" strokeWidth="0.6" />

      {/* Center focal point — the "drop zone" where markdown enters */}
      <circle cx="300" cy="300" r="24" stroke="currentColor" strokeWidth="1" />
      <circle cx="300" cy="300" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="300" cy="300" r="2.5" fill="currentColor" />

      {/* Tick marks along outer edges */}
      <line x1="150" y1="20" x2="150" y2="30" stroke="currentColor" strokeWidth="1" />
      <line x1="300" y1="20" x2="300" y2="34" stroke="currentColor" strokeWidth="1.5" />
      <line x1="450" y1="20" x2="450" y2="30" stroke="currentColor" strokeWidth="1" />
      <line x1="150" y1="580" x2="150" y2="570" stroke="currentColor" strokeWidth="1" />
      <line x1="300" y1="580" x2="300" y2="566" stroke="currentColor" strokeWidth="1.5" />
      <line x1="450" y1="580" x2="450" y2="570" stroke="currentColor" strokeWidth="1" />
      <line x1="20" y1="150" x2="30" y2="150" stroke="currentColor" strokeWidth="1" />
      <line x1="20" y1="300" x2="34" y2="300" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="450" x2="30" y2="450" stroke="currentColor" strokeWidth="1" />
      <line x1="580" y1="150" x2="570" y2="150" stroke="currentColor" strokeWidth="1" />
      <line x1="580" y1="300" x2="566" y2="300" stroke="currentColor" strokeWidth="1.5" />
      <line x1="580" y1="450" x2="570" y2="450" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
