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

  const ticker = items.map((item) => `⬡ ${item}`).join(' · ');

  return (
    <div className="w-full bg-accent-blue py-3.5 overflow-hidden relative">
      <div className="marquee-container">
        <div className="marquee-content gap-0">
          <span className="text-white text-sm font-mono tracking-widest whitespace-nowrap px-4">
            {ticker} · {ticker} · {ticker} ·{' '}
          </span>
          <span className="text-white text-sm font-mono tracking-widest whitespace-nowrap px-4" aria-hidden="true">
            {ticker} · {ticker} · {ticker} ·{' '}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TickerStrip;
