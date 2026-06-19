const Order =
require("../../models/Order");

const Stock =
require("../../models/Stock");

const Product =
require("../../models/Product");

async function acceptPayment(ctx)
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
                "Order sudah selesai"
            );
        }

        const product =
        await Product.findById(
            order.productId
        );

        const accounts = [];

        for (
            let i = 0;
            i < order.qty;
            i++
        )
        {
            const stock =
            await Stock.findOneAndUpdate(
                {
                    productId:
                    order.productId,

                    sold: false
                },
                {
                    $set: {
                        sold: true
                    }
                },
                {
                    sort: {
                        createdAt: 1
                    },
                    new: true
                }
            );

            if (!stock)
            {
                return ctx.answerCbQuery(
                    "Stock tidak cukup"
                );
            }

            accounts.push(
                stock.data
            );
        }

        order.status =
        "success";

        await order.save();

        await ctx.editMessageText(
`✅ PEMBAYARAN DISETUJUI

🆔 Invoice:
${order.invoice}

📦 Produk:
${product.name}

Status:
SUCCESS`
        );

let accountList = "";

accounts.forEach(
    (account, index) =>
    {
        accountList +=
`🔹 AKUN ${index + 1}

${account}

━━━━━━━━━━━━━━

`;
    }
);

await ctx.telegram.sendMessage(
    order.userId,

`🎉 PESANAN BERHASIL

🆔 Invoice :
${order.invoice}

📦 Produk :
${product.name}

━━━━━━━━━━━━━━

${accountList}

🚀 HOST EXPRESS BOT`
);
    }
    catch(err)
    {
        console.error(err);
    }
}

async function rejectPayment(ctx)
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
                "Order sudah selesai"
            );
        }

        order.status =
        "pending";

        await order.save();

        await ctx.editMessageText(
`❌ PEMBAYARAN DITOLAK

🆔 Invoice:
${order.invoice}

Status:
PENDING`
        );

        await ctx.telegram.sendMessage(
            order.userId,

`❌ PEMBAYARAN DITOLAK

🆔 Invoice:
${order.invoice}

Silakan cek kembali pembayaran Anda.`
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    acceptPayment,
    rejectPayment
};