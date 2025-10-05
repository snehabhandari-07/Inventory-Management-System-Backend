const User = require("../models/User");
const { generateToken } = require("../middleware/jwt");

const signup = async (req, res) => {
  try {
    // Data is coming from req.body
    const data = req.body;
    const adminUser = await User.findOne({ role: "admin" });

    if (data.role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin user already exists" });
    }

    const existingUser = await User.findOne({ username: data.username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same username already exists" });
    }
    const newUser = new User(data); //create a newUser using User model

    // Save the data in document
    const response = await newUser.save();
    console.log(response);

    // Payload to generate token using jwt
    const payload = {
      id: user.id,
      role: user.role,
    };

    console.log(JSON.stringify(payload));

    // pass payload to function
    const token = generateToken(payload);
    console.log("Token is ", token);

    // Send the json response
    res.status(200).json({ response: response, token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    // Extract user info from req.body
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    // Error if no user found or password does not match
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const payload = {
      id: user.id,
    };

    const token = generateToken(payload);
    console.log("Token generated : ", token);

    res.json({ token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login };
