/**
 * ===================================
 * FILE : Setting.js
 * FUNGSI :
 * - Banner URL
 * - QRIS URL
 * ===================================
 */

const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
    bannerUrl: {
        type: String,
        default: ""
    },

    qrisImageUrl: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Setting",
    SettingSchema
);