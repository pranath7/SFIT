import { useState } from 'react';
import { CATEGORIES } from '../utils/categories';
import { useProducts } from '../context/ProductContext';
import CategoryIcons from '../components/home/CategoryIcons';

const AdminCategories = () => {
  const { getProductCount, customCategories, addCustomCategory } = useProducts();
  const [showAdd, setShowAdd] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const allCategories = [
    ...CATEGORIES,
    ...customCategories.map((c) => ({
      ...c,
      pattern: 'geo-pattern-1',
      badgeClass: 'badge-kitchen',
      icon: 'kitchen',
      isCustom: true,
    })),
  ];

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCustomCategory({
      name: newCatName,
      shortName: newCatName.split(' ')[0],
      description: newCatDesc || 'Custom category',
    });
    setNewCatName('');
    setNewCatDesc('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-slate-800 mb-1">Categories</h1>
          <p className="text-slate-500 text-sm">Manage your product categories.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allCategories.map((cat) => {
          const count = getProductCount(cat.id);
          return (
            <div key={cat.id} className={`admin-card p-6 ${cat.pattern}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 text-blue-600/60">
                  {CategoryIcons[cat.icon] || CategoryIcons.kitchen}
                </div>
                {cat.isCustom && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100/50 text-[10px] font-mono rounded uppercase">Custom</span>
                )}
              </div>
              <h3 className="font-display text-lg text-slate-800 mb-1">{cat.name}</h3>
              <p className="text-slate-500 text-sm mb-4">{cat.description}</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                <span className="text-slate-400 text-xs font-mono">
                  {count} {count === 1 ? 'product' : 'products'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-card bg-white border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-slate-800 font-display text-lg mb-4">Add Custom Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label htmlFor="new-cat-name" className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">
                  Category Name
                </label>
                <input
                  id="new-cat-name"
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="admin-input"
                  placeholder="e.g., Handles & Knobs"
                  required
                />
              </div>
              <div>
                <label htmlFor="new-cat-desc" className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">
                  Description
                </label>
                <input
                  id="new-cat-desc"
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="admin-input"
                  placeholder="Short description"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Add Category
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
