export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  isFlashSale?: boolean;
  soldCount?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: '1', name: 'LazMall', icon: 'ShoppingBag' },
  { id: '2', name: 'Vouchers', icon: 'Ticket' },
  { id: '3', name: 'Top-Up & Bills', icon: 'CreditCard' },
  { id: '4', name: 'LazGlobal', icon: 'Globe' },
  { id: '5', name: 'Beauty', icon: 'Sparkles' },
  { id: '6', name: 'Electronics', icon: 'Smartphone' },
  { id: '7', name: 'Fashion', icon: 'Shirtsmith' },
  { id: '8', name: 'Home & Living', icon: 'Home' },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Noise Cancelling Bluetooth Headphones',
    price: 1250.00,
    originalPrice: 2500.00,
    discount: 50,
    rating: 4.8,
    reviews: 1245,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    isFlashSale: true,
    soldCount: 450,
  },
  {
    id: 'p2',
    name: 'Men\'s Casual Quick Dry T-Shirt Summer Short Sleeve',
    price: 150.00,
    originalPrice: 300.00,
    discount: 50,
    rating: 4.5,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60',
    isFlashSale: true,
    soldCount: 1200,
  },
  {
    id: 'p3',
    name: 'Smart Watch Fitness Tracker with Heart Rate Monitor',
    price: 899.00,
    originalPrice: 1500.00,
    discount: 40,
    rating: 4.6,
    reviews: 532,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60',
    isFlashSale: true,
    soldCount: 320,
  },
  {
    id: 'p4',
    name: 'Ergonomic Office Chair with Lumbar Support',
    price: 3450.00,
    originalPrice: 5000.00,
    discount: 31,
    rating: 4.7,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&auto=format&fit=crop&q=60',
    isFlashSale: true,
    soldCount: 85,
  },
  {
    id: 'p5',
    name: 'Premium Leather Wallet with RFID Blocking',
    price: 499.00,
    originalPrice: 999.00,
    discount: 50,
    rating: 4.9,
    reviews: 3120,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60',
    isFlashSale: false,
  },
  {
    id: 'p6',
    name: 'Professional Skincare Vitamin C Serum 30ml',
    price: 299.00,
    originalPrice: 600.00,
    discount: 50,
    rating: 4.4,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60',
    isFlashSale: false,
  },
  {
    id: 'p7',
    name: 'Non-Stick Frying Pan 28cm Aluminum Alloy',
    price: 750.00,
    originalPrice: 1200.00,
    discount: 38,
    rating: 4.8,
    reviews: 450,
    image: 'https://images.unsplash.com/photo-1584990347449-a6181b483488?w=500&auto=format&fit=crop&q=60',
    isFlashSale: true,
    soldCount: 65,
  },
  {
    id: 'p8',
    name: 'Gaming Mouse 10000 DPI RGB Backlight',
    price: 650.00,
    originalPrice: 1200.00,
    discount: 46,
    rating: 4.6,
    reviews: 1350,
    image: 'https://images.unsplash.com/photo-1527814050087-379381547969?w=500&auto=format&fit=crop&q=60',
    isFlashSale: false,
  },
  {
    id: 'p9',
    name: 'Canvas Casual Sneakers Unisex',
    price: 599.00,
    originalPrice: 1199.00,
    discount: 50,
    rating: 4.3,
    reviews: 670,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=60',
    isFlashSale: true,
    soldCount: 154,
  },
  {
    id: 'p10',
    name: '4K Ultra HD Action Camera Waterproof',
    price: 2100.00,
    originalPrice: 4200.00,
    discount: 50,
    rating: 4.7,
    reviews: 324,
    image: 'https://images.unsplash.com/photo-1502920514313-52581002a659?w=500&auto=format&fit=crop&q=60',
    isFlashSale: false,
  },
  {
    id: 'p11',
    name: 'Portable Power Bank 20000mAh Fast Charging',
    price: 890.00,
    originalPrice: 1400.00,
    discount: 36,
    rating: 4.8,
    reviews: 4320,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=60',
    isFlashSale: false,
  },
  {
    id: 'p12',
    name: 'Mechanical Keyboard Blue Switches TKL',
    price: 1300.00,
    originalPrice: 2000.00,
    discount: 35,
    rating: 4.9,
    reviews: 980,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=60',
    isFlashSale: false,
  }
];
