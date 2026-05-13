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

  // Location API states
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [barangays, setBarangays] = useState<any[]>([]);

  const [province, setProvince] = useState('');
  const [provinceCode, setProvinceCode] = useState('');
  const [district, setDistrict] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [ward, setWard] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch Provinces on mount
  React.useEffect(() => {
    fetch('https://psgc.gitlab.io/api/provinces')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => a.name.localeCompare(b.name));
        setProvinces(sorted);
      })
      .catch(err => console.error('Error fetching provinces:', err));

    // Also fetch NCR (which is a region, not a province in PSGC but often treated as one)
    fetch('https://psgc.gitlab.io/api/regions/130000000/provinces')
      .then(res => res.json())
      .then(data => {
        // Metro Manila is sometimes here, sometimes we need to fetch its cities directly
      });
  }, []);

  // Fetch Cities when province changes
  React.useEffect(() => {
    if (!provinceCode) {
      setCities([]);
      return;
    }
    
    let url = `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities`;
    // Handle Metro Manila (NCR) specifically if needed
    if (provinceCode === '130000000') {
      url = `https://psgc.gitlab.io/api/regions/130000000/cities-municipalities`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCities(sorted);
      })
      .catch(err => console.error('Error fetching cities:', err));
  }, [provinceCode]);

  // Fetch Barangays when city changes
  React.useEffect(() => {
    if (!districtCode) {
      setBarangays([]);
      return;
    }

    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${districtCode}/barangays`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => a.name.localeCompare(b.name));
        setBarangays(sorted);
      })
      .catch(err => console.error('Error fetching barangays:', err));
  }, [districtCode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!province) newErrors.province = "Province is required";
    if (!district) newErrors.district = "City/Municipality is required";
    if (!ward) newErrors.ward = "Barangay is required";
    if (!addressDetails.trim()) newErrors.addressDetails = "Address details are required";
    if (!phone || phone.length < 13) newErrors.phone = "Valid phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      alert('User session not found. Please log in again.');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const fullAddress = `${addressDetails}, ${ward}, ${district}, ${province}`;
      
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-800 mb-2">
                  <span className="text-red-500 mr-1">*</span>Province
                </label>
                <select 
                  value={provinceCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const name = provinces.find(p => p.code === code)?.name || "Metro Manila";
                    setProvinceCode(code);
                    setProvince(name);
                    setDistrict('');
                    setDistrictCode('');
                    setWard('');
                    if (errors.province) setErrors(prev => {
                      const { province, ...rest } = prev;
                      return rest;
                    });
                  }}
                  className={`w-full border rounded px-3 py-2 text-sm text-gray-700 outline-none transition-colors bg-white ${
                    errors.province ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  <option value="" disabled>Select Province</option>
                  <option value="130000000">Metro Manila</option>
                  {provinces.map(p => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </select>
                {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-800 mb-2">
                  <span className="text-red-500 mr-1">*</span>City / Municipality
                </label>
                <select 
                  value={districtCode}
                  disabled={!provinceCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const name = cities.find(c => c.code === code)?.name || "";
                    setDistrictCode(code);
                    setDistrict(name);
                    setWard('');
                    if (errors.district) setErrors(prev => {
                      const { district, ...rest } = prev;
                      return rest;
                    });
                  }}
                  className={`w-full border rounded px-3 py-2 text-sm text-gray-700 outline-none transition-colors bg-white disabled:bg-gray-50 ${
                    errors.district ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  <option value="" disabled>Select City</option>
                  {cities.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-800 mb-2">
                  <span className="text-red-500 mr-1">*</span>Barangay
                </label>
                <select 
                  value={ward}
                  disabled={!districtCode}
                  onChange={(e) => {
                    setWard(e.target.value);
                    if (errors.ward) setErrors(prev => {
                      const { ward, ...rest } = prev;
                      return rest;
                    });
                  }}
                  className={`w-full border rounded px-3 py-2 text-sm text-gray-700 outline-none transition-colors bg-white disabled:bg-gray-50 ${
                    errors.ward ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  <option value="" disabled>Select Barangay</option>
                  {barangays.map(b => (
                    <option key={b.code} value={b.name}>{b.name}</option>
                  ))}
                </select>
                {errors.ward && <p className="text-red-500 text-xs mt-1">{errors.ward}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">
                <span className="text-red-500 mr-1">*</span>Address Details: Number, Street, Landmark, etc.
              </label>
              <input 
                type="text" 
                value={addressDetails}
                onChange={(e) => {
                  setAddressDetails(e.target.value);
                  if (errors.addressDetails) setErrors(prev => {
                    const { addressDetails, ...rest } = prev;
                    return rest;
                  });
                }}
                placeholder="Address Details: Number, Street, Landmark, etc." 
                className={`w-full border rounded px-3 py-2 text-sm text-gray-700 outline-none transition-colors ${
                  errors.addressDetails ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.addressDetails && <p className="text-red-500 text-xs mt-1">{errors.addressDetails}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">
                <span className="text-red-500 mr-1">*</span>Phone Number
              </label>
              <div className="flex">
                <span className={`inline-flex items-center px-3 text-sm border border-r-0 rounded-l ${
                  errors.phone ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 bg-gray-50 text-gray-500'
                }`}>
                  +63
                </span>
                <input 
                  type="tel" 
                  value={phone.startsWith('+63') ? phone.slice(3) : phone}
                  onChange={(e) => {
                    setPhone('+63' + e.target.value.replace(/\D/g, ''));
                    if (errors.phone) setErrors(prev => {
                      const { phone, ...rest } = prev;
                      return rest;
                    });
                  }}
                  placeholder="9XXXXXXXXX" 
                  className={`w-full border rounded-r px-3 py-2 text-sm text-gray-700 outline-none transition-colors ${
                    errors.phone ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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

