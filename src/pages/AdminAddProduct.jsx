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
  
  // Variants State
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([]);

  // Load existing product for edit mode
  useEffect(() => {
    if (id) {
      const product = getProductById(id);
      if (product) {
        const prodVariants = product.variants || [];
        const productHasVariants = prodVariants.length > 0;
        
        // Map variants to include markupPercent if CP and price are present
        const mappedVariants = prodVariants.map(v => {
          let markup = 25;
          if (v.costPrice && v.price) {
            markup = Math.round(((v.price - v.costPrice) / v.costPrice) * 100);
          }
          return {
            id: `var_${Math.random()}`,
            size: v.size || '',
            costPrice: v.costPrice || '',
            price: v.price || '',
            markupPercent: markup
          };
        });

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
        setHasVariants(productHasVariants);
        setVariants(mappedVariants);
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

  const handleToggleVariants = (enabled) => {
    setHasVariants(enabled);
    if (enabled && variants.length === 0) {
      if (form.costPrice || form.price) {
        setVariants([
          {
            id: `var_${Date.now()}`,
            size: '',
            costPrice: form.costPrice,
            price: form.price,
            markupPercent: markupPercent
          }
        ]);
      } else {
        setVariants([
          {
            id: `var_${Date.now()}`,
            size: '',
            costPrice: '',
            price: '',
            markupPercent: 25
          }
        ]);
      }
    }
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    
    // Recalculate if CP or markup changed
    if (field === 'costPrice' || field === 'markupPercent') {
      const cp = parseFloat(updated[index].costPrice) || 0;
      const pct = parseFloat(updated[index].markupPercent) || 0;
      updated[index].price = cp > 0 ? Math.round(cp * (1 + pct / 100)) : '';
    } else if (field === 'price') {
      const cp = parseFloat(updated[index].costPrice) || 0;
      const sp = parseFloat(value) || 0;
      if (cp > 0 && sp > 0) {
        updated[index].markupPercent = Math.round(((sp - cp) / cp) * 100);
      }
    }
    setVariants(updated);
  };

  const addVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `var_${Date.now()}`,
        size: '',
        costPrice: '',
        price: '',
        markupPercent: 25,
      },
    ]);
  };

  const removeVariantRow = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
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

    if (hasVariants) {
      if (variants.length === 0) {
        alert("⚠️ Please add at least one variant.");
        return;
      }
      for (let i = 0; i < variants.length; i++) {
        if (!variants[i].size.trim()) {
          alert(`⚠️ Variant #${i + 1} size is required.`);
          return;
        }
        if (!variants[i].price) {
          alert(`⚠️ Variant #${i + 1} Selling Price is required.`);
          return;
        }
      }
    }

    setSaving(true);

    const payload = {
      ...form,
      costPrice: hasVariants 
        ? (variants[0].costPrice !== '' ? Number(variants[0].costPrice) : null)
        : (form.costPrice !== '' ? Number(form.costPrice) : null),
      price: hasVariants
        ? (variants[0].price !== '' ? Number(variants[0].price) : 0)
        : (form.price !== '' ? Number(form.price) : 0),
      variants: hasVariants ? variants.map(v => ({
        size: v.size,
        costPrice: v.costPrice !== '' ? Number(v.costPrice) : null,
        price: v.price !== '' ? Number(v.price) : 0
      })) : []
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
        <h1 className="font-sans font-bold tracking-tight text-2xl text-slate-800 mb-1">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-slate-500 text-sm">
          {id ? 'Update product details below.' : 'Fill in the details to add a new product to your catalog.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="product-name" className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">
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
          <label htmlFor="product-category" className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">
            Category
          </label>
          <select
            id="product-category"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="admin-input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] bg-[length:20px]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="product-description" className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">
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
            <span className={`text-xs font-mono ${charCount > 180 ? 'text-amber-600' : 'text-slate-400'}`}>
              {charCount}/200
            </span>
          </div>
        </div>

        {/* Has Variants Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <div className="text-slate-800 text-sm font-medium">Product Variants</div>
            <div className="text-slate-400 text-xs">Does this product have different sizes and pricing?</div>
          </div>
          <button
            type="button"
            onClick={() => handleToggleVariants(!hasVariants)}
            className={`toggle-switch ${hasVariants ? 'active' : ''}`}
            role="switch"
            aria-checked={hasVariants}
            aria-label="Toggle variants"
          />
        </div>

        {/* Pricing Block or Variants Table */}
        {!hasVariants ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
            {/* Cost Price */}
            <div>
              <label htmlFor="product-cp" className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">
                Cost Price (CP)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono">₹</span>
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
              <label className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">
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
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkupChange(30)}
                  className={`px-3 py-2 rounded-lg text-xs font-mono transition-colors border ${
                    markupPercent === 30
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  30%
                </button>
              </div>
            </div>

            {/* Selling Price */}
            <div>
              <label htmlFor="product-sp" className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">
                Selling Price (SP) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono">₹</span>
                <input
                  id="product-sp"
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="admin-input pl-8 font-semibold text-blue-600 border-slate-200"
                  placeholder="0"
                  min="0"
                  required={!hasVariants}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 text-xs font-mono uppercase tracking-wider">Product Variants (Sizing & Custom Pricing)</span>
              <button
                type="button"
                onClick={addVariantRow}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
                Add Variant
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="text-left text-slate-500 font-mono text-xs uppercase tracking-wider">
                    <th className="pb-3 pr-4 font-normal">Variant Size <span className="text-red-400">*</span></th>
                    <th className="pb-3 px-4 font-normal w-32">Cost Price (CP)</th>
                    <th className="pb-3 px-4 font-normal w-28">Markup %</th>
                    <th className="pb-3 px-4 font-normal w-36">Selling Price (SP) <span className="text-red-400">*</span></th>
                    <th className="pb-3 pl-4 font-normal w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {variants.map((v, index) => (
                    <tr key={v.id} className="group">
                      <td className="py-3 pr-4">
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          className="admin-input py-1.5 text-sm"
                          placeholder="e.g., 600 mm"
                          required
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₹</span>
                          <input
                            type="number"
                            value={v.costPrice}
                            onChange={(e) => handleVariantChange(index, 'costPrice', e.target.value)}
                            className="admin-input pl-6 py-1.5 text-sm font-mono"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={v.markupPercent}
                          onChange={(e) => handleVariantChange(index, 'markupPercent', e.target.value)}
                          className="admin-input py-1.5 text-sm font-mono"
                          placeholder="25"
                          min="0"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₹</span>
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                            className="admin-input pl-6 py-1.5 text-sm font-semibold text-blue-600 font-mono border-slate-200"
                            placeholder="0"
                            min="0"
                            required
                          />
                        </div>
                      </td>
                      <td className="py-3 pl-4 text-center">
                        <button
                          type="button"
                          onClick={() => removeVariantRow(index)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
                          aria-label="Delete variant row"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">
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
                <svg className="w-10 h-10 text-blue-600 mx-auto mb-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <p className="text-blue-600 text-sm font-medium">Uploading images to cloud...</p>
              </div>
            ) : (
              <>
                <svg className="w-10 h-10 text-blue-600/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"/>
                </svg>
                <p className="text-slate-600 text-sm mb-1">
                  Drag & drop images here, or <span className="text-blue-600">browse</span>
                </p>
                <p className="text-slate-400 text-xs">Supports JPG, PNG, WebP</p>
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
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
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
                    <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-600/80 text-white text-[9px] font-mono rounded uppercase">Cover</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="text-slate-800 text-sm font-medium">Featured Product</div>
              <div className="text-slate-400 text-xs">Highlight on homepage</div>
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
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="text-slate-800 text-sm font-medium">Status</div>
              <div className="text-slate-400 text-xs">
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
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            className="px-6 py-3 text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;
