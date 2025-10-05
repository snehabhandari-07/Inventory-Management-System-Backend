const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    stock_quantity: {
        type: Number,
        required: true,
        min: 0
    },
    low_stock_threshold: {
        type: Number,
        default: 0,
        min: 0
    }
}, {timestamps: true})

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;