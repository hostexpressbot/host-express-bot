/**
 * ===================================
 * FILE : productMenu.js
 * FUNGSI :
 * - Menampilkan produk
 * ===================================
 */

const Product =
require("../../models/Product");

const { Markup } =
require("telegraf");

async function showProducts(ctx)
{
    try
    {
        const products =
        await Product.find({
            active: true
        }).sort({
            createdAt: 1
        });

        if (
            products.length === 0
        )
        {
            return ctx.answerCbQuery(
                "Belum ada produk"
            );
        }

        const buttons = [];

        for (const product of products)
        {
            buttons.push([
                Markup.button.callback(
                    `📦 ${product.name} | Rp${product.price.toLocaleString()}`,
                    `product_${product._id}`
                )
            ]);
        }

        buttons.push([
            Markup.button.callback(
                "⬅️ KEMBALI",
                "back_main_menu"
            )
        ]);

        await ctx.editMessageText(
`📦 DAFTAR PRODUK

Silakan pilih produk.`,
            Markup.inlineKeyboard(
                buttons
            )
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    showProducts
};