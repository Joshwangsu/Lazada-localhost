import { categories } from '../data/mockData';
import * as Icons from 'lucide-react';

export default function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category) => {
            // @ts-ignore - dynamic icon loading for demo
            const IconComponent = Icons[category.icon] || Icons.ShoppingBag;
            return (
              <div key={category.id} className="flex flex-col items-center gap-3 cursor-pointer group">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center text-lazada-orange transition-colors">
                  <IconComponent size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xs md:text-sm text-center text-gray-600 group-hover:text-lazada-orange transition-colors leading-tight">
                  {category.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
