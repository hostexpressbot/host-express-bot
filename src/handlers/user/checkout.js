/**
 * ===================================
 * FILE : checkout.js
 * FUNGSI :
 * - Validasi stock sebelum checkout
 * ===================================
 */

const Product =
require("../../models/Product");

const Stock =
require("../../models/Stock");

const { Markup } =
require("telegraf");

async function checkout(ctx)
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
            availableStock < qty
        )
        {
            return await ctx.editMessageText(
`❌ STOCK TIDAK MENCUKUPI

📦 Produk :
${product.name}

📦 Stock tersedia :
${availableStock}

🛒 Qty diminta :
${qty}`,
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            "⬅️ KEMBALI",
                            `product_${product._id}`
                        )
                    ]
                ])
            );
        }

        const total =
        product.price * qty;

        await ctx.editMessageText(
`✅ STOCK TERSEDIA

📦 Produk :
${product.name}

🔢 Qty :
${qty}

💰 Total :
Rp${total.toLocaleString()}

Lanjut ke pembayaran?`,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "💳 BAYAR",
                        `pay_${product._id}_${qty}`
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
    checkout
};