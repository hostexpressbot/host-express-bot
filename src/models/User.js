/**
 * ===================================
 * FILE : User.js
 * FUNGSI :
 * - Menyimpan data user
 * - Approval user
 * ===================================
 */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    telegramId: {
        type: Number,
        required: true,
        unique: true
    },

    firstName: {
        type: String,
        default: ""
    },

    username: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(
    "User",
    UserSchema
);