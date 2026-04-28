import React, { useState } from 'react';
import { ChevronDown, Search, Info, Plus, ChevronRight, Inbox } from 'lucide-react';

export default function ManageProducts({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState('Active');

  const tabs = ['All', 'Active', 'Inactive', 'Draft', 'Pending QC', 'Violation', 'Deleted'];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:px-10 scrollbar-hide flex flex-col gap-6 font-sans">
      
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-4">
        <div className="text-gray-500 text-[13px] flex items-center gap-2">
          <span>Home</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-medium text-gray-800">Manage Products</span>
        </div>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
          <div className="flex gap-2 text-sm font-medium">
            <button className="px-4 py-1.5 border border-blue-500 text-blue-600 rounded whitespace-nowrap hover:bg-blue-50">
              Find Trending Opportunities
            </button>
            <button className="px-4 py-1.5 border border-blue-500 text-blue-600 rounded flex items-center gap-1 hover:bg-blue-50">
              Analysis Tools <ChevronDown className="w-4 h-4" />
            </button>
            <button className="px-4 py-1.5 border border-blue-500 text-blue-600 rounded flex items-center gap-1 hover:bg-blue-50">
              Bulk Manage <ChevronDown className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('add-product')}
              className="px-4 py-1.5 bg-[#1e61f9] hover:bg-blue-700 text-white rounded flex items-center gap-1 shadow-sm"
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
          <p>Welcome to Product Management Page. <a href="#" className="text-[#1e61f9] hover:underline">Learn more</a> and share more Feedback to us.</p>
          <p>Your products are not visible to buyers yet. <a href="#" className="hidden"></a><a href="#" className="text-[#1e61f9] hover:underline">Please click here to complete to-do list</a></p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 shrink-0">
          ×
        </button>
      </div>

      {/* Product Overview Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <span className="font-bold text-gray-800">Product Overview</span>
             <div className="flex items-center gap-2">
                <div className="w-32 h-1.5 bg-gray-200 rounded-full"></div>
                <span className="text-xs text-gray-500">- / 1,000 <Info className="w-3 h-3 inline text-gray-400" /></span>
             </div>
           </div>
           <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
              Show Details <ChevronDown className="w-4 h-4" />
           </button>
        </div>

        {/* Tabs */}
        <div className="px-4 border-b border-gray-200 flex gap-6 mt-4">
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
              {tab === 'Deleted' && (
                <span className="bg-[#1e61f9] text-white text-[10px] px-1.5 rounded-full font-bold">1</span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-4 bg-[#FAFAFC] border-b border-gray-100 flex flex-col gap-3">
           <div className="flex items-center gap-4 text-sm">
             <span className="text-gray-500">Filter Product:</span>
             <button className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Out Of Stock</button>
           </div>
           
           <div className="grid grid-cols-3 gap-4">
             <div className="flex bg-white border border-gray-300 rounded focus-within:border-[#1e61f9] overflow-hidden">
                <div className="flex items-center gap-1 px-3 border-r border-gray-300 bg-gray-50 text-gray-600 text-[13px] cursor-pointer">
                  Product Name <ChevronDown className="w-3 h-3" />
                </div>
                <input type="text" placeholder="Please Input" className="flex-1 px-3 py-1.5 outline-none text-[13px]" />
                <button className="px-3 text-gray-400"><Search className="w-4 h-4" /></button>
             </div>
             
             <div className="flex bg-white border border-gray-300 rounded focus-within:border-[#1e61f9] overflow-hidden relative cursor-pointer">
                <div className="flex items-center gap-1 px-3 border-r border-gray-300 bg-gray-50 text-gray-600 text-[13px]">
                  Select Category
                </div>
                <input type="text" placeholder="Please Select" className="flex-1 px-3 py-1.5 outline-none text-[13px] bg-transparent cursor-pointer" readOnly />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             </div>

             <div className="flex bg-white border border-gray-300 rounded focus-within:border-[#1e61f9] overflow-hidden relative cursor-pointer">
                <div className="flex items-center gap-1 px-3 border-r border-gray-300 bg-gray-50 text-gray-600 text-[13px]">
                  Sort By
                </div>
                <input type="text" placeholder="Please Select" className="flex-1 px-3 py-1.5 outline-none text-[13px] bg-transparent cursor-pointer" readOnly />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             </div>
             
             <div className="flex bg-white border border-gray-300 rounded focus-within:border-[#1e61f9] overflow-hidden relative cursor-pointer col-span-1">
                <div className="flex items-center gap-1 px-3 border-r border-gray-300 bg-gray-50 text-gray-600 text-[13px]">
                  A/B Testing
                </div>
                <input type="text" placeholder="Please Select" className="flex-1 px-3 py-1.5 outline-none text-[13px] bg-transparent cursor-pointer" readOnly />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             </div>
           </div>
        </div>

        {/* Empty State */}
        <div className="p-20 flex flex-col items-center justify-center text-center">
           <div className="w-40 h-40 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 relative">
             <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-blue-500 rounded-full"></div>
             <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-purple-400 rounded-full"></div>
             <Inbox className="w-16 h-16 text-blue-500 opacity-80" strokeWidth={1} />
             {/* A more illustrative icon placeholder to match the reference */}
             <div className="absolute mt-10 w-24 h-12 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
                <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
             </div>
           </div>
           <h3 className="text-xl font-bold text-gray-800 mb-2">No product under this status or filter</h3>
           <p className="text-gray-500 text-sm">Please check other product status or use other filter.</p>
        </div>

      </div>

    </div>
  );
}
