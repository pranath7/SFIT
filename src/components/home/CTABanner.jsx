import { useEffect, useRef } from 'react';
import { getWhatsAppLink, INSTAGRAM_URL } from '../../utils/whatsapp';

const CTABanner = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.2 }
    );

    const el = sectionRef.current?.querySelectorAll('.section-reveal');
    el?.forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 overflow-hidden border-t border-[#1b2d4a] bg-[#050d1a]">
      {/* Decorative blurred hexagons */}
      <div className="absolute top-0 left-0 w-96 h-96 text-primary/5 pointer-events-none blur-[100px] -translate-x-1/2 -translate-y-1/2 select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          <polygon points="50,5 95,30 95,80 50,95 5,80 5,30" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-96 h-96 text-primary/5 pointer-events-none blur-[100px] translate-x-1/2 translate-y-1/2 select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          <polygon points="50,5 95,30 95,80 50,95 5,80 5,30" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="section-reveal">
          <span className="text-primary text-xs font-mono tracking-[0.3em] uppercase mb-4 block">Let's Connect</span>
          <h2 className="font-sans font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-charcoal leading-tight mb-6">
            Have a Project?<br />Let's Talk Hardware.
          </h2>
          <p className="text-slate-body text-lg max-w-2xl mx-auto mb-10 font-body">
            Whether you're fitting out a single kitchen or sourcing for a 500-unit development, our team is ready to help with product selection, pricing, and fulfillment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-whatsapp hover:bg-whatsapp/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-base"
              id="cta-whatsapp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp +91 99622 85822
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-charcoal font-semibold rounded-lg border border-[#e2e8f0] hover:border-primary/30 transition-all duration-300 shadow-sm text-base"
              id="cta-instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Follow @sfitkitchen
            </a>
          </div>

          {/* Address & Map Section */}
          <div className="mt-16 bg-white border border-[#e2e8f0] rounded-[24px] p-8 md:p-10 shadow-sm max-w-2xl mx-auto text-left relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="hexagon-icon-wrap">
                    <div className="hexagon-icon-border" />
                    <div className="hexagon-icon-inner text-primary bg-white">
                      📍
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wider text-primary uppercase">
                    Store Location
                  </span>
                </div>
                <h3 className="font-sans font-bold text-xl text-charcoal">
                  Sathyam Hardwares (S-FIT)
                </h3>
                <p className="text-slate-body text-sm leading-relaxed max-w-sm">
                  123, Avadhanam Papier Road,<br />
                  Near Choolai Park, Choolai,<br />
                  Chennai, Tamil Nadu 600007
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-body/75">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Open 10:00 AM – 8:30 PM (Mon–Sat)</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                <a
                  href="https://www.google.com/maps/place/Sathyam+hardwares/@13.0902701,80.2633086,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5265e5b4a82763:0xbf6058e934a4683e!8m2!3d13.0902701!4d80.2633086!16s%2Fg%2F11cp67dggt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
