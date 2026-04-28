import React from 'react';
import { ShoppingCart, Search, User, Bell, LogOut } from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export interface NavbarProps {
  user?: FirebaseUser | null;
  cartCount: number;
  onHomeClick: () => void;
  onCartClick: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onSellClick: () => void;
}

export default function Navbar({ user, cartCount, onHomeClick, onCartClick, onLoginClick, onSignupClick, onSellClick }: NavbarProps) {
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Banner (Utility Nav) */}
      <div className="bg-gray-100 py-1.5 md:py-1 text-[11px] md:text-xs overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-start md:justify-end gap-4 md:gap-6 text-gray-600 min-w-max">
          <a href="#" className="hover:text-lazada-orange transition-colors">SAVE MORE ON APP</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onSellClick(); }} className="hover:text-lazada-orange transition-colors">SELL ON LAZADA</a>
          <a href="#" className="hover:text-lazada-orange transition-colors">CUSTOMER CARE</a>
          <a href="#" className="hover:text-lazada-orange transition-colors">TRACK MY ORDER</a>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-lazada-dark font-medium">Hello, {user.displayName || user.email}</span>
              <a href="#" onClick={handleLogout} className="hover:text-lazada-orange transition-colors flex items-center gap-1">
                <LogOut size={12} /> LOGOUT
              </a>
            </div>
          ) : (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="hover:text-lazada-orange transition-colors">LOGIN</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onSignupClick(); }} className="hover:text-lazada-orange transition-colors">SIGNUP</a>
            </>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer select-none shrink-0"
            onClick={onHomeClick}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/4/4d/Lazada_%282019%29.svg" 
              alt="Lazada" 
              className="h-8 md:h-10" 
            />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl flex items-center">
            <div className="flex w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 focus-within:border-lazada-orange focus-within:ring-1 focus-within:ring-lazada-orange transition-all">
              <input 
                type="text" 
                placeholder="Search in Lazada" 
                className="w-full bg-transparent py-2.5 px-4 outline-none text-sm"
              />
              <button className="bg-lazada-orange hover:bg-orange-600 transition-colors text-white px-5 flex items-center justify-center">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 text-gray-700 shrink-0">
            <button 
              onClick={onCartClick} 
              className="relative hover:text-lazada-orange transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-lazada-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="hover:text-lazada-orange transition-colors hidden sm:block">
              <Bell size={24} />
            </button>
            <button className="hover:text-lazada-orange transition-colors hidden sm:block">
              <User size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
