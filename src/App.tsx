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
import UserAccount from './components/UserAccount';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { mockProducts, Product } from './data/mockData';

type ViewState = 
  | { type: 'home' } 
  | { type: 'product'; product: Product } 
  | { type: 'seller' } 
  | { type: 'account' }
  | { type: 'cart' }
  | { type: 'checkout' };

export interface CartItemType {
  id: string; // unique cart item id
  product: Product;
  quantity: number;
  isSelected: boolean;
}

export default function App() {
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Check local storage for existing BUYER session only
    const storedUser = localStorage.getItem('buyerUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('buyerUser');
      }
    }

    // Load cart from local storage if exists
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {}
    }
  }, []);

  // Sync cart to localstorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleProductClick = (product: Product) => {
    setView({ type: 'product', product });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      // Check if product already exists
      const existingItemIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingItemIndex >= 0) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          product,
          quantity,
          isSelected: true
        }];
      }
    });
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  const updateCartItemQuantity = (id: string, newQuantity: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item));
  };

  const toggleCartItemSelection = (id: string) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, isSelected: !item.isSelected } : item));
  };

  const toggleSelectAll = (selectAll: boolean) => {
    setCartItems(prev => prev.map(item => ({ ...item, isSelected: selectAll })));
  };

  const removeCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const removeSelectedItems = () => {
    setCartItems(prev => prev.filter(item => !item.isSelected));
  };

  const handleAuthSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('buyerUser');
    localStorage.removeItem('buyerToken');
  };

  const [regularProducts, setRegularProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  
  const fetchProducts = () => {
    setProductsLoading(true);
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mappedProducts = data.map((p: any) => ({
            id: p.Prdct_Id.toString(),
            name: p.Prdct_Name,
            price: parseFloat(p.Prdct_Price),
            image: p.Prdct_Image_Url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
            rating: 4.5,
            reviews: Math.floor(Math.random() * 500) + 10,
            discount: 0,
            isFlashSale: false,
            category: p.Ctgry_Name || 'General'
          }));
          setRegularProducts(mappedProducts);
        }
      })
      .catch(err => console.error('Failed to fetch products', err))
      .finally(() => setProductsLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const flashSaleProducts = regularProducts.filter(p => p.isFlashSale).slice(0, 6);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (view.type === 'seller') {
    // Load seller session from separate key
    const storedSeller = localStorage.getItem('sellerUser');
    const sellerUser = storedSeller ? (() => { try { return JSON.parse(storedSeller); } catch { return null; } })() : null;
    return (
      <>
        {sellerUser ? (
          <SellerCenter onBackToMain={() => setView({ type: 'home' })} onLogout={() => {
            localStorage.removeItem('sellerUser');
            localStorage.removeItem('sellerToken');
          }} user={sellerUser} />
        ) : (
          <SellerLanding onBackToMain={() => setView({ type: 'home' })} onLoginClick={() => setAuthModal('login')} onSuccess={handleAuthSuccess} />
        )}
        {authModal && (
          <AuthModal 
            isOpen={authModal !== null} 
            view={authModal} 
            onClose={() => setAuthModal(null)} 
            onSwitchView={setAuthModal} 
            onSuccess={handleAuthSuccess}
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
        onCartClick={() => setView({ type: 'cart' })} 
        onLoginClick={() => setAuthModal('login')}
        onSignupClick={() => setAuthModal('signup')}
        onSellClick={() => setView({ type: 'seller' })}
        onAccountClick={() => {
          if (user) {
            setView({ type: 'account' });
          } else {
            setAuthModal('login');
          }
        }}
      />
      
      <main className="flex-1 w-full relative">
        {view.type === 'home' && (
          <div className="space-y-2 pb-8">
            <Hero />
            <Categories />
            {flashSaleProducts.length > 0 && (
              <FlashSale products={flashSaleProducts} onProductClick={handleProductClick} />
            )}

            {productsLoading ? (
              <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <div className="inline-block w-10 h-10 border-4 border-lazada-orange border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 text-sm">Loading products...</p>
              </div>
            ) : regularProducts.length > 0 ? (
              <ProductList products={regularProducts} onProductClick={handleProductClick} />
            ) : (
              <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No products yet</h3>
                <p className="text-gray-400 text-sm">Products added by sellers will appear here.</p>
              </div>
            )}
          </div>
        )}
        {view.type === 'product' && (
          <ProductDetail product={view.product} onAddToCart={handleAddToCart} />
        )}
        {view.type === 'account' && (
          <UserAccount user={user} onUpdateUser={handleAuthSuccess} />
        )}
        {view.type === 'cart' && (
          <Cart 
            cartItems={cartItems}
            updateQuantity={updateCartItemQuantity}
            toggleSelection={toggleCartItemSelection}
            toggleSelectAll={toggleSelectAll}
            removeItem={removeCartItem}
            removeSelected={removeSelectedItems}
            recommendedProducts={regularProducts} 
            onProductClick={handleProductClick}
            onCheckout={() => {
              if (cartItems.filter(i => i.isSelected).length === 0) {
                alert('Please select items to checkout.');
                return;
              }
              setView({ type: 'checkout' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onContinueShopping={() => setView({ type: 'home' })}
          />
        )}
        {view.type === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            user={user}
            onBack={() => setView({ type: 'cart' })}
            onOrderPlaced={() => {
              removeSelectedItems();
              setView({ type: 'home' });
            }}
          />
        )}
      </main>

      <Footer />
      {authModal && (
        <AuthModal 
          isOpen={authModal !== null} 
          view={authModal} 
          onClose={() => setAuthModal(null)} 
          onSwitchView={setAuthModal}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
