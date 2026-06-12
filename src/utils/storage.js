const PRODUCTS_KEY = 'sfit_products';
const SESSION_KEY = 'sfit_session';
const CATEGORIES_KEY = 'sfit_custom_categories';

// ===== PRODUCTS =====
export const getProducts = () => {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id, updates) => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
    saveProducts(products);
    return products[index];
  }
  return null;
};

export const deleteProduct = (id) => {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
};

export const deleteProducts = (ids) => {
  const products = getProducts().filter((p) => !ids.includes(p.id));
  saveProducts(products);
};

// ===== SESSION =====
export const getSession = () => {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

// ===== CUSTOM CATEGORIES =====
export const getCustomCategories = () => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCustomCategories = (categories) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

// ===== EXPORT CSV =====
export const exportProductsCSV = () => {
  const products = getProducts();
  if (products.length === 0) return '';

  const headers = ['Name', 'Category', 'Description', 'Status', 'Featured', 'Created At'];
  const rows = products.map((p) => [
    `"${p.name}"`,
    `"${p.category}"`,
    `"${(p.description || '').replace(/"/g, '""')}"`,
    p.status || 'draft',
    p.featured ? 'Yes' : 'No',
    new Date(p.createdAt).toLocaleDateString(),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sfit-products-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
