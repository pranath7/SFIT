import { useEffect, useRef } from 'react';
import { CATEGORIES } from '../../utils/categories';
import { useProducts } from '../../context/ProductContext';
import CategoryIcons from './CategoryIcons';

const Categories = () => {
  const sectionRef = useRef(null);
  const { getProductCount } = useProducts();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.section-reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleCategoryClick = (categoryId) => {
    const productsSection = document.querySelector('#products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
      // Dispatch custom event for filter
      window.dispatchEvent(new CustomEvent('filter-category', { detail: categoryId }));
    }
  };

  return (
    <section id="categories" ref={sectionRef} className="relative py-24 bg-navy-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 section-reveal">
          <span className="text-accent-blue text-xs font-mono tracking-[0.3em] uppercase">Our Product Lines</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mt-3">
            Everything Your Space Needs
          </h2>
          <div className="w-16 h-[2px] bg-accent-blue mx-auto mt-6" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((category, index) => {
            const count = getProductCount(category.id);
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`section-reveal card-border-trace card-glow group relative bg-navy-card rounded-2xl p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover ${category.pattern}`}
                style={{ transitionDelay: `${index * 80}ms` }}
                aria-label={`View ${category.name} products`}
              >
                {/* Icon */}
                <div className="w-16 h-16 text-accent-blue/60 group-hover:text-accent-electric transition-colors duration-300 mb-6">
                  {CategoryIcons[category.icon]}
                </div>

                {/* Name */}
                <h3 className="font-display text-xl text-white mb-2 group-hover:text-accent-electric transition-colors duration-300">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-steel text-sm leading-relaxed mb-4">
                  {category.description}
                </p>

                {/* Product Count Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono ${
                  count > 0 ? 'bg-accent-blue/10 text-accent-electric' : 'bg-navy-mid/50 text-steel/60'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${count > 0 ? 'bg-accent-electric' : 'bg-steel/40'}`} />
                  {count > 0 ? `${count} Products` : 'Coming Soon'}
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-8 right-8 w-8 h-8 rounded-full border border-accent-blue/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  <svg className="w-4 h-4 text-accent-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"/>
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
