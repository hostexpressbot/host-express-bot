const Order =
require("../../models/Order");

const Product =
require("../../models/Product");

const qtyKeyboard =
require("../../keyboards/qtyKeyboard");

async function cancelOrder(ctx)
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

        if (
            order.status ===
            "paid"
        )
        {
            return ctx.answerCbQuery(
                "Tidak bisa dibatalkan, pembayaran sudah dikirim"
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
                "Pesanan sudah dibatalkan"
            );
        }

        order.status =
        "cancelled";

        await order.save();

        const product =
        await Product.findById(
            order.productId
        );

        await ctx.deleteMessage()
        .catch(() => {});

        if (!product)
        {
            return await ctx.reply(
`❌ TRANSAKSI DIBATALKAN

🆔 Invoice:
${order.invoice}`
            );
        }

        await ctx.reply(
`❌ TRANSAKSI DIBATALKAN

🆔 Invoice:
${order.invoice}

📦 Produk:
${product.name}

Silakan pilih ulang jumlah pembelian.`,
            qtyKeyboard(
                product._id
            )
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    cancelOrder
};