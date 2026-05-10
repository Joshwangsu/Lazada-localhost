import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Upload, X } from 'lucide-react';

interface AddProductProps {
  onNavigate: (page: string) => void;
  user: any;
  editProduct?: any;
}

export default function AddProduct({ onNavigate, user, editProduct }: AddProductProps) {
  const [name, setName] = useState(editProduct?.Prdct_Name || '');
  const [category, setCategory] = useState(editProduct?.Prdct_CtgryId?.toString() || '');
  const [price, setPrice] = useState(editProduct?.Prdct_Price?.toString() || '');
  const [stock, setStock] = useState(editProduct?.Prdct_Stock_Qty?.toString() || '');
  const [description, setDescription] = useState(editProduct?.Prdct_Description || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editProduct?.Prdct_Image_Url || null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          if (!editProduct?.Prdct_CtgryId) {
            setCategory(data[0].Ctgry_Id.toString());
          }
        }
      })
      .catch(err => console.error('Failed to fetch categories', err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please upload an image smaller than 5MB.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert("Product Name and Price are required.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Use FormData so we can upload the file
      const formData = new FormData();
      formData.append('name', name);
      formData.append('categoryId', category);
      formData.append('price', price);
      formData.append('stock', stock || '0');
      formData.append('description', description);
      formData.append('userId', user.id.toString());
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const url = editProduct 
        ? `http://localhost:5000/api/products/${editProduct.Prdct_Id}`
        : 'http://localhost:5000/api/products';
        
      const response = await fetch(url, {
        method: editProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text.slice(0, 150) || 'Server returned a non-JSON response');
      }

      if (!response.ok) throw new Error(data.error || `Failed to ${editProduct ? 'update' : 'add'} product`);

      alert(`Product ${editProduct ? 'updated' : 'added'} successfully!`);
      onNavigate('manage-products');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:px-10 scrollbar-hide flex flex-col gap-6 font-sans bg-[#F2F3F8]">
      
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-4">
        <div className="text-gray-500 text-[13px] flex items-center gap-2">
          <span className="cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="cursor-pointer hover:underline" onClick={() => onNavigate('manage-products')}>Manage Products</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-medium text-gray-800">{editProduct ? 'Edit Product' : 'Add Product'}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{editProduct ? 'Edit Product' : 'Add Product'}</h1>
      </div>

      <div className="flex gap-6 items-start">
        {/* Main Form Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Basic Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="flex items-center gap-1 text-[13px] font-medium text-gray-800 mb-2">
                    Product Image <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                  </label>
                  
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-32 h-32 rounded-lg border border-gray-200 overflow-hidden group">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#1e61f9] hover:text-[#1e61f9] cursor-pointer bg-gray-50 transition-all group"
                      >
                        <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-medium text-center px-2">Upload Photo</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="text-[12px] text-gray-400 space-y-1">
                      <p>• Supported: JPG, PNG, WEBP</p>
                      <p>• Max size: 5MB</p>
                      <p>• Best ratio: 1:1 (Square)</p>
                    </div>
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="flex items-center gap-1 text-[13px] font-medium text-gray-800 mb-2">
                    <span className="text-red-500">*</span> Product Name
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={255}
                      placeholder="Ex. Nikon Coolpix A300 Digital Camera" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] outline-none focus:border-[#1e61f9] transition-colors pr-20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">{name.length}/255</span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-1 text-[13px] font-medium text-gray-800 mb-2">
                    <span className="text-red-500">*</span> Category
                  </label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] outline-none focus:border-[#1e61f9] transition-colors bg-white"
                  >
                    {categories.length === 0 && <option disabled>Loading categories...</option>}
                    {categories.map(c => (
                      <option key={c.Ctgry_Id} value={c.Ctgry_Id}>{c.Ctgry_Name}</option>
                    ))}
                  </select>
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1 text-[13px] font-medium text-gray-800 mb-2">
                      <span className="text-red-500">*</span> Price (PHP)
                    </label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] outline-none focus:border-[#1e61f9] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-[13px] font-medium text-gray-800 mb-2">
                      Stock Quantity
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="0" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] outline-none focus:border-[#1e61f9] transition-colors"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-1 text-[13px] font-medium text-gray-800 mb-2">
                    Description
                  </label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product..." 
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] outline-none focus:border-[#1e61f9] transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#1e61f9] hover:bg-blue-700 text-white rounded-sm font-medium transition-colors disabled:opacity-50 min-w-[120px]"
                  >
                    {loading ? (editProduct ? 'Updating...' : 'Publishing...') : (editProduct ? 'Update Product' : 'Publish Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Tips */}
        <div className="w-[280px] shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 p-6 hidden lg:block sticky top-6">
          <div className="font-bold text-[#1e61f9] mb-3 text-base">Tips</div>
          <div className="text-[13px] text-gray-600 space-y-2">
            <p>• Product images are optional but highly recommended.</p>
            <p>• Choose the correct category so buyers can find your product.</p>
            <p>• A detailed description helps answer buyer questions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
