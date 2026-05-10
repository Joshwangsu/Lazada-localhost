import React, { useState } from 'react';

interface PickUpAddressProps {
  onNavigate: (page: string) => void;
}

export default function PickUpAddress({ onNavigate }: PickUpAddressProps) {
  const [returnSame, setReturnSame] = useState(true);
  const [businessSame, setBusinessSame] = useState(true);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f2f4f8] overflow-y-auto font-sans">
      <div className="p-6">
        
        {/* Breadcrumb & Alert */}
        <div className="mb-4">
          <div className="text-[13px] text-gray-500 mb-4 flex items-center gap-2">
            <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('dashboard')}>Home</span>
            <span>&gt;</span>
            <span className="text-gray-800">Pick-Up Address</span>
          </div>
          <div className="text-[13px] text-gray-700 bg-transparent">
            Please <span className="font-semibold text-gray-800">add your pick-up address</span> to make your products visible to customers 
            (<a href="#" className="text-blue-500 hover:underline">Apply Delivery By Seller</a> If your warehouse address is not supported by LEL)
          </div>
        </div>

        {/* Pick-Up Address Form */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Pick-Up Address</h2>
          
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">
                <span className="text-red-500 mr-1">*</span>Region/City/District
              </label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-400 outline-none focus:border-blue-500 appearance-none bg-transparent">
                <option value="" disabled selected>Region/City/District</option>
                <option value="ncr">Metro Manila</option>
                <option value="cebu">Cebu</option>
                <option value="davao">Davao</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">
                <span className="text-red-500 mr-1">*</span>Address Details: Number, Street, Landmark, etc.
              </label>
              <input 
                type="text" 
                placeholder="Address Details: Number, Street, Landmark, etc." 
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Return Address */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Return Address</h2>
          <div className="flex items-center gap-3">
            {/* Custom Toggle Switch */}
            <div 
              className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${returnSame ? 'bg-[#1890ff]' : 'bg-gray-300'}`}
              onClick={() => setReturnSame(!returnSame)}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${returnSame ? 'left-[22px]' : 'left-0.5'}`}></div>
            </div>
            <span className="text-[13px] text-gray-500">Same as Warehouse Address</span>
          </div>
        </div>

        {/* Business Address */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Business Address</h2>
          <div className="flex items-center gap-3">
            {/* Custom Toggle Switch */}
            <div 
              className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${businessSame ? 'bg-[#1890ff]' : 'bg-gray-300'}`}
              onClick={() => setBusinessSame(!businessSame)}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${businessSame ? 'left-[22px]' : 'left-0.5'}`}></div>
            </div>
            <span className="text-[13px] text-gray-500">Same as Warehouse Address</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex justify-end">
          <button 
            className="bg-[#1890ff] hover:bg-blue-600 text-white font-medium px-8 py-2 rounded text-sm transition-colors"
            onClick={() => {
              alert('Pick-Up Address saved successfully!');
              onNavigate('dashboard');
            }}
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}
