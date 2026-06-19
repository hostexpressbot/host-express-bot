/**
 * ===================================
 * FILE : qtyKeyboard.js
 * FUNGSI :
 * - Tombol jumlah 1-10
 * ===================================
 */

const { Markup } = require("telegraf");

function qtyKeyboard(productId)
{
    return Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "1",
                `qty_${productId}_1`
            ),
            Markup.button.callback(
                "2",
                `qty_${productId}_2`
            ),
            Markup.button.callback(
                "3",
                `qty_${productId}_3`
            )
        ],

        [
            Markup.button.callback(
                "4",
                `qty_${productId}_4`
            ),
            Markup.button.callback(
                "5",
                `qty_${productId}_5`
            ),
            Markup.button.callback(
                "6",
                `qty_${productId}_6`
            )
        ],

        [
            Markup.button.callback(
                "7",
                `qty_${productId}_7`
            ),
            Markup.button.callback(
                "8",
                `qty_${productId}_8`
            ),
            Markup.button.callback(
                "9",
                `qty_${productId}_9`
            )
        ],

        [
            Markup.button.callback(
                "10",
                `qty_${productId}_10`
            )
        ],

        [
            Markup.button.callback(
                "⬅️ KEMBALI",
                "back_main_menu"
            )
        ]
    ]);
}

module.exports = qtyKeyboard;