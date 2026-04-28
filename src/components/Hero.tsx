import { ChevronRight } from 'lucide-react';

export default function Hero() {
  const sidebarCategories = [
    "Electronic Devices",
    "Electronic Accessories",
    "TV & Home Appliances",
    "Health & Beauty",
    "Babies & Toys",
    "Groceries & Pets",
    "Home & Lifestyle",
    "Women's Fashion",
    "Men's Fashion",
    "Watches & Accessories",
    "Sports & Lifestyle",
    "Automotive & Motorcycles"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 w-full">
      <div className="flex gap-4 h-[350px]">
        {/* Left Sidebar Categories - Hidden on mobile */}
        <div className="hidden lg:flex flex-col w-64 bg-white rounded-lg shadow-sm py-2 shrink-0 border border-gray-100 overflow-y-auto">
          {sidebarCategories.map((category, idx) => (
            <a 
              key={idx} 
              href="#" 
              className="px-4 py-1.5 text-sm text-gray-600 hover:text-lazada-orange hover:bg-orange-50 flex items-center justify-between group transition-colors"
            >
              {category}
              <ChevronRight size={16} className="text-gray-400 group-hover:text-lazada-orange" />
            </a>
          ))}
        </div>

        {/* Main Banner Slider Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden relative group cursor-pointer border border-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80" 
            alt="Promo Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex flex-col justify-center px-10">
            <h2 className="text-white text-4xl md:text-5xl font-bold mb-2">MEGA SALE</h2>
            <p className="text-white text-xl md:text-2xl mb-6">Up to 70% OFF on all items</p>
            <button className="bg-lazada-orange hover:bg-orange-600 text-white font-semibold py-2.5 px-8 rounded-lg w-fit transition-colors shadow-lg">
              Shop Now
            </button>
          </div>
          
          {/* Slider indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-lazada-orange"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/50 backdrop-blur-sm"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/50 backdrop-blur-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
