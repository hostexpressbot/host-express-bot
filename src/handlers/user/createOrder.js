const Product =
require("../../models/Product");

const Order =
require("../../models/Order");

const { Markup } =
require("telegraf");

async function createOrder(ctx)
{
    try
    {
        const productId =
        ctx.match[1];

        const qty =
        Number(ctx.match[2]);

        const existing =
        await Order.findOne({
            userId: ctx.from.id,
            status: {
                $in: [
                    "pending",
                    "paid"
                ]
            }
        });

        if (existing)
        {
            return ctx.answerCbQuery(
                "Selesaikan transaksi sebelumnya dulu"
            );
        }

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

        const total =
        product.price * qty;

        const invoice =
        "INV-" + Date.now();

        const order =
        await Order.create({
            invoice,
            userId:
            ctx.from.id,
            productId,
            qty,
            total,
            status:
            "pending"
        });

        await ctx.editMessageText(
`🧾 INVOICE

🆔 ${invoice}

📦 ${product.name}

🔢 Qty:
${qty}

💰 Total:
Rp${total.toLocaleString()}

Status:
PENDING`,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "💳 BAYAR",
                        `view_qris_${order._id}`
                    )
                ],
                [
                    Markup.button.callback(
                        "❌ BATALKAN",
                        `cancel_order_${order._id}`
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
    createOrder
};