const Order =
require("../../models/Order");

const {
    ADMIN_ID
} =
require("../../config/config");

async function alreadyPaid(ctx)
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

        if (order.status === "paid")
        {
            return ctx.answerCbQuery(
                "Sudah dikonfirmasi, tunggu admin"
            );
        }

        if (order.status === "success")
        {
            return ctx.answerCbQuery(
                "Pesanan sudah selesai"
            );
        }

        if (order.status === "cancelled")
        {
            return ctx.answerCbQuery(
                "Pesanan sudah dibatalkan"
            );
        }

        order.status =
        "paid";

        await order.save();

        await ctx.telegram.sendMessage(
            ADMIN_ID,
`💰 PEMBAYARAN MASUK

🆔 Invoice:
${order.invoice}

👤 User:
${order.userId}

💰 Total:
Rp${order.total.toLocaleString()}`,
            {
                reply_markup:
                {
                    inline_keyboard:
                    [
                        [
                            {
                                text:
                                "✅ APPROVE",

                                callback_data:
                                `accept_payment_${order._id}`
                            },
                            {
                                text:
                                "❌ REJECT",

                                callback_data:
                                `reject_payment_${order._id}`
                            }
                        ]
                    ]
                }
            }
        );

        await ctx.answerCbQuery(
            "Pembayaran berhasil dikirim ke admin"
        );
    }
    catch(err)
    {
        console.error(
            "ALREADY PAID ERROR:",
            err
        );

        await ctx.answerCbQuery(
            "Terjadi kesalahan"
        );
    }
}

module.exports = {
    alreadyPaid
};