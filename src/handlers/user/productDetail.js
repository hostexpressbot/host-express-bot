/**
 * ===================================
 * FILE : productDetail.js
 * FUNGSI :
 * - Detail Produk
 * ===================================
 */

const Product =
require("../../models/Product");

const Stock =
require("../../models/Stock");

const qtyKeyboard =
require("../../keyboards/qtyKeyboard");

async function showProductDetail(ctx)
{
    try
    {
        const productId =
        ctx.match[1];

        const product =
        await Product.findById(
            productId
        );

        if (!product)
        {
            return ctx.answerCbQuery(
                "Produk tidak ditemukan"
            );
        }

        const stock =
await Stock.countDocuments({
    productId,
    sold: false
});

if (stock <= 0)
{
    return await ctx.editMessageText(
`❌ STOCK HABIS

📦 Produk:
${product.name}

Silakan tunggu admin melakukan restock.`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "⬅️ KEMBALI",
                            callback_data:
                            "back_main_menu"
                        }
                    ]
                ]
            }
        }
    );
}

        await ctx.editMessageText(
`📦 ${product.name}

💰 Harga:
Rp${product.price.toLocaleString()}

Pilih jumlah pembelian.`,
            qtyKeyboard(product._id)
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    showProductDetail
};