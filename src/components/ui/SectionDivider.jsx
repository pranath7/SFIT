const SectionDivider = ({ flip = false, color = '#050d1a' }) => {
  return (
    <div className="relative h-16 -mt-1 -mb-1 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
      >
        {/* Thin blue diagonal line */}
        <line x1="0" y1="58" x2="1440" y2="6" stroke="#1a6fff" strokeWidth="1" opacity="0.15"/>
        {/* Fill shape */}
        <path
          d={`M0 ${flip ? '0' : '64'} L0 48 Q360 12, 720 32 Q1080 52, 1440 16 L1440 ${flip ? '0' : '64'} Z`}
          fill={color}
        />
      </svg>
    </div>
  );
};

export default SectionDivider;
