/**
 * ===================================
 * FILE : selectQty.js
 * FUNGSI :
 * - Memilih jumlah pembelian
 * ===================================
 */

const Product =
require("../../models/Product");

const Stock =
require("../../models/Stock");

const { Markup } =
require("telegraf");

async function selectQty(ctx)
{
    try
    {
        const productId =
        ctx.match[1];

        const qty =
        Number(
            ctx.match[2]
        );

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

        const availableStock =
await Stock.countDocuments({
    productId,
    sold: false
});

        if (
    qty > availableStock
)
{
    return ctx.answerCbQuery(
        "Stock tidak cukup"
    );
}

        const total =
        product.price * qty;

        await ctx.editMessageText(
`🛒 RINGKASAN ORDER

📦 Produk :
${product.name}

🔢 Qty :
${qty}

💰 Total :
Rp${total.toLocaleString()}

Silakan lanjutkan.`,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "💳 LANJUT PEMBAYARAN",
                        `checkout_${product._id}_${qty}`
                    )
                ],
                [
                    Markup.button.callback(
                        "⬅️ KEMBALI",
                        `product_${product._id}`
                    )
                ]
            ])
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    selectQty
};