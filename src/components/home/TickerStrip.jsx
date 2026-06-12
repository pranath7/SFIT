const TickerStrip = () => {
  const items = [
    'KITCHEN ACCESSORIES',
    'SLIDING FITTINGS',
    'FURNITURE FIXTURES',
    'SOFA LEGS',
    'BATHROOM ACCESSORIES',
    'PROFILES',
    'STAINLESS STEEL FITTINGS',
    'ALUMINUM PROFILES',
    'HYDRAULIC HINGES',
    'DRAWER CHANNELS',
  ];

  return (
    <div className="w-full bg-[#f8fafc] border-y border-[#e2e8f0] py-4 overflow-hidden relative">
      <div className="marquee-container">
        <div className="marquee-content gap-0 flex items-center">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-charcoal text-xs font-mono tracking-widest whitespace-nowrap px-4 flex items-center gap-8">
              {items.map((item) => (
                <span key={item} className="flex items-center gap-8">
                  <span className="text-primary">✦</span>
                  <span>{item}</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TickerStrip;
