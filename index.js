const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'your-mongodb-uri-here'; // Use environment variables for security
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

const Product = mongoose.model('Product', productSchema);

// Routes
app.get('/', (req, res) => {
  res.send("<h1>Welcome to the Products API</h1>");
});

app.get('/seed', async (req, res) => {
  const products = [
    { name: 'Fjallraven Backpack', price: 109.95, description: 'Fits 15" laptops', image: 'https://www.jiomart.com/images/product/original/rvjjz4lfas/astrid-men-s-laptop-bag-office-bag-with-sling-waterproof-laptop-sleeve-cover-brown-7-l-product-images-rvjjz4lfas-0-202312201506.jpg?im=Resize=(600,750)' },
    // ... More products
  ];
  try {
    await Product.insertMany(products);
    res.json({ message: 'Seed data added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export the app for Vercel
module.exports = app;
