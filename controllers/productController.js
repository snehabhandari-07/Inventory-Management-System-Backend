const Product = require("../models/Product");
const User = require("../models/User"); 

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user.role == "admin") {
      return true;
    }
  } catch (err) {
    return false;
  }
};

// CRUD
const getProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.json(allProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;
    const response = await Product.findById(productId);

    if (!response) {
      return res.status(404).json({ error: "Product Not Found" });
    }

    res.status(200).json({ response: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addProduct = async (req, res) => {
  try {

    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User not Admin" });
    
    // Data - req.body
    const productData = req.body;
    const newProduct = new Product(productData);

    // Save data in document
    const response = await newProduct.save();
    // console.log(res);

    // Send response
    res.status(200).json({ response: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User not Admin" });

    const productId = req.params.id;
    const newProductData = req.body;

    const response = await Product.findByIdAndUpdate(
      productId,
      newProductData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Product Not Found" });
    }

    console.log("Data updated");

    res.status(200).json({ response: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User not Admin" });

    const productId = req.params.id;
    const response = await Product.findByIdAndDelete(productId);

    if (!response) {
      return res.status(404).json({ error: "Product Not Found" });
    }

    console.log("Product Deleted");

    res.status(200).json({ response: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Stock- inc/dec
const incStock = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User not Admin" });

    const productId = req.params.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.stock_quantity += amount;
    await product.save();

    res.status(200).json({ response: product, message: "Stock increased" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const decStock = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User not Admin" });

    const productId = req.params.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product Not found" });
    }

    if (product.stock_quantity < amount) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    product.stock_quantity -= amount;
    await product.save();

    res.status(200).json({ response: product, message: "Stock decreased" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get low Stock Products
const getLowStock = async (req, res) => {
  try {
    const products = await Product.find();

    const lowStockProducts = products.filter((p) => {
      return p.stock_quantity < p.low_stock_threshold;
    });

    res.status(200).json(lowStockProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  incStock,
  decStock,
  getLowStock,
  getProductDetails,
};
