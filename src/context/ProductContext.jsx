import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../utils/storage';
import { supabase } from '../utils/supabaseClient';

const ProductContext = createContext(null);

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);

  // Fetch products and categories on mount
  useEffect(() => {
    const loadData = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (!error && data) {
            // Map db snake_case back to camelCase
            const mapped = data.map(p => ({
              id: p.id,
              name: p.name,
              category: p.category,
              description: p.description,
              price: Number(p.price),
              costPrice: p.cost_price ? Number(p.cost_price) : undefined,
              images: p.images || [],
              featured: p.featured,
              status: p.status,
              createdAt: p.created_at,
              updatedAt: p.updated_at
            }));
            setProducts(mapped);
            setCustomCategories(storage.getCustomCategories());
            return;
          }
        } catch (e) {
          console.error("Failed to load from Supabase, falling back to local storage:", e);
        }
      }
      
      // Fallback
      setProducts(storage.getProducts());
      setCustomCategories(storage.getCustomCategories());
    };

    loadData();
  }, []);

  const addProduct = useCallback(async (product) => {
    // Local fallback save
    const localProduct = storage.addProduct(product);
    let cloudError = null;
    
    if (supabase) {
      try {
        const dbProduct = {
          id: localProduct.id,
          name: product.name,
          category: product.category,
          description: product.description,
          price: product.price,
          cost_price: product.costPrice || null,
          images: product.images || [],
          featured: product.featured || false,
          status: product.status || 'published',
          created_at: localProduct.createdAt,
          updated_at: localProduct.updatedAt
        };

        const { error } = await supabase.from('products').insert([dbProduct]);
        if (error) throw error;
      } catch (e) {
        console.error("Failed to write to Supabase:", e);
        cloudError = e.message || e;
      }
    }
    
    // Refresh products state
    if (supabase) {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) {
        setProducts(data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          price: Number(p.price),
          costPrice: p.cost_price ? Number(p.cost_price) : undefined,
          images: p.images || [],
          featured: p.featured,
          status: p.status,
          createdAt: p.created_at,
          updatedAt: p.updated_at
        })));
      }
    } else {
      setProducts(storage.getProducts());
    }
    return { success: !cloudError, error: cloudError, product: localProduct };
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    const localUpdated = storage.updateProduct(id, updates);
    let cloudError = null;
    
    if (supabase) {
      try {
        const dbUpdates = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.price !== undefined) dbUpdates.price = updates.price;
        if (updates.costPrice !== undefined) dbUpdates.cost_price = updates.costPrice;
        if (updates.images !== undefined) dbUpdates.images = updates.images;
        if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        dbUpdates.updated_at = new Date().toISOString();

        const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
        if (error) throw error;
      } catch (e) {
        console.error("Failed to update in Supabase:", e);
        cloudError = e.message || e;
      }
    }

    if (supabase) {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) {
        setProducts(data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          price: Number(p.price),
          costPrice: p.cost_price ? Number(p.cost_price) : undefined,
          images: p.images || [],
          featured: p.featured,
          status: p.status,
          createdAt: p.created_at,
          updatedAt: p.updated_at
        })));
      }
    } else {
      setProducts(storage.getProducts());
    }
    return { success: !cloudError, error: cloudError, product: localUpdated };
  }, []);

  const deleteProduct = useCallback(async (id) => {
    storage.deleteProduct(id);
    
    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
      } catch (e) {
        console.error("Failed to delete in Supabase:", e);
      }
    }

    if (supabase) {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) {
        setProducts(data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          price: Number(p.price),
          costPrice: p.cost_price ? Number(p.cost_price) : undefined,
          images: p.images || [],
          featured: p.featured,
          status: p.status,
          createdAt: p.created_at,
          updatedAt: p.updated_at
        })));
      }
    } else {
      setProducts(storage.getProducts());
    }
  }, []);

  const deleteProducts = useCallback(async (ids) => {
    storage.deleteProducts(ids);

    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().in('id', ids);
        if (error) throw error;
      } catch (e) {
        console.error("Failed to bulk delete in Supabase:", e);
      }
    }

    if (supabase) {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) {
        setProducts(data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          price: Number(p.price),
          costPrice: p.cost_price ? Number(p.cost_price) : undefined,
          images: p.images || [],
          featured: p.featured,
          status: p.status,
          createdAt: p.created_at,
          updatedAt: p.updated_at
        })));
      }
    } else {
      setProducts(storage.getProducts());
    }
  }, []);

  const getProductsByCategory = useCallback(
    (categoryId) => {
      return products.filter((p) => p.category === categoryId && p.status === 'published');
    },
    [products]
  );

  const getPublishedProducts = useCallback(() => {
    return products.filter((p) => p.status === 'published');
  }, [products]);

  const getFeaturedProducts = useCallback(() => {
    return products.filter((p) => p.featured && p.status === 'published');
  }, [products]);

  const getProductById = useCallback(
    (id) => products.find((p) => p.id === id),
    [products]
  );

  const getProductCount = useCallback(
    (categoryId) => {
      if (!categoryId) return products.length;
      return products.filter((p) => p.category === categoryId).length;
    },
    [products]
  );

  const getRecentProducts = useCallback(
    (limit = 5) => {
      return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
    },
    [products]
  );

  const getProductsThisMonth = useCallback(() => {
    const now = new Date();
    return products.filter((p) => {
      const d = new Date(p.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [products]);

  const addCustomCategory = useCallback((category) => {
    const updated = [...customCategories, { ...category, id: `custom_${Date.now()}` }];
    setCustomCategories(updated);
    storage.saveCustomCategories(updated);
  }, [customCategories]);

  const searchProducts = useCallback(
    (query) => {
      const q = query.toLowerCase();
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    },
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteProducts,
        getProductsByCategory,
        getPublishedProducts,
        getFeaturedProducts,
        getProductById,
        getProductCount,
        getRecentProducts,
        getProductsThisMonth,
        searchProducts,
        customCategories,
        addCustomCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
