/**
 * ===================================
 * FILE : adminMenu.js
 * FUNGSI :
 * - Keyboard Admin Panel
 * ===================================
 */

const { Markup } = require("telegraf");

function adminMenu()
{
    return Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "➕ TAMBAH",
                "admin_add_product"
            ),
            Markup.button.callback(
                "✏️ NAMA",
                "admin_edit_product"
            )
        ],

        [
            Markup.button.callback(
                "💰 HARGA",
                "admin_edit_price"
            ),
            Markup.button.callback(
                "📦 RESTOCK",
                "admin_restock"
            )
        ],

        [
            Markup.button.callback(
                "🗑 STOCK",
                "admin_delete_stock"
            ),
            Markup.button.callback(
                "❌ PRODUK",
                "admin_delete_product"
            )
        ],

        [
            Markup.button.callback(
                "💳 QRIS",
                "admin_change_qris"
            ),
            Markup.button.callback(
                "📊 DASHBOARD",
                "admin_dashboard"
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