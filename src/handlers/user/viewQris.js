const Order =
require("../../models/Order");

const Setting =
require("../../models/Setting");

const { Markup } =
require("telegraf");

async function viewQris(ctx)
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
                "Order tidak ditemukan"
            );
        }

        if (
            order.status ===
            "success"
        )
        {
            return ctx.answerCbQuery(
                "Pesanan sudah selesai"
            );
        }

        if (
            order.status ===
            "cancelled"
        )
        {
            return ctx.answerCbQuery(
                "Pesanan telah dibatalkan"
            );
        }

        const setting =
        await Setting.findOne();

        if (
            !setting ||
            !setting.qrisImageUrl
        )
        {
            return ctx.answerCbQuery(
                "QRIS belum diatur admin"
            );
        }

        await ctx.replyWithPhoto(
            setting.qrisImageUrl,
            {
                caption:
`💳 PEMBAYARAN QRIS

🆔 Invoice:
${order.invoice}

💰 Total:
Rp${order.total.toLocaleString()}

Setelah transfer,
klik tombol di bawah.`,
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            "✅ SUDAH BAYAR",
                            `already_paid_${order._id}`
                        )
                    ],
                    [
                        Markup.button.callback(
                            "❌ BATALKAN PESANAN",
                            `cancel_order_${order._id}`
                        )
                    ]
                ])
            }
        );

        await ctx.answerCbQuery();
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    viewQris
};