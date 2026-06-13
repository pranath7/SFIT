import { useState, useRef, useEffect } from 'react';
import { getWhatsAppLink } from '../../utils/whatsapp';

const PRODUCT_EXPERIENCES = [
  {
    id: 'scorner',
    title: 'S Corner Swivel',
    shortTitle: 'S Corner',
    emoji: '💫',
    productName: 'S-FIT Intelligent S-Corner',
    description: 'Transform blind corner cabinets into fully accessible storage. Drag the cabinet door to swing the S-shaped textured trays out in a synchronized, fluid arc.',
    specs: [
      { label: 'Basket System', val: 'Dual S-Shape Baskets' },
      { label: 'Load Capacity', val: '25 kg Per Tray' },
      { label: 'Path Type', val: 'Synchronized Swing-out' }
    ],
    whatsappMsg: 'Enquire about S-FIT S Corner Swivel Baskets'
  },
  {
    id: 'shutter',
    title: 'PVC Rolling Shutter',
    shortTitle: 'Rolling Shutter',
    emoji: '🚪',
    productName: 'S-FIT 600mm PVC Rolling Shutter',
    description: 'A vertical roll-up shutter cabinet ideal for hiding kitchen appliances. Slide the shutter handle vertically upwards to roll the slats into the top cabinet box.',
    specs: [
      { label: 'Slat Material', val: 'Premium PVC Slats' },
      { label: 'Counterbalance', val: 'Spring Tension Assist' },
      { label: 'Ideal For', val: 'Microwave & Coffee Stations' }
    ],
    whatsappMsg: 'Enquire about S-FIT 600mm PVC Rolling Shutter'
  },
  {
    id: 'pulldown',
    title: 'Wall Pull Down',
    shortTitle: 'Pull Down Rack',
    emoji: '⬇️',
    productName: 'S-FIT 600mm Wall Pull Down',
    description: 'Bring high wall cabinets within reach. Drag the pull-down bar downward to swing the double-decker steel storage basket down and forward on its hydraulic arms.',
    specs: [
      { label: 'Cabinet Width', val: '600 mm Cabinet Size' },
      { label: 'Mechanism', val: 'Dual Gas-Spring Lift' },
      { label: 'Reach Drop', val: '340mm Vertical Path' }
    ],
    whatsappMsg: 'Enquire about S-FIT 600mm Wall Cabinet Pull Down'
  }
];

const MotionExperience = () => {
  const [activeTab, setActiveTab] = useState('scorner');
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef(null);
  const startDragPos = useRef(0);
  const currentProgress = useRef(0);
  const [scale, setScale] = useState(1);

  const currentProduct = PRODUCT_EXPERIENCES.find(p => p.id === activeTab);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.parentElement.getBoundingClientRect().width;
      // Subtract small padding to prevent edge touch clipping
      const containerWidth = Math.max(280, parentWidth - 32);
      const newScale = Math.min(1, containerWidth / 480);
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const timeout = setTimeout(handleResize, 150);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [activeTab]);

  const handlePointerDown = (e) => {
    if (isClosing) return;
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);

    // Track starting point based on coordinate direction
    if (activeTab === 'shutter') {
      // Shutter moves vertically: track Y coordinate
      startDragPos.current = e.clientY - (currentProgress.current * 180);
    } else if (activeTab === 'pulldown') {
      // Pull down moves vertically: track Y coordinate
      startDragPos.current = e.clientY - (currentProgress.current * 150);
    } else {
      // S Corner moves horizontally to the LEFT: track X coordinate
      startDragPos.current = e.clientX + (currentProgress.current * 200);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    let delta = 0;
    let maxTravel = 1;

    if (activeTab === 'shutter') {
      // Shutter rolls UPwards: drag Y decreases. So progress increases as clientY decreases.
      delta = startDragPos.current - e.clientY;
      maxTravel = 180; // max Y travel in px
    } else if (activeTab === 'pulldown') {
      // Pull down swings DOWNwards: drag Y increases.
      delta = e.clientY - startDragPos.current;
      maxTravel = 150; // max Y travel in px
    } else {
      // S Corner swings horizontally to the LEFT: drag X decreases.
      delta = startDragPos.current - e.clientX;
      maxTravel = 200; // max X travel in px
    }

    const progress = Math.max(0, Math.min(delta / maxTravel, 1));
    currentProgress.current = progress;
    setDragProgress(progress);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);

    if (currentProgress.current > 0) {
      triggerSoftClose();
    }
  };

  const triggerSoftClose = () => {
    setIsClosing(true);
    const startVal = currentProgress.current;
    const startTime = performance.now();
    const duration = 1000; // ms

    const animateClose = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // Soft close curve
      const nextProgress = startVal * (1 - ease);
      
      currentProgress.current = nextProgress;
      setDragProgress(nextProgress);

      if (progress < 1) {
        requestAnimationFrame(animateClose);
      } else {
        currentProgress.current = 0;
        setDragProgress(0);
        setIsClosing(false);
      }
    };

    requestAnimationFrame(animateClose);
  };

  // Run auto-hint animation on tab changes
  useEffect(() => {
    let startHint = 0;
    const step = (now) => {
      if (!startHint) startHint = now;
      const elapsed = now - startHint;
      if (elapsed < 300) {
        const p = (elapsed / 300) * 0.35; // Open slightly for hint
        currentProgress.current = p;
        setDragProgress(p);
        requestAnimationFrame(step);
      } else if (elapsed < 500) {
        requestAnimationFrame(step);
      } else {
        triggerSoftClose();
      }
    };
    
    if (currentProgress.current === 0 && !isDragging) {
      requestAnimationFrame(step);
    }
  }, [activeTab]);

  return (
    <section className="relative py-24 bg-slate-light border-y border-[#e2e8f0] overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 geo-pattern-4 opacity-5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary text-xs font-mono tracking-[0.3em] uppercase">Interactive Experiences</span>
          <h2 className="font-sans font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-charcoal mt-3">
            Hardware Motion Gallery
          </h2>
          <p className="text-slate-body text-sm max-w-xl mx-auto mt-4 leading-relaxed">
            Interact with our premium space-saving systems. Drag the handles or doors to slide, pull down, or swivel each mechanism.
          </p>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6" />
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center gap-2 mb-12 overflow-x-auto pb-2 scrollbar-none">
          {PRODUCT_EXPERIENCES.map((prod) => (
            <button
              key={prod.id}
              onClick={() => {
                if (!isClosing && !isDragging) {
                  setActiveTab(prod.id);
                  currentProgress.current = 0;
                  setDragProgress(0);
                }
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-sans font-bold tracking-tight whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                activeTab === prod.id
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-charcoal border-[#e2e8f0] hover:bg-slate-50'
              }`}
            >
              <span>{prod.emoji}</span>
              <span>{prod.shortTitle}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Simulator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Column Left: Visual Canvas Simulator (7 cols) */}
          <div className="lg:col-span-7 w-full flex flex-col items-center justify-center p-4">
            
            {/* Responsive Scaling Wrapper */}
            <div 
              className="w-full flex items-center justify-center overflow-visible"
              style={{ height: `${300 * scale}px` }}
            >
              <div 
                ref={containerRef}
                className="relative w-[480px] h-[300px] bg-slate-900 border-4 border-slate-950 rounded-[28px] shadow-2xl overflow-hidden select-none touch-none flex-shrink-0"
                style={{ 
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center'
                }}
              >
              {/* Cabinet Interior Shadow Map */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
              
              {/* --- SIMULATOR 1: S CORNER --- */}
              {activeTab === 'scorner' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Blind Corner divider block */}
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-slate-950/60 border-r border-slate-800" />
                  
                  {/* Swing-out Shelf 2 (Inner shelf, swivels out late) */}
                  <div 
                    className="absolute w-40 h-24 bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-slate-600 rounded-[30px] flex items-center justify-center shadow-lg pointer-events-none transform-gpu origin-left"
                    style={{
                      left: '32%',
                      top: '15%',
                      transform: `translateX(${dragProgress * 100}px) rotate(${dragProgress * 70}deg) scale(${0.8 + (dragProgress * 0.2)})`,
                      opacity: dragProgress > 0.1 ? 1 : 0.3,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <span className="text-3xl filter drop-shadow">🥘</span>
                    <span className="absolute bottom-2 right-4 text-[9px] font-mono text-slate-400">Tray 2</span>
                  </div>

                  {/* Swing-out Shelf 1 (Front shelf, swivels out early) */}
                  <div 
                    className="absolute w-44 h-28 bg-gradient-to-br from-slate-700 to-slate-600 border border-slate-500 rounded-[35px] flex items-center justify-center shadow-xl pointer-events-none transform-gpu origin-left"
                    style={{
                      left: '35%',
                      top: '45%',
                      transform: `translateX(${dragProgress * 150}px) rotate(${dragProgress * 110}deg)`,
                      opacity: dragProgress > 0.05 ? 1 : 0.5
                    }}
                  >
                    <span className="text-4xl filter drop-shadow">🍳</span>
                    <span className="absolute bottom-3 right-6 text-[9px] font-mono text-white/50">Tray 1</span>
                  </div>

                  {/* Cabinet Door (User drags this) */}
                  <div 
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className="absolute inset-y-0 right-0 w-[45%] bg-gradient-to-r from-slate-800 to-slate-700 border-l border-slate-600 shadow-2xl flex items-center justify-start pl-6 cursor-grab active:cursor-grabbing origin-right"
                    style={{
                      transform: `rotateY(${dragProgress * -115}deg)`,
                      transformStyle: 'preserve-3d',
                      perspective: '1000px',
                      transition: isDragging ? 'none' : 'transform 100ms ease-out'
                    }}
                  >
                    {/* Visual Gold cabinet door handle */}
                    <div className="w-1.5 h-24 bg-gradient-to-b from-[#e2c792] via-[#bfa054] to-[#e2c792] border border-[#a28643] rounded-full shadow-md relative">
                      {dragProgress === 0 && (
                        <div className="absolute left-[-150px] top-1/2 -translate-y-1/2 bg-charcoal/90 text-white text-[10px] font-semibold py-1.5 px-3 rounded-full flex items-center gap-1 shadow-md border border-slate-700 pointer-events-none animate-pulse">
                          <span>Pull Door</span>
                          <svg className="w-3.5 h-3.5 text-primary animate-bounce-horizontal" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --- SIMULATOR 2: PVC ROLLING SHUTTER --- */}
              {activeTab === 'shutter' && (
                <div className="absolute inset-0">
                  {/* Shutter Interior Shelf: holds coffee/toaster (Revealed as shutter rolls up) */}
                  <div className="absolute inset-x-8 bottom-6 top-12 bg-slate-950/40 rounded-xl p-4 flex flex-col justify-end gap-2 border border-slate-800">
                    <div className="flex justify-around items-end h-32">
                      <span className="text-4xl filter drop-shadow animate-bounce" style={{ animationDelay: '0.1s' }}>☕</span>
                      <span className="text-4xl filter drop-shadow">🍞</span>
                      <span className="text-4xl filter drop-shadow animate-bounce" style={{ animationDelay: '0.3s' }}>🥛</span>
                    </div>
                    <div className="h-1 bg-slate-800 w-full rounded" />
                    <div className="text-[9px] font-mono text-center text-slate-500">Appliance Garage Bay</div>
                  </div>

                  {/* Sliding Shutter Door: vertical slatted layout */}
                  <div 
                    className="absolute inset-x-4 top-4 bg-slate-900 border border-slate-800 flex flex-col overflow-hidden rounded-lg shadow-inner"
                    style={{
                      height: `${240 - (dragProgress * 180)}px`
                    }}
                  >
                    {/* Render visual PVC slats */}
                    {[...Array(15)].map((_, i) => (
                      <div 
                        key={i} 
                        className="h-4 border-b border-slate-950/40 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 flex-shrink-0"
                      />
                    ))}

                    {/* Drag Handle Bar on Shutter bottom edge */}
                    <div 
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                      className="absolute bottom-0 inset-x-0 h-10 bg-slate-950 border-t-2 border-[#bfa054] cursor-grab active:cursor-grabbing flex items-center justify-center shadow-lg touch-none"
                      style={{ touchAction: 'none' }}
                    >
                      {/* Pull handle grip */}
                      <div className="w-20 h-1.5 bg-[#bfa054] rounded-full" />
                      
                      {dragProgress === 0 && (
                        <div className="absolute bottom-12 bg-charcoal/90 text-white text-[10px] font-semibold py-1.5 px-3 rounded-full flex items-center gap-1 shadow-md border border-slate-700 pointer-events-none animate-pulse">
                          <span>Swipe Up</span>
                          <svg className="w-3.5 h-3.5 text-primary animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --- SIMULATOR 3: WALL PULL DOWN --- */}
              {activeTab === 'pulldown' && (
                <div className="absolute inset-0">
                  {/* High Wall Cabinet Enclosure bounding box */}
                  <div className="absolute inset-x-12 top-6 h-28 bg-slate-950/60 border border-slate-800 rounded-lg" />

                  {/* Swing-down Rack unit */}
                  <div 
                    className="absolute w-56 h-36 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-2 border-slate-500 rounded-2xl flex flex-col justify-between p-3 shadow-2xl pointer-events-none transform-gpu origin-top"
                    style={{
                      left: '26%',
                      top: '12%',
                      transform: `translateY(${dragProgress * 110}px) translateX(${dragProgress * 15}px) scale(${1 + (dragProgress * 0.05)})`,
                    }}
                  >
                    {/* Double-tier baskets inside */}
                    <div className="h-1/2 border border-slate-600/40 rounded-lg p-1.5 flex gap-2 justify-center items-center bg-slate-900/60">
                      <span className="text-xl">🥫</span>
                      <span className="text-xl">🌾</span>
                      <span className="text-xl">🍝</span>
                    </div>
                    <div className="h-1/2 border border-slate-600/40 rounded-lg p-1.5 flex gap-2 justify-center items-center bg-slate-900/60 mt-1">
                      <span className="text-xl">🧂</span>
                      <span className="text-xl">🧴</span>
                      <span className="text-xl">🍯</span>
                    </div>

                    {/* Pull Bar Handle attachment at the bottom */}
                    <div 
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                      className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-36 h-4 bg-slate-950 border border-slate-600 rounded-full cursor-grab active:cursor-grabbing pointer-events-auto flex items-center justify-center shadow-lg"
                    >
                      <div className="w-16 h-1 bg-slate-500 rounded-full" />
                      
                      {dragProgress === 0 && (
                        <div className="absolute bottom-8 bg-charcoal/90 text-white text-[10px] font-semibold py-1.5 px-3 rounded-full flex items-center gap-1 shadow-md border border-slate-700 pointer-events-none animate-pulse">
                          <span>Pull Down</span>
                          <svg className="w-3.5 h-3.5 text-primary animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visual Pivot Arms on side walls */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line 
                      x1="100" 
                      y1="40" 
                      x2={120 + (dragProgress * 15)} 
                      y2={70 + (dragProgress * 110)} 
                      stroke="#475569" 
                      strokeWidth="3" 
                    />
                    <line 
                      x1="380" 
                      y1="40" 
                      x2={360 + (dragProgress * 15)} 
                      y2={70 + (dragProgress * 110)} 
                      stroke="#475569" 
                      strokeWidth="3" 
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

            {/* Live Drag Info Status */}
            <div className="mt-6 w-full max-w-[480px] flex items-center justify-between text-xs font-mono text-slate-body">
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isDragging ? 'bg-amber-500 animate-ping' : isClosing ? 'bg-primary animate-pulse' : 'bg-green-500'}`} />
                Status: {isDragging ? 'Dragging' : isClosing ? 'Dampening Return' : 'Standard Rest'}
              </span>
              <span>Extended: {Math.round(dragProgress * 100)}%</span>
            </div>

          </div>

          {/* Column Right: Interactive Specifications Spotlight (5 cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
            <span className="text-primary font-mono text-xs font-semibold tracking-wider uppercase">Interactive Spotlight</span>
            <h3 className="font-sans font-bold tracking-tight text-3xl text-charcoal">
              {currentProduct.productName}
            </h3>
            <p className="text-slate-body text-sm leading-relaxed">
              {currentProduct.description}
            </p>

            {/* Product Specifications */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">Mechanism Details</h4>
              <div className="space-y-2">
                {currentProduct.specs.map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-[#e2e8f0] text-sm">
                    <span className="text-slate-body/80 font-body">{spec.label}</span>
                    <span className="text-charcoal font-bold font-sans">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <a
              href={getWhatsAppLink(currentProduct.whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-charcoal hover:bg-primary text-white text-center font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enquire about this Hardware
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default MotionExperience;
