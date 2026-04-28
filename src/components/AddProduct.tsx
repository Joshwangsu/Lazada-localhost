import React from 'react';
import { ChevronRight, Info, Plus } from 'lucide-react';

export default function AddProduct({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:px-10 scrollbar-hide flex flex-col gap-6 font-sans bg-[#F2F3F8]">
      
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-4">
        <div className="text-gray-500 text-[13px] flex items-center gap-2">
          <span className="cursor-pointer hover:underline">Home</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="cursor-pointer hover:underline" onClick={() => onNavigate('manage-products')}>Manage Products</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-medium text-gray-800">Add Product</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>
      </div>

      <div className="flex gap-6 items-start">
        {/* Main Form Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 font-sans">Basic Information</h2>
              
              <div className="space-y-6">
                {/* Product Images */}
                <div>
                  <label className="flex items-center gap-1 text-[13px] font-medium text-gray-800 mb-2">
                    <span className="text-red-500">*</span> Product Images <Info className="w-3.5 h-3.5 text-gray-400" />
                  </label>
                  <div className="w-24 h-24 border border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 hover:border-[#1e61f9] hover:text-[#1e61f9] cursor-pointer bg-gray-50 transition-colors">
                    <Plus className="w-8 h-8 mb-1 opacity-60" />
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
                      placeholder="Ex. Nikon Coolpix A300 Digital Camera" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] outline-none focus:border-[#1e61f9] transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[12px] text-gray-400">
                      <span>0/255</span>
                      <span className="text-gray-300 cursor-not-allowed">Re-Generate</span>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-1 text-[13px] font-medium text-gray-800 mb-2">
                    <span className="text-red-500">*</span> Category
                  </label>
                  <div className="relative cursor-pointer">
                    <input 
                      type="text" 
                      placeholder="Please select category or search with keyword" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] outline-none focus:border-[#1e61f9] transition-colors bg-white cursor-pointer"
                      readOnly
                    />
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <p className="text-[12px] text-gray-500">
              Please upload your product image and the AI Services will auto-generate title, category and other content recommendations to help complete your listing. Subject to <a href="#" className="text-[#1e61f9] hover:underline">AI Services Terms</a>.
            </p>
            <button className="bg-gray-100 text-gray-400 px-6 py-2 rounded text-[13px] font-medium cursor-not-allowed whitespace-nowrap">
              Next: Complete Product Info
            </button>
          </div>
        </div>

        {/* Right Sidebar - Tips */}
        <div className="w-[300px] shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 p-6 hidden lg:block sticky top-6">
          <div className="flex items-center gap-2 text-[#1e61f9] font-bold mb-3">
             <span className="text-base tracking-wide">Tips</span>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20 ml-auto">
               <path d="M12 2C8.68629 2 6 4.68629 6 8C6 10.1583 7.13524 12.0468 8.78461 13.111C9.64692 13.6677 10 14.6191 10 15.6429V17C10 17.5523 10.4477 18 11 18H13C13.5523 18 14 17.5523 14 17V15.6429C14 14.6191 14.3531 13.6677 15.2154 13.111C16.8648 12.0468 18 10.1583 18 8C18 4.68629 15.3137 2 12 2Z" fill="currentColor"/>
               <path d="M10 20H14V21C14 21.5523 13.5523 22 13 22H11C10.4477 22 10 21.5523 10 21V20Z" fill="currentColor"/>
             </svg>
          </div>
          <p className="text-[13px] text-gray-600 leading-relaxed">
            Please make sure to upload product images(s), fill product name, and select the correct category to publish a product.
          </p>
        </div>
      </div>
    </div>
  );
}
