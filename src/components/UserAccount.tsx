import React, { useState, useEffect } from 'react';
import { MapPin, Search, Store, ChevronLeft, Truck, Package, CheckCircle2 } from 'lucide-react';

interface UserAccountProps {
  user: any;
  onUpdateUser?: (updatedUser: any) => void;
}

type SubView = 'manage' | 'orders' | 'add_address';

export default function UserAccount({ user, onUpdateUser }: UserAccountProps) {
  const [currentView, setCurrentView] = useState<SubView>('manage');
  const [activeOrderTab, setActiveOrderTab] = useState('All');

  // Form states for Address
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [floor, setFloor] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [label, setLabel] = useState<'OFFICE' | 'HOME'>('HOME');

  const [provincesList, setProvincesList] = useState<any[]>([]);
  const [districtsList, setDistrictsList] = useState<any[]>([]);
  const [wardsList, setWardsList] = useState<any[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isSaving, setIsSaving] = useState(false);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  // Fetch Provinces on mount
  useEffect(() => {
    fetch('https://psgc.gitlab.io/api/provinces/')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => a.name.localeCompare(b.name));
        // Add Metro Manila manually since it's a region in PSGC but treated as a province in address forms
        const ncr = { code: '130000000', name: 'Metro Manila', isRegion: true };
        setProvincesList([ncr, ...sorted]);
      })
      .catch(err => console.error('Error fetching provinces:', err));
  }, []);

  // Fetch Cities when province changes
  useEffect(() => {
    if (!selectedProvinceCode) {
      setDistrictsList([]);
      setDistrict('');
      return;
    }
    const isNCR = selectedProvinceCode === '130000000';
    const url = isNCR 
      ? `https://psgc.gitlab.io/api/regions/${selectedProvinceCode}/cities-municipalities/`
      : `https://psgc.gitlab.io/api/provinces/${selectedProvinceCode}/cities-municipalities/`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setDistrictsList(data.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      })
      .catch(err => console.error('Error fetching cities:', err));
  }, [selectedProvinceCode]);

  // Fetch Barangays when city changes
  useEffect(() => {
    if (!selectedDistrictCode) {
      setWardsList([]);
      setWard('');
      return;
    }
    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedDistrictCode}/barangays/`)
      .then(res => res.json())
      .then(data => {
        setWardsList(data.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      })
      .catch(err => console.error('Error fetching barangays:', err));
  }, [selectedDistrictCode]);

  useEffect(() => {
    if (currentView === 'orders' && user?.id) {
      setLoadingOrders(true);
      fetch(`http://localhost:5000/api/orders?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoadingOrders(false);
        })
        .catch(err => {
          console.error('Failed to fetch orders:', err);
          setLoadingOrders(false);
        });
    }
  }, [currentView, user?.id]);

  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: 'PUT',
      });
      if (res.ok) {
        alert('Order cancelled successfully!');
        // Update local state to reflect cancellation
        setOrders(prev => prev.map(o => o.Order_Id === orderId ? { ...o, Pymnt_Status: 'Cancelled', Dlvry_Status: 'Cancelled' } : o));
        setActiveOrder((prev: any) => ({ ...prev, Pymnt_Status: 'Cancelled', Dlvry_Status: 'Cancelled' }));
      } else {
        alert('Failed to cancel order.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while cancelling the order.');
    } finally {
      setIsCancelling(false);
    }
  };

  const orderTabs = ['All', 'To pay', 'To ship', 'To receive', 'To review'];

  const validateAddressForm = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!phone || phone.length < 11) newErrors.phone = "Valid mobile number is required";
    if (!address.trim()) newErrors.address = "Detailed address is required";
    if (!province) newErrors.province = "Province is required";
    if (!district) newErrors.district = "District/City is required";
    if (!ward) newErrors.ward = "Ward/Barangay is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!user || !user.id) {
      alert("User not logged in!");
      return;
    }

    if (!validateAddressForm()) return;

    // Combine name
    const combinedName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim();

    // Combine address parts
    const fullAddress = `${floor ? floor + ', ' : ''}${address}, ${ward}, ${district}, ${province}`;
    
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          phone: phone,
          address: fullAddress,
          name: combinedName || undefined
        })
      });

      if (!response.ok) throw new Error('Failed to save address');

      // Update local user state
      const updatedUser = { ...user, phone, address: fullAddress, name: combinedName || user.name };
      localStorage.setItem('buyerUser', JSON.stringify(updatedUser));
      
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      } else {
        // Fallback reload if prop not passed
        window.location.reload();
      }

      alert("Address saved successfully!");
      setCurrentView('manage');
      
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderManageAccount = () => (
    <>
      <h2 className="text-xl text-gray-800 mb-6 font-medium">Manage My Account</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Profile Panel */}
        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800 font-medium">Personal Profile</h3>
            <span className="text-xs text-[#1a9cb7] cursor-pointer hover:underline">| EDIT</span>
          </div>
          <p className="text-gray-800 text-sm">{user?.name || 'Lazada User'}</p>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Address Book Panel */}
        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800 font-medium">Address Book</h3>
            <span 
              className="text-xs text-[#1a9cb7] cursor-pointer hover:underline"
              onClick={() => setCurrentView('add_address')}
            >| Add</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="border-r border-gray-100 pr-4">
              {user?.address ? (
                <div>
                  <p className="text-gray-800 font-medium text-sm mb-1">{user.name}</p>
                  <p className="text-gray-600 text-sm mb-1">{user.phone}</p>
                  <p className="text-gray-500 text-sm">{user.address}</p>
                  <div className="mt-4 w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-lazada-orange">
                    <MapPin size={24} strokeWidth={1.5} />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-400 text-sm mb-6">Save your shipping address here.</p>
                  <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                    <MapPin size={24} strokeWidth={1.5} />
                  </div>
                </>
              )}
            </div>
            
            <div className="pl-2">
              <p className="text-gray-400 text-sm">Save your billing address here.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderAddAddress = () => (
    <>
      <h2 className="text-xl text-gray-800 mb-6 font-medium">Add New Address</h2>
      <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">First Name</label>
                <input 
                  type="text" 
                  placeholder="Juan" 
                  value={firstName}
                  onChange={e => {
                    setFirstName(e.target.value);
                    if (errors.firstName) setErrors(prev => {
                      const { firstName, ...rest } = prev;
                      return rest;
                    });
                  }}
                  className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-colors ${
                    errors.firstName ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-lazada-orange'
                  }`} 
                />
                {errors.firstName && <p className="text-red-500 text-[11px] mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Middle Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Santos" 
                  value={middleName}
                  onChange={e => setMiddleName(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:border-lazada-orange outline-none" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Last Name</label>
              <input 
                type="text" 
                placeholder="Dela Cruz" 
                value={lastName}
                onChange={e => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors(prev => {
                    const { lastName, ...rest } = prev;
                    return rest;
                  });
                }}
                className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-colors ${
                  errors.lastName ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-lazada-orange'
                }`} 
              />
              {errors.lastName && <p className="text-red-500 text-[11px] mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Mobile Number</label>
              <input 
                type="text" 
                placeholder="09123456789" 
                value={phone}
                onChange={e => {
                  setPhone(e.target.value.replace(/\D/g, ''));
                  if (errors.phone) setErrors(prev => {
                    const { phone, ...rest } = prev;
                    return rest;
                  });
                }}
                className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-colors ${
                  errors.phone ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-lazada-orange'
                }`} 
              />
              {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Address</label>
              <input 
                type="text" 
                placeholder="123 Rizal St." 
                value={address}
                onChange={e => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors(prev => {
                    const { address, ...rest } = prev;
                    return rest;
                  });
                }}
                className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-colors ${
                  errors.address ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-lazada-orange'
                }`} 
              />
              {errors.address && <p className="text-red-500 text-[11px] mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Floor/Unit Number (Optional)</label>
              <input 
                type="text" 
                placeholder="Unit 4B (Optional)" 
                value={floor}
                onChange={e => setFloor(e.target.value)}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:border-lazada-orange outline-none" 
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Province</label>
              <select 
                value={selectedProvinceCode} 
                onChange={e => {
                  const code = e.target.value;
                  setSelectedProvinceCode(code);
                  const name = provincesList.find(p => p.code === code)?.name || '';
                  setProvince(name);
                  // Reset child dropdowns
                  setSelectedDistrictCode('');
                  setDistrict('');
                  setWard('');
                }}
                className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-colors text-gray-700 bg-white ${
                  errors.province ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-lazada-orange'
                }`}
              >
                <option value="" disabled>Please choose your province</option>
                {provincesList.map(p => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
              {errors.province && <p className="text-red-500 text-[11px] mt-1">{errors.province}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">District (City/Municipality)</label>
              <select 
                value={selectedDistrictCode} 
                onChange={e => {
                  const code = e.target.value;
                  setSelectedDistrictCode(code);
                  const name = districtsList.find(d => d.code === code)?.name || '';
                  setDistrict(name);
                  // Reset child dropdown
                  setWard('');
                }}
                disabled={!selectedProvinceCode}
                className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-colors text-gray-700 bg-white disabled:bg-gray-50 ${
                  errors.district ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-lazada-orange'
                }`}
              >
                <option value="" disabled>{selectedProvinceCode ? 'Please choose your district' : 'Select a province first'}</option>
                {districtsList.map(d => (
                  <option key={d.code} value={d.code}>{d.name}</option>
                ))}
              </select>
              {errors.district && <p className="text-red-500 text-[11px] mt-1">{errors.district}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Ward (Barangay)</label>
              <select 
                value={ward} 
                onChange={e => setWard(e.target.value)}
                disabled={!selectedDistrictCode}
                className={`w-full border rounded-sm px-3 py-2 text-sm outline-none transition-colors text-gray-700 bg-white disabled:bg-gray-50 ${
                  errors.ward ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-300 focus:border-lazada-orange'
                }`}
              >
                <option value="" disabled>{selectedDistrictCode ? 'Please choose your ward' : 'Select a district first'}</option>
                {wardsList.map(w => (
                  <option key={w.code} value={w.name}>{w.name}</option>
                ))}
              </select>
              {errors.ward && <p className="text-red-500 text-[11px] mt-1">{errors.ward}</p>}
            </div>

            <div className="pt-2">
              <label className="block text-sm text-gray-600 mb-3">Select a label for effective delivery:</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setLabel('OFFICE')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-sm text-sm font-medium transition-colors ${
                    label === 'OFFICE' 
                      ? 'border border-[#1a9cb7] text-[#1a9cb7] bg-[#eef8fa]' 
                      : 'border border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] leading-none ${label === 'OFFICE' ? 'bg-[#1a9cb7] text-white' : 'bg-gray-300 text-white'}`}>🏢</span> OFFICE
                </button>
                <button 
                  onClick={() => setLabel('HOME')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-sm text-sm font-medium transition-colors ${
                    label === 'HOME' 
                      ? 'border border-lazada-orange text-lazada-orange bg-orange-50' 
                      : 'border border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] leading-none ${label === 'HOME' ? 'bg-lazada-orange text-white' : 'bg-gray-300 text-white'}`}>🏠</span> HOME
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 mt-12">
          <button 
            className="px-8 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-sm hover:bg-gray-200"
            onClick={() => setCurrentView('manage')}
          >
            CANCEL
          </button>
          <button 
            className={`px-12 py-2.5 text-white text-sm font-medium rounded-sm transition-colors ${isSaving ? 'bg-orange-300 cursor-not-allowed' : 'bg-lazada-orange hover:bg-[#e06633]'}`}
            onClick={handleSaveAddress}
            disabled={isSaving}
          >
            {isSaving ? 'SAVING...' : 'SAVE'}
          </button>
        </div>
      </div>
    </>
  );

  const renderMyOrders = () => {
    if (activeOrder) {
      return (
        <>
          <div className="flex items-center gap-2 mb-6">
            <button 
              onClick={() => setActiveOrder(null)} 
              className="text-gray-500 hover:text-lazada-orange flex items-center text-sm font-medium transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" /> Back to My Orders
            </button>
          </div>
          
          <h2 className="text-xl text-gray-800 mb-4 font-medium">Order Details</h2>
          
          <div className="bg-white p-6 border border-gray-200 rounded-sm mb-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order #{activeOrder.Order_Id}</p>
              <p className="text-sm text-gray-800">Placed on {new Date(activeOrder.Order_Date).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-[#ff5000]">₱{parseFloat(activeOrder.Pymnt_Amount).toFixed(2)}</p>
              
              {activeOrder.Dlvry_Status !== 'Cancelled' && activeOrder.Dlvry_Status !== 'Delivered' && (
                <button 
                  onClick={() => handleCancelOrder(activeOrder.Order_Id)}
                  disabled={isCancelling}
                  className="mt-3 px-4 py-1.5 border border-gray-300 text-gray-600 rounded-sm text-xs font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {isCancelling ? 'CANCELLING...' : 'CANCEL ORDER'}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 rounded-sm mb-6">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
              <Truck size={20} className="text-[#1a9cb7]" /> Delivery Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Delivery Status</p>
                  <p className="text-sm font-medium text-[#1a9cb7] flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span className={activeOrder.Dlvry_Status === 'Cancelled' ? 'text-red-500' : ''}>
                      {activeOrder.Dlvry_Status || 'Processing'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Courier</p>
                  <p className="text-sm text-gray-800">{activeOrder.Dlvry_Courier || 'Standard Delivery'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tracking Number</p>
                  <p className="text-sm text-gray-800 font-mono bg-gray-50 px-2 py-1 inline-block rounded-sm">{activeOrder.Dlvry_TrackingNumber || 'Pending'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Estimated Delivery</p>
                  <p className="text-sm text-gray-800">{activeOrder.Dlvry_EstimatedDelivery ? new Date(activeOrder.Dlvry_EstimatedDelivery).toLocaleDateString() : 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                <Package size={18} className="text-gray-500" /> Items in this Order
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {activeOrder.items && activeOrder.items.map((item: any, idx: number) => (
                <div key={idx} className="p-5 flex gap-4">
                  <div className="w-20 h-20 border border-gray-200 rounded-sm p-1 shrink-0 bg-white flex items-center justify-center">
                    <img src={item.Prdct_Image_Url || 'https://via.placeholder.com/80'} alt={item.Prdct_Name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-2">{item.Prdct_Name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Sold by: {item.Shop_Name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-800">₱{parseFloat(item.OItem_Price).toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.OItem_Quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <h2 className="text-xl text-gray-800 mb-4 font-medium">My Orders</h2>
        
        {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {orderTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveOrderTab(tab)}
            className={`px-6 py-3 text-sm font-medium relative ${activeOrderTab === tab ? 'text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
          >
            {tab}
            {activeOrderTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a9cb7]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search by seller name, order ID or product name" 
          className="w-full bg-gray-100 border-none rounded-sm py-3 pl-10 pr-4 text-sm focus:ring-1 focus:ring-gray-300 outline-none"
        />
      </div>

      {/* Order List */}
      {loadingOrders ? (
        <div className="bg-white p-12 text-center border border-gray-200 rounded-sm">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : (() => {
        const filteredOrders = orders.filter((order: any) => {
          if (activeOrderTab === 'All') return true;
          if (activeOrderTab === 'To pay') return order.Pymnt_Status === 'Pending' && order.Pymnt_Method !== 'cod';
          if (activeOrderTab === 'To ship') return order.Dlvry_Status === 'Processing' || (order.Pymnt_Status === 'Pending' && order.Pymnt_Method === 'cod');
          if (activeOrderTab === 'To receive') return order.Dlvry_Status === 'Shipped';
          if (activeOrderTab === 'To review') return order.Dlvry_Status === 'Delivered';
          return true;
        });

        return filteredOrders && filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order: any) => (
            <div 
              key={order.Order_Id} 
              className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm hover:border-lazada-orange cursor-pointer transition-colors"
              onClick={() => setActiveOrder(order)}
            >
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium text-gray-800 mr-4 hover:underline">Order #{order.Order_Id}</span>
                  <span className="text-gray-500">Placed on {new Date(order.Order_Date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-sm text-xs font-bold ${
                    order.Pymnt_Status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                    order.Pymnt_Status === 'Cancelled' ? 'bg-red-100 text-red-600' : 
                    'bg-green-100 text-green-600'
                  }`}>
                    {order.Pymnt_Status}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items && order.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-5 flex gap-4">
                    <div className="w-20 h-20 border border-gray-200 rounded-sm p-1 shrink-0 bg-white flex items-center justify-center">
                      <img src={item.Prdct_Image_Url || 'https://via.placeholder.com/80'} alt={item.Prdct_Name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-2">{item.Prdct_Name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Sold by: {item.Shop_Name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-800">₱{parseFloat(item.OItem_Price).toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.OItem_Quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-5 py-4 border-t border-gray-200 flex justify-end items-center gap-4">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="text-xl font-medium text-[#ff5000]">₱{parseFloat(order.Pymnt_Amount).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center border border-gray-200 rounded-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 mb-4 opacity-50">
            <img src="https://lzd-img-global.slatic.net/g/tps/tfs/TB1DgaEqQyWBuNjy0FpXXassXXa-200-200.png" alt="No orders" className="w-full h-full object-contain grayscale opacity-50" />
          </div>
          <p className="text-gray-500 font-medium">There are no orders placed yet.</p>
          <button 
            className="mt-4 px-8 py-2 bg-lazada-orange text-white rounded-sm font-medium hover:bg-[#e06633] transition-colors"
            onClick={() => window.scrollTo(0,0)}
          >
            CONTINUE SHOPPING
          </button>
        </div>
      );
    })()}
    </>
  );
};

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
      {/* Sidebar Navigation */}
      <div className="w-64 shrink-0 space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">Hello, {user?.name || user?.email || 'Skam Berdo'}</p>
          
          <div className="space-y-4">
            <div>
              <h3 
                className={`font-medium cursor-pointer mb-2 ${currentView === 'manage' || currentView === 'add_address' ? 'text-[#1a9cb7]' : 'text-gray-800 hover:text-lazada-orange'}`}
                onClick={() => setCurrentView('manage')}
              >
                Manage My Account
              </h3>
              <ul className="text-sm text-gray-500 space-y-2 ml-4">
                <li className="hover:text-lazada-orange cursor-pointer transition-colors">My Profile</li>
                <li 
                  className={`cursor-pointer transition-colors ${currentView === 'add_address' ? 'text-[#1a9cb7]' : 'hover:text-lazada-orange'}`}
                  onClick={() => setCurrentView('add_address')}
                >
                  Address Book
                </li>
                <li className="hover:text-lazada-orange cursor-pointer transition-colors">My Payment Options</li>
                <li className="hover:text-lazada-orange cursor-pointer transition-colors">Lazada Wallet</li>
              </ul>
            </div>

            <div>
              <h3 
                className={`font-medium cursor-pointer mb-2 transition-colors ${currentView === 'orders' ? 'text-[#1a9cb7]' : 'text-gray-800 hover:text-lazada-orange'}`}
                onClick={() => setCurrentView('orders')}
              >
                My Orders
              </h3>
              <ul className="text-sm text-gray-500 space-y-2 ml-4">
                <li className="hover:text-lazada-orange cursor-pointer transition-colors">My Returns</li>
                <li className="hover:text-lazada-orange cursor-pointer transition-colors">My Cancellations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 hover:text-lazada-orange cursor-pointer transition-colors">My Reviews</h3>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 hover:text-lazada-orange cursor-pointer transition-colors">My Wishlist & Followed Stores</h3>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 hover:text-lazada-orange cursor-pointer transition-colors">Sell On Lazada</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-[500px]">
        {currentView === 'manage' && renderManageAccount()}
        {currentView === 'add_address' && renderAddAddress()}
        {currentView === 'orders' && renderMyOrders()}
      </div>
    </div>
  );
}
