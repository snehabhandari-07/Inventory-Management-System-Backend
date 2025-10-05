const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { signup, login } = require('../controllers/userController');


// signup
router.post("/signup", signup)

// login
router.post("/login", login)

module.exports = router;