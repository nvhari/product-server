const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = 'mongodb+srv://harinv18:zPWAzE6dMaLy6JpU@product-list.swerw.mongodb.net/'; // Replace this with your actual MongoDB URI
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

const Product = mongoose.model('Product', productSchema);

// Seed data (optional, for testing)
app.get('/seed', async (req, res) => {
  const products = [
    { name: 'Fjallraven Backpack', price: 109.95, description: 'Fits 15" laptops', image: 'https://via.placeholder.com/150' },
    { name: 'Mens Casual Shirt', price: 22.3, description: 'Slim Fit T-Shirts', image: 'https://via.placeholder.com/150' },
    { name: 'Mens Cotton Jacket', price: 55.99, description: 'Stylish cotton jacket', image: 'https://via.placeholder.com/150' },
    { name: 'Mens Casual Slim Fit', price: 15.99, description: 'Comfortable slim fit shirt', image: 'https://via.placeholder.com/150' },
    { name: 'Elegant Watch', price: 120.49, description: 'Luxury wristwatch', image: 'https://via.placeholder.com/150' },
  ];
  try {
    await Product.insertMany(products);
    res.json({ message: 'Seed data added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API endpoint to fetch products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));


// Export the app for Vercel
module.exports = app;
