const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware} = require("../middleware/jwt");
const {getProducts, addProduct, updateProduct, deleteProduct, incStock, decStock, getLowStock, getProductDetails} = require("../controllers/productController");

// Get list of all products
router.get("/", getProducts);

// Add new Product
router.post("/", jwtAuthMiddleware, addProduct);

// Update product
router.put("/:id", jwtAuthMiddleware, updateProduct);

// Delete Product
router.delete("/:id", jwtAuthMiddleware, deleteProduct);

// Inc Stock
router.put("/:id/inc", jwtAuthMiddleware, incStock);

// Dec Stock
router.put("/:id/dec", jwtAuthMiddleware, decStock);

// Check low stocks
router.get("/low-stock", getLowStock);

// Get Specific Product Details
router.get("/:id", getProductDetails);

module.exports = router;