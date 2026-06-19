/**
 * ===================================
 * FILE : restock.js
 * ===================================
 */

const Product =
require("../../models/Product");

const User =
require("../../models/User");

const adminPanel =
require("./adminPanel");

const Stock =
require("../../models/Stock");

const {
    setSession,
    getSession,
    clearSession
} =
require("../../utils/sessionManager");

const stopKeyboard =
require("../../keyboards/stopKeyboard");

const { Markup } =
require("telegraf");

/**
 * ===================================
 * PILIH PRODUK
 * ===================================
 */

async function startRestock(ctx)
{
    const products =
    await Product.find({
        active: true
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
                product.name,
                `restock_${product._id}`
            )
        ]);
    }

    buttons.push([
        Markup.button.callback(
    "⬅️ KEMBALI",
    "admin_panel"
)
    ]);

    await ctx.editMessageText(
        "📦 PILIH PRODUK UNTUK RESTOCK",
        Markup.inlineKeyboard(
            buttons
        )
    );
}

/**
 * ===================================
 * MULAI RESTOCK
 * ===================================
 */

async function chooseProduct(ctx)
{
    const productId =
    ctx.match[1];

   await setSession(
    ctx.from.id,
    "RESTOCK",
    {
        productId,
        count: 0,
        panelMessageId:
        ctx.callbackQuery.message.message_id
    }
);

 await ctx.editMessageText(
`📦 RESTOCK MODE

📦 Produk:
Loading...

📚 Ditambahkan:
0 Akun

━━━━━━━━━━━━━━

Kirim stock satu per satu.

Contoh:

email@gmail.com|password`,
{
    reply_markup:
    Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "✅ SELESAI",
                "finish_restock"
            )
        ],
        [
            Markup.button.callback(
                "🛑 STOP",
                "stop_session"
            )
        ]
    ]).reply_markup
}
);

}

/**
 * ===================================
 * INPUT STOCK
 * ===================================
 */

async function handleRestock(ctx)
{
    const session =
    await getSession(
        ctx.from.id
    );

    if (
        !session
    )
    {
        return false;
    }

    if (
        session.mode !==
        "RESTOCK"
    )
    {
        return false;
    }

    await Stock.create({
    productId:
    session.data.productId,

    data:
    ctx.message.text
});

const newCount =
(session.data.count || 0) + 1;

await setSession(
    ctx.from.id,
    "RESTOCK",
    {
        productId:
        session.data.productId,

        count:
        newCount,

        panelMessageId:
        session.data.panelMessageId
    }
);

try
{
    await ctx.deleteMessage(
        ctx.message.message_id
    );
}
catch {}

const product =
await Product.findById(
    session.data.productId
);

await ctx.telegram.editMessageText(
    ctx.chat.id,
    session.data.panelMessageId,
    null,

`📦 RESTOCK MODE

📦 Produk:
${product.name}

📚 Ditambahkan:
${newCount} Akun

━━━━━━━━━━━━━━

Kirim stock satu per satu.

Contoh:

email@gmail.com|password`,
{
    reply_markup:
    Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "✅ SELESAI",
                "finish_restock"
            )
        ],
        [
            Markup.button.callback(
                "🛑 STOP",
                "stop_session"
            )
        ]
    ]).reply_markup
}
);

    return true;
}


async function finishRestock(ctx)
{
    try
    {
        const session =
        await getSession(
            ctx.from.id
        );

        if (
            !session ||
            session.mode !==
            "RESTOCK"
        )
        {
            return ctx.answerCbQuery(
                "Tidak ada sesi restock"
            );
        }

        const product =
        await Product.findById(
            session.data.productId
        );

        const {
    ADMIN_ID
} =
require("../../config/config");

const users =
await User.find({
    status: "approved",
    telegramId: {
        $ne: Number(ADMIN_ID)
    }
});
for (const user of users)
{
    if (
        String(user.telegramId) ===
        String(ADMIN_ID)
    )
    {
        continue;
    }

    try
    {
        await ctx.telegram.sendMessage(
            user.telegramId,

`📢 STOCK MASUK!

📦 ${product.name}

📚 +${session.data.count} Stock Baru

━━━━━━━━━━━━━━

🔥 READY ORDER
⚡ Auto Delivery
💎 Premium Service

Jangan sampai kehabisan.`,
                    {
                        reply_markup:
                        {
                            inline_keyboard:
                            [
                                [
                                    {
                                        text:
                                        "🛒 ORDER SEKARANG",

                                        callback_data:
                                        `product_${product._id}`
                                    }
                                ]
                            ]
                        }
                    }
                );
            }
            catch {}
        }

        await clearSession(
            ctx.from.id
        );

        await ctx.editMessageText(
`✅ RESTOCK BERHASIL

📦 ${product.name}

📚 +${session.data.count} Stock Baru

📢 Notifikasi berhasil
dikirim ke user.`,
{
    reply_markup:
    {
        inline_keyboard:
        [
            [
                {
                    text:
                    "🏠 ADMIN PANEL",

                    callback_data:
                    "admin_panel"
                }
            ]
        ]
    }
}
        );
    }
    catch(err)
    {
        console.error(err);
    }
}
/**
 * ===================================
 * STOP SESSION
 * ===================================
 */

async function stopSession(ctx)
{
    try
    {
        await clearSession(
            ctx.from.id
        );

        await ctx.answerCbQuery(
            "Dibatalkan"
        );

        try
        {
            await ctx.deleteMessage();
        }
        catch(e)
        {
        }

        return adminPanel(ctx);
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    startRestock,
    chooseProduct,
    handleRestock,
    finishRestock,
    stopSession
};