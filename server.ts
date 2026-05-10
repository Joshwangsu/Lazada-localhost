import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_for_development_only';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Set up uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// Seed Categories
const seedCategories = async () => {
  try {
    const categories = [
      'Electronic Devices', 'Electronic Accessories', 'TV & Home Appliances',
      'Health & Beauty', 'Babies & Toys', 'Groceries & Pet Care',
      'Home & Living', 'Womens Fashion', 'Mens Fashion', 'Fashion Accessories',
      'Sports & Lifestyle', 'Automotive & Motorcycles', 'Home Appliances',
      'Kitchen Appliances', 'Computers & Laptops', 'Cameras', 'Tablets',
      'Smartphones', 'Audio', 'Wearable Technology', 'Gaming',
      'Furniture & Organization', 'Home Decor', 'Lighting', 'Bedding', 'Bath',
      'Kitchen & Dining', 'Tools & Home Improvement', 'Outdoor & Garden',
      'Pet Supplies', 'Stationery & Craft', 'Books & Media', 'Toys & Games',
      'Baby Care', 'Maternity', 'Personal Care', 'Skin Care', 'Hair Care',
      'Makeup', 'Fragrances', 'Mens Grooming', 'Sports Equipment',
      'Outdoor Recreation', 'Exercise & Fitness', 'Travel & Luggage',
      'Automotive', 'Motorcycle'
    ];

    for (const cat of categories) {
      const [existing]: any = await pool.query('SELECT * FROM Category WHERE Ctgry_Name = ?', [cat]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO Category (Ctgry_Name) VALUES (?)', [cat]);
      }
    }
    console.log('✅ Categories check/seeding completed');
  } catch (err) {
    console.error('Error seeding categories:', err);
  }
};

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lazada_clone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test Database Connection
pool.getConnection()
  .then(async connection => {
    console.log('✅ Successfully connected to MySQL database');
    // Fix image URL column size
    try {
      await connection.query('ALTER TABLE Product MODIFY COLUMN Prdct_Image_Url TEXT');
      console.log('✅ Product image column updated');
    } catch (e: any) { /* column may already be updated */ }
    connection.release();
    seedCategories();
  })
  .catch(err => {
    console.error('❌ Error connecting to MySQL:', err.message);
  });

// --- AUTHENTICATION ROUTES ---

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const [existingUsers]: any = await pool.query('SELECT * FROM User WHERE User_Email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [result]: any = await pool.query(
      'INSERT INTO User (User_Name, User_Email, User_Password, User_Role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'buyer']
    );

    // If role is seller, we should also create a shop for them
    if (role === 'seller') {
      await pool.query('INSERT INTO Shop (Shop_UserId) VALUES (?)', [result.insertId]);
    }

    // Generate JWT token
    const token = jwt.sign({ id: result.insertId, role: role || 'buyer' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertId,
        name,
        email,
        role: role || 'buyer'
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const [users]: any = await pool.query('SELECT * FROM User WHERE User_Email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.User_Password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.User_Id, role: user.User_Role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.User_Id,
        name: user.User_Name,
        email: user.User_Email,
        role: user.User_Role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});


// Update User Profile Route (Address & Phone)
app.put('/api/user/profile', async (req, res) => {
  try {
    // We should ideally use JWT verification middleware here, but for simplicity we rely on body email/id
    const { id, address, phone } = req.body;
    
    if (!id) return res.status(400).json({ error: 'User ID is required' });

    await pool.query(
      'UPDATE User SET User_Address = ?, User_Phone = ? WHERE User_Id = ?',
      [address, phone, id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error during profile update' });
  }
});

// --- OTHER API ROUTES ---

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, c.Ctgry_Name FROM Product p LEFT JOIN Category c ON p.Prdct_CtgryId = c.Ctgry_Id ORDER BY p.Prdct_DateAdded DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/seller/products/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get Shop_Id from User_Id
    const [shops]: any = await pool.query('SELECT Shop_Id FROM Shop WHERE Shop_UserId = ?', [userId]);
    if (shops.length === 0) {
      return res.status(404).json({ error: 'Shop not found for this user' });
    }
    const shopId = shops[0].Shop_Id;

    const [rows] = await pool.query(
      'SELECT p.*, c.Ctgry_Name FROM Product p LEFT JOIN Category c ON p.Prdct_CtgryId = c.Ctgry_Id WHERE p.Prdct_ShopId = ?', 
      [shopId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ error: 'Failed to fetch seller products' });
  }
});

app.post('/api/products', upload.single('image'), async (req: any, res: any) => {
  try {
    const { name, description, price, stock, categoryId, userId } = req.body;

    if (!name || !price || !userId) {
      return res.status(400).json({ error: 'Name, price, and userId are required' });
    }

    // Get Shop_Id from User_Id
    const [shops]: any = await pool.query('SELECT Shop_Id FROM Shop WHERE Shop_UserId = ?', [userId]);
    if (shops.length === 0) {
      return res.status(400).json({ error: 'Shop not found for this user' });
    }
    const shopId = shops[0].Shop_Id;

    // Build image URL from uploaded file or fallback
    let imageUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const [result]: any = await pool.query(
      'INSERT INTO Product (Prdct_ShopId, Prdct_CtgryId, Prdct_Name, Prdct_Description, Prdct_Price, Prdct_Stock_Qty, Prdct_Image_Url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [shopId, categoryId || 1, name, description || '', parseFloat(price), parseInt(stock || '0'), imageUrl]
    );

    res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.delete('/api/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    await pool.query('DELETE FROM Product WHERE Prdct_Id = ?', [productId]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Category');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, paymentMethod, items, total } = req.body;
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing order data' });
    }

    // Create order record
    const [orderResult]: any = await pool.query(
      'INSERT INTO `Order` (Order_UserId) VALUES (?)', [userId]
    );
    const orderId = orderResult.insertId;

    // Insert each order item
    for (const item of items) {
      await pool.query(
        'INSERT INTO Order_Item (OItem_OrderId, OItem_PrdctId, OItem_Quantity, OItem_Price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    // Create payment record
    await pool.query(
      'INSERT INTO Payment (Pymnt_OrderId, Pymnt_Method, Pymnt_Status, Pymnt_Amount) VALUES (?, ?, ?, ?)',
      [orderId, paymentMethod || 'cod', 'Pending', total || 0]
    );

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Global Error Handler for JSON
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Backend Server running on http://localhost:${port}`);
});
