import { useEffect, useRef } from 'react';
import { getWhatsAppLink } from '../../utils/whatsapp';

const Hero = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (textRef.current) {
            textRef.current.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[90vh] pt-28 lg:pt-36 flex items-center bg-white overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* Left Column — Text */}
        <div ref={textRef} className="w-full lg:w-1/2 space-y-8 z-10 pt-10 lg:pt-0">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5"
            style={{ animation: 'fadeUp 0.6s ease-out 0.1s both' }}
          >
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
            </svg>
            <span className="text-primary text-xs font-mono tracking-widest uppercase font-semibold">Precision Hardware Solutions</span>
          </div>

          {/* Headline */}
          <h1
            className="font-sans font-bold tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-charcoal leading-[1.05]"
            style={{ animation: 'fadeUp 0.8s ease-out 0.3s both' }}
          >
            Where Every Detail<br />
            <span className="relative inline-block mt-2">
              <span className="text-primary relative z-10">Fits Perfectly</span>
              <span className="absolute bottom-2 left-0 w-full h-[6px] bg-primary/20 z-0" />
            </span>
            .
          </h1>

          {/* Subtext */}
          <p
            className="text-slate-500 text-lg sm:text-xl max-w-lg leading-relaxed font-body"
            style={{ animation: 'fadeUp 0.8s ease-out 0.5s both' }}
          >
            Premium kitchen accessories, sliding fittings, furniture hardware, sofa legs, bathroom fittings, and architectural profiles — engineered for the spaces you build.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4 pt-4"
            style={{ animation: 'fadeUp 0.8s ease-out 0.7s both' }}
          >
            <a
              href="#products"
              onClick={(e) => { e.preventDefault(); document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-8 py-4 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_8px_40px_rgb(37,99,235,0.4)] hover:-translate-y-1 text-sm flex items-center gap-2"
              id="hero-explore-cta"
            >
              Explore Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 border-2 border-slate-200 hover:border-primary hover:bg-slate-50 text-charcoal font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 text-sm"
              id="hero-whatsapp-cta"
            >
              <svg className="w-5 h-5 text-whatsapp group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
          </div>

          {/* Trust Badges */}
          <div
            className="flex flex-wrap gap-8 pt-8"
            style={{ animation: 'fadeUp 0.8s ease-out 0.9s both' }}
          >
            {[
              { label: 'Premium Quality', icon: '✦' },
              { label: 'Pan India Shipping', icon: '✦' },
              { label: 'Trade & Retail', icon: '✦' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2">
                <span className="text-primary text-sm">{badge.icon}</span>
                <span className="text-slate-600 text-xs font-mono font-medium tracking-wide uppercase">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column — Image Showcase */}
        <div 
          className="w-full lg:w-1/2 relative h-[50vh] lg:h-[80vh] flex items-center justify-center lg:justify-end"
          style={{ animation: 'slideInRight 1s ease-out 0.4s both' }}
        >
          <div className="absolute inset-0 right-0 lg:-right-8 top-0 bottom-0 bg-slate-50 lg:rounded-l-[80px] overflow-hidden shadow-2xl">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105" 
              style={{ backgroundImage: "url('/hero-bg.png')" }} 
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-charcoal/5" />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/4 -left-6 lg:left-8 w-24 h-24 bg-white rounded-2xl shadow-xl p-4 hidden md:flex items-center justify-center animate-float">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
