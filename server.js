require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const db = require("./db");

const productRoutes = require("./routes/products");
const userRoutes = require("./routes/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CRUD - Products
app.use("/products", productRoutes);

// User
app.use("/auth", userRoutes);

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server listening on ${port}`));
}

// Export app for testing
module.exports = app;
