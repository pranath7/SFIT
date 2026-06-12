import { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../../utils/categories';
import { useProducts } from '../../context/ProductContext';
import { getWhatsAppLink } from '../../utils/whatsapp';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { products: allProducts, getPublishedProducts, getProductsByCategory } = useProducts();
  const sectionRef = useRef(null);

  // Listen for category filter events from Categories section
  useEffect(() => {
    const handleFilter = (e) => {
      setActiveCategory(e.detail);
    };
    window.addEventListener('filter-category', handleFilter);
    return () => window.removeEventListener('filter-category', handleFilter);
  }, []);

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
  }, [allProducts, activeCategory]);

  const products = activeCategory === 'all'
    ? getPublishedProducts()
    : getProductsByCategory(activeCategory);

  return (
    <section id="products" ref={sectionRef} className="relative py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 section-reveal">
          <span className="text-primary text-xs font-mono tracking-[0.3em] uppercase">Our Catalog</span>
          <h2 className="font-sans font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-charcoal mt-3">
            Product Catalog
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6" />
        </div>

        {/* 2-Column Catalog Container */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Sidebar — Categories List (Desktop only) */}
          <div className="w-full lg:w-1/4 lg:sticky lg:top-32 section-reveal hidden lg:block">
            <h3 className="font-sans font-bold tracking-tight text-2xl text-charcoal mb-6 pb-3 border-b border-[#e2e8f0]">
              Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full text-left font-sans font-bold tracking-tight text-lg py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-between ${
                  activeCategory === 'all'
                    ? 'bg-slate-light text-primary font-semibold shadow-sm border border-[#e2e8f0]'
                    : 'text-charcoal hover:bg-slate-light/50 hover:text-primary'
                }`}
              >
                <span>All Products</span>
                <span className="text-xs font-mono opacity-60">{getPublishedProducts().length}</span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = getProductsByCategory(cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left font-sans font-bold tracking-tight text-lg py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-between ${
                      activeCategory === cat.id
                        ? 'bg-slate-light text-primary font-semibold shadow-sm border border-[#e2e8f0]'
                        : 'text-charcoal hover:bg-slate-light/50 hover:text-primary'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs font-mono opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horizontal category tabs for mobile/tablet */}
          <div className="w-full lg:hidden section-reveal overflow-x-auto pb-4 flex gap-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 rounded-full text-sm font-body whitespace-nowrap transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-slate-light text-charcoal border border-[#e2e8f0]'
              }`}
            >
              All Products
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-body whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-slate-light text-charcoal border border-[#e2e8f0]'
                }`}
              >
                {cat.shortName}
              </button>
            ))}
          </div>

          {/* Right Area — Products Grid or Empty State */}
          <div className="w-full lg:w-3/4">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, index) => {
                  const category = CATEGORIES.find((c) => c.id === product.category);
                  return (
                    <div
                      key={product.id}
                      className="section-reveal card-border-trace group bg-white border border-[#e2e8f0] rounded-[30px] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-blue"
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square bg-slate-light overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="0.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M6.75 7.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18 7.5a.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Featured badge */}
                        {product.featured && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
                            Featured
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        {/* Category Badge */}
                        {category && (
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider mb-2 bg-slate-light text-charcoal border border-[#e2e8f0]`}>
                            {category.shortName}
                          </span>
                        )}
                        <h3 className="font-sans font-bold tracking-tight text-lg text-charcoal mb-1.5 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-slate-body text-xs leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between mb-4">
                          {product.price ? (
                            <span className="text-primary font-semibold text-lg font-mono">₹{product.price}</span>
                          ) : (
                            <span className="text-slate-body/50 text-xs font-mono">Price on request</span>
                          )}
                        </div>
                        <a
                          href={getWhatsAppLink(product.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#e2e8f0] hover:border-primary text-charcoal hover:text-primary text-sm font-medium hover:bg-primary/5 transition-all duration-300"
                        >
                          <svg className="w-4 h-4 text-whatsapp" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          Enquire on WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="section-reveal max-w-2xl mx-auto">
                <div className="bg-slate-light border border-[#e2e8f0] rounded-[30px] p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-8 relative">
                    <div className="absolute inset-0 border-2 border-dashed border-primary/10 rounded-xl" />
                    <div className="absolute inset-4 border border-primary/5 rounded-lg" />
                    <svg className="absolute inset-0 w-full h-full p-8 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    {/* Corner markers */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/20" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/20" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/20" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/20" />
                  </div>

                  <h3 className="font-sans font-bold tracking-tight text-2xl text-charcoal mb-3">
                    {activeCategory !== 'all' ? 'Products Arriving Soon' : 'Catalog Coming Soon'}
                  </h3>
                  <p className="text-slate-body text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    Our product catalog is being updated. Chat with us on WhatsApp to explore our full range of premium hardware and fittings.
                  </p>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-whatsapp hover:bg-whatsapp/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-md"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Chat with Us on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
