import React, { useState } from 'react';

interface PickUpAddressProps {
  onNavigate: (page: string) => void;
  user?: any;
}

export default function PickUpAddress({ onNavigate, user }: PickUpAddressProps) {
  const [returnSame, setReturnSame] = useState(true);
  const [businessSame, setBusinessSame] = useState(true);
  const [region, setRegion] = useState('');
  const [addressDetails, setAddressDetails] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user?.id) {
      alert('User session not found. Please log in again.');
      return;
    }

    if (!addressDetails || !phone) {
      alert('Please fill in both address details and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullAddress = region ? `${region}, ${addressDetails}` : addressDetails;
      
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          address: fullAddress,
          phone: phone
        }),
      });

      if (response.ok) {
        // Update local storage to reflect changes
        const updatedUser = { ...user, address: fullAddress, phone: phone };
        localStorage.setItem('sellerUser', JSON.stringify(updatedUser));
        
        alert('Pick-Up Address and Phone Number saved successfully!');
        onNavigate('dashboard');
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('An error occurred while saving. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <select 
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 appearance-none bg-transparent"
              >
                <option value="" disabled>Region/City/District</option>
                <option value="Metro Manila">Metro Manila</option>
                <option value="Cebu">Cebu</option>
                <option value="Davao">Davao</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">
                <span className="text-red-500 mr-1">*</span>Address Details: Number, Street, Landmark, etc.
              </label>
              <input 
                type="text" 
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                placeholder="Address Details: Number, Street, Landmark, etc." 
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">
                <span className="text-red-500 mr-1">*</span>Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l">
                  +63
                </span>
                <input 
                  type="tel" 
                  value={phone.startsWith('+63') ? phone.slice(3) : phone}
                  onChange={(e) => setPhone('+63' + e.target.value.replace(/\D/g, ''))}
                  placeholder="9XXXXXXXXX" 
                  className="w-full border border-gray-300 rounded-r px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                />
              </div>
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
            disabled={isSubmitting}
            className={`bg-[#1890ff] hover:bg-blue-600 text-white font-medium px-8 py-2 rounded text-sm transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Saving...' : 'Submit'}
          </button>
        </div>

      </div>
    </div>
  );
}

