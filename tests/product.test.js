// tests/product.test.js
process.env.NODE_ENV = "test";
require('dotenv').config({ path: '.env.test' });

const request = require("supertest");
const app = require("../server");  // Your Express app
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "testsecret";
let testToken;
let adminUserId;

beforeAll(async () => {
  // Connect to test DB
  await mongoose.connect("mongodb://127.0.0.1:27017/inventory_test");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear collections
  await Product.deleteMany({});
  await User.deleteMany({});

  // Create admin user
  const hashedPassword = await bcrypt.hash("adminpass", 10);
  adminUserId = new mongoose.Types.ObjectId();

  const adminUser = new User({
    _id: adminUserId,
    username: "admin",
    email: "admin@test.com", // required
    password: hashedPassword,
    role: "admin"
  });

  await adminUser.save();

  // Generate JWT matching the admin user
  testToken = jwt.sign({ id: adminUser._id }, SECRET_KEY, { expiresIn: "1h" });
});

describe("Product API Tests", () => {
  
  test("should create a new product", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        name: "Test Product",
        description: "Sample product",
        stock_quantity: 10,
        low_stock_threshold: 5
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.response).toHaveProperty("_id");
    expect(res.body.response.name).toBe("Test Product");
  });

  test("should fetch all products", async () => {
    await Product.create({ name: "P1", description: "d1", stock_quantity: 5 });
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("should increment stock", async () => {
    const product = await Product.create({ name: "P2", description: "d2", stock_quantity: 5 });
    const res = await request(app)
      .put(`/products/${product._id}/inc`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ amount: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.response.stock_quantity).toBe(8);
  });

  test("should NOT decrement stock below 0", async () => {
    const product = await Product.create({ name: "P3", description: "d3", stock_quantity: 2 });
    const res = await request(app)
      .put(`/products/${product._id}/dec`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Insufficient stock/i);
  });

  test("should fetch low stock products", async () => {
    await Product.create({
      name: "LowStockP",
      description: "low",
      stock_quantity: 2,
      low_stock_threshold: 5
    });
    const res = await request(app).get("/products/low-stock");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe("LowStockP");
  });

});
