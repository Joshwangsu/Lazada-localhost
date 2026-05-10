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

    // Every user gets a cart upon signup
    await pool.query('INSERT INTO Cart (Cart_UserId) VALUES (?)', [result.insertId]);

    // Generate JWT token
    const token = jwt.sign({ id: result.insertId, role: role || 'buyer' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertId,
        name,
        email,
        role: role || 'buyer',
        address: '',
        phone: ''
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

    // Check if user has a cart, create if not (for users created before this feature)
    const [carts]: any = await pool.query('SELECT Cart_Id FROM Cart WHERE Cart_UserId = ?', [user.User_Id]);
    if (carts.length === 0) {
      await pool.query('INSERT INTO Cart (Cart_UserId) VALUES (?)', [user.User_Id]);
    }

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.User_Id,
        name: user.User_Name,
        email: user.User_Email,
        role: user.User_Role,
        address: user.User_Address || '',
        phone: user.User_Phone || ''
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

app.put('/api/products/:productId', upload.single('image'), async (req: any, res: any) => {
  try {
    const { productId } = req.params;
    const { price, stock, name, description, categoryId } = req.body;
    
    const updates = [];
    const values = [];
    
    if (price !== undefined) {
      updates.push('Prdct_Price = ?');
      values.push(parseFloat(price));
    }
    if (stock !== undefined) {
      updates.push('Prdct_Stock_Qty = ?');
      values.push(parseInt(stock));
    }
    if (name !== undefined) {
      updates.push('Prdct_Name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('Prdct_Description = ?');
      values.push(description);
    }
    if (categoryId !== undefined) {
      updates.push('Prdct_CtgryId = ?');
      values.push(parseInt(categoryId));
    }
    
    if (req.file) {
      const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      updates.push('Prdct_Image_Url = ?');
      values.push(imageUrl);
    }
    
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    
    values.push(productId);
    
    await pool.query(
      `UPDATE Product SET ${updates.join(', ')} WHERE Prdct_Id = ?`,
      values
    );
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
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

// --- CART ROUTES ---

app.get('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find cart for user
    const [carts]: any = await pool.query('SELECT Cart_Id FROM Cart WHERE Cart_UserId = ?', [userId]);
    if (carts.length === 0) return res.json([]);
    const cartId = carts[0].Cart_Id;

    // Fetch items with product details
    const [items]: any = await pool.query(
      `SELECT ci.CItem_Id as id, ci.CItem_Quantity as quantity, 
              p.Prdct_Id as productId, p.Prdct_Name as name, p.Prdct_Price as price, p.Prdct_Image_Url as image
       FROM Cart_Item ci
       JOIN Product p ON ci.CItem_PrdctId = p.Prdct_Id
       WHERE ci.CItem_CartId = ?`,
      [cartId]
    );

    // Map to frontend format
    const formattedItems = items.map((item: any) => ({
      id: item.id.toString(),
      product: {
        id: item.productId.toString(),
        name: item.name,
        price: parseFloat(item.price),
        image: item.image
      },
      quantity: item.quantity,
      isSelected: true // Default to selected in DB-synced cart
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error('Fetch cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/api/cart/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    // Find cart
    const [carts]: any = await pool.query('SELECT Cart_Id FROM Cart WHERE Cart_UserId = ?', [userId]);
    if (carts.length === 0) return res.status(404).json({ error: 'Cart not found' });
    const cartId = carts[0].Cart_Id;

    // Check if item already in cart
    const [existing]: any = await pool.query(
      'SELECT CItem_Id, CItem_Quantity FROM Cart_Item WHERE CItem_CartId = ? AND CItem_PrdctId = ?',
      [cartId, productId]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE Cart_Item SET CItem_Quantity = CItem_Quantity + ? WHERE CItem_Id = ?',
        [quantity || 1, existing[0].CItem_Id]
      );
    } else {
      await pool.query(
        'INSERT INTO Cart_Item (CItem_CartId, CItem_PrdctId, CItem_Quantity) VALUES (?, ?, ?)',
        [cartId, productId, quantity || 1]
      );
    }

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

app.put('/api/cart/update', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const [carts]: any = await pool.query('SELECT Cart_Id FROM Cart WHERE Cart_UserId = ?', [userId]);
    if (carts.length === 0) return res.status(404).json({ error: 'Cart not found' });
    const cartId = carts[0].Cart_Id;

    await pool.query(
      'UPDATE Cart_Item SET CItem_Quantity = ? WHERE CItem_CartId = ? AND CItem_PrdctId = ?',
      [quantity, cartId, productId]
    );
    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

app.delete('/api/cart/remove', async (req, res) => {
  try {
    const { userId, productId } = req.query;
    const [carts]: any = await pool.query('SELECT Cart_Id FROM Cart WHERE Cart_UserId = ?', [userId]);
    if (carts.length === 0) return res.status(404).json({ error: 'Cart not found' });
    const cartId = carts[0].Cart_Id;

    await pool.query(
      'DELETE FROM Cart_Item WHERE CItem_CartId = ? AND CItem_PrdctId = ?',
      [cartId, productId]
    );
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Failed to remove item' });
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
    const [paymentResult]: any = await pool.query(
      'INSERT INTO Payment (Pymnt_OrderId, Pymnt_Method, Pymnt_Status, Pymnt_Amount) VALUES (?, ?, ?, ?)',
      [orderId, paymentMethod || 'cod', 'Pending', total || 0]
    );
    const paymentId = paymentResult.insertId;

    // Create delivery record
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days from now

    await pool.query(
      'INSERT INTO Delivery (Dlvry_PymntId, Dlvry_Status, Dlvry_Courier, Dlvry_TrackingNumber, Dlvry_EstimatedDelivery) VALUES (?, ?, ?, ?, ?)',
      [paymentId, 'Processing', 'J&T Express', 'JT' + Math.floor(Math.random() * 1000000000), estimatedDelivery]
    );

    // Clear cart after order
    const [carts]: any = await pool.query('SELECT Cart_Id FROM Cart WHERE Cart_UserId = ?', [userId]);
    if (carts.length > 0) {
      const cartId = carts[0].Cart_Id;
      // We only clear the items that were actually ordered
      for (const item of items) {
        await pool.query('DELETE FROM Cart_Item WHERE CItem_CartId = ? AND CItem_PrdctId = ?', [cartId, item.productId]);
      }
    }

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    // Fetch orders for user with delivery details
    const [orders]: any = await pool.query(
      `SELECT o.Order_Id, o.Order_Date, p.Pymnt_Amount, p.Pymnt_Status, p.Pymnt_Method,
              d.Dlvry_Status, d.Dlvry_Courier, d.Dlvry_TrackingNumber, d.Dlvry_EstimatedDelivery 
       FROM \`Order\` o 
       LEFT JOIN Payment p ON o.Order_Id = p.Pymnt_OrderId 
       LEFT JOIN Delivery d ON p.Pymnt_Id = d.Dlvry_PymntId
       WHERE o.Order_UserId = ? 
       ORDER BY o.Order_Date DESC`,
      [userId]
    );

    // Fetch items for each order
    for (let order of orders) {
      const [items]: any = await pool.query(
        'SELECT oi.OItem_Quantity, oi.OItem_Price, pr.Prdct_Name, pr.Prdct_Image_Url, s.Shop_Id, u.User_Name as Shop_Name FROM Order_Item oi JOIN Product pr ON oi.OItem_PrdctId = pr.Prdct_Id JOIN Shop s ON pr.Prdct_ShopId = s.Shop_Id JOIN User u ON s.Shop_UserId = u.User_Id WHERE oi.OItem_OrderId = ?',
        [order.Order_Id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.put('/api/orders/:id/cancel', async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Check if order exists and is not already cancelled
    const [orders]: any = await pool.query('SELECT Order_Id FROM `Order` WHERE Order_Id = ?', [orderId]);
    if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });

    // Find the payment ID for the order
    const [payments]: any = await pool.query('SELECT Pymnt_Id FROM Payment WHERE Pymnt_OrderId = ?', [orderId]);
    if (payments.length > 0) {
      const paymentId = payments[0].Pymnt_Id;
      await pool.query('UPDATE Payment SET Pymnt_Status = ? WHERE Pymnt_Id = ?', ['Cancelled', paymentId]);
      await pool.query('UPDATE Delivery SET Dlvry_Status = ? WHERE Dlvry_PymntId = ?', ['Cancelled', paymentId]);
    }
    
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
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
