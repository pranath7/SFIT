import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES } from '../utils/categories';
import { useProducts } from '../context/ProductContext';

const AdminAddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProductById } = useProducts();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0].id,
    description: '',
    images: [],
    featured: false,
    status: 'published',
    costPrice: '',
    price: '',
  });
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [markupPercent, setMarkupPercent] = useState(25); // Default markup is 25%

  // Load existing product for edit mode
  useEffect(() => {
    if (id) {
      const product = getProductById(id);
      if (product) {
        setForm({
          name: product.name || '',
          category: product.category || CATEGORIES[0].id,
          description: product.description || '',
          images: product.images || [],
          featured: product.featured || false,
          status: product.status || 'draft',
          costPrice: product.costPrice || '',
          price: product.price || '',
        });
        setCharCount((product.description || '').length);
        if (product.costPrice && product.price) {
          const diff = product.price - product.costPrice;
          const pct = Math.round((diff / product.costPrice) * 100);
          setMarkupPercent(pct);
        }
      }
    }
  }, [id, getProductById]);

  const handleChange = (field, value) => {
    if (field === 'description') {
      if (value.length > 200) return;
      setCharCount(value.length);
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCostPriceChange = (val) => {
    const cp = parseFloat(val) || 0;
    const sp = cp > 0 ? Math.round(cp * (1 + markupPercent / 100)) : '';
    setForm((prev) => ({
      ...prev,
      costPrice: val,
      price: sp,
    }));
  };

  const handleMarkupChange = (pct) => {
    setMarkupPercent(pct);
    const cp = parseFloat(form.costPrice) || 0;
    const sp = cp > 0 ? Math.round(cp * (1 + pct / 100)) : '';
    setForm((prev) => ({ ...prev, price: Math.round(sp) }));
  };

  const [uploadingImages, setUploadingImages] = useState(false);

  const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    // Check if configured properly
    if (
      !cloudName || 
      !uploadPreset || 
      cloudName === 'YOUR_CLOUDINARY_CLOUD_NAME_HERE' || 
      uploadPreset === 'YOUR_CLOUDINARY_UNSIGNED_PRESET_HERE' || 
      !cloudName.trim()
    ) {
      // Fallback: convert to base64
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const compressImageClient = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }));
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleImageUpload = async (files) => {
    setUploadingImages(true);
    const uploadedUrls = [];
    
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const compressedFile = await compressImageClient(file);
        const url = await uploadImageToCloudinary(compressedFile);
        uploadedUrls.push(url);
      } catch (err) {
        console.error("Failed to upload image:", err);
        alert(`Failed to upload ${file.name}. Ensure your Cloudinary credentials are correct.`);
      }
    }
    
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
    setUploadingImages(false);
  };


  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);

    const payload = {
      ...form,
      costPrice: form.costPrice !== '' ? Number(form.costPrice) : null,
      price: form.price !== '' ? Number(form.price) : 0,
    };

    try {
      let result;
      if (id) {
        result = await updateProduct(id, payload);
      } else {
        result = await addProduct(payload);
      }

      setSaving(false);
      if (result && result.success) {
        alert("✅ Success! Product successfully saved and synchronized to Supabase Cloud and Cloudinary.");
        navigate('/admin/products');
      } else {
        const errMsg = result?.error || "Unknown error occurred.";
        alert(`⚠️ Warning: Saved locally, but failed to sync to the cloud database: ${errMsg}`);
        navigate('/admin/products');
      }
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert("❌ Error: An unexpected error occurred while saving the product.");
    }
  };


  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-white mb-1">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-steel text-sm">
          {id ? 'Update product details below.' : 'Fill in the details to add a new product to your catalog.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="product-name" className="block text-steel text-xs font-mono uppercase tracking-wider mb-2">
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="admin-input"
            placeholder="e.g., Premium Soft-Close Drawer Slide 450mm"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="product-category" className="block text-steel text-xs font-mono uppercase tracking-wider mb-2">
            Category
          </label>
          <select
            id="product-category"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="admin-input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238fa3c0%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] bg-[length:20px]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="product-description" className="block text-steel text-xs font-mono uppercase tracking-wider mb-2">
            Short Description
          </label>
          <textarea
            id="product-description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="admin-input min-h-[100px] resize-y"
            placeholder="Brief product description (max 200 characters)"
            maxLength={200}
          />
          <div className="mt-1 text-right">
            <span className={`text-xs font-mono ${charCount > 180 ? 'text-yellow-400' : 'text-steel/40'}`}>
              {charCount}/200
            </span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-navy-dark/40 rounded-xl border border-accent-blue/5">
          {/* Cost Price */}
          <div>
            <label htmlFor="product-cp" className="block text-steel text-xs font-mono uppercase tracking-wider mb-2">
              Cost Price (CP)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel/50 font-mono">₹</span>
              <input
                id="product-cp"
                type="number"
                value={form.costPrice}
                onChange={(e) => handleCostPriceChange(e.target.value)}
                className="admin-input pl-8"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Markup % */}
          <div>
            <label className="block text-steel text-xs font-mono uppercase tracking-wider mb-2">
              Markup Percentage
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={markupPercent}
                onChange={(e) => handleMarkupChange(Number(e.target.value))}
                className="admin-input flex-1"
                placeholder="25"
                min="0"
              />
              <button
                type="button"
                onClick={() => handleMarkupChange(25)}
                className={`px-3 py-2 rounded-lg text-xs font-mono transition-colors border ${
                  markupPercent === 25
                    ? 'bg-accent-blue text-white border-accent-blue'
                    : 'bg-navy-dark text-steel border-accent-blue/10 hover:border-accent-blue/30'
                }`}
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => handleMarkupChange(30)}
                className={`px-3 py-2 rounded-lg text-xs font-mono transition-colors border ${
                  markupPercent === 30
                    ? 'bg-accent-blue text-white border-accent-blue'
                    : 'bg-navy-dark text-steel border-accent-blue/10 hover:border-accent-blue/30'
                }`}
              >
                30%
              </button>
            </div>
          </div>

          {/* Selling Price */}
          <div>
            <label htmlFor="product-sp" className="block text-steel text-xs font-mono uppercase tracking-wider mb-2">
              Selling Price (SP) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel/50 font-mono">₹</span>
              <input
                id="product-sp"
                type="number"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="admin-input pl-8 font-semibold text-accent-electric border-accent-blue/20"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-steel text-xs font-mono uppercase tracking-wider mb-2">
            Product Images
          </label>

          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''} ${uploadingImages ? 'opacity-60 pointer-events-none' : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => !uploadingImages && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload images"
          >
            {uploadingImages ? (
              <div className="text-center py-4">
                <svg className="w-10 h-10 text-accent-electric mx-auto mb-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <p className="text-accent-electric text-sm font-medium">Uploading images to cloud...</p>
              </div>
            ) : (
              <>
                <svg className="w-10 h-10 text-accent-blue/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"/>
                </svg>
                <p className="text-steel text-sm mb-1">
                  Drag & drop images here, or <span className="text-accent-electric">browse</span>
                </p>
                <p className="text-steel/40 text-xs">Supports JPG, PNG, WebP</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
          />

          {/* Image Previews */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {form.images.map((img, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-navy-dark">
                  <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-accent-blue/80 text-white text-[9px] font-mono rounded uppercase">Cover</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-4 bg-navy-dark/50 rounded-xl border border-accent-blue/5">
            <div>
              <div className="text-white text-sm font-medium">Featured Product</div>
              <div className="text-steel/60 text-xs">Highlight on homepage</div>
            </div>
            <button
              type="button"
              onClick={() => handleChange('featured', !form.featured)}
              className={`toggle-switch ${form.featured ? 'active' : ''}`}
              role="switch"
              aria-checked={form.featured}
              aria-label="Toggle featured"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-navy-dark/50 rounded-xl border border-accent-blue/5">
            <div>
              <div className="text-white text-sm font-medium">Status</div>
              <div className="text-steel/60 text-xs">
                {form.status === 'published' ? 'Visible on public site' : 'Hidden from public'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChange('status', form.status === 'published' ? 'draft' : 'published')}
              className={`toggle-switch ${form.status === 'published' ? 'active' : ''}`}
              role="switch"
              aria-checked={form.status === 'published'}
              aria-label="Toggle publish status"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            className="px-8 py-3 bg-accent-blue hover:bg-accent-electric text-white font-semibold rounded-lg transition-all duration-300 shadow-glow-blue hover:shadow-glow-blue-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
                {id ? 'Update Product' : 'Save Product'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 text-steel hover:text-white border border-accent-blue/10 hover:border-accent-blue/20 rounded-lg transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;
