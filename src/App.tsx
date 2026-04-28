import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FlashSale from './components/FlashSale';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import SellerCenter from './components/SellerCenter';
import SellerLanding from './components/SellerLanding';
import { mockProducts, Product } from './data/mockData';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

type ViewState = { type: 'home' } | { type: 'product'; product: Product } | { type: 'seller' };

export default function App() {
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [cartCount, setCartCount] = useState(0);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleProductClick = (product: Product) => {
    setView({ type: 'product', product });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartCount(prev => prev + quantity);
    // Simple mock toast mechanism could be added here
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  const flashSaleProducts = mockProducts.filter(p => p.isFlashSale).slice(0, 6);
  const regularProducts = mockProducts; // In real app, apply filters and pagination here

  if (view.type === 'seller') {
    return (
      <>
        {user ? (
          <SellerCenter onBackToMain={() => setView({ type: 'home' })} />
        ) : (
          <SellerLanding onBackToMain={() => setView({ type: 'home' })} onLoginClick={() => setAuthModal('login')} />
        )}
        {authModal && (
          <AuthModal 
            isOpen={authModal !== null} 
            view={authModal} 
            onClose={() => setAuthModal(null)} 
            onSwitchView={setAuthModal} 
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar 
        user={user}
        cartCount={cartCount} 
        onHomeClick={() => setView({ type: 'home' })} 
        onCartClick={() => alert('View Cart clicked')} 
        onLoginClick={() => setAuthModal('login')}
        onSignupClick={() => setAuthModal('signup')}
        onSellClick={() => setView({ type: 'seller' })}
      />
      
      <main className="flex-1 w-full relative">
        {view.type === 'home' ? (
          <div className="space-y-2 pb-8">
            <Hero />
            <Categories />
            <FlashSale products={flashSaleProducts} onProductClick={handleProductClick} />
            <ProductList products={regularProducts} onProductClick={handleProductClick} />
          </div>
        ) : (
          <ProductDetail product={view.product} onAddToCart={handleAddToCart} />
        )}
      </main>

      <Footer />
      {authModal && (
        <AuthModal 
          isOpen={authModal !== null} 
          view={authModal} 
          onClose={() => setAuthModal(null)} 
          onSwitchView={setAuthModal} 
        />
      )}
    </div>
  );
}
