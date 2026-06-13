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
    <section id="categories" ref={sectionRef} className="relative py-24 bg-white border-t border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 section-reveal">
          <span className="text-primary text-xs font-mono tracking-[0.3em] uppercase">Our Product Lines</span>
          <h2 className="font-sans font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-charcoal mt-3">
            Everything Your Space Needs
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category, index) => {
            const count = getProductCount(category.id);
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="section-reveal hexagon-wrap group relative w-full border-none bg-transparent transition-all duration-500 hover:-translate-y-2"
                style={{ transitionDelay: `${index * 80}ms` }}
                aria-label={`View ${category.name} products`}
              >
                {/* Hexagon Border */}
                <div className="hexagon-border shadow-sm group-hover:shadow-lg" />

                {/* Hexagon Inner Content */}
                <div className="hexagon-inner p-6 flex flex-col items-center justify-center">
                  {/* Icon */}
                  <div className="w-12 h-12 text-primary/60 group-hover:text-primary transition-colors duration-300 mb-4 flex items-center justify-center">
                    {CategoryIcons[category.icon]}
                  </div>

                  {/* Name */}
                  <h3 className="font-sans font-bold tracking-tight text-lg text-charcoal mb-2 group-hover:text-primary transition-colors duration-300 text-center">
                    {category.emoji} {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 text-xs text-center leading-relaxed mb-4 line-clamp-2 px-2">
                    {category.description}
                  </p>

                  {/* Product Count Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono ${
                    count > 0 ? 'bg-slate-50 text-charcoal border border-[#e2e8f0]' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${count > 0 ? 'bg-primary' : 'bg-slate-300'}`} />
                    {count > 0 ? `${count} Products` : 'Coming Soon'}
                  </div>
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
