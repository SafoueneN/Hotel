// Illustrations SVG maison (aucune dependance a des images externes / photos).
// Palette alignee sur le design system (voir index.css).

export function IllustrationHero(props) {
  return (
    <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="skyA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a78d6" stopOpacity="0.18" />
          <stop offset="1" stopColor="#2a78d6" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="towerA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a78d6" />
          <stop offset="1" stopColor="#1c5cab" />
        </linearGradient>
        <linearGradient id="towerB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3aa7" />
          <stop offset="1" stopColor="#2d2168" />
        </linearGradient>
        <linearGradient id="towerC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1baf7a" />
          <stop offset="1" stopColor="#0d7e57" />
        </linearGradient>
      </defs>

      <circle cx="210" cy="290" r="150" fill="url(#skyA)" />

      {/* soleil */}
      <circle cx="330" cy="70" r="30" fill="#eda100" opacity="0.85" />

      {/* nuage */}
      <g opacity="0.5">
        <ellipse cx="90" cy="80" rx="34" ry="14" fill="#ffffff" />
        <ellipse cx="115" cy="74" rx="24" ry="12" fill="#ffffff" />
        <ellipse cx="68" cy="74" rx="20" ry="10" fill="#ffffff" />
      </g>

      {/* immeuble B (arriere, violet) */}
      <rect x="60" y="150" width="70" height="170" rx="6" fill="url(#towerB)" />
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <rect
            key={`b-${row}-${col}`}
            x={72 + col * 20}
            y={166 + row * 28}
            width="10"
            height="14"
            rx="1.5"
            fill="#ffffff"
            opacity="0.55"
          />
        ))
      )}

      {/* immeuble C (arriere droite, vert) */}
      <rect x="300" y="180" width="56" height="140" rx="6" fill="url(#towerC)" />
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 2 }).map((_, col) => (
          <rect
            key={`c-${row}-${col}`}
            x={312 + col * 22}
            y={196 + row * 28}
            width="10"
            height="14"
            rx="1.5"
            fill="#ffffff"
            opacity="0.55"
          />
        ))
      )}

      {/* immeuble principal (avant, bleu) */}
      <rect x="145" y="90" width="120" height="230" rx="8" fill="url(#towerA)" />
      {Array.from({ length: 7 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <rect
            key={`a-${row}-${col}`}
            x={161 + col * 24}
            y={110 + row * 28}
            width="12"
            height="16"
            rx="2"
            fill="#ffffff"
            opacity={(row + col) % 3 === 0 ? 0.95 : 0.45}
          />
        ))
      )}
      {/* porte */}
      <rect x="188" y="286" width="34" height="34" rx="4" fill="#ffffff" opacity="0.85" />

      {/* sol */}
      <rect x="20" y="320" width="380" height="6" rx="3" fill="currentColor" opacity="0.12" />
    </svg>
  );
}

export function IllustrationEmpty(props) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="100" cy="138" rx="70" ry="10" fill="currentColor" opacity="0.08" />
      <rect x="55" y="55" width="90" height="65" rx="10" fill="currentColor" opacity="0.08" />
      <rect x="55" y="55" width="90" height="65" rx="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M75 55V42a8 8 0 0 1 8-8h34a8 8 0 0 1 8 8v13" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <circle cx="100" cy="86" r="14" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path d="M94 86h12M100 80v12" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IllustrationAuth(props) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="100" cy="138" rx="66" ry="9" fill="currentColor" opacity="0.08" />
      <rect x="60" y="46" width="80" height="80" rx="14" fill="currentColor" opacity="0.07" />
      <circle cx="100" cy="78" r="16" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path d="M78 112c3-13 13-20 22-20s19 7 22 20" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
