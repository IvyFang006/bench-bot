interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function PacMan({ size = 24, color = "#ffd709", className }: IconProps) {
  // 13x13 pixel grid, classic pac-man facing right
  const bg = "transparent";
  const eye = "#131313";
  // Each row is 13 pixels wide
  const rows = [
    //         0  1  2  3  4  5  6  7  8  9  10 11 12
    /* 0  */ [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    /* 1  */ [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
    /* 2  */ [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    /* 3  */ [ 0, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 0, 0 ],
    /* 4  */ [ 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 0, 0 ],
    /* 5  */ [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    /* 6  */ [ 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    /* 7  */ [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    /* 8  */ [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
    /* 9  */ [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
    /* 10 */ [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    /* 11 */ [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
    /* 12 */ [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
  ];

  const rects = rows.flatMap((row, y) =>
    row.map((v, x) => {
      if (v === 0) return null;
      const fill = v === 2 ? eye : color;
      return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
    })
  );

  return (
    <svg width={size} height={size} viewBox="0 0 13 13" className={className} fill={bg}>
      {rects}
    </svg>
  );
}

export function Ghost({
  size = 24,
  color = "#ff8fa9",
  className,
}: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none">
      {/* Body */}
      <path
        d="M5 1h6v1h2v1h1v2h1v9h-2v-2h-1v2H10v-2H8v2H6v-2H5v2H3v-2H1V5h1V3h1V2h2V1z"
        fill={color}
      />
      {/* Left eye */}
      <rect x="4" y="5" width="3" height="3" fill="white" />
      <rect x="5" y="6" width="2" height="2" fill="#131313" />
      {/* Right eye */}
      <rect x="9" y="5" width="3" height="3" fill="white" />
      <rect x="10" y="6" width="2" height="2" fill="#131313" />
    </svg>
  );
}

export function Cherry({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none">
      {/* Stem */}
      <rect x="7" y="0" width="1" height="1" fill="#4a8c3f" />
      <rect x="8" y="1" width="1" height="1" fill="#4a8c3f" />
      <rect x="9" y="2" width="1" height="1" fill="#4a8c3f" />
      <rect x="10" y="3" width="1" height="1" fill="#4a8c3f" />
      <rect x="6" y="1" width="1" height="1" fill="#4a8c3f" />
      <rect x="5" y="2" width="1" height="1" fill="#4a8c3f" />
      <rect x="4" y="3" width="1" height="1" fill="#4a8c3f" />
      {/* Left cherry */}
      <path
        d="M2 5h3v1h1v3H5v1H2v-1H1V6h1V5z"
        fill="#f95630"
      />
      <rect x="2" y="6" width="1" height="1" fill="#ff8fa9" />
      {/* Right cherry */}
      <path
        d="M9 5h3v1h1v3h-1v1H9v-1H8V6h1V5z"
        fill="#f95630"
      />
      <rect x="9" y="6" width="1" height="1" fill="#ff8fa9" />
    </svg>
  );
}

export function Basketball({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      <circle cx="32" cy="32" r="30" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
      <path d="M32 2 C32 2 32 62 32 62" stroke="#c2410c" strokeWidth="1.8" fill="none" />
      <path d="M2 32 C2 32 62 32 62 32" stroke="#c2410c" strokeWidth="1.8" fill="none" />
      <path d="M8 10 C22 22 22 42 8 54" stroke="#c2410c" strokeWidth="1.8" fill="none" />
      <path d="M56 10 C42 22 42 42 56 54" stroke="#c2410c" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

export function Dot({
  size = 4,
  color = "#ffd709",
  className,
}: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 4 4" className={className} fill="none">
      <rect x="1" y="1" width="2" height="2" fill={color} />
    </svg>
  );
}
