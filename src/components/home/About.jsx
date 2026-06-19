import { useEffect, useRef } from 'react';
import { IndiaMapPaths } from './IndiaMapPaths';

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

  const advantages = [
    {
      title: 'Premium Quality',
      desc: 'Crafted from high-grade raw materials and undergo strict quality checks.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043" />
        </svg>
      )
    },
    {
      title: 'Durable & Long Lasting',
      desc: 'Engineered for smooth motion, high load capacity, and lifetime durability.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
        </svg>
      )
    },
    {
      title: 'Wide Range of Solutions',
      desc: 'From modular kitchen baskets to wardrobe profiles and heavy-duty sliding kits.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      )
    },
    {
      title: 'Innovative Designs',
      desc: 'Sleek handle-less profiles, modern color options, and ergonomic movements.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-1.305 1.305l-1.11 2.22a1 1 0 001.442 1.442l2.22-1.11a3 3 0 001.306-1.305l2.22-4.44a3 3 0 00-1.306-1.306l-4.44-2.22zm10.106-9.562l-1.12 2.24-2.24-1.12 1.12-2.24a2 2 0 012.828 0l-.588.588z" />
        </svg>
      )
    },
    {
      title: 'Value For Money',
      desc: 'True factory-direct wholesale pricing for premium architectural fittings.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-slate-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* ================= SECTION 1: ABOUT S-FIT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[32px] overflow-hidden border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-300">
          
          {/* Left Column - Story / Narrative (6 cols) */}
          <div className="lg:col-span-6 p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-6 section-reveal">
            <span className="text-primary text-xs font-mono tracking-[0.30em] uppercase font-bold">About S-FIT</span>
            
            <h2 className="font-sans font-bold tracking-tight text-3xl md:text-4xl text-charcoal leading-tight">
              BUILT ON <span className="text-primary">LEGACY</span>.<br />
              DRIVEN BY <span className="text-primary">INNOVATION</span>.
            </h2>
            
            <div className="w-12 h-[2px] bg-primary" />
            
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                S-FIT is a premium hardware brand by <strong>Sathyam Hardwares</strong>, established in 2015. Guided and led by Mr. Prakash Kumarji Mangilalji Chajjed and led by his sons <strong>Vicky Jain</strong> (Interior Designer) & <strong>Akshay Jain</strong> (Business Management), we bring you exclusive designer handles, door fittings, kitchen accessories and a wide range of premium hardware solutions.
              </p>
              <p>
                We focus on structural integrity and sleek aesthetics. S-FIT items are created to elevate standard cabinetry into modern, functional spaces.
              </p>
            </div>
            
            <div className="pt-2">
              <a
                href="#why-choose"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#why-choose')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-[#152e56] text-white text-xs font-sans font-bold tracking-wider uppercase rounded-lg shadow transition-all duration-300"
              >
                Know More About Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column - Kitchen Image + Bullet Highlights (6 cols) */}
          <div className="lg:col-span-6 bg-[#050d1a] bg-gradient-cta relative text-white min-h-[380px] lg:min-h-auto overflow-hidden flex flex-col justify-center">
            {/* Slanted Image Overlay on the left half of this column */}
            <div 
              className="absolute inset-y-0 left-0 w-full sm:w-1/2 bg-cover bg-center opacity-45 sm:opacity-50 hidden sm:block lg:[clip-path:polygon(0_0,100%_0,75%_100%,0_100%)] z-0" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80')" }}
            />
            
            {/* Floating shadow divider between image and text */}
            <div className="absolute inset-y-0 left-[45%] w-16 bg-gradient-to-r from-transparent to-[#0b192e] hidden lg:block z-0" />
            
            {/* Highlights List container */}
            <div className="relative z-10 p-8 md:p-12 w-full sm:w-1/2 sm:ml-auto space-y-6 flex flex-col justify-center">
              
              <div className="space-y-6">
                
                {/* Bullet 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold tracking-tight text-sm uppercase text-white">Established 2015</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">Rooted in Sathyam Hardwares legacy.</p>
                  </div>
                </div>

                {/* Bullet 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 21m-5.18-2.91a9.38 9.38 0 01-2.625.372 9.337 9.337 0 01-4.121-.952 4.125 4.125 0 017.533-2.493M4.909 19.128v-.003c0-1.113.285-2.16.786-3.07M4.909 19.128v.109A11.386 11.386 0 009.91 21M9.91 21a11.386 11.386 0 004.991-2.072M12 11.25a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0zM3 13.5a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold tracking-tight text-sm uppercase text-white">Expert Team</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">Professionals with interior & management experience.</p>
                  </div>
                </div>

                {/* Bullet 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.599-3.75A11.952 11.952 0 0112 5.713z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold tracking-tight text-sm uppercase text-white">Quality Assured</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">Every product tested for maximum load cycle.</p>
                  </div>
                </div>

                {/* Bullet 4 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold tracking-tight text-sm uppercase text-white">Wide Network</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">Strong PAN India presence and logistics.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: WHY CHOOSE S-FIT / STATS ================= */}
        <div id="why-choose" className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[32px] overflow-hidden border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-300">
          
          {/* Left Column - Core Advantages (6 cols) */}
          <div className="lg:col-span-6 p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-8 section-reveal">
            <div className="space-y-2">
              <span className="text-primary text-xs font-mono tracking-[0.30em] uppercase font-bold">Why Choose S-FIT?</span>
              <h3 className="font-sans font-bold tracking-tight text-3xl text-charcoal">Core Advantages</h3>
              <div className="w-12 h-[2px] bg-primary mt-4" />
            </div>

            {/* List of USPs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {advantages.map((adv, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-[#e2e8f0] text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {adv.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold tracking-tight text-sm text-charcoal group-hover:text-primary transition-colors duration-300 uppercase">{adv.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{adv.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Stats Grid + India Network Map (6 cols) */}
          <div className="lg:col-span-6 bg-[#050d1a] bg-gradient-cta p-8 md:p-12 lg:p-16 relative text-white flex flex-col justify-center">
            
            {/* Stats and India Map Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center relative z-10 w-full">
              
              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 gap-6 text-center sm:text-left">
                {/* Counter 1 */}
                <div className="space-y-1">
                  <svg className="w-5 h-5 text-blue-400 mx-auto sm:mx-0 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div className="text-3xl font-sans font-bold tracking-tight text-white">15+</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Years in Service</div>
                </div>

                {/* Counter 2 */}
                <div className="space-y-1">
                  <svg className="w-5 h-5 text-blue-400 mx-auto sm:mx-0 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                  <div className="text-3xl font-sans font-bold tracking-tight text-white">1000+</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Happy Clients</div>
                </div>

                {/* Counter 3 */}
                <div className="space-y-1">
                  <svg className="w-5 h-5 text-blue-400 mx-auto sm:mx-0 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72M6.75 18h3.5a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75h-3.5a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" /></svg>
                  <div className="text-3xl font-sans font-bold tracking-tight text-white">500+</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Dealers</div>
                </div>

                {/* Counter 4 */}
                <div className="space-y-1">
                  <svg className="w-5 h-5 text-blue-400 mx-auto sm:mx-0 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8m-3-3.75V14m-9 5.25h16.5V4.499c0-.225-.015-.45-.045-.67A11.944 11.944 0 0012 3c-2.17 0-4.207.576-5.963 1.584A6.062 6.062 0 016 4.499V19.5z" /></svg>
                  <div className="text-3xl font-sans font-bold tracking-tight text-white">25+</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">States Covered</div>
                </div>
              </div>

              {/* Glowing Vector India Supply Network Map */}
              <div className="flex justify-center items-center h-[260px] pointer-events-none select-none relative">
                
                {/* SVG radar background grid with India outline */}
                <svg className="w-full h-full text-blue-400/10 overflow-visible" viewBox="0 0 612 696">
                  {/* Grid lines */}
                  <line x1="0" y1="100" x2="612" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  <line x1="0" y1="200" x2="612" y2="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  <line x1="0" y1="300" x2="612" y2="300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  <line x1="0" y1="400" x2="612" y2="400" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  <line x1="0" y1="500" x2="612" y2="500" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  <line x1="0" y1="600" x2="612" y2="600" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  
                  <line x1="100" y1="0" x2="100" y2="696" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  <line x1="200" y1="0" x2="200" y2="696" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  <line x1="300" y1="0" x2="300" y2="696" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  <line x1="400" y1="0" x2="400" y2="696" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  <line x1="500" y1="0" x2="500" y2="696" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  <line x1="600" y1="0" x2="600" y2="696" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />

                  {/* India Map Outline Layer (Crisp White Boundaries) */}
                  <g className="text-white/25" fill="none" strokeWidth="1.0">
                    <IndiaMapPaths />
                  </g>

                  {/* Interconnecting supply chain path lines */}
                  <path d="M78,355 L187,211 L235,580 L440,365 L195,565 L78,355" fill="none" stroke="rgba(96,165,250,0.25)" strokeWidth="2" />
                  <path d="M187,211 L195,565 L235,580 M78,355 L115,445 L195,565 M440,365 L235,580" fill="none" stroke="rgba(96,165,250,0.25)" strokeWidth="2" />

                  {/* Supply network node pins with outer glowing radar pulses */}
                  
                  {/* Delhi Node */}
                  <circle cx="187" cy="211" r="22" className="fill-blue-500/10 stroke-blue-400/20 animate-ping" />
                  <circle cx="187" cy="211" r="8" fill="#60a5fa" />
                  <text x="202" y="206" fill="rgba(255,255,255,0.7)" fontSize="14" fontFamily="monospace">DEL</text>

                  {/* Rajkot / Gujarat Node */}
                  <circle cx="78" cy="355" r="22" className="fill-blue-500/10 stroke-blue-400/20 animate-ping" style={{ animationDelay: '0.3s' }} />
                  <circle cx="78" cy="355" r="8" fill="#60a5fa" />
                  <text x="28" y="360" fill="rgba(255,255,255,0.7)" fontSize="14" fontFamily="monospace">RAJ</text>

                  {/* Mumbai Node */}
                  <circle cx="115" cy="445" r="22" className="fill-blue-500/10 stroke-blue-400/20 animate-ping" style={{ animationDelay: '0.6s' }} />
                  <circle cx="115" cy="445" r="8" fill="#60a5fa" />
                  <text x="130" y="450" fill="rgba(255,255,255,0.7)" fontSize="14" fontFamily="monospace">BOM</text>

                  {/* Bengaluru Node */}
                  <circle cx="195" cy="565" r="22" className="fill-blue-500/10 stroke-blue-400/20 animate-ping" style={{ animationDelay: '0.2s' }} />
                  <circle cx="195" cy="565" r="8" fill="#60a5fa" />
                  <text x="130" y="570" fill="rgba(255,255,255,0.7)" fontSize="14" fontFamily="monospace">BLR</text>

                  {/* Chennai Node (HQ) */}
                  <circle cx="235" cy="580" r="30" className="fill-blue-400/20 stroke-blue-300/30 animate-pulse" />
                  <circle cx="235" cy="580" r="12" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2.5" />
                  <text x="255" y="586" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="monospace">MAA (HQ)</text>

                  {/* Kolkata Node */}
                  <circle cx="440" cy="365" r="22" className="fill-blue-500/10 stroke-blue-400/20 animate-ping" style={{ animationDelay: '0.4s' }} />
                  <circle cx="440" cy="365" r="8" fill="#60a5fa" />
                  <text x="455" y="361" fill="rgba(255,255,255,0.7)" fontSize="14" fontFamily="monospace">CCU</text>
                </svg>

                {/* Subtle India outline indicator text */}
                <div className="absolute bottom-2 text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                  SFIT Distribution Map India
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
