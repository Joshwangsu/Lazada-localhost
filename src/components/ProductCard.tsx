import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Product } from '../data/mockData';

export interface ProductCardProps {
  key?: string | number;
  product: Product;
  onClick: () => void;
}

const COLORS = ['#f36f36', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#84cc16'];
const getBgColor = (name: string) => COLORS[name.charCodeAt(0) % COLORS.length];

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      onClick={onClick}
      className="bg-white group cursor-pointer hover:shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-shadow duration-200 flex flex-col h-full border border-transparent hover:border-lazada-orange/30 p-2 md:p-3 rounded-md"
    >
      <div className="aspect-square w-full relative mb-2 overflow-hidden rounded bg-gray-50">
        {imgError ? (
          <div 
            className="w-full h-full flex items-center justify-center text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundColor: getBgColor(product.name) }}
          >
            {product.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        {product.discount > 0 && (
          <div className="absolute top-0 right-0 bg-lazada-orange text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded-bl-lg">
            -{product.discount}%
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1">
        <h3 className="text-xs md:text-sm text-gray-800 line-clamp-2 leading-relaxed mb-1 group-hover:text-lazada-orange transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lazada-orange font-bold text-sm md:text-lg">
              ₱{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          
          {product.originalPrice > product.price && (
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs">
              <span className="text-gray-400 line-through">
                ₱{product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-0.5">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500 ml-0.5">{product.rating}</span>
            </div>
            {product.soldCount && (
              <span className="text-[10px] md:text-xs text-gray-500">
                {product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}k` : product.soldCount} sold
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
