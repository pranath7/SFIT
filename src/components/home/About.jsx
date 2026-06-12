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

  const usps = [
    {
      title: 'Curated Quality',
      description: 'Every product in our catalog is hand-selected for build quality, finish, and durability. We work only with manufacturers who meet our exacting standards.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/>
        </svg>
      ),
    },
    {
      title: 'Trade Pricing',
      description: 'Competitive wholesale pricing for builders, architects, and interior designers. Volume discounts available for large-scale projects.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>
        </svg>
      ),
    },
    {
      title: 'Fast Fulfillment',
      description: 'Maintained inventory across categories ensures quick dispatch. Most orders ship within 48 hours to locations across India.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
        </svg>
      ),
    },
    {
      title: 'Nationwide Reach',
      description: 'Serving architects, builders, and retailers across 28+ states. From Mumbai high-rises to Chennai villas — we deliver everywhere.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="about" ref={sectionRef} className="relative py-24 bg-navy-dark overflow-hidden">
      <div className="blueprint-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 section-reveal">
          <span className="text-accent-blue text-xs font-mono tracking-[0.3em] uppercase">About SFIT</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mt-3">Built for Builders</h2>
          <div className="w-16 h-[2px] bg-accent-blue mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — Quote Card */}
          <div className="section-reveal">
            <div className="relative bg-navy-card rounded-2xl p-10 border border-accent-blue/10 geo-pattern-3 overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24">
                <svg className="w-full h-full text-accent-blue/10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                  <line x1="100" y1="0" x2="0" y2="100"/>
                  <line x1="100" y1="20" x2="20" y2="100"/>
                  <line x1="100" y1="40" x2="40" y2="100"/>
                  <line x1="100" y1="60" x2="60" y2="100"/>
                  <line x1="100" y1="80" x2="80" y2="100"/>
                </svg>
              </div>

              {/* Quote */}
              <div className="relative">
                <svg className="w-10 h-10 text-accent-blue/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609L9.978 5.15c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z"/>
                </svg>
                <blockquote className="font-display text-2xl sm:text-3xl text-white italic leading-snug mb-8">
                  Built for builders.<br />Designed for designers.
                </blockquote>

                <div className="space-y-4 text-steel text-sm leading-relaxed">
                  <p>
                    SFIT was founded in Chennai with a singular vision: to supply India's builders, architects, and interior designers with the finest hardware and fittings — at prices that make sense for every project scale.
                  </p>
                  <p>
                    From a small warehouse to a comprehensive hardware catalog spanning six categories, we've grown by staying true to what matters: precision engineering, consistent quality, and genuine trade partnerships.
                  </p>
                  <p>
                    Every handle, hinge, and profile in our catalog has been selected for its build quality, finish, and longevity. We don't stock mediocre — we curate excellence.
                  </p>
                </div>

                {/* Founder signature */}
                <div className="mt-8 pt-6 border-t border-accent-blue/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
                    <span className="font-display text-accent-electric text-sm">S</span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">SFIT Team</div>
                    <div className="text-steel/60 text-xs font-mono">Chennai, India</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — USP Cards */}
          <div className="space-y-4">
            {usps.map((usp, index) => (
              <div
                key={usp.title}
                className="section-reveal group bg-navy-card rounded-xl p-6 border border-accent-blue/5 hover:border-accent-blue/20 transition-all duration-500 hover:-translate-y-0.5"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue flex-shrink-0 group-hover:bg-accent-blue/20 transition-colors duration-300">
                    {usp.icon}
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-white mb-1 group-hover:text-accent-electric transition-colors">
                      {usp.title}
                    </h4>
                    <p className="text-steel text-sm leading-relaxed">{usp.description}</p>
                  </div>
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
