import React from 'react';
import { Trash2, Heart, Search, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Product } from '../data/mockData';
import ProductList from './ProductList';
import { CartItemType } from '../App';

interface CartProps {
  cartItems: CartItemType[];
  updateQuantity: (id: string, newQuantity: number) => void;
  toggleSelection: (id: string) => void;
  toggleSelectAll: (selectAll: boolean) => void;
  removeItem: (id: string) => void;
  removeSelected: () => void;
  recommendedProducts: Product[];
  onProductClick: (product: Product) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export default function Cart({ 
  cartItems, 
  updateQuantity, 
  toggleSelection, 
  toggleSelectAll,
  removeItem,
  removeSelected,
  recommendedProducts, 
  onProductClick, 
  onCheckout,
  onContinueShopping
}: CartProps) {
  
  const selectedItems = cartItems.filter(item => item.isSelected);
  const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = selectedItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const allSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Area: Cart Items */}
        <div className="flex-1">
          {cartItems.length === 0 ? (
            <div className="bg-white shadow-sm border border-gray-200 rounded-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px] mb-8">
              <div className="w-32 h-32 mb-6">
                <img src="https://lzd-img-global.slatic.net/g/tps/tfs/TB1DgaEqQyWBuNjy0FpXXassXXa-200-200.png" alt="Empty Cart" className="w-full h-full object-contain grayscale opacity-50" />
              </div>
              <h3 className="text-gray-800 font-medium mb-2">There are no items in this cart</h3>
              <button 
                onClick={onContinueShopping} 
                className="mt-4 px-12 py-2 border border-[#1a9cb7] text-[#1a9cb7] font-medium rounded-sm hover:bg-[#eef8fa] transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <>
              {/* Header Controls */}
              <div className="bg-white p-4 flex items-center justify-between shadow-sm border border-gray-200 rounded-sm mb-4">
                <div className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 cursor-pointer accent-lazada-orange" 
                    checked={allSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                  <span className="text-sm text-gray-700 uppercase">Select All ({cartItems.length} Item(s))</span>
                </div>
                <button 
                  onClick={removeSelected}
                  disabled={selectedItems.length === 0}
                  className={`flex items-center gap-1 transition-colors text-sm ${selectedItems.length > 0 ? 'text-gray-500 hover:text-lazada-orange cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
                >
                  <Trash2 size={16} /> DELETE
                </button>
              </div>

              {/* Cart Items List */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-sm mb-8">
                {cartItems.map((item, index) => (
                  <div key={item.id} className={`${index > 0 ? 'border-t border-gray-100' : ''}`}>
                    {/* Store Header Mock */}
                    <div className="p-4 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 cursor-pointer accent-lazada-orange" 
                        checked={item.isSelected}
                        onChange={() => toggleSelection(item.id)}
                      />
                      <span className="bg-red-600 text-white text-[10px] px-1 font-bold rounded-sm">LazMall</span>
                      <span className="font-bold text-gray-800 text-sm cursor-pointer hover:underline">Official Store &gt;</span>
                    </div>

                    {/* Cart Item Detail */}
                    <div className={`p-4 flex gap-4 ${item.isSelected ? 'bg-orange-50/30' : ''}`}>
                      <div className="pt-2">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 cursor-pointer accent-lazada-orange" 
                          checked={item.isSelected}
                          onChange={() => toggleSelection(item.id)}
                        />
                      </div>
                      <div className="w-20 h-20 border border-gray-200 rounded shrink-0 bg-gray-50 flex items-center justify-center p-1 cursor-pointer" onClick={() => onProductClick(item.product)}>
                        <img src={item.product.image} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 
                          className="text-sm text-gray-800 leading-tight mb-1 cursor-pointer hover:text-lazada-orange"
                          onClick={() => onProductClick(item.product)}
                        >
                          {item.product.name}
                        </h4>
                        {item.product.isFlashSale && (
                          <div className="inline-block bg-[#ffeaef] text-[#ff0036] text-[10px] px-1.5 py-0.5 rounded-sm mt-2">
                            Flash Sale Active
                          </div>
                        )}
                      </div>

                      <div className="w-24 text-center shrink-0">
                        <div className="text-[#ff5000] font-medium text-lg mb-2">
                          ₱{item.product.price.toFixed(2)}
                        </div>
                        {item.product.originalPrice > item.product.price && (
                          <div className="text-xs text-gray-400 line-through mb-2">
                            ₱{item.product.originalPrice.toFixed(2)}
                          </div>
                        )}
                        <div className="flex justify-center gap-3 text-gray-400 mt-2">
                          <button className="hover:text-lazada-orange"><Heart size={18} /></button>
                          <button className="hover:text-lazada-orange" onClick={() => removeItem(item.id)}><Trash2 size={18} /></button>
                        </div>
                      </div>

                      <div className="w-28 shrink-0 flex justify-end items-start pt-1">
                        <div className="flex border border-gray-300 rounded-sm overflow-hidden h-8">
                          <button 
                            className="w-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <input 
                            type="text" 
                            className="w-10 text-center text-sm border-x border-gray-300 outline-none" 
                            value={item.quantity}
                            readOnly
                          />
                          <button 
                            className="w-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Area: Order Summary */}
        <div className="w-full lg:w-[350px] shrink-0">
          <div className="bg-white p-4 shadow-sm border border-gray-200 rounded-sm sticky top-24">
            <h3 className="font-medium text-gray-800 mb-4 text-lg">Order Summary</h3>
            
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-gray-600">Subtotal ({totalQuantity} items)</span>
              <span className="text-gray-800">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-sm">
              <span className="text-gray-600">Shipping Fee</span>
              <span className="text-gray-800">₱0.00</span>
            </div>

            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Enter Voucher Code" 
                className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#1a9cb7]"
              />
              <button className="bg-[#1a9cb7] hover:bg-[#158299] text-white px-6 py-2 rounded-sm text-sm font-medium transition-colors">
                APPLY
              </button>
            </div>

            <div className="flex justify-between items-end mb-1">
              <span className="text-gray-800 font-medium">Subtotal</span>
              <span className="text-[#ff5000] text-xl font-medium">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="text-right text-[11px] text-gray-500 mb-6">
              VAT included, where applicable
            </div>

            <button 
              onClick={onCheckout}
              disabled={totalQuantity === 0}
              className={`w-full py-3 rounded-sm font-medium transition-colors ${
                totalQuantity > 0 
                ? 'bg-lazada-orange text-white hover:bg-[#e06633]' 
                : 'bg-gray-300 text-white cursor-not-allowed'
              }`}
            >
              PROCEED TO CHECKOUT({totalQuantity})
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8">
        <h3 className="text-lg text-gray-800 mb-4 font-medium flex items-center">
          Just For You
        </h3>
        {/* We reuse the ProductList for recommendations */}
        <ProductList products={recommendedProducts} onProductClick={onProductClick} />
      </div>

    </div>
  );
}
