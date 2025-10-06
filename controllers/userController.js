const User = require("../models/User");
const { generateToken } = require("../middleware/jwt");

const signup = async (req, res) => {
  try {
    const data = req.body;

    // Check if admin already exists
    const adminUser = await User.findOne({ role: "admin" });
    if (data.role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin user already exists" });
    }

    // Check for duplicate username
    const existingUser = await User.findOne({ username: data.username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same username already exists" });
    }

    // Create and save new user
    const newUser = new User(data);
    const savedUser = await newUser.save();

    // Generate JWT payload
    const payload = {
      id: savedUser._id,
      role: savedUser.role,
    };

    const token = generateToken(payload);

    // Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
      },
      token: token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = generateToken(payload);

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login };
