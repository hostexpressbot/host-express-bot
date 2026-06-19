/**
 * ===================================
 * FILE : transactionDetail.js
 * FUNGSI :
 * - Detail transaksi user
 * - Button berdasarkan status
 * ===================================
 */

const Order =
require("../../models/Order");

const Product =
require("../../models/Product");

const { Markup } =
require("telegraf");

async function showTransactionDetail(ctx)
{
    try
    {
        const orderId =
        ctx.match[1];

        const order =
        await Order.findById(
            orderId
        );

        if (!order)
        {
            return ctx.answerCbQuery(
                "Transaksi tidak ditemukan"
            );
        }

        const product =
        await Product.findById(
            order.productId
        );

        if (!product)
        {
            return ctx.editMessageText(
`🧾 DETAIL TRANSAKSI

🆔 Invoice:
${order.invoice}

❌ Produk tidak ditemukan`
            );
        }

        let statusLabel =
        order.status;

        if (order.status === "pending")
            statusLabel = "MENUNGGU PEMBAYARAN";

        if (order.status === "paid")
            statusLabel = "MENUNGGU KONFIRMASI ADMIN";

        if (order.status === "success")
            statusLabel = "SELESAI";

        if (order.status === "cancelled")
            statusLabel = "DIBATALKAN";

        const buttons = [];

        // PENDING
        if (order.status === "pending")
        {
            buttons.push([
                Markup.button.callback(
                    "💳 LIHAT QRIS",
                    `view_qris_${order._id}`
                )
            ]);

            buttons.push([
                Markup.button.callback(
                    "❌ BATALKAN PESANAN",
                    `cancel_order_${order._id}`
                )
            ]);
        }

        // PAID
        if (order.status === "paid")
        {
            buttons.push([
                Markup.button.callback(
                    "💳 LIHAT QRIS",
                    `view_qris_${order._id}`
                )
            ]);
        }

        // SUCCESS / CANCELLED -> no action

        buttons.push([
            Markup.button.callback(
                "⬅️ KEMBALI",
                "menu_transaksi"
            )
        ]);

        await ctx.editMessageText(
`🧾 DETAIL TRANSAKSI

🆔 Invoice:
${order.invoice}

📦 Produk:
${product.name}

🔢 Qty:
${order.qty}

💰 Total:
Rp${order.total.toLocaleString()}

📌 Status:
${statusLabel}`,
            Markup.inlineKeyboard(buttons)
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    showTransactionDetail
};