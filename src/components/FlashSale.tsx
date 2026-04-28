import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../data/mockData';

interface FlashSaleProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function FlashSale({ products, onProductClick }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });

  // Simulate countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 mb-4">
      <div className="flex items-center gap-4 mb-4 ml-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Flash Sale</h2>
        <div className="flex items-center gap-1.5 object-contain">
          <div className="bg-red-500 text-white font-mono font-bold px-2 py-1 rounded text-sm md:text-base">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <span className="font-bold text-red-500">:</span>
          <div className="bg-red-500 text-white font-mono font-bold px-2 py-1 rounded text-sm md:text-base">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <span className="font-bold text-red-500">:</span>
          <div className="bg-red-500 text-white font-mono font-bold px-2 py-1 rounded text-sm md:text-base">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 pb-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
          <span className="text-sm font-medium text-lazada-orange uppercase tracking-wider">On Sale Now</span>
          <button className="text-lazada-orange text-sm font-medium hover:underline border px-3 py-1 border-lazada-orange rounded">
            SHOP ALL PRODUCTS
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => onProductClick(product)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
