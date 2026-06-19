import { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../../utils/categories';
import { useProducts } from '../../context/ProductContext';
import { getWhatsAppLink } from '../../utils/whatsapp';
import { getGridThumbnail, getDetailImage, getSuggestionThumbnail } from '../../utils/imageOptimizer';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(100000);
  const [includeRequestPrice, setIncludeRequestPrice] = useState(true);

  // Preload ALL product images eagerly on mount so they're instantly available when scrolling
  const { products: allProducts, getPublishedProducts, getProductsByCategory } = useProducts();
  useEffect(() => {
    const published = allProducts.filter(p => p.status === 'published');
    published.forEach(product => {
      if (product.images && product.images.length > 0) {
        const img = new Image();
        img.src = getGridThumbnail(product.images[0]);
      }
    });
  }, [allProducts]);
  // (products already destructured above)
  const sectionRef = useRef(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [projectList, setProjectList] = useState(() => {
    try {
      const saved = localStorage.getItem('sfit_project_list');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);

  // Search & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Image Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('sfit_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Back to top visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Touch swipe ref
  const touchStartX = useRef(null);

  // Sync project list to storage
  useEffect(() => {
    localStorage.setItem('sfit_project_list', JSON.stringify(projectList));
  }, [projectList]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedProduct]);

  // Escape key listener to close modal & lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          setSelectedProduct(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  // Toast auto-dismiss
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Sync recently viewed to localStorage
  useEffect(() => {
    localStorage.setItem('sfit_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleShare = async (product) => {
    const shareData = {
      title: `${product.name} — SFIT Hardware`,
      text: `Check out ${product.name} from SFIT Hardware!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToastNotification('🔗 Product link copied to clipboard!');
      } catch (e) {
        showToastNotification('Could not copy link');
      }
    }
  };

  // Touch swipe handlers for mobile gallery
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e, images) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;
    if (Math.abs(diff) > 50 && images && images.length > 1) {
      if (diff > 0) {
        setActiveImageIndex(prev => (prev + 1) % images.length);
      } else {
        setActiveImageIndex(prev => (prev - 1 + images.length) % images.length);
      }
    }
    touchStartX.current = null;
  };

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 5);
    });
  };

  const handleProductCardClick = (product) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : null);
    setActiveImageIndex(0);
    setQuantity(1);
    addToRecentlyViewed(product);
  };

  const handleRelatedProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : null);
    setActiveImageIndex(0);
    setQuantity(1);
    addToRecentlyViewed(product);
    const overlayElement = document.querySelector('.full-page-details-container');
    if (overlayElement) {
      overlayElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addToProjectList = (product, variant, qty) => {
    const size = variant ? variant.size : 'Standard';
    const price = variant ? variant.price : (product.price || 0);
    
    const existingIndex = projectList.findIndex(
      (item) => item.id === product.id && item.size === size
    );

    if (existingIndex > -1) {
      const updated = [...projectList];
      updated[existingIndex].quantity += qty;
      setProjectList(updated);
    } else {
      setProjectList([
        ...projectList,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          size: size,
          price: price,
          quantity: qty,
          coverImage: product.images && product.images.length > 0 ? product.images[0] : null
        }
      ]);
    }
    showToastNotification(`✅ Added ${qty} × ${product.name} (${size}) to your Project List!`);
  };

  const getWhatsAppLinkWithQty = (productName, variantSize, qty) => {
    const sizeStr = variantSize ? ` (${variantSize})` : '';
    const qtyStr = qty > 1 ? ` — Quantity: ${qty} units` : '';
    const message = `Hi SFIT! I'm interested in ${productName}${sizeStr}${qtyStr}. Please share pricing and availability.`;
    return `https://wa.me/919962285822?text=${encodeURIComponent(message)}`;
  };

  const getConsolidatedWhatsAppLink = () => {
    if (projectList.length === 0) return '#';
    let message = "Hi SFIT! I'd like to receive a consolidated quote for these items in my project list:\n\n";
    projectList.forEach((item, index) => {
      const priceStr = item.price ? ` (₹${item.price} each)` : '';
      message += `${index + 1}. ${item.name} - Size: ${item.size} - Qty: ${item.quantity}${priceStr}\n`;
    });
    message += "\nPlease let me know pricing, discounts, and dispatch timelines.";
    return `https://wa.me/919962285822?text=${encodeURIComponent(message)}`;
  };

  const getStoreSuggestions = (product) => {
    if (!product) return [];
    const others = allProducts.filter((p) => p.id !== product.id && p.status === 'published');
    // Prioritize same category first
    const sameCategory = others.filter(p => p.category === product.category);
    const differentCategory = others.filter(p => p.category !== product.category);
    return [...sameCategory, ...differentCategory].slice(0, 8);
  };

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
  }, [allProducts, activeCategory, priceRange, includeRequestPrice]);

  const filteredByCategory = activeCategory === 'all'
    ? getPublishedProducts()
    : getProductsByCategory(activeCategory);

  const products = filteredByCategory.filter((p) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = p.name?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const catObj = CATEGORIES.find(c => c.id === p.category);
      const catMatch = catObj?.name?.toLowerCase().includes(q) || catObj?.shortName?.toLowerCase().includes(q);
      if (!nameMatch && !descMatch && !catMatch) return false;
    }

    const matchesPrice = p.price !== undefined && p.price !== null && p.price >= 0 && p.price <= priceRange;
    const isRequestPrice = p.price === undefined || p.price === null || isNaN(p.price) || p.price === 0;
    
    if (isRequestPrice) {
      return includeRequestPrice;
    }
    return matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return (a.price || 0) - (b.price || 0);
      case 'price-high': return (b.price || 0) - (a.price || 0);
      case 'name-az': return (a.name || '').localeCompare(b.name || '');
      case 'name-za': return (b.name || '').localeCompare(a.name || '');
      default: return 0;
    }
  });

  return (
    <section id="products" ref={sectionRef} className="relative py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 section-reveal">
          <span className="text-primary text-xs font-mono tracking-[0.3em] uppercase">Our Catalog</span>
          <h2 className="font-sans font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-charcoal mt-3">
            SFIT Hardware Catalog
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
                <span className="flex items-center gap-2">📦 All Products</span>
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
                    <span className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-xs font-mono opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Price Filter (Desktop) */}
            <div className="mt-8 pt-6 border-t border-[#e2e8f0] space-y-4">
              <h3 className="font-sans font-bold tracking-tight text-xl text-charcoal">
                Filter by Price
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-mono text-slate-body">
                  <span>Min: ₹0</span>
                  <span>Max: ₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-body text-slate-body">
                <input
                  type="checkbox"
                  checked={includeRequestPrice}
                  onChange={(e) => setIncludeRequestPrice(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4 border-[#e2e8f0]"
                />
                <span>Include "Price on Request"</span>
              </label>
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
              📦 All Products
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
                {cat.emoji} {cat.shortName}
              </button>
            ))}
          </div>

          {/* Mobile/Tablet Price Filter */}
          <div className="w-full lg:hidden section-reveal bg-slate-50 border border-[#e2e8f0] rounded-[24px] p-5 mb-8 space-y-3">
            <h4 className="font-sans font-bold text-sm text-charcoal uppercase tracking-wider">
              Filter by Price
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-body">
                  <span>Min: ₹0</span>
                  <span>Max: ₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-body text-slate-body">
                <input
                  type="checkbox"
                  checked={includeRequestPrice}
                  onChange={(e) => setIncludeRequestPrice(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-[#e2e8f0]"
                />
                <span>Include "Price on Request"</span>
              </label>
            </div>
          </div>

          {/* Right Area — Products Grid or Empty State */}
          <div className="w-full lg:w-3/4">
            {/* Search Bar & Sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-white border border-[#e2e8f0] rounded-2xl text-sm text-charcoal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-charcoal transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-[#e2e8f0] rounded-2xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer min-w-[180px]"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name-az">Name: A → Z</option>
                <option value="name-za">Name: Z → A</option>
              </select>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, index) => {
                  const category = CATEGORIES.find((c) => c.id === product.category);
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleProductCardClick(product)}
                      className="card-border-trace group bg-white border border-[#e2e8f0] rounded-[30px] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-blue cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="relative w-full aspect-[4/3] bg-slate-50 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={getGridThumbnail(product.images[0])}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                            loading="eager"
                            decoding="async"
                            width="400"
                            height="300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100">
                            <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Featured badge */}
                        {product.featured && (
                          <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 bg-primary text-white text-[9px] font-mono font-bold rounded-full uppercase tracking-wider shadow-md">
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
                          onClick={(e) => e.stopPropagation()}
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
                    {searchQuery.trim() ? 'No Products Found' : activeCategory !== 'all' ? 'Products Arriving Soon' : 'Catalog Coming Soon'}
                  </h3>
                  <p className="text-slate-body text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    {searchQuery.trim()
                      ? `No products match "${searchQuery}". Try a different search term or browse all categories.`
                      : 'Our product catalog is being updated. Chat with us on WhatsApp to explore our full range of premium hardware and fittings.'
                    }
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

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && !selectedProduct && (
          <div className="mt-16 pt-12 border-t border-[#e2e8f0]">
            <h3 className="font-sans font-bold text-xl text-charcoal mb-6 flex items-center gap-2">
              🕰️ Recently Viewed
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
              {recentlyViewed.map((rp) => (
                <div
                  key={rp.id}
                  onClick={() => handleProductCardClick(rp)}
                  className="flex-shrink-0 w-44 bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-full aspect-square bg-slate-50 overflow-hidden">
                    {rp.images && rp.images.length > 0 ? (
                      <img src={getSuggestionThumbnail(rp.images[0])} alt={rp.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-charcoal line-clamp-1">{rp.name}</h4>
                    <span className="text-[10px] font-mono text-primary">{rp.price ? `₹${rp.price}` : 'Price on request'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Details Full-Screen Overlay */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-[#050d1a] z-50 overflow-y-auto flex flex-col text-[#e2e8f0] full-page-details-container"
          style={{ animation: 'fadeIn 0.25s ease-out' }}
        >
          {/* Breadcrumb Header */}
          <header className="border-b border-[#1b2d4a] bg-[#050d1a]/90 backdrop-blur-md sticky top-0 z-30 py-4 px-6 md:px-8 flex items-center justify-between">
            <nav className="flex items-center gap-2 text-sm min-w-0">
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Catalog
              </button>
              <span className="text-[#1b2d4a]">/</span>
              {CATEGORIES.find(c => c.id === selectedProduct.category) && (
                <>
                  <span className="text-slate-400 whitespace-nowrap hidden sm:inline">
                    {CATEGORIES.find(c => c.id === selectedProduct.category).name}
                  </span>
                  <span className="text-[#1b2d4a] hidden sm:inline">/</span>
                </>
              )}
              <span className="text-[#e2e8f0] font-semibold truncate max-w-[180px] sm:max-w-[300px]">
                {selectedProduct.name}
              </span>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => handleShare(selectedProduct)}
                className="flex items-center gap-1.5 py-2 px-3 bg-[#0b192e] border border-[#1b2d4a] text-slate-400 hover:text-white rounded-xl text-sm hover:border-primary/50 transition-all cursor-pointer"
                title="Share product"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={() => setIsProjectListOpen(true)}
                className="flex items-center gap-2 py-2 px-3 sm:px-4 bg-primary text-white rounded-xl text-sm hover:bg-primary/95 transition-all shadow-md cursor-pointer font-sans font-bold"
              >
                💼 <span className="hidden sm:inline">Project List</span> ({projectList.length})
              </button>
            </div>
          </header>

          {/* Main Contents Panel */}
          <main className="max-w-7xl mx-auto w-full px-6 md:px-8 py-8 flex-1 pb-28 lg:pb-8">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              
              {/* Left Side: Dynamic Gallery */}
              <div className="w-full lg:w-1/2 lg:sticky lg:top-24 flex flex-col items-center">
                <div 
                  className="w-full aspect-square relative rounded-[28px] overflow-hidden bg-[#0b192e] border border-[#1b2d4a] flex items-center justify-center p-6 shadow-2xl cursor-zoom-in group/gallery"
                  onClick={() => selectedProduct.images?.length > 0 && setIsLightboxOpen(true)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={(e) => handleTouchEnd(e, selectedProduct.images)}
                >
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <>
                      <img
                        src={getDetailImage(selectedProduct.images[activeImageIndex])}
                        alt={selectedProduct.name}
                        className="max-w-full max-h-full object-contain rounded-xl transition-transform duration-300"
                      />
                      {/* Zoom hint */}
                      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white/70 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/gallery:opacity-100 transition-opacity pointer-events-none hidden md:flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" /></svg>
                        Click to zoom
                      </div>
                      {/* Mobile swipe dots */}
                      {selectedProduct.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                          {selectedProduct.images.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === activeImageIndex ? 'bg-primary scale-125' : 'bg-white/30'}`} />
                          ))}
                        </div>
                      )}
                      {/* Desktop arrow navigation */}
                      {selectedProduct.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity cursor-pointer hover:bg-black/60 text-lg"
                          >
                            ‹
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev + 1) % selectedProduct.images.length); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity cursor-pointer hover:bg-black/60 text-lg"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <svg className="w-24 h-24 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                      <polygon points="50,5 95,30 95,80 50,95 5,80 5,30" />
                    </svg>
                  )}
                </div>

                {/* Gallery Swapper Thumbnails */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex flex-wrap gap-3 mt-6 justify-center">
                    {selectedProduct.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                          activeImageIndex === i 
                            ? 'border-primary scale-105 shadow-[0_0_12px_rgba(27,59,111,0.6)]' 
                            : 'border-[#1b2d4a] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={getSuggestionThumbnail(img)} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Specs & Details */}
              <div className="w-full lg:w-1/2 flex flex-col space-y-8">
                {/* Category Badge & Name */}
                <div>
                  {CATEGORIES.find(c => c.id === selectedProduct.category) && (
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#0b192e] text-[#e2e8f0] border border-[#1b2d4a] w-fit mb-3">
                      {CATEGORIES.find(c => c.id === selectedProduct.category).name}
                    </span>
                  )}
                  <h2 className="font-sans font-bold text-3xl md:text-4xl text-[#e2e8f0] leading-tight">
                    {selectedProduct.name}
                  </h2>
                  <div className="w-16 h-[2px] bg-primary mt-4" />
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <div>
                    <h4 className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-[#94a3b8] text-sm leading-relaxed whitespace-pre-line bg-[#0b192e] p-5 rounded-2xl border border-[#1b2d4a]/50">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                {/* Sizing & Variants Selector */}
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div>
                    <h4 className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">Available Options</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProduct.variants.map((v, i) => {
                        const isSelected = selectedVariant && selectedVariant.size === v.size;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedVariant(v)}
                            className={`px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 text-left flex flex-col justify-between gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-primary/25 border-primary text-white font-semibold'
                                : 'border-[#1b2d4a] text-[#e2e8f0] bg-[#0b192e]/40 hover:border-primary/50'
                            }`}
                          >
                            <span className="opacity-95">{v.size}</span>
                            {v.price ? (
                              <span className="text-xs font-mono text-primary font-semibold">
                                ₹{v.price.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">Price on request</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Selector & Price breakdown */}
                <div className="bg-[#0b192e] p-6 rounded-2xl border border-[#1b2d4a] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
                  <div>
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1 block">Pricing Calculator</span>
                    {selectedVariant ? (
                      selectedVariant.price ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-bold font-mono text-[#e2e8f0]">
                            ₹{(selectedVariant.price * quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ({quantity} × ₹{selectedVariant.price.toLocaleString('en-IN')})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-mono text-slate-400 font-bold">Price on Request</span>
                      )
                    ) : selectedProduct.price ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold font-mono text-[#e2e8f0]">
                          ₹{(selectedProduct.price * quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ({quantity} × ₹{selectedProduct.price.toLocaleString('en-IN')})
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-mono text-slate-400 font-bold">Price on Request</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono uppercase mr-1">Quantity:</span>
                    <div className="flex items-center gap-3 bg-[#050d1a] border border-[#1b2d4a] rounded-xl p-1.5">
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg bg-[#0b192e] border border-[#1b2d4a] text-white flex items-center justify-center hover:border-primary transition-all font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-sm">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-8 h-8 rounded-lg bg-[#0b192e] border border-[#1b2d4a] text-white flex items-center justify-center hover:border-primary transition-all font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={getWhatsAppLinkWithQty(selectedProduct.name, selectedVariant?.size, quantity)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 flex-1 py-4 bg-whatsapp hover:bg-whatsapp/90 text-white font-bold rounded-xl shadow-lg transition-all text-base text-center cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Enquire {quantity > 1 ? `(${quantity} Items)` : ''} on WhatsApp
                  </a>
                  
                  <button
                    type="button"
                    onClick={() => addToProjectList(selectedProduct, selectedVariant, quantity)}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-[#0b192e] border border-[#1b2d4a] hover:border-primary text-white font-bold rounded-xl shadow-md transition-all text-base cursor-pointer"
                  >
                    💼 Add to Project Checklist
                  </button>
                </div>
              </div>
            </div>

            {/* Store Suggestions Section */}
            {getStoreSuggestions(selectedProduct).length > 0 && (
              <div className="mt-20 pt-12 border-t border-[#1b2d4a]">
                <h4 className="font-sans font-bold text-2xl text-[#e2e8f0] mb-8">
                  Explore Other Store Products
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {getStoreSuggestions(selectedProduct).map((rp) => {
                    const rpCategory = CATEGORIES.find(c => c.id === rp.category);
                    return (
                      <div
                        key={rp.id}
                        onClick={() => handleRelatedProductClick(rp)}
                        className="bg-[#0b192e] border border-[#1b2d4a] rounded-[24px] p-5 cursor-pointer hover:-translate-y-2 transition-all duration-300 hover:shadow-glow-blue flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-full aspect-square rounded-2xl bg-[#050d1a] border border-[#1b2d4a] overflow-hidden flex items-center justify-center p-4 mb-4">
                            {rp.images && rp.images.length > 0 ? (
                              <img src={getSuggestionThumbnail(rp.images[0])} alt={rp.name} className="max-w-full max-h-full object-contain" loading="lazy" decoding="async" />
                            ) : (
                              <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="50,5 95,30 95,80 50,95 5,80 5,30" /></svg>
                            )}
                          </div>
                          <h5 className="font-sans font-bold text-sm text-[#e2e8f0] line-clamp-1 mb-1">{rp.name}</h5>
                          {rpCategory && (
                            <span className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">{rpCategory.shortName}</span>
                          )}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs font-mono text-primary font-semibold">
                            {rp.price ? `₹${rp.price}` : 'Price on request'}
                          </span>
                          <span className="text-xs text-[#94a3b8] hover:text-white transition-colors">View →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </main>

          {/* Sticky Mobile Action Bar */}
          <div className="lg:hidden sticky bottom-0 bg-[#050d1a]/95 backdrop-blur-md border-t border-[#1b2d4a] p-3 flex gap-3 z-20">
            <a
              href={getWhatsAppLinkWithQty(selectedProduct.name, selectedVariant?.size, quantity)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 flex-1 py-3 bg-whatsapp hover:bg-whatsapp/90 text-white font-bold rounded-xl shadow-lg transition-all text-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <button
              onClick={() => addToProjectList(selectedProduct, selectedVariant, quantity)}
              className="py-3 px-4 bg-[#0b192e] border border-[#1b2d4a] hover:border-primary text-white font-bold rounded-xl text-sm cursor-pointer transition-all"
            >
              💼 Add
            </button>
          </div>
        </div>
      )}

      {/* Project Checklist Drawer Overlay */}
      {isProjectListOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setIsProjectListOpen(false)}
          style={{ zIndex: 20000 }}
        >
          <div
            className="bg-[#0b192e] border-l border-[#1b2d4a] shadow-2xl overflow-hidden flex flex-col w-full max-w-lg h-full absolute right-0 top-0 bottom-0"
            style={{ animation: 'slideInRight 0.3s ease' }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="p-6 border-b border-[#1b2d4a] flex items-center justify-between">
              <h3 className="font-sans font-bold text-xl text-[#e2e8f0] flex items-center gap-2">
                💼 Project Checklist
              </h3>
              <button
                onClick={() => setIsProjectListOpen(false)}
                className="text-slate-400 hover:text-white p-2 bg-[#050d1a]/60 hover:bg-[#050d1a]/95 border border-[#1b2d4a] rounded-full transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {projectList.length === 0 ? (
                <div className="text-center py-16 text-[#94a3b8]/60 space-y-4">
                  <svg className="w-16 h-16 mx-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                  <p className="text-sm">Your technical project list is empty.</p>
                  <p className="text-xs max-w-xs mx-auto">Browse catalog items and add them to your checklist to consolidate dimensions, sizing, and quantities.</p>
                </div>
              ) : (
                projectList.map((item, index) => (
                  <div 
                    key={`${item.id}-${item.size}`}
                    className="bg-[#050d1a]/55 border border-[#1b2d4a]/60 rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#0b192e] border border-[#1b2d4a]/50 overflow-hidden flex items-center justify-center p-1">
                        {item.coverImage ? (
                          <img src={item.coverImage} alt="" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="50,5 95,30 95,80 50,95 5,80 5,30" /></svg>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#e2e8f0] line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-[#94a3b8] font-mono">Size: {item.size}</p>
                        {item.price ? (
                          <p className="text-xs text-primary font-mono font-semibold">₹{item.price} each</p>
                        ) : (
                          <p className="text-xs text-[#94a3b8]/60 font-mono">Price on request</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => setProjectList(prev => prev.filter(p => !(p.id === item.id && p.size === item.size)))}
                        className="text-red-400 hover:text-red-500 text-xs p-1 cursor-pointer"
                      >
                        Remove
                      </button>
                      <div className="flex items-center gap-2 bg-[#0b192e] border border-[#1b2d4a]/50 rounded-lg py-1 px-2">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              const updated = [...projectList];
                              updated[index].quantity--;
                              setProjectList(updated);
                            }
                          }}
                          className="text-[#e2e8f0] hover:text-white px-1 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            const updated = [...projectList];
                            updated[index].quantity++;
                            setProjectList(updated);
                          }}
                          className="text-[#e2e8f0] hover:text-white px-1 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {projectList.length > 0 && (
              <footer className="p-6 border-t border-[#1b2d4a] bg-[#050d1a]/40 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94a3b8]">Total Estimated Cost</span>
                  <span className="text-lg font-bold font-mono text-[#e2e8f0]">
                    ₹{projectList.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <a
                  href={getConsolidatedWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-whatsapp hover:bg-whatsapp/90 text-white font-bold rounded-xl shadow-lg transition-all text-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Consolidated Project Enquiry
                </a>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your project list?")) {
                      setProjectList([]);
                    }
                  }}
                  className="w-full text-center text-xs text-[#94a3b8] hover:text-[#e2e8f0] transition-colors py-1 cursor-pointer"
                >
                  Clear Checklist
                </button>
              </footer>
            )}
          </div>
        </div>
      )}

      {/* Image Lightbox Overlay */}
      {isLightboxOpen && selectedProduct?.images?.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 z-[60000] flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white p-3 bg-white/10 rounded-full transition-all cursor-pointer z-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
          <img
            src={selectedProduct.images[activeImageIndex]}
            alt={selectedProduct.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {selectedProduct.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl cursor-pointer transition-all"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev + 1) % selectedProduct.images.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl cursor-pointer transition-all"
              >
                ›
              </button>
            </>
          )}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {selectedProduct.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === activeImageIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[70000] transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-[#0b192e] border border-[#1b2d4a] text-[#e2e8f0] px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-3 backdrop-blur-md whitespace-nowrap">
          <span>{toastMessage}</span>
          <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-[50000] w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-xl ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>
      </button>
    </section>
  );
};

export default Products;
