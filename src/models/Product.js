/**
 * ===================================
 * FILE : Product.js
 * FUNGSI :
 * - Menyimpan produk
 * ===================================
 */

const mongoose = require("mongoose");

const ProductSchema =
new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    price: {
        type: Number,
        required: true
    },

    active: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

module.exports =
mongoose.model(
    "Product",
    ProductSchema
);