import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../utils/categories';
import { useProducts } from '../context/ProductContext';
import { exportProductsCSV } from '../utils/storage';

const AdminProducts = () => {
  const { products, deleteProduct, deleteProducts } = useProducts();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null); // null or product id or 'bulk'

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory === 'all' || p.category === filterCategory;
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, search, filterCategory, filterStatus]);

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((p) => p.id));
    }
  };

  const handleDelete = () => {
    if (deleteModal === 'bulk') {
      deleteProducts(selected);
      setSelected([]);
    } else if (deleteModal) {
      deleteProduct(deleteModal);
      setSelected((prev) => prev.filter((s) => s !== deleteModal));
    }
    setDeleteModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-bold tracking-tight text-2xl text-slate-800 mb-1">All Products</h1>
          <p className="text-slate-500 text-sm">{products.length} total products</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportProductsCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 text-sm border border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
            </svg>
            Export CSV
          </button>
          <button
            onClick={() => navigate('/admin/add-product')}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input text-sm"
            placeholder="Search products..."
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="admin-input text-sm w-auto min-w-[160px]"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="admin-input text-sm w-auto min-w-[120px]"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl">
          <span className="text-blue-600 text-sm font-medium">{selected.length} selected</span>
          <button
            onClick={() => setDeleteModal('bulk')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 text-sm hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
            </svg>
            Delete Selected
          </button>
          <button
            onClick={() => setSelected([])}
            className="text-slate-500 text-sm hover:text-slate-800 transition-colors"
          >
            Clear Selection
          </button>
        </div>
      )}

      <div className="admin-card overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-12">
                    <input
                      type="checkbox"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                   <th>Product</th>
                  <th>Category</th>
                  <th>Cost Price (CP)</th>
                  <th>Selling Price (SP)</th>
                  <th>Status</th>
                  <th>Date Added</th>
                  <th className="w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const cat = CATEGORIES.find((c) => c.id === product.category);
                  return (
                    <tr key={product.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M6.75 7.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18 7.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-slate-800 font-medium text-sm">{product.name}</div>
                            {product.description && (
                              <div className="text-slate-400 text-xs line-clamp-1 max-w-[200px]">{product.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        {cat && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${cat.badgeClass}`}>
                            {cat.shortName}
                          </span>
                        )}
                      </td>
                      <td className="text-slate-500 text-sm font-mono">
                        {product.costPrice ? `₹${product.costPrice}` : '—'}
                      </td>
                      <td className="font-semibold text-blue-600 text-sm font-mono">
                        {product.price ? `₹${product.price}` : '—'}
                      </td>
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                          product.status === 'published'
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {product.status || 'draft'}
                        </span>
                      </td>
                      <td className="text-slate-500 text-xs font-mono">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-all"
                            aria-label={`Edit ${product.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteModal(product.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
                            aria-label={`Delete ${product.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-14 h-14 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
            <p className="text-slate-500 text-sm mb-1">No products found</p>
            <p className="text-slate-400 text-xs">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal-card bg-white border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-slate-850 font-sans font-bold tracking-tight text-lg">Confirm Delete</h3>
                <p className="text-slate-600 text-sm">
                  {deleteModal === 'bulk'
                    ? `Delete ${selected.length} selected products?`
                    : 'Delete this product?'}
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
