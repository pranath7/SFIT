// Architectural line-art SVG icons for each category
const CategoryIcons = {
  kitchen: (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
      {/* Cabinet door */}
      <rect x="8" y="8" width="48" height="48" rx="3"/>
      {/* Handle */}
      <path d="M38 24 L38 40" strokeWidth="2" strokeLinecap="round"/>
      {/* Panel line */}
      <line x1="8" y1="32" x2="34" y2="32" strokeWidth="0.8" opacity="0.5"/>
      {/* Detail */}
      <rect x="14" y="14" width="18" height="14" rx="1" strokeWidth="0.6" opacity="0.4"/>
      <rect x="14" y="36" width="18" height="14" rx="1" strokeWidth="0.6" opacity="0.4"/>
    </svg>
  ),
  sliding: (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
      {/* Track */}
      <line x1="4" y1="10" x2="60" y2="10"/>
      <line x1="4" y1="14" x2="60" y2="14" strokeWidth="0.6" opacity="0.5"/>
      {/* Door 1 */}
      <rect x="8" y="16" width="24" height="40" rx="2"/>
      {/* Door 2 (overlapping) */}
      <rect x="28" y="16" width="24" height="40" rx="2" opacity="0.6"/>
      {/* Roller */}
      <circle cx="20" cy="12" r="2.5" strokeWidth="0.8"/>
      <circle cx="40" cy="12" r="2.5" strokeWidth="0.8"/>
      {/* Arrow */}
      <path d="M44 36 L54 36 M51 33 L54 36 L51 39" strokeWidth="0.8" opacity="0.5"/>
    </svg>
  ),
  furniture: (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
      {/* Hinge body */}
      <rect x="8" y="12" width="20" height="40" rx="2"/>
      <rect x="36" y="12" width="20" height="40" rx="2"/>
      {/* Pin */}
      <line x1="32" y1="10" x2="32" y2="54" strokeWidth="1.5"/>
      {/* Knuckles */}
      <circle cx="32" cy="20" r="4" strokeWidth="0.8"/>
      <circle cx="32" cy="32" r="4" strokeWidth="0.8"/>
      <circle cx="32" cy="44" r="4" strokeWidth="0.8"/>
      {/* Screws */}
      <circle cx="16" cy="22" r="1.5" strokeWidth="0.6" opacity="0.5"/>
      <circle cx="16" cy="42" r="1.5" strokeWidth="0.6" opacity="0.5"/>
      <circle cx="48" cy="22" r="1.5" strokeWidth="0.6" opacity="0.5"/>
      <circle cx="48" cy="42" r="1.5" strokeWidth="0.6" opacity="0.5"/>
    </svg>
  ),
  sofa: (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
      {/* Top plate */}
      <ellipse cx="32" cy="10" rx="18" ry="6"/>
      {/* Tapered leg */}
      <path d="M16 14 L20 52 Q21 56, 24 57 L40 57 Q43 56, 44 52 L48 14"/>
      {/* Bottom */}
      <ellipse cx="32" cy="57" rx="10" ry="3.5"/>
      {/* Dimension markers */}
      <path d="M8 10 L8 57" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.3"/>
      <path d="M56 10 L56 57" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.3"/>
      {/* Cross-section line */}
      <ellipse cx="32" cy="35" rx="12" ry="4" strokeWidth="0.5" opacity="0.3"/>
    </svg>
  ),
  bathroom: (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
      {/* Shower head */}
      <ellipse cx="32" cy="14" rx="16" ry="7"/>
      {/* Water holes */}
      <circle cx="24" cy="13" r="1.5" strokeWidth="0.6" opacity="0.5"/>
      <circle cx="32" cy="12" r="1.5" strokeWidth="0.6" opacity="0.5"/>
      <circle cx="40" cy="13" r="1.5" strokeWidth="0.6" opacity="0.5"/>
      <circle cx="28" cy="16" r="1.5" strokeWidth="0.6" opacity="0.5"/>
      <circle cx="36" cy="16" r="1.5" strokeWidth="0.6" opacity="0.5"/>
      {/* Arm */}
      <path d="M32 21 L32 38"/>
      {/* Ball joint */}
      <circle cx="32" cy="40" r="4"/>
      {/* Pipe */}
      <path d="M32 44 L32 54 Q32 58, 28 58 L12 58"/>
      {/* Wall mount */}
      <rect x="4" y="52" width="12" height="12" rx="2"/>
    </svg>
  ),
  profiles: (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
      {/* L-profile */}
      <path d="M8 8 L8 56 L28 56 L28 48 L16 48 L16 8 Z" strokeWidth="1" opacity="0.6"/>
      {/* T-profile */}
      <path d="M32 8 L32 56 M24 8 L40 8 L40 16 L24 16 Z" strokeWidth="0.8" opacity="0.5"/>
      {/* Channel */}
      <path d="M44 8 L44 56 M56 8 L56 56 M44 8 L56 8 M44 56 L56 56" strokeWidth="0.8" opacity="0.5"/>
      {/* Cross-section marks */}
      <path d="M4 32 L60 32" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.2"/>
      {/* Dimension */}
      <text x="50" y="34" fontSize="5" fill="currentColor" opacity="0.3" fontFamily="monospace">mm</text>
    </svg>
  ),
};

export default CategoryIcons;
