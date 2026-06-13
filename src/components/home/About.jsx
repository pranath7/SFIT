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
      title: 'Premium Quality Products',
      desc: 'Crafted from the finest materials, our hardware undergoes rigorous inspection to guarantee flaws are eliminated.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043" />
        </svg>
      )
    },
    {
      title: 'Modern & Innovative Designs',
      desc: 'Designed by architectural interior professionals to match the sleek aesthetics of contemporary home and workspace layouts.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-1.305 1.305l-1.11 2.22a1 1 0 001.442 1.442l2.22-1.11a3 3 0 001.306-1.305l2.22-4.44a3 3 0 00-1.306-1.306l-4.44-2.22zm10.106-9.562l-1.12 2.24-2.24-1.12 1.12-2.24a2 2 0 012.828 0l-.588.588z" />
        </svg>
      )
    },
    {
      title: 'Durable & Reliable Performance',
      desc: 'Engineered for smooth motion, high loading capacity, and wear resistance, ensuring long-lasting usage cycles.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
        </svg>
      )
    },
    {
      title: 'Trusted Industry Experience',
      desc: 'Rooted in Sathyam Hardwares legacy of trust since 2015, providing genuine solutions to thousands of clients.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c-.196-.396-.74-.396-.936 0L8.27 7.912l-4.872.637c-.438.057-.613.59-.276.893l3.648 3.208-1.03 4.794c-.09.422.373.757.749.534L10 15.611l4.498 2.378c.376.223.839-.112.749-.534l-1.03-4.794 3.648-3.208c.337-.303.162-.836-.276-.893l-4.872-.637-2.272-4.413z" />
        </svg>
      )
    },
    {
      title: 'Customer-First Approach',
      desc: 'From custom designer advice to prompt after-sales support on WhatsApp, we prioritize your satisfaction above all.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="relative py-24 bg-white border-t border-slate-100 overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 section-reveal">
          <span className="text-primary text-xs font-mono tracking-[0.3em] uppercase">S-FIT – TRUSTED QUALITY</span>
          <h2 className="font-sans font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-charcoal mt-3">
            Our Legacy & Story
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6" />
        </div>

        {/* Brand Legacy Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Left Column — Detailed Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6 section-reveal">
            <h3 className="font-sans font-bold tracking-tight text-2xl text-charcoal">
              Born from a Heritage of Trust
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              S-FIT is a brand born from the legacy of <strong>Sathyam Hardwares</strong>, a trusted name in the hardware industry since <strong>2015</strong>. Our journey began with the valuable support and guidance of Mr. <strong>Prakash Kumarji Mangilalji Chajjed</strong>, whose vision and encouragement laid the foundation for our growth.
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              Building on this strong foundation, his sons <strong>Vicky Jain</strong> (an Interior Designer) and <strong>Akshay Jain</strong> (a Business Management professional) expanded the business. They introduced exclusive designer handles, door fittings, and premium kitchen accessories to meet the changing needs of modern interiors.
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              To continue this legacy and bring innovative, high-quality hardware solutions to a wider market, we launched <strong>S-FIT</strong> — a brand dedicated to premium hardware fittings that combine style, durability, and performance. Today, S-FIT offers a wide range of furniture and architectural hardware designed to enhance homes, offices, and commercial spaces. Every product reflects our commitment to quality, reliability, and customer satisfaction.
            </p>
          </div>

          {/* Right Column — Founders & Quick Specs (5 cols) */}
          <div className="lg:col-span-5 space-y-6 section-reveal">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-6">
              <h4 className="font-sans font-bold tracking-tight text-lg text-charcoal border-b border-slate-200 pb-3">
                Key Leadership
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    VJ
                  </div>
                  <div>
                    <div className="text-charcoal text-sm font-semibold">Vicky Jain</div>
                    <div className="text-slate-500 text-xs font-mono">Interior Designer & Product Visionary</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    AJ
                  </div>
                  <div>
                    <div className="text-charcoal text-sm font-semibold">Akshay Jain</div>
                    <div className="text-slate-500 text-xs font-mono">Business Management Professional</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
              <span className="text-slate-500 text-xs font-mono uppercase tracking-wider block mb-2">Our Foundation</span>
              <div className="flex items-baseline gap-2 text-primary font-bold text-4xl">
                2015
              </div>
              <p className="text-slate-600 text-xs leading-relaxed mt-2">
                Delivering high-performance furniture fittings to builders, interior designers, and retail spaces across India.
              </p>
            </div>
          </div>
        </div>

        {/* 5-Column USPs Section */}
        <div className="mb-20">
          <div className="text-center mb-12 section-reveal">
            <span className="text-primary text-xs font-mono tracking-widest uppercase font-semibold">Why S-FIT?</span>
            <h3 className="font-sans font-bold tracking-tight text-2xl text-charcoal mt-2">Core Advantages</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {usps.map((usp, idx) => (
              <div
                key={idx}
                className="section-reveal group bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:bg-white hover:border-primary/45 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {usp.icon}
                  </div>
                  <h4 className="font-sans font-bold tracking-tight text-base text-charcoal group-hover:text-primary transition-colors">
                    {usp.title}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {usp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Promise Callout Box */}
        <div className="section-reveal">
          <div className="relative bg-charcoal rounded-[30px] p-8 md:p-12 shadow-xl overflow-hidden flex flex-col md:flex-row items-center gap-8 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 geo-pattern-2 opacity-10" />
            <div className="text-primary flex-shrink-0">
              <svg className="w-12 h-12 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.13-5.68a.75.75 0 00.08-.08s.008-.009.009-.01z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="flex-1 space-y-3">
              <span className="text-primary text-xs font-mono uppercase tracking-[0.2em] font-semibold">Our Promise</span>
              <h3 className="font-sans font-bold tracking-tight text-2xl md:text-3xl">
                To deliver hardware solutions that are strong, stylish, and built to last.
              </h3>
              <div className="flex items-center gap-4 text-xs font-mono opacity-80 pt-2">
                <span>✦ Built Strong</span>
                <span>✦ Built to Last</span>
                <span>✦ S-FIT – Trusted Quality</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
