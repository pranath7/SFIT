import { useState, useEffect } from 'react';
import { getWhatsAppLink, INSTAGRAM_URL } from '../../utils/whatsapp';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let active = false;
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== active) {
        active = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Categories', href: '#categories' },
    { label: 'Products', href: '#products' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-500 ${
          scrolled
            ? 'bg-navy-deep/95 backdrop-blur-md border-b border-accent-blue/20'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('#home'); }} className="flex items-center group" aria-label="SFIT Home">
              <img src="/logo.png" alt="S-FIT Logo" className="h-10 lg:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="text-steel hover:text-white text-sm font-body tracking-wide transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent-blue transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-whatsapp/30 text-whatsapp text-sm font-medium hover:bg-whatsapp/10 transition-all duration-300"
                aria-label="Chat on WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-accent-blue hover:bg-accent-electric text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-glow-blue hover:shadow-glow-blue-lg"
              >
                Get Quote
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
              <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-navy-deep/95 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-16 left-0 right-0 bg-navy-dark border-b border-accent-blue/10 p-6 flex flex-col gap-4 transition-transform duration-500 ${mobileOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className="text-white text-lg font-display py-2 border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 mt-4">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-whatsapp/20 text-whatsapp font-semibold"
            >
              WhatsApp Us
            </a>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center py-3 rounded-lg bg-accent-blue text-white font-semibold"
            >
              Get Quote
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
