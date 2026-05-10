import React, { useState } from 'react';
import { 
  Search,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Megaphone,
  Store,
  Wallet,
  BarChart2,
  HeadphonesIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  Info,
  X,
  Plus,
  MapPin,
  FileText,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Edit,
  MessageCircle,
  Bell,
  Download,
  Bot
} from 'lucide-react';
import ManageProducts from './ManageProducts';
import AddProduct from './AddProduct';
import SellerDashboard from './SellerDashboard';
import PickUpAddress from './PickUpAddress';

interface SellerCenterProps {
  onBackToMain: () => void;
  onLogout: () => void;
  user?: any;
}

export default function SellerCenter({ onBackToMain, onLogout, user }: SellerCenterProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'products': true,
    'common-tools': false
  });

  const handleNavigate = (page: string) => {
    setActivePage(page);
    if (page !== 'edit-product') {
      setEditingProduct(null);
    }
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    handleNavigate('edit-product');
  };

  const toggleExpanded = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const menuGroups = [
    {
      id: 'common-tools',
      title: 'Common Tools',
      items: [
        { id: 'orders', label: 'Orders', active: activePage === 'orders' },
        { id: 'promotions', label: 'Promotions', active: activePage === 'promotions' },
      ]
    },
    {
      items: [
        { 
          id: 'products', 
          icon: Package, 
          label: 'Products', 
          hasArrow: true,
          subItems: [
            { id: 'manage-products', label: 'Manage Products' },
            { id: 'add-product', label: 'Add Products' },
            { id: 'decorate-products', label: 'Decorate Products' },
            { id: 'fbl', label: 'Fulfilment By Lazada' },
            { id: 'opportunity', label: 'Opportunity Center' },
            { id: 'assortment', label: 'Assortment Growth Center' }
          ]
        },
        { id: 'orders-2', icon: ShoppingCart, label: 'Orders', hasArrow: true },
        { id: 'marketing-center', icon: Megaphone, label: 'Marketing Center', hasArrow: true },
        { id: 'sponsored-solutions', icon: Bot, label: 'Sponsored Solutions', hasArrow: true, badge: true },
        { id: 'store', icon: Store, label: 'Store', hasArrow: true },
        { id: 'finance', icon: Wallet, label: 'Finance', hasArrow: true },
        { id: 'data-insight', icon: BarChart2, label: 'Data Insight', hasArrow: true },
        { id: 'service-center', icon: HeadphonesIcon, label: 'Service Center', hasArrow: true },
        { 
          id: 'setting', 
          icon: Settings, 
          label: 'Setting', 
          hasArrow: true,
          subItems: [
            { id: 'pickup-address', label: 'Pick-Up Address' }
          ]
        },
      ]
    }
  ];

  return (
    <div className="flex bg-[#F2F3F8] min-h-screen font-sans text-sm text-gray-700">
      
      {/* LEFT SIDEBAR AND MOBILE DRAWER OVERLAY */}
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col 
        fixed md:relative top-0 bottom-0 left-0 z-50 md:z-10 h-screen
        ${sidebarOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full md:translate-x-0 md:w-[60px]'} 
        shrink-0`}
      >
        {/* Logo Area */}
        <div className="h-[60px] flex items-center px-4 shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-2 cursor-pointer w-full" onClick={() => handleNavigate('dashboard')}>
              <svg width="28" height="24" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M20 32L3 21V9L11.5 3.5L20 10L28.5 3.5L37 9V21L20 32Z" fill="#2525F5"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-[#0f136d] font-bold text-base leading-none">Lazada</span>
                <span className="text-[#2525F5] font-semibold text-[11px] leading-none tracking-tight">Seller Center</span>
              </div>
            </div>
          ) : (
            <svg width="28" height="24" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mx-auto cursor-pointer" onClick={() => handleNavigate('dashboard')}>
              <path d="M20 32L3 21V9L11.5 3.5L20 10L28.5 3.5L37 9V21L20 32Z" fill="#2525F5"/>
            </svg>
          )}
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute right-0 top-[28px] translate-x-1/2 bg-white border border-gray-200 rounded-full p-0.5 text-gray-400 hover:text-gray-600 shadow-sm z-20"
        >
          {sidebarOpen ? <ChevronDown className="w-3 h-3 rotate-90" /> : <ChevronDown className="w-3 h-3 -rotate-90" />}
        </button>

        {/* Search */}
        {sidebarOpen && (
          <div className="px-4 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-blue-500" />
              <input 
                type="text" 
                placeholder="Search with Ctrl + K" 
                className="w-full bg-blue-50 border border-blue-200 text-blue-700 pl-8 pr-3 py-1.5 rounded-full text-xs outline-none focus:border-blue-400"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto w-full py-2 space-y-4 custom-scrollbar">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="px-2">
              {sidebarOpen && group.title && (
                <div className="flex items-center justify-between px-3 py-1.5 text-gray-700 hover:bg-gray-50 rounded cursor-pointer mb-1">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">{group.title}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              )}
              
              <ul className="space-y-0.5">
                {group.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  const isExpanded = item.id ? expandedMenus[item.id] : false;
                  // For top-level item without subItems, figure out its active state based on activePage
                  // For top-level item with subItems, check if activePage is one of its subItems' id
                  const isItemActive = item.subItems 
                    ? item.subItems.some(sub => sub.id === activePage)
                    : item.active || item.id === activePage;

                  return (
                    <li key={iIdx} className="flex flex-col">
                      <button 
                        onClick={(e) => {
                          if (item.subItems) {
                            toggleExpanded(item.id || '', e);
                          } else {
                            handleNavigate(item.id || 'dashboard');
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                          isItemActive && !item.subItems
                            ? 'bg-blue-50 text-blue-600 font-medium' 
                            : isItemActive 
                              ? 'text-blue-600 font-medium hover:bg-gray-50'
                              : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon className={`w-4 h-4 ${isItemActive ? 'text-blue-600' : 'text-gray-500'}`} />}
                          {sidebarOpen && (
                            <span className={!Icon ? "pl-7" : ""}>{item.label}</span>
                          )}
                        </div>
                        {sidebarOpen && (
                          <div className="flex items-center gap-1">
                            {item.badge && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                            {item.hasArrow && (
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            )}
                          </div>
                        )}
                      </button>
                      
                      {/* Sub Items */}
                      {item.subItems && sidebarOpen && isExpanded && (
                        <div className="mt-1 mb-2 ml-4">
                          <ul className="flex flex-col">
                            {item.subItems.map((subItem, subIdx) => {
                              const isSubActive = subItem.id === activePage;
                              return (
                                <li key={subIdx} className="relative">
                                  <button
                                    onClick={() => handleNavigate(subItem.id)}
                                    className={`w-full text-left pl-8 pr-3 py-2 text-[13px] rounded-md transition-colors ${
                                      isSubActive
                                        ? 'text-blue-600 font-medium bg-blue-50/50'
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                                  >
                                    {subItem.label}
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Language/Logo */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-100 flex flex-col gap-4 mt-auto">
            <div className="flex items-center justify-between text-gray-600 cursor-pointer hover:text-gray-900">
               <div className="flex items-center gap-2">
                 <span className="text-xs border border-gray-300 rounded px-1">文A</span>
                 <span>English</span>
               </div>
               <ChevronRight className="w-4 h-4" />
            </div>
            
            {/* Small Footer Logo */}
            <div className="flex items-center gap-1 opacity-50 grayscale">
              <svg width="20" height="16" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 32L3 21V9L11.5 3.5L20 10L28.5 3.5L37 9V21L20 32Z" fill="#ff4500"/>
              </svg>
              <span className="font-bold text-[#0f136d] text-sm tracking-tight leading-none">Lazada</span>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-white h-[60px] flex items-center justify-between px-4 border-b border-gray-200 shrink-0 shadow-sm z-10 w-full relative">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('dashboard')}>
            <svg width="28" height="24" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M20 32L3 21V9L11.5 3.5L20 10L28.5 3.5L37 9V21L20 32Z" fill="#2525F5"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-[#0f136d] font-bold text-base leading-none">Lazada</span>
              <span className="text-[#2525F5] font-semibold text-[11px] leading-none tracking-tight">Seller Center</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onLogout}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium flex items-center gap-1"
            >
              <LogOut className="w-5 h-5" /> 
            </button>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Banner */}
        {showBanner && (
          <div className="bg-[#EBF3FF] border-b border-blue-100 text-blue-700 px-6 py-2.5 flex items-center justify-between shrink-0 text-[13px]">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Great! Your products are ready now. Finish your account verification to launch your products and make it visible for customers! <a href="#" className="font-medium hover:underline text-blue-600">Go!</a></span>
            </div>
            <button onClick={() => setShowBanner(false)} className="text-blue-400 hover:text-blue-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Content Area Routing */}
        {activePage === 'dashboard' && <SellerDashboard onNavigate={handleNavigate} />}
        {activePage === 'manage-products' && <ManageProducts onNavigate={handleNavigate} user={user} onEditProduct={handleEditProduct} />}
        {activePage === 'add-product' && <AddProduct onNavigate={handleNavigate} user={user} />}
        {activePage === 'edit-product' && <AddProduct onNavigate={handleNavigate} user={user} editProduct={editingProduct} />}
        {activePage === 'pickup-address' && <PickUpAddress onNavigate={handleNavigate} />}
      </div>

      {/* RIGHT FLOATING MENU */}
      <div className="hidden sm:flex w-[50px] bg-white border-l border-gray-200 shrink-0 flex-col items-center py-4 z-20 shadow-sm relative">
        <div className="flex flex-col gap-5 flex-1">
          <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors relative" title="Chat">
            <MessageCircle className="w-5 h-5" fill="#EBF3FF" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <button className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Notifications">
            <Bell className="w-5 h-5" fill="#FFF0E5" />
          </button>
          
          <button className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors relative" title="Lazada Assistant">
            <Bot className="w-6 h-6" />
            <span className="absolute top-1 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <button className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors mt-2" title="Downloads">
            <Download className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 pb-2">
           <button 
             onClick={onLogout}
             className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors" title="Log Out / Exit"
           >
             <LogOut className="w-5 h-5" />
           </button>
           <button className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors" title="Feedback">
             <Edit className="w-5 h-5" />
           </button>
        </div>
      </div>

    </div>
  );
}
