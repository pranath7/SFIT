import { useEffect, useRef } from 'react';

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );

    const el = sectionRef.current?.querySelectorAll('.section-reveal');
    el?.forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-24 bg-white border-t border-slate-100 overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 section-reveal">
          <span className="text-primary text-xs font-mono tracking-[0.3em] uppercase">Who We Are</span>
          <h2 className="font-sans font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-charcoal mt-3">
            Our Story & Core Values
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6" />
        </div>

        {/* Unique Quote Banner - Premium Aesthetics */}
        <div className="mb-20 section-reveal">
          <div className="relative bg-gradient-to-r from-slate-50 to-white border border-slate-200/80 rounded-[30px] p-8 md:p-12 shadow-sm overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="absolute top-0 right-0 w-32 h-32 geo-pattern-2 opacity-50" />
            
            <div className="text-primary/10 flex-shrink-0">
              <svg className="w-16 h-16 md:w-24 md:h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609L9.978 5.15c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z"/>
              </svg>
            </div>
            
            <div className="flex-1 space-y-4">
              <blockquote className="font-sans font-bold tracking-tight text-xl sm:text-2xl lg:text-3xl text-charcoal italic leading-relaxed">
                "Precision is not an option; it is our promise. We shape the architectural hardware details that quietly support, secure, and refine the spaces you build."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-slate-400" />
                <span className="text-slate-body text-xs font-mono uppercase tracking-widest font-semibold">The SFIT Philosophy</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Values & Heritage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          
          {/* Box 1: Our Heritage */}
          <div className="section-reveal group bg-slate-50 border border-slate-200/80 rounded-2xl p-8 hover:bg-white hover:border-primary/45 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="font-sans font-bold tracking-tight text-2xl text-charcoal group-hover:text-primary transition-colors">
                  Our Heritage
                </h3>
                <p className="text-slate-body text-sm leading-relaxed">
                  Established under the vision of our founder, <strong className="text-charcoal">Vicky Jain</strong>, SFIT was built on a foundation of profound industry expertise. Backed by <strong className="text-primary font-semibold">11 years of deep-rooted experience</strong> in architectural hardware, Vicky Jain set out to deliver hardware that meets global standards of precision.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-200/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                VJ
              </div>
              <div>
                <div className="text-charcoal text-xs font-semibold">Vicky Jain</div>
                <div className="text-slate-body text-[10px] font-mono">Founder & Industry Veteran</div>
              </div>
            </div>
          </div>

          {/* Box 2: Our Mission */}
          <div className="section-reveal group bg-slate-50 border border-slate-200/80 rounded-2xl p-8 hover:bg-white hover:border-primary/45 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043" />
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="font-sans font-bold tracking-tight text-2xl text-charcoal group-hover:text-primary transition-colors">
                  Our Mission
                </h3>
                <p className="text-slate-body text-sm leading-relaxed">
                  Our mission is to engineer and supply premium-grade, highly reliable hardware fittings. We cater to the exact needs of modern builders, architects, and homeowners by offering durable, state-of-the-art sliding tracks, profiles, and kitchen organizers that maximize space efficiency and performance.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-body font-mono">
              <span>ESTABLISHED 2015</span>
              <span>✦ PRECISION</span>
            </div>
          </div>

          {/* Box 3: Our Vision */}
          <div className="section-reveal group bg-slate-50 border border-slate-200/80 rounded-2xl p-8 hover:bg-white hover:border-primary/45 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="font-sans font-bold tracking-tight text-2xl text-charcoal group-hover:text-primary transition-colors">
                  Our Vision & Plan
                </h3>
                <p className="text-slate-body text-sm leading-relaxed">
                  To become India's preeminent destination for high-end architectural hardware. We strive to pioneer next-generation fittings and build robust supply pipelines that offer seamless national delivery, making luxury standards accessible to trade and retail projects across all major Indian cities.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-body font-mono">
              <span>PAN-INDIA REACH</span>
              <span>✦ SERVICE</span>
            </div>
          </div>

        </div>

        {/* Core USP strip */}
        <div className="mt-20 pt-16 border-t border-slate-100 section-reveal">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '11+', label: 'Years Experience' },
              { num: '100%', label: 'Premium Quality' },
              { num: '6', label: 'Product Lines' },
              { num: '28+', label: 'States Served' },
            ].map((stat, idx) => (
              <div key={idx} className="relative group border-r border-slate-200/50 last:border-r-0 px-4">
                <div className="font-sans font-bold tracking-tight text-4xl md:text-5xl text-primary leading-none mb-2">
                  {stat.num}
                </div>
                <div className="text-charcoal text-xs md:text-sm font-body tracking-wider uppercase opacity-80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
