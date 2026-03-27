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
  // 14x14 pixel basketball - clean with gentle curves near center
  const _ = 0, X = 1, H = 2, A = 3, B = 4, C = 5, S = 6;
  const rows = [
    [ _, _, _, _, X, X, X, X, X, X, _, _, _, _ ],
    [ _, _, X, X, H, H, H, S, A, A, X, X, _, _ ],
    [ _, X, H, H, H, H, A, S, A, A, A, A, X, _ ],
    [ X, H, H, H, A, A, A, S, A, A, A, A, B, X ],
    [ X, H, H, A, A, A, A, S, A, A, A, B, B, X ],
    [ X, H, A, A, A, S, A, S, A, S, B, B, B, X ],
    [ X, A, A, A, S, A, A, S, A, A, S, B, C, X ],
    [ S, S, S, S, S, S, S, S, S, S, S, S, S, S ],
    [ X, A, A, A, S, A, A, S, A, A, S, C, C, X ],
    [ X, A, A, A, A, S, A, S, A, S, C, C, C, X ],
    [ X, B, B, A, A, A, A, S, A, A, A, C, C, X ],
    [ X, B, B, B, A, A, A, S, A, A, C, C, C, X ],
    [ _, X, B, B, B, B, A, S, C, C, C, C, X, _ ],
    [ _, _, X, X, C, C, C, S, C, C, X, X, _, _ ],
  ];

  const colors: Record<number, string> = {
    [X]: "#1a1a1a",
    [H]: "#fe8b38",
    [A]: "#f05a11",
    [B]: "#d24b0e",
    [C]: "#a33c0a",
    [S]: "#331a08",
  };

  const rects = rows.flatMap((row, y) =>
    row.map((v, x) => {
      if (v === 0) return null;
      return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={colors[v]} />;
    })
  );

  return (
    <svg width={size} height={size} viewBox="0 0 14 14" className={className} fill="transparent">
      {rects}
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
