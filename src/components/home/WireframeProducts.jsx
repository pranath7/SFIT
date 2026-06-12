const WireframeProducts = () => {
  return (
    <div className="wireframe-container relative w-full h-full flex items-center justify-center" aria-hidden="true">
      {/* Cabinet Handle */}
      <div className="absolute top-[10%] right-[15%] wireframe-item animate-float" style={{ animationDelay: '0s' }}>
        <div className="wireframe-rotate">
          <svg viewBox="0 0 120 80" className="w-32 h-24 md:w-40 md:h-28" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Handle bar */}
            <path d="M20 55 C20 35, 30 25, 45 25 L75 25 C90 25, 100 35, 100 55" stroke="#1a6fff" strokeWidth="1.2" fill="none" opacity="0.4"/>
            {/* Mounting plates */}
            <rect x="15" y="52" width="18" height="8" rx="2" stroke="#4d9fff" strokeWidth="1" fill="none" opacity="0.3"/>
            <rect x="87" y="52" width="18" height="8" rx="2" stroke="#4d9fff" strokeWidth="1" fill="none" opacity="0.3"/>
            {/* Screws */}
            <circle cx="24" cy="65" r="2" stroke="#1a6fff" strokeWidth="0.8" fill="none" opacity="0.25"/>
            <circle cx="96" cy="65" r="2" stroke="#1a6fff" strokeWidth="0.8" fill="none" opacity="0.25"/>
            {/* Detail lines */}
            <path d="M35 25 L35 20 M60 25 L60 18 M85 25 L85 20" stroke="#4d9fff" strokeWidth="0.5" opacity="0.2"/>
          </svg>
        </div>
      </div>

      {/* Sofa Leg */}
      <div className="absolute bottom-[15%] left-[10%] wireframe-item animate-float" style={{ animationDelay: '2s' }}>
        <div className="wireframe-rotate-reverse">
          <svg viewBox="0 0 60 120" className="w-20 h-32 md:w-24 md:h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Top plate */}
            <ellipse cx="30" cy="12" rx="22" ry="8" stroke="#4d9fff" strokeWidth="1" fill="none" opacity="0.4"/>
            {/* Tapered leg */}
            <path d="M12 15 L18 100 Q19 108, 22 110 L38 110 Q41 108, 42 100 L48 15" stroke="#1a6fff" strokeWidth="1.2" fill="none" opacity="0.35"/>
            {/* Bottom */}
            <ellipse cx="30" cy="110" rx="10" ry="4" stroke="#4d9fff" strokeWidth="0.8" fill="none" opacity="0.3"/>
            {/* Dimension lines */}
            <path d="M5 12 L5 110 M55 12 L55 110" stroke="#1a6fff" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.15"/>
            <path d="M8 5 L52 5" stroke="#1a6fff" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.15"/>
          </svg>
        </div>
      </div>

      {/* Shower Fitting */}
      <div className="absolute top-[40%] right-[5%] wireframe-item animate-float" style={{ animationDelay: '4s' }}>
        <div className="wireframe-rotate-slow">
          <svg viewBox="0 0 80 120" className="w-24 h-32 md:w-28 md:h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shower head */}
            <ellipse cx="40" cy="20" rx="25" ry="10" stroke="#1a6fff" strokeWidth="1" fill="none" opacity="0.4"/>
            <ellipse cx="40" cy="20" rx="18" ry="7" stroke="#4d9fff" strokeWidth="0.6" fill="none" opacity="0.25"/>
            {/* Water holes */}
            <circle cx="32" cy="18" r="1.5" stroke="#4d9fff" strokeWidth="0.5" fill="none" opacity="0.2"/>
            <circle cx="40" cy="17" r="1.5" stroke="#4d9fff" strokeWidth="0.5" fill="none" opacity="0.2"/>
            <circle cx="48" cy="18" r="1.5" stroke="#4d9fff" strokeWidth="0.5" fill="none" opacity="0.2"/>
            <circle cx="36" cy="22" r="1.5" stroke="#4d9fff" strokeWidth="0.5" fill="none" opacity="0.2"/>
            <circle cx="44" cy="22" r="1.5" stroke="#4d9fff" strokeWidth="0.5" fill="none" opacity="0.2"/>
            {/* Neck */}
            <path d="M40 30 L40 55" stroke="#1a6fff" strokeWidth="1.2" fill="none" opacity="0.35"/>
            {/* Ball joint */}
            <circle cx="40" cy="58" r="6" stroke="#4d9fff" strokeWidth="1" fill="none" opacity="0.3"/>
            {/* Arm */}
            <path d="M40 64 L40 90 C40 95, 35 100, 30 100 L15 100" stroke="#1a6fff" strokeWidth="1.2" fill="none" opacity="0.35"/>
            {/* Wall mount */}
            <rect x="5" y="92" width="14" height="16" rx="3" stroke="#4d9fff" strokeWidth="1" fill="none" opacity="0.3"/>
          </svg>
        </div>
      </div>

      {/* Hinge (smaller accent piece) */}
      <div className="absolute bottom-[30%] right-[35%] wireframe-item animate-float hidden md:block" style={{ animationDelay: '1s' }}>
        <div className="wireframe-rotate" style={{ animationDuration: '35s' }}>
          <svg viewBox="0 0 80 60" className="w-20 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Left plate */}
            <rect x="5" y="10" width="30" height="40" rx="3" stroke="#1a6fff" strokeWidth="0.8" fill="none" opacity="0.3"/>
            {/* Right plate */}
            <rect x="45" y="10" width="30" height="40" rx="3" stroke="#4d9fff" strokeWidth="0.8" fill="none" opacity="0.25"/>
            {/* Pin */}
            <line x1="40" y1="8" x2="40" y2="52" stroke="#1a6fff" strokeWidth="1" opacity="0.35"/>
            {/* Knuckles */}
            <circle cx="40" cy="18" r="5" stroke="#4d9fff" strokeWidth="0.6" fill="none" opacity="0.2"/>
            <circle cx="40" cy="30" r="5" stroke="#4d9fff" strokeWidth="0.6" fill="none" opacity="0.2"/>
            <circle cx="40" cy="42" r="5" stroke="#4d9fff" strokeWidth="0.6" fill="none" opacity="0.2"/>
          </svg>
        </div>
      </div>

      {/* Grid Lines Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wireframe-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4d9fff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wireframe-grid)"/>
        </svg>
      </div>
    </div>
  );
};

export default WireframeProducts;
