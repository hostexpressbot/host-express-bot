/**
 * ===================================
 * FILE : mongodb.js
 * FUNGSI :
 * - Koneksi MongoDB
 * ===================================
 */

const mongoose = require("mongoose");
const { MONGO_URI } = require("../config/config");

async function connectMongo() {
    try {

        mongoose.set("strictQuery", true);

        await mongoose.connect(MONGO_URI);

        console.log("✅ MongoDB Connected");

    } catch (err) {

        console.error("❌ MongoDB Error");
        console.error(err.message);

        process.exit(1);
    }
}

module.exports = connectMongo;