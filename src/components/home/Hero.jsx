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
      className="relative min-h-[90vh] pt-40 lg:pt-[200px] flex flex-col justify-between bg-[#050d1a] bg-gradient-cta text-white overflow-hidden"
    >
      {/* Floating Background Hexagons */}
      <div className="absolute top-24 left-12 w-32 h-32 text-white/5 pointer-events-none animate-float hidden lg:block select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          <polygon points="50,5 95,30 95,80 50,95 5,80 5,30" />
        </svg>
      </div>
      <div className="absolute bottom-40 right-[40%] w-24 h-24 text-white/5 pointer-events-none animate-float-delayed hidden lg:block select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          <polygon points="50,5 95,30 95,80 50,95 5,80 5,30" />
        </svg>
      </div>
      <div className="absolute top-1/4 right-10 w-40 h-40 text-white/5 pointer-events-none animate-pulse hidden lg:block select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current" stroke="currentColor" strokeWidth="1" fill="none">
          <polygon points="50,5 95,30 95,80 50,95 5,80 5,30" />
        </svg>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 flex-grow pb-12 lg:pb-16">
        
        {/* Left Column — Text */}
        <div ref={textRef} className="w-full lg:w-1/2 space-y-8 z-10 pt-10 lg:pt-0">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            <svg className="w-4 h-4 text-blue-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
            </svg>
            <span className="text-blue-400 text-xs font-mono tracking-widest uppercase font-semibold">SFIT Hardware — Precision Solutions</span>
          </div>

          {/* Headline */}
          <h1
            className="font-sans font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.05]"
            style={{ animation: 'fadeUp 0.8s ease-out 0.3s both' }}
          >
            STRONG HARDWARE<br />
            <span className="relative inline-block mt-2">
              <span className="text-blue-400 relative z-10">FOR STRONGER SPACES</span>
              <span className="absolute bottom-2 left-0 w-full h-[6px] bg-blue-400/20 z-0" />
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="text-slate-300 text-lg sm:text-xl max-w-lg leading-relaxed font-body"
            style={{ animation: 'fadeUp 0.8s ease-out 0.5s both' }}
          >
            Discover premium modular kitchen accessories, sliding wardrobe fittings, and architectural profiles by S-FIT Kitchen & Hardware. The leading choice for S Fit Hardware & Kitchen in Chennai.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4 pt-4"
            style={{ animation: 'fadeUp 0.8s ease-out 0.7s both' }}
          >
            <a
              href="#products"
              onClick={(e) => { e.preventDefault(); document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-8 py-4 bg-primary hover:bg-[#152e56] text-white font-semibold rounded-lg transition-all duration-300 shadow-[0_8px_30px_rgba(27,59,111,0.4)] hover:-translate-y-1 text-sm flex items-center gap-2"
              id="hero-explore-cta"
            >
              Explore Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 border-2 border-white/60 hover:border-white hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 text-sm"
              id="hero-whatsapp-cta"
            >
              <svg className="w-5 h-5 text-white group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Catalogue
            </a>
          </div>
        </div>

        {/* Right Column — Honeycomb Image Showcase */}
        <div 
          className="w-full lg:w-1/2 relative h-[50vh] lg:h-[65vh] flex items-center justify-center"
          style={{ animation: 'slideInRight 1s ease-out 0.4s both' }}
        >
          <div className="relative w-full max-w-[440px] h-full flex items-center justify-center">
            
            {/* Hexagon 1: Main Center */}
            <div className="absolute w-[240px] md:w-[280px] aspect-[1/1.15] z-10 hover:z-25 group transition-transform duration-500 hover:scale-105 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-cyan-500/10 hexagon-shape scale-[1.02] -z-10 shadow-xl" />
              <div className="absolute inset-0 bg-slate-900 hexagon-shape overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[1.5s] group-hover:scale-110" 
                  style={{ backgroundImage: "url('/images/products/page_04_product_03.jpg')" }} 
                />
                <div className="absolute inset-0 bg-charcoal/5 group-hover:bg-charcoal/0 transition-colors duration-500" />
              </div>
            </div>

            {/* Hexagon 2: Top Left Offset */}
            <div className="absolute w-[150px] md:w-[170px] aspect-[1/1.15] -translate-x-[110px] -translate-y-[110px] md:-translate-x-[130px] md:-translate-y-[130px] z-0 hover:z-25 group transition-transform duration-500 hover:scale-105 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/5 hexagon-shape scale-[1.02] -z-10" />
              <div className="absolute inset-0 bg-slate-900 hexagon-shape overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[1.5s] group-hover:scale-110" 
                  style={{ backgroundImage: "url('/images/products/page_02_product_01.jpg')" }} 
                />
                <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/0 transition-colors duration-500" />
              </div>
            </div>

            {/* Hexagon 3: Bottom Right Offset */}
            <div className="absolute w-[150px] md:w-[170px] aspect-[1/1.15] translate-x-[110px] translate-y-[110px] md:translate-x-[130px] md:translate-y-[130px] z-0 hover:z-25 group transition-transform duration-500 hover:scale-105 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/5 hexagon-shape scale-[1.02] -z-10" />
              <div className="absolute inset-0 bg-slate-900 hexagon-shape overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[1.5s] group-hover:scale-110" 
                  style={{ backgroundImage: "url('/images/products/page_06_product_01.jpg')" }} 
                />
                <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/0 transition-colors duration-500" />
              </div>
            </div>

            {/* Decorative Floating Hexagon Badge */}
            <div className="absolute top-[10%] right-[5%] w-14 h-14 bg-slate-900 shadow-lg flex items-center justify-center animate-float hexagon-shape border border-slate-800 z-30 select-none">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="12,2 22,8.5 22,19.5 12,24 2,19.5 2,8.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

          </div>
        </div>

      </div>

      {/* Mockup's Horizontal Features Strip at bottom of Hero */}
      <div className="w-full bg-[#050d1a]/85 border-t border-slate-800/80 py-8 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043" />
              </svg>
            </div>
            <div>
              <h4 className="font-sans font-bold tracking-wider text-xs uppercase text-white font-semibold">Trusted Quality</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-normal">Tested for strength, durability & reliability</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-sans font-bold tracking-wider text-xs uppercase text-white font-semibold">Precision Engineered</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-normal">Perfect fit with advanced technology</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.173-.427.76-.427.933 0l2.366 5.867 6.137.9a.5.5 0 01.278.853l-4.441 4.341 1.048 6.113a.5.5 0 01-.726.527L12 19.177l-5.489 2.879a.5.5 0 01-.727-.527l1.048-6.113L2.39 11.12a.5.5 0 01.277-.853l6.138-.9L11.48 3.5z" />
              </svg>
            </div>
            <div>
              <h4 className="font-sans font-bold tracking-wider text-xs uppercase text-white font-semibold">Stylish Designs</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-normal">Modern, elegant & functional designs</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.421.069.846.069 1.275A9.001 9.001 0 0112 21.75c-1.776 0-3.44-.519-4.834-1.416a4.808 4.808 0 01-1.553-2.137l-.53-1.65a1.875 1.875 0 01.442-1.996l1.107-1.107zM3 10.5h1.875c.621 0 1.125.504 1.125 1.125v7.5c0 .621-.504 1.125-1.125 1.125H3A1.125 1.125 0 011.875 19.125v-7.5A1.125 1.125 0 013 10.5z" />
              </svg>
            </div>
            <div>
              <h4 className="font-sans font-bold tracking-wider text-xs uppercase text-white font-semibold">Customer Satisfaction</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-normal">Dedicated support you can count on</p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;
