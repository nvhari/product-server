const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Supported HTTP methods
    credentials: true, // Allow sending cookies
  })
);

// MongoDB connection configuration
const MONGO_URI = "mongodb+srv://harinv18:zPWAzE6dMaLy6JpU@product-list.swerw.mongodb.net/";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schemas and Models
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema);

// Welcome route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Products API</h1>");
});

// Seed data route (Initial data insertion)
app.get("/seed", async (req, res) => {
  const products = [
    {
      name: "Fjallraven Backpack",
      price: 109.95,
      description: 'Fits 15" laptops',
      image: "https://www.jiomart.com/images/product/original/rvjjz4lfas/astrid-men-s-laptop-bag-office-bag-with-sling-waterproof-laptop-sleeve-cover-brown-7-l-product-images-rvjjz4lfas-0-202312201506.jpg?im=Resize=(600,750)",
    },
    {
      name: "Mens Casual Shirt",
      price: 22.3,
      description: "Slim Fit T-Shirts",
      image: "https://www.jiomart.com/images/product/original/rvzuth3vr6/bruton-trendy-running-shoes-sneaker-shoes-for-men-product-images-rvzuth3vr6-0-202401111155.jpg?im=Resize=(330,410)",
    },
    {
      name: "Mens Cotton Jacket",
      price: 55.99,
      description: "Stylish cotton jacket",
      image: "https://www.jiomart.com/images/product/original/rvqfvgju8p/crazy-bee-t-shirt-for-men-men-t-shirt-tshirt-for-men-back-print-tshirt-t-shirts-oversized-tshirt-men-tshirt-tshirt-men-tshirts-for-men-oversized-t-shirt-oversize-t-shirt-oversized-tshirt-men-product-images-rvqfvgju8p-0-202409201137.jpg?im=Resize=(330,410)",
    },
    {
      name: "Mens Casual Slim Fit",
      price: 15.99,
      description: "Comfortable slim fit shirt",
      image: "https://www.jiomart.com/images/product/original/rvxsoqxkml/glito-stylish-graphic-printed-kangaroo-pocket-s-hooded-sweartshirts-men-product-images-rvxsoqxkml-0-202409110209.jpg?im=Resize=(330,410)",
    },
    {
      name: "Elegant Watch",
      price: 120.49,
      description: "Luxury wristwatch",
      image: "https://www.jiomart.com/images/product/original/rvwgz5gjfb/acnos-silver-strap-analogue-steel-watch-for-men-pack-of-1-fx437-product-images-rvwgz5gjfb-0-202305050811.jpg?im=Resize=(330,410)",
    },
  ];

  try {
    const existingProducts = await Product.find(); // Check if products already exist
    if (existingProducts.length > 0) {
      return res.json({ message: "Database already seeded" });
    }

    await Product.insertMany(products); // Insert seed data into the Product collection
    res.json({ message: "Seed data added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Products API route
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the Product collection
    res.json(products); // Respond with the list of products in JSON format
  } catch (err) {
    res.status(500).json({ message: err.message }); // Error handling
  }
});

// Login API route
app.post("/login", async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body
  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ message: "Login successful", user, success: true }); // Success response
  } catch (err) {
    res.status(500).json({ message: err.message }); // Error handling
  }
});

// Signup API route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body
  try {
    const existingUser = await User.findOne({ email }); // Check if user already exists
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ email, password }); // Create a new user
    await newUser.save(); // Save the new user to the database
    res.json({ message: "Signup successful", user: newUser }); // Success response
  } catch (err) {
    res.status(500).json({ message: err.message }); // Error handling
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

module.exports = app; // Export the app for use in other modules
