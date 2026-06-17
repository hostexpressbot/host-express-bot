/**
 * ===================================
 * FILE : mainMenu.js
 * FUNGSI :
 * - Keyboard Menu Utama User
 * ===================================
 */

const { Markup } = require("telegraf");

function mainMenu() {
    return Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "📦 PRODUK",
                "menu_produk"
            )
        ],
        [
            Markup.button.callback(
                "📄 TRANSAKSI SAYA",
                "menu_transaksi"
            )
        ],
        [
            Markup.button.callback(
                "👤 AKUN SAYA",
                "menu_akun"
            )
        ]
    ]);
}

module.exports = mainMenu;