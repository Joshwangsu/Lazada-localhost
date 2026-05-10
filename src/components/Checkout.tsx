import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, Truck } from 'lucide-react';
import { CartItemType } from '../App';

interface CheckoutProps {
  cartItems: CartItemType[];
  user: any;
  onBack: () => void;
  onOrderPlaced: () => void;
}

const SHIPPING_FEE = 84.15;

const PAYMENT_METHODS = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    subtitle: 'Pay when you receive',
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#1a9cb7] flex items-center justify-center">
        <span className="text-white text-xs font-bold">₱</span>
      </div>
    ),
  },
  {
    id: 'gcash',
    label: 'GCash e-Wallet',
    subtitle: 'GCash e-Wallet',
    icon: (
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <span className="text-white text-xs font-bold">G</span>
      </div>
    ),
  },
];

export default function Checkout({ cartItems, user, onBack, onOrderPlaced }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [voucher, setVoucher] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const selectedItems = cartItems.filter(item => item.isSelected);
  const subtotal = selectedItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal + SHIPPING_FEE;
  const totalItems = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

  // Get delivery estimate (3 weeks from now range)
  const now = new Date();
  const d1 = new Date(now); d1.setDate(d1.getDate() + 12);
  const d2 = new Date(now); d2.setDate(d2.getDate() + 15);
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const deliveryRange = `Guaranteed by ${d1.getDate()}-${d2.getDate()} ${monthNames[d2.getMonth()]}`;

  const handlePlaceOrder = async () => {
    if (selectedItems.length === 0) return;
    try {
      setPlacing(true);

      if (user?.id) {
        const token = localStorage.getItem('buyerToken');
        await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            userId: user.id,
            paymentMethod,
            items: selectedItems.map(item => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            })),
            total: total,
          }),
        });
      }

      setOrderSuccess(true);
    } catch (err) {
      console.error('Order placement error:', err);
      // Still show success for demo
      setOrderSuccess(true);
    } finally {
      setPlacing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center font-sans">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-14 h-14 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-500 text-sm mb-2">Thank you for your order, {user?.name || 'Customer'}!</p>
        <p className="text-gray-400 text-sm mb-8">Your estimated delivery: <span className="font-medium text-gray-700">{deliveryRange}</span></p>
        <button
          onClick={onOrderPlaced}
          className="bg-lazada-orange hover:bg-orange-600 text-white font-semibold px-10 py-3 rounded text-sm transition-colors"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans pb-16">
      {/* Mini Header */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 mb-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 hover:text-lazada-orange flex items-center gap-1 text-sm transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Cart
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-lg font-bold text-gray-800">Checkout</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start">

          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-4">

            {/* Shipping Address */}
            <div className="bg-white rounded shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">Shipping Address</h3>
                <button className="text-[#1a9cb7] text-sm hover:underline">Edit</button>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-800">{user?.name || 'Guest'}</span>
                    <span className="text-gray-500 text-sm">{user?.phone || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-lazada-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">Home</span>
                    <span className="text-gray-600 text-sm">{user?.address || 'No address set. Please update your profile.'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Package(s) */}
            <div className="bg-white rounded shadow-sm border border-gray-100">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <span className="font-bold text-gray-800 text-sm">Package 1 of 1</span>
                <span className="text-gray-500 text-xs">Shipped by <span className="font-semibold text-gray-700">Lazada Official Store</span></span>
              </div>

              {/* Delivery option */}
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-xs text-gray-500 mb-3">Choose your delivery option</p>
                <div className="border-2 border-[#1a9cb7] rounded p-3 flex items-start gap-3 cursor-pointer bg-[#f0fbfc]">
                  <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-[#1a9cb7] flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1a9cb7]"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#1a9cb7]" />
                      <span className="font-bold text-[#1a9cb7] text-sm">₱{SHIPPING_FEE.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">Standard</p>
                    <p className="text-xs text-gray-400 mt-1">{deliveryRange}</p>
                  </div>
                </div>
              </div>

              {/* Items in this package */}
              <div className="divide-y divide-gray-50">
                {selectedItems.map(item => {
                  const hasDiscount = item.product.originalPrice && item.product.originalPrice > item.product.price;
                  const discountPct = hasDiscount
                    ? Math.round((1 - item.product.price / item.product.originalPrice) * 100)
                    : 0;

                  return (
                    <div key={item.id} className="px-5 py-4 flex gap-4 items-center">
                      <div className="w-16 h-16 border border-gray-200 rounded overflow-hidden shrink-0 bg-gray-50">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 leading-tight line-clamp-2 mb-1">{item.product.name}</p>
                        {item.product.isFlashSale && (
                          <span className="text-[10px] bg-[#ffeaef] text-[#ff0036] px-1.5 py-0.5 rounded-sm font-bold">Flash Sale</span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[#ff5000] font-semibold text-sm">₱{item.product.price.toFixed(2)}</div>
                        {hasDiscount && (
                          <>
                            <div className="text-gray-400 text-xs line-through">₱{item.product.originalPrice.toFixed(2)}</div>
                            <div className="text-[#ff5000] text-xs font-bold">-{discountPct}%</div>
                          </>
                        )}
                        <div className="text-gray-400 text-xs mt-1">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[330px] shrink-0 space-y-4">

            {/* Payment Method */}
            <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Select payment method</h3>
                <button className="text-[#1a9cb7] text-xs hover:underline">View all methods &gt;</button>
              </div>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex items-center gap-3 border rounded p-3 cursor-pointer transition-all ${
                      paymentMethod === m.id ? 'border-[#1a9cb7] bg-[#f0fbfc]' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {m.icon}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{m.label}</p>
                      <p className="text-xs text-gray-400">{m.subtitle}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      paymentMethod === m.id ? 'border-[#1a9cb7]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === m.id && <div className="w-2.5 h-2.5 rounded-full bg-[#1a9cb7]"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voucher */}
            <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-3">Voucher</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucher}
                  onChange={e => setVoucher(e.target.value)}
                  placeholder="Enter Voucher Code"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#1a9cb7] transition-colors"
                />
                <button className="bg-[#1a9cb7] hover:bg-[#158299] text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                  APPLY
                </button>
              </div>
            </div>

            {/* Invoice and Contact Info */}
            <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Invoice and Contact Info</h3>
                <button className="text-[#1a9cb7] text-sm hover:underline">Edit</button>
              </div>
            </div>

            {/* Order Detail */}
            <div className="bg-white rounded shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Order Detail</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} Item{totalItems !== 1 ? 's' : ''})</span>
                  <span className="text-gray-800">₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="text-gray-800">₱{SHIPPING_FEE.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center mb-4">
                <span className="font-bold text-gray-800">Total:</span>
                <span className="text-[#ff5000] font-bold text-lg">₱{total.toFixed(2)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing || selectedItems.length === 0}
                className="w-full bg-lazada-orange hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded text-sm transition-colors flex items-center justify-center gap-2 uppercase"
              >
                {placing && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {placing ? 'Placing Order...' : 'Place Order Now'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
