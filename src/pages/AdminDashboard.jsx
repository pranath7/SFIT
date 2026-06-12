import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../utils/categories';

const AdminDashboard = () => {
  const { products, getProductsThisMonth, getRecentProducts } = useProducts();

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
        </svg>
      ),
      color: 'text-accent-electric',
      bg: 'bg-accent-blue/10',
    },
    {
      label: 'Categories',
      value: CATEGORIES.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z"/>
        </svg>
      ),
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      label: 'Added This Month',
      value: getProductsThisMonth(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
        </svg>
      ),
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      label: 'Published',
      value: products.filter((p) => p.status === 'published').length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  const recentProducts = getRecentProducts(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-white mb-1">Dashboard</h1>
        <p className="text-steel text-sm">Overview of your product catalog.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="font-display text-3xl text-white mb-1">{stat.value}</div>
            <div className="text-steel text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg text-white">Recent Products</h2>
          <a href="/admin/products" className="text-accent-electric text-sm hover:underline">View All →</a>
        </div>

        {recentProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => {
                  const cat = CATEGORIES.find((c) => c.id === product.category);
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-navy-dark overflow-hidden flex-shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-navy-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M6.75 7.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18 7.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
                              </div>
                            )}
                          </div>
                          <span className="text-white font-medium text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td>
                        {cat && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${cat.badgeClass}`}>
                            {cat.shortName}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                          product.status === 'published'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {product.status || 'draft'}
                        </span>
                      </td>
                      <td className="text-steel text-xs font-mono">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-navy-mid mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
            </svg>
            <p className="text-steel text-sm mb-2">No products yet</p>
            <a href="/admin/add-product" className="text-accent-electric text-sm hover:underline">Add your first product →</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
