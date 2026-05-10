-- Create the database
CREATE DATABASE IF NOT EXISTS lazada_clone;
USE lazada_clone;

-- 1. User
CREATE TABLE User (
    User_Id INT AUTO_INCREMENT PRIMARY KEY,
    User_Name VARCHAR(255) NOT NULL,
    User_Email VARCHAR(255) NOT NULL UNIQUE,
    User_Phone VARCHAR(50),
    User_Password VARCHAR(255) NOT NULL,
    User_Address TEXT,
    User_Role VARCHAR(50) DEFAULT 'buyer',
    User_RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Shop
CREATE TABLE Shop (
    Shop_Id INT AUTO_INCREMENT PRIMARY KEY,
    Shop_UserId INT NOT NULL,
    Shop_RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Shop_UserId) REFERENCES User(User_Id) ON DELETE CASCADE
);

-- 3. Category
CREATE TABLE Category (
    Ctgry_Id INT AUTO_INCREMENT PRIMARY KEY,
    Ctgry_Name VARCHAR(100) NOT NULL,
    Ctgry_Description TEXT
);

-- 4. Product
CREATE TABLE Product (
    Prdct_Id INT AUTO_INCREMENT PRIMARY KEY,
    Prdct_ShopId INT NOT NULL,
    Prdct_CtgryId INT NOT NULL,
    Prdct_Name VARCHAR(255) NOT NULL, -- Added Name as it's typically required, though not explicitly shown
    Prdct_Description TEXT,
    Prdct_Price DECIMAL(10, 2) NOT NULL,
    Prdct_Stock_Qty INT NOT NULL DEFAULT 0,
    Prdct_Image_Url VARCHAR(500),
    Prdct_DateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Prdct_ShopId) REFERENCES Shop(Shop_Id) ON DELETE CASCADE,
    FOREIGN KEY (Prdct_CtgryId) REFERENCES Category(Ctgry_Id) ON DELETE CASCADE
);

-- 5. Cart
CREATE TABLE Cart (
    Cart_Id INT AUTO_INCREMENT PRIMARY KEY,
    Cart_UserId INT NOT NULL,
    Cart_DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Cart_UserId) REFERENCES User(User_Id) ON DELETE CASCADE
);

-- 6. Cart_Item
CREATE TABLE Cart_Item (
    CItem_Id INT AUTO_INCREMENT PRIMARY KEY,
    CItem_CartId INT NOT NULL,
    CItem_PrdctId INT NOT NULL,
    CItem_Quantity INT DEFAULT 1, -- Assuming quantity is needed, added for standard cart behavior
    FOREIGN KEY (CItem_CartId) REFERENCES Cart(Cart_Id) ON DELETE CASCADE,
    FOREIGN KEY (CItem_PrdctId) REFERENCES Product(Prdct_Id) ON DELETE CASCADE
);

-- 7. Order
CREATE TABLE `Order` (
    Order_Id INT AUTO_INCREMENT PRIMARY KEY,
    Order_UserId INT NOT NULL,
    Order_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Note: 'Order_Date' was listed twice in the ERD; only included once here.
    FOREIGN KEY (Order_UserId) REFERENCES User(User_Id) ON DELETE CASCADE
);

-- 8. Order_Item
CREATE TABLE Order_Item (
    OItem_Id INT AUTO_INCREMENT PRIMARY KEY,
    OItem_OrderId INT NOT NULL, -- The ERD says OItem_UserId but it connects to Order, so fixing the typo to OItem_OrderId
    OItem_PrdctId INT NOT NULL,
    OItem_Quantity INT NOT NULL,
    OItem_Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (OItem_OrderId) REFERENCES `Order`(Order_Id) ON DELETE CASCADE,
    FOREIGN KEY (OItem_PrdctId) REFERENCES Product(Prdct_Id) ON DELETE CASCADE
);

-- 9. Payment
CREATE TABLE Payment (
    Pymnt_Id INT AUTO_INCREMENT PRIMARY KEY,
    Pymnt_OrderId INT NOT NULL,
    Pymnt_Method VARCHAR(50) NOT NULL,
    Pymnt_Status VARCHAR(50) DEFAULT 'Pending',
    Pymnt_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Pymnt_Amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (Pymnt_OrderId) REFERENCES `Order`(Order_Id) ON DELETE CASCADE
);

-- 10. Delivery
-- Disregarded Rider and Dlvry_RiderId as per instructions
CREATE TABLE Delivery (
    Dlvry_Id INT AUTO_INCREMENT PRIMARY KEY,
    Dlvry_PymntId INT NOT NULL,
    Dlvry_Status VARCHAR(50) DEFAULT 'Processing',
    Dlvry_Courier VARCHAR(100),
    Dlvry_TrackingNumber VARCHAR(100),
    Dlvry_EstimatedDelivery DATE,
    Dlvry_DeliveryDate DATE,
    FOREIGN KEY (Dlvry_PymntId) REFERENCES Payment(Pymnt_Id) ON DELETE CASCADE
);
