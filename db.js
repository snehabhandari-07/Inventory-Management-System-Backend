require('dotenv').config();
const mongoose = require("mongoose");

const mongodb_url = process.env.MONGO_URL;
mongoose.connect(mongodb_url);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MONGODB');
})

db.on('error', (err) => {
    console.log('MONGODB Connection error', err);
})

db.on('disconnected', () => {
    console.log('MONGODB Disconnected');
})

module.exports = db;