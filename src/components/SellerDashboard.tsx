import React from 'react';
import { ChevronRight, RefreshCw, Bot, CheckCircle2, FileText, MapPin, MessageCircle, Plus } from 'lucide-react';

interface SellerDashboardProps {
  onNavigate?: (page: string) => void;
}

export default function SellerDashboard({ onNavigate }: SellerDashboardProps) {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:px-10 scrollbar-hide flex flex-col gap-6">
      
      {/* Kickstart Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="px-8 py-6 relative z-10 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-gray-800">4 Steps to Kickstart Your Business</h1>
            <span className="bg-[#E5F5FF] text-[#0088FF] text-xs font-semibold px-2 py-0.5 rounded text-blue-600">Enjoy 0% Commission Fee for 90 Days!</span>
          </div>
          <p className="text-gray-500 text-sm">Grow your business with Lazada now</p>
        </div>

        {/* Decorative Mascot (absolute top right) */}
        <div className="absolute right-8 top-2 w-24 h-24 z-0 pointer-events-none hidden md:block">
          {/* Using a placeholder SVG since we don't have the exact mascot */}
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-300 to-fuchsia-400 opacity-20 blur-xl absolute"></div>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md relative z-10">
             <circle cx="50" cy="50" r="40" fill="#000080" />
             <path d="M30 40 Q50 60 70 40" stroke="#FF007F" strokeWidth="8" strokeLinecap="round" />
             <circle cx="35" cy="35" r="5" fill="white" />
             <circle cx="65" cy="35" r="5" fill="white" />
             {/* Decorative elements representing the mascot */}
             <path d="M10 20 L30 35 L40 10 Z" fill="#00D2FF" />
             <path d="M90 20 L70 35 L60 10 Z" fill="#FF007F" />
          </svg>
        </div>

        {/* Steps List */}
        <div className="flex flex-col">
          
          {/* Step 1 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors gap-4 sm:gap-0">
             <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-0.5 sm:mt-1 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-500">
                  <MessageCircle fill="currentColor" stroke="none" className="w-4 h-4 opacity-70" />
                </div>
                <div>
                  <h3 className="text-gray-800 font-medium mb-1">Input an email to receive crucial updates and notifications</h3>
                  <p className="text-gray-500 text-xs sm:text-[13px]">Add an active email address to secure your account and receive important updates.</p>
                </div>
             </div>
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-md text-sm font-medium transition-colors w-full sm:w-auto">Get Started</button>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors gap-4 sm:gap-0">
             <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-0.5 sm:mt-1 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-500 relative">
                  <MapPin className="w-4 h-4" />
                  <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                     <Plus className="w-2.5 h-2.5 text-emerald-600" strokeWidth={3} />
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-800 font-medium mb-1">Add a pick-up address</h3>
                  <p className="text-gray-500 text-xs sm:text-[13px]">Use the pin feature to quickly add your pickup address for order fulfillment.</p>
                </div>
             </div>
             <button onClick={() => onNavigate && onNavigate('pickup-address')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-md text-sm font-medium transition-colors w-full sm:w-auto">Get Started</button>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors gap-4 sm:gap-0">
             <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-0.5 sm:mt-1 w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center shrink-0 text-cyan-500 relative">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-gray-800 font-medium mb-1">Add Business Information and Bank Document</h3>
                  <p className="text-gray-500 text-xs sm:text-[13px]">Upload your official business registration and valid bank document to get verified.</p>
                </div>
             </div>
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-md text-sm font-medium transition-colors w-full sm:w-auto">Get Started</button>
          </div>

          {/* Step 4 Completed */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-8 py-5 hover:bg-gray-50 transition-colors gap-4 sm:gap-0">
             <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-0.5 sm:mt-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-500">
                  <CheckCircle2 className="w-5 h-5" fill="currentColor" stroke="white" />
                </div>
                <div>
                  <h3 className="text-gray-800 font-medium mb-1 flex items-center gap-2">
                    Upload your first product
                    <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-1.5 rounded-sm shrink-0">Successful</span>
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-[13px]">You've successfully added your product.</p>
                </div>
             </div>
             <button className="text-blue-600 border border-blue-200 sm:border-transparent hover:text-blue-800 hover:bg-blue-50 sm:hover:bg-transparent px-3 py-1.5 text-sm font-medium transition-colors flex items-center justify-center gap-1 w-full sm:w-auto rounded-md">View <ChevronRight className="w-4 h-4" /></button>
          </div>

        </div>
      </div>

      {/* Lazada University Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6 mt-4">
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800">Lazada University</h2>
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 font-medium transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> <span className="text-[13px]">Load New Recommendation</span>
            </button>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-[13px] font-medium flex items-center gap-1">
            More <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <p className="text-gray-500 text-xs mb-6">Recommendation based on previous learning history</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { type: 'Product Creation', title: 'Batch Image Management Tool', views: '18,710', date: '19/04/23' },
            { type: 'Product Creation', title: 'Excel Overwrite Feature', views: '7,193', date: '12/04/23' },
            { type: 'Delivery & Logistics', title: 'Lazada Sponsored Solutions (LSS) Advantage', views: '12,087' },
            { type: 'Ratings & Reviews', title: 'Instant Messaging (IM) Checkout Invitation', views: '5,570', date: '16/03/23' }
          ].map((card, idx) => (
            <div key={idx} className="group cursor-pointer">
              {/* Thumb Placeholder */}
              <div className="w-full h-28 rounded-lg overflow-hidden mb-3 relative bg-gray-100 flex items-center justify-center">
                 {/* Just an abstract shape to represent the thumbnail */}
                 <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500">
                    {card.title.split(' ')[0]} {card.title.split(' ')[1] || ''}
                 </div>
                 {card.date && (
                    <div className="absolute bottom-2 left-2 text-[10px] text-red-500 font-bold">{card.date}</div>
                 )}
              </div>
              <div>
                <div className="text-[11px] text-gray-400 mb-0.5">{card.type}</div>
                <h3 className="font-medium text-gray-800 text-[13px] leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{card.title}</h3>
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Bot className="w-3 h-3" /> {card.views} visited
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-gray-400 text-xs py-4">
         <div>Lazada 2024. All rights reserved.</div>
         <div className="flex gap-4">
            <a href="#" className="hover:text-gray-600">Lazada University</a>
            <a href="#" className="hover:text-gray-600">Service Marketplace</a>
            <a href="#" className="hover:text-gray-600">API Document</a>
            <a href="#" className="hover:text-gray-600">Help Center</a>
            <a href="#" className="hover:text-gray-600">Lazada Seller App</a>
         </div>
      </div>
      
    </main>
  );
}
