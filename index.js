const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Update to your frontend URL in production
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI; // Use environment variable for MongoDB URI
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Product Schema and Model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});
const Product = mongoose.model("Product", productSchema);

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Products API</h1>");
});

// Seed data route
app.get("/seed", async (req, res) => {
  const products = [
    {
      name: "Fjallraven Backpack",
      price: 109.95,
      description: 'Fits 15" laptops',
      image:
        "https://www.jiomart.com/images/product/original/rvjjz4lfas/astrid-men-s-laptop-bag-office-bag-with-sling-waterproof-laptop-sleeve-cover-brown-7-l-product-images-rvjjz4lfas-0-202312201506.jpg",
    },
    {
      name: "Mens Casual Shirt",
      price: 22.3,
      description: "Slim Fit T-Shirts",
      image:
        "https://www.jiomart.com/images/product/original/rvzuth3vr6/bruton-trendy-running-shoes-sneaker-shoes-for-men-product-images-rvzuth3vr6-0-202401111155.jpg",
    },
    {
      name: "Mens Cotton Jacket",
      price: 55.99,
      description: "Stylish cotton jacket",
      image:
        "https://www.jiomart.com/images/product/original/rvqfvgju8p/crazy-bee-t-shirt-for-men-men-t-shirt-tshirt-for-men-back-print-tshirt-t-shirts-oversized-tshirt-men-tshirt-tshirt-men-tshirts-for-men-oversized-t-shirt-oversize-t-shirt-oversized-tshirt-men-product-images-rvqfvgju8p-0-202409201137.jpg",
    },
    {
      name: "Mens Casual Slim Fit",
      price: 15.99,
      description: "Comfortable slim fit shirt",
      image:
        "https://www.jiomart.com/images/product/original/rvxsoqxkml/glito-stylish-graphic-printed-kangaroo-pocket-s-hooded-sweartshirts-men-product-images-rvxsoqxkml-0-202409110209.jpg",
    },
    {
      name: "Elegant Watch",
      price: 120.49,
      description: "Luxury wristwatch",
      image:
        "https://www.jiomart.com/images/product/original/rvwgz5gjfb/acnos-silver-strap-analogue-steel-watch-for-men-pack-of-1-fx437-product-images-rvwgz5gjfb-0-202305050811.jpg",
    },
  ];

  try {
    const existingProducts = await Product.find();
    if (existingProducts.length > 0) {
      return res.json({ message: "Database already seeded" });
    }
    await Product.insertMany(products);
    res.json({ message: "Seed data added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch all products
app.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Export the app for Vercel
module.exports = app;
