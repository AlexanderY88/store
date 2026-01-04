const mongoose = require('mongoose');

const productSchema = new mongoose.Schema ({
    productId: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;