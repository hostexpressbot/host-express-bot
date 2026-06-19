/**
 * ===================================
 * FILE : productMenu.js
 * FUNGSI :
 * - Menampilkan produk
 * - Cek transaksi aktif user
 * ===================================
 */

const Product =
require("../../models/Product");

const Order =
require("../../models/Order");

const { Markup } =
require("telegraf");

async function showProducts(ctx)
{
    try
    {
        const activeOrder =
        await Order.findOne({
            userId: ctx.from.id,
            status: {
                $in: [
                    "pending",
                    "paid"
                ]
            }
        }).sort({
            createdAt: -1
        });

        if (activeOrder)
        {
            return await ctx.editMessageText(
`⚠️ TRANSAKSI BELUM SELESAI

🆔 Invoice:
${activeOrder.invoice}

Silakan selesaikan transaksi terlebih dahulu.`,
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            "💳 LANJUTKAN PEMBAYARAN",
                            `view_qris_${activeOrder._id}`
                        )
                    ],
                    [
                        Markup.button.callback(
                            "❌ BATALKAN PESANAN",
                            `cancel_order_${activeOrder._id}`
                        )
                    ],
                    [
                        Markup.button.callback(
                            "⬅️ KEMBALI",
                            "back_main_menu"
                        )
                    ]
                ])
            );
        }

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