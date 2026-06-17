const Product =
require("../../models/Product");

const Order =
require("../../models/Order");

const { Markup } =
require("telegraf");

async function createOrder(ctx)
{
    console.log("=== CREATE ORDER CALLED ===");
    console.log(ctx.callbackQuery.data);

    try
    {
        const productId =
        ctx.match[1];

        const qty =
        Number(ctx.match[2]);

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

        await Order.create({
            invoice,
            userId: ctx.from.id,
            productId,
            qty,
            total,
            status: "pending"
        });

        await ctx.editMessageText(
`🧾 INVOICE BERHASIL DIBUAT

🆔 ${invoice}

📦 ${product.name}

🔢 Qty : ${qty}

💰 Total :
Rp${total.toLocaleString()}

Status : PENDING`,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "💳 BAYAR",
                        `payment_${invoice}`
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