import { useEffect, useRef } from 'react';
import WireframeProducts from './WireframeProducts';
import { getWhatsAppLink } from '../../utils/whatsapp';

const Hero = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const wireframeRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (textRef.current) {
            textRef.current.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
          }
          if (wireframeRef.current) {
            wireframeRef.current.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
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
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Blueprint Grid Background */}
      <div className="blueprint-grid" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/50 via-transparent to-navy-deep pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/80 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column — Text */}
          <div ref={textRef} className="space-y-8">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-blue/20 bg-accent-blue/5"
              style={{ animation: 'fadeUp 0.6s ease-out 0.3s both' }}
            >
              <svg className="w-4 h-4 text-accent-blue" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
              </svg>
              <span className="text-accent-electric text-xs font-mono tracking-widest uppercase">Precision Hardware Solutions</span>
            </div>

            {/* Headline */}
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1]"
              style={{ animation: 'fadeUp 0.8s ease-out 0.5s both' }}
            >
              Where Every Detail{' '}
              <span className="relative">
                <span className="text-accent-electric">Fits Perfectly</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
                  <path d="M0 8 Q75 0, 150 8 Q225 16, 300 8" stroke="#1a6fff" strokeWidth="2" fill="none" opacity="0.5"/>
                </svg>
              </span>
              .
            </h1>

            {/* Subtext */}
            <p
              className="text-steel text-lg sm:text-xl max-w-xl leading-relaxed font-body"
              style={{ animation: 'fadeUp 0.8s ease-out 0.7s both' }}
            >
              Premium kitchen accessories, sliding fittings, furniture hardware, sofa legs, bathroom fittings, and architectural profiles — engineered for the spaces you build.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4"
              style={{ animation: 'fadeUp 0.8s ease-out 0.9s both' }}
            >
              <a
                href="#products"
                onClick={(e) => { e.preventDefault(); document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-8 py-3.5 bg-accent-blue hover:bg-accent-electric text-white font-semibold rounded-lg transition-all duration-300 shadow-glow-blue hover:shadow-glow-blue-lg text-sm"
                id="hero-explore-cta"
              >
                Explore Products
              </a>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-3.5 border border-whatsapp/40 text-whatsapp font-semibold rounded-lg hover:bg-whatsapp/10 transition-all duration-300 flex items-center gap-2 text-sm"
                id="hero-whatsapp-cta"
              >
                <svg className="w-5 h-5 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Us
              </a>
            </div>

            {/* Trust Badges */}
            <div
              className="flex flex-wrap gap-6 pt-4"
              style={{ animation: 'fadeUp 0.8s ease-out 1.1s both' }}
            >
              {[
                { label: 'Premium Fittings', icon: '◈' },
                { label: 'Pan India Shipping', icon: '◈' },
                { label: 'Trade & Retail Supply', icon: '◈' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2">
                  <span className="text-accent-blue text-xs">{badge.icon}</span>
                  <span className="text-steel/80 text-xs font-mono tracking-wide">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — 3D Wireframes */}
          <div ref={wireframeRef} className="relative h-[400px] lg:h-[500px] hidden md:block">
            <WireframeProducts />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span className="text-steel/40 text-xs font-mono tracking-widest uppercase">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-accent-blue/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
