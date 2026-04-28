import ProductCard from './ProductCard';
import { Product } from '../data/mockData';

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductList({ products, onProductClick }: ProductListProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 ml-2">Just For You</h2>
      
      {/* Filters & Sort Banner */}
      <div className="bg-white p-3 mb-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between flex-wrap gap-4 text-sm">
        <div className="flex space-x-6 text-gray-600">
          <button className="text-lazada-orange border-b-2 border-lazada-orange pb-1 font-medium">Relevance</button>
          <button className="hover:text-lazada-orange pb-1">Top Sales</button>
          <button className="hover:text-lazada-orange pb-1">Price</button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500">Filters:</span>
          <select className="border border-gray-200 rounded px-2 py-1 outline-none text-gray-600 bg-transparent focus:border-lazada-orange">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
          </select>
          <select className="border border-gray-200 rounded px-2 py-1 outline-none text-gray-600 bg-transparent focus:border-lazada-orange">
            <option>Any Price</option>
            <option>Under ₱500</option>
            <option>₱500 - ₱1000</option>
            <option>Above ₱1000</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={() => onProductClick(product)} 
          />
        ))}
      </div>
      
      <div className="mt-10 flex justify-center">
        <button className="border border-lazada-orange text-lazada-orange font-medium hover:bg-orange-50 transition-colors px-12 py-2.5 rounded text-sm w-full md:w-auto">
          LOAD MORE
        </button>
      </div>
    </div>
  );
}
