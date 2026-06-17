/**
 * ===================================
 * FILE : adminMenu.js
 * FUNGSI :
 * - Keyboard Admin Panel
 * ===================================
 */

const { Markup } = require("telegraf");

function adminMenu() {
    return Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "➕ TAMBAH PRODUK",
                "admin_add_product"
            )
        ],
        [
            Markup.button.callback(
                "✏️ UBAH NAMA PRODUK",
                "admin_edit_product"
            )
        ],
        [
            Markup.button.callback(
                "💰 UBAH HARGA",
                "admin_edit_price"
            )
        ],
        [
            Markup.button.callback(
                "📦 RESTOCK",
                "admin_restock"
            )
        ],
        [
            Markup.button.callback(
                "🗑 HAPUS STOCK",
                "admin_delete_stock"
            )
        ],
        [
            Markup.button.callback(
                "❌ HAPUS PRODUK",
                "admin_delete_product"
            )
        ],
        [
            Markup.button.callback(
                "💳 UBAH LINK QRIS",
                "admin_change_qris"
            )
        ],
        [
            Markup.button.callback(
                "🖼 UBAH BANNER",
                "admin_change_banner"
            )
        ],
        [
            Markup.button.callback(
                "📢 BROADCAST",
                "admin_broadcast"
            )
        ]
    ]);
}

module.exports = adminMenu;