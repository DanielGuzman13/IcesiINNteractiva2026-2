interface IconProps {
  className?: string;
}

export function SoccerBall({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="#ffffff" />
      <g fill="none" stroke="#1f2937" strokeWidth="0.9">
        <polygon points="12,9.2 14.8,12.3 13.3,15.7 10.7,15.7 9.2,12.3" />
        <path d="M12 3.2v6M12 15.7v5.1M6.8 7.1l2.4 5.2M17.2 7.1l-2.4 5.2M5.2 16.3l5.5-.6M18.8 16.3l-5.5-.6" />
      </g>
    </svg>
  );
}

export function StarIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="m12 2 3 6.3 6.9.9-5.1 4.8 1.3 6.8L12 17.3l-6.1 3.5 1.3-6.8L2.1 9.2l6.9-.9L12 2Z" />
    </svg>
  );
}

export function ShieldIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function CrossIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </svg>
  );
}

export function PersonIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="7.5" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  );
}

export function TrophyIcon({ className = "h-12 w-12" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M9 14.5c0 1 .5 2 1.5 2h3c1 0 1.5-1 1.5-2V13H9v1.5Z" />
      <path d="M12 16.5V20M8 20h8" />
    </svg>
  );
}

export function MedalIcon({ medalla, className = "h-12 w-12" }: { medalla: number } & IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="15" r="5.5" />
      <path d="m9.5 4.5 2.5 6 2.5-6M8 6 5.5 9l3 1.5M16 6l2.5 3-3 1.5" />
      {medalla === 1 && (
        <text x="12" y="18.6" textAnchor="middle" fontSize="7" fontWeight="800" fill="currentColor" stroke="none">
          1
        </text>
      )}
      {medalla === 2 && (
        <text x="12" y="18.6" textAnchor="middle" fontSize="7" fontWeight="800" fill="currentColor" stroke="none">
          2
        </text>
      )}
      {medalla === 3 && (
        <text x="12" y="18.6" textAnchor="middle" fontSize="7" fontWeight="800" fill="currentColor" stroke="none">
          3
        </text>
      )}
    </svg>
  );
}