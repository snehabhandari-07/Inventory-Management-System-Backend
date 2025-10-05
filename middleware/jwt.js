const jwt = require("jsonwebtoken");
require('dotenv').config();

// Payload - has userID
const secretKey = process.env.SECRET_KEY;
const options = {expiresIn: "30m"};

// Check incoming req has valid token
const jwtAuthMiddleware = (req, res, next) => {
    // Check token
    const authorization = req.headers.authorization;
    if(!authorization) {
        return res.status(401).json({ error: 'Token Not Found' });
    }

    const token = authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({error: "Token not found"});
    }

    try {
        // Verify the jwt token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach user info that is id to request user
        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({error: err.message});
    }
}

// Generate Token 
const generateToken = (userData) => {
    return jwt.sign(userData, secretKey, options);
}

module.exports = {generateToken, jwtAuthMiddleware}