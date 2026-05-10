import { useState } from 'react';
import { Minus, Plus, Home, ChevronRight, Star, ShoppingCart, Info } from 'lucide-react';
import { Product } from '../data/mockData';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

const COLORS = ['#f36f36', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#84cc16'];
const getBgColor = (name: string) => COLORS[name.charCodeAt(0) % COLORS.length];

export default function ProductDetail({ product, onAddToCart, onBuyNow }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity(prev => prev + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
        <Home size={14} className="cursor-pointer hover:text-lazada-orange" />
        <ChevronRight size={14} />
        <span className="cursor-pointer hover:text-lazada-orange">Category Name</span>
        <ChevronRight size={14} />
        <span className="text-gray-800 truncate select-none">{product.name}</span>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-[400px] shrink-0">
            <div className="aspect-square rounded-md overflow-hidden bg-gray-50 mb-3 border border-gray-100">
              {imgError ? (
                <div 
                  className="w-full h-full flex items-center justify-center text-8xl font-bold text-white"
                  style={{ backgroundColor: getBgColor(product.name) }}
                >
                  {product.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
            {/* Thumbnails (mock) */}
            <div className="flex gap-2 p-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-16 h-16 rounded border ${i === 1 ? 'border-lazada-orange' : 'border-gray-200 hover:border-lazada-orange'} cursor-pointer overflow-hidden p-0.5`}>
                  {imgError ? (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: getBgColor(product.name) }}>
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <img src={product.image} alt="thumb" className="w-full h-full object-cover" onError={() => setImgError(true)} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col">
            {/* Title & Stats */}
            <h1 className="text-xl md:text-2xl font-medium text-gray-800 mb-3 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 text-sm mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current text-gray-300" />
                <a href="#" className="text-blue-600 ml-1 hover:underline">{product.rating} Ratings</a>
              </div>
              <div className="w-px h-3 bg-gray-300"></div>
              {product.soldCount && (
                <a href="#" className="text-gray-600 hover:underline">{product.soldCount} Sold</a>
              )}
            </div>

            {/* Price Box */}
            <div className="bg-gray-50 p-4 rounded mb-6">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-bold text-lazada-orange">
                  ₱{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              {product.originalPrice > product.price && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    ₱{product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-semibold text-lazada-dark bg-lazada-orange/10 px-1 py-0.5 rounded">
                    -{product.discount}%
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Setup */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-gray-500 w-20">Quantity</span>
              <div className="flex items-center">
                <button 
                  onClick={handleDecrease}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-12 h-8 border-t border-b border-gray-300 text-center text-gray-800 text-sm focus:outline-none" 
                />
                <button 
                  onClick={handleIncrease}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-6">
              <button 
                className="flex-1 bg-orange-100 hover:bg-orange-200 text-lazada-orange active:scale-95 transition-all py-3 px-6 rounded text-sm font-medium border border-lazada-orange text-center"
                onClick={() => onBuyNow(product, quantity)}
              >
                Buy Now
              </button>
              <button 
                onClick={() => onAddToCart(product, quantity)}
                className="flex-1 bg-lazada-orange hover:bg-orange-600 active:scale-95 transition-all text-white py-3 px-6 rounded text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dummy Product Description */}
      <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-3 mb-4">Product Details of {product.name}</h2>
        <div className="space-y-4 text-gray-600 text-sm">
          <p>
            Experience premium quality with this top-tier product. Designed carefully to meet your everyday needs,
            it offers durable comfort and excellent functionality.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>High-quality materials</li>
            <li>Reliable performance</li>
            <li>100% Authentic product guarantee</li>
            <li>7 Days Return policy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
