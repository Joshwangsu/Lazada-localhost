import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Info, Plus, ChevronRight, Inbox, Edit, Trash2 } from 'lucide-react';

interface ManageProductsProps {
  onNavigate: (page: string) => void;
  user: any;
}

export default function ManageProducts({ onNavigate, user }: ManageProductsProps) {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['All', 'Active', 'Inactive', 'Draft', 'Pending QC', 'Violation', 'Deleted'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/seller/products/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProducts();
    }
  }, [user?.id]);

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setProducts(products.filter(p => p.Prdct_Id !== productId));
        alert('Product deleted successfully');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:px-10 scrollbar-hide flex flex-col gap-6 font-sans bg-[#F2F3F8]">
      
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-4">
        <div className="text-gray-500 text-[13px] flex items-center gap-2">
          <span className="cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-medium text-gray-800">Manage Products</span>
        </div>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
          <div className="flex gap-2 text-sm font-medium">
            <button 
              onClick={() => onNavigate('add-product')}
              className="px-4 py-1.5 bg-[#1e61f9] hover:bg-blue-700 text-white rounded flex items-center gap-1 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> New Product
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#f2f8ff] border border-blue-100 rounded-lg p-3.5 flex items-start gap-2 text-[13px]">
        <Info className="w-4 h-4 text-[#1e61f9] shrink-0 mt-0.5" />
        <div className="flex-1 text-gray-600 space-y-1">
          <p>Manage your product listings and monitor their performance. <a href="#" className="text-[#1e61f9] hover:underline">Learn more</a></p>
        </div>
      </div>

      {/* Product Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="px-4 border-b border-gray-200 flex gap-6 pt-4">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[14px] font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === tab 
                  ? 'border-[#1e61f9] text-[#1e61f9]' 
                  : 'border-transparent text-gray-600 hover:text-[#1e61f9]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters Area */}
        <div className="p-4 bg-[#FAFAFC] border-b border-gray-100 flex items-center gap-4">
           <div className="flex-1 flex bg-white border border-gray-300 rounded focus-within:border-[#1e61f9] overflow-hidden">
              <input type="text" placeholder="Search by product name..." className="flex-1 px-3 py-1.5 outline-none text-[13px]" />
              <button className="px-3 text-gray-400 border-l border-gray-200"><Search className="w-4 h-4" /></button>
           </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-gray-500">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FAFAFC] border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[13px] font-semibold text-gray-700">Product Info</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-gray-700">Stock</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.Prdct_Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                          <img 
                            src={product.Prdct_Image_Url || 'https://via.placeholder.com/48'} 
                            alt={product.Prdct_Name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[13px] font-medium text-gray-800 line-clamp-1">{product.Prdct_Name}</h4>
                          <span className="text-[11px] text-gray-400">ID: {product.Prdct_Id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-gray-600">
                      {product.Ctgry_Name || 'General'}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-gray-800">
                      ₱{parseFloat(product.Prdct_Price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-gray-600">
                      {product.Prdct_Stock_Qty}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.Prdct_Id)}
                          className="text-red-500 hover:text-red-700 transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-20 flex flex-col items-center justify-center text-center">
             <div className="w-40 h-40 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
               <Inbox className="w-16 h-16 text-blue-500 opacity-80" strokeWidth={1} />
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
             <p className="text-gray-500 text-sm mb-6">Start selling by adding your first product.</p>
             <button 
               onClick={() => onNavigate('add-product')}
               className="px-6 py-2 bg-[#1e61f9] hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
             >
               Add Product
             </button>
          </div>
        )}
      </div>

    </div>
  );
}
