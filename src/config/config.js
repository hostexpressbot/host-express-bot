/**
 * ===================================
 * FILE : config.js
 * FUNGSI :
 * - Konfigurasi Global
 * ===================================
 */

require("dotenv").config();

module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,

    MONGO_URI: process.env.MONGO_URI,

    ADMIN_ID: Number(process.env.ADMIN_ID),

    STORE_NAME: process.env.STORE_NAME,

    BOT_USERNAME: process.env.BOT_USERNAME,

    PORT: process.env.PORT || 3000
};