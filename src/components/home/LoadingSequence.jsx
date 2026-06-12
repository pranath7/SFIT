import { useState, useEffect } from 'react';

const LoadingSequence = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const letters = ['S', 'F', 'I', 'T'];

  useEffect(() => {
    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    // Show logo after progress bar
    const logoTimer = setTimeout(() => setShowLogo(true), 1200);

    // Fade out
    const fadeTimer = setTimeout(() => setFadeOut(true), 2800);

    // Complete
    const completeTimer = setTimeout(() => onComplete?.(), 3200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(logoTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`loading-screen transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-label="Loading SFIT"
    >
      {/* Progress Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-transparent via-accent-blue to-accent-electric transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Logo Assembly */}
      <div className="flex flex-col items-center gap-3">
        <div
          className={`transition-all duration-700 ease-out ${
            showLogo ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          <img src="/logo.png" alt="S-FIT Logo" className="h-16 md:h-24 w-auto object-contain" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSequence;
