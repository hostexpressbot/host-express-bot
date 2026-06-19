/**
 * ===================================
 * FILE : addProduct.js
 * FUNGSI :
 * - Tambah Produk
 * ===================================
 */

const Product =
require("../../models/Product");

const {
    setSession,
    getSession,
    clearSession
} =
require("../../utils/sessionManager");

const { Markup } =
require("telegraf");

async function startAddProduct(ctx)
{
    await clearSession(
        ctx.from.id
    );

    await setSession(
        ctx.from.id,
        "ADD_PRODUCT_NAME",
        {
            panelMessageId:
            ctx.callbackQuery.message.message_id
        }
    );

    await ctx.editMessageText(
`➕ TAMBAH PRODUK

📦 Masukkan nama produk baru.

━━━━━━━━━━━━━━

Contoh:
AWS 5V NO GARANSI`,
{
    reply_markup:
    Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "❌ BATAL",
                "stop_session"
            )
        ]
    ]).reply_markup
}
    );
}

async function handleAddProduct(ctx)
{
    const session =
    await getSession(
        ctx.from.id
    );

    if (!session)
    {
        return false;
    }

    /**
     * ===============================
     * INPUT NAMA PRODUK
     * ===============================
     */

    if (
        session.mode ===
        "ADD_PRODUCT_NAME"
    )
    {
        try
        {
            await ctx.deleteMessage(
                ctx.message.message_id
            );
        }
        catch {}

        await setSession(
            ctx.from.id,
            "ADD_PRODUCT_PRICE",
            {
                name:
                ctx.message.text,

                panelMessageId:
                session.data.panelMessageId
            }
        );

        await ctx.telegram.editMessageText(
            ctx.chat.id,
            session.data.panelMessageId,
            null,

`💰 INPUT HARGA PRODUK

📦 Produk :
${ctx.message.text}

━━━━━━━━━━━━━━

💵 Masukkan harga produk

Contoh:
25000

⚠️ Tanpa titik atau koma`,
{
    reply_markup:
    Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "❌ BATAL",
                "stop_session"
            )
        ]
    ]).reply_markup
}
        );

        return true;
    }

    /**
     * ===============================
     * INPUT HARGA PRODUK
     * ===============================
     */

    if (
        session.mode ===
        "ADD_PRODUCT_PRICE"
    )
    {
        try
        {
            await ctx.deleteMessage(
                ctx.message.message_id
            );
        }
        catch {}

        const price =
        Number(
            ctx.message.text
        );

        if (
            isNaN(price)
        )
        {
            await ctx.telegram.editMessageText(
                ctx.chat.id,
                session.data.panelMessageId,
                null,

`❌ HARGA TIDAK VALID

📦 Produk :
${session.data.name}

━━━━━━━━━━━━━━

Masukkan angka saja.

Contoh:
25000`,
{
    reply_markup:
    Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "❌ BATAL",
                "stop_session"
            )
        ]
    ]).reply_markup
}
            );

            return true;
        }

        await Product.create({
            name:
            session.data.name,

            price
        });

        await clearSession(
            ctx.from.id
        );

        await ctx.telegram.editMessageText(
            ctx.chat.id,
            session.data.panelMessageId,
            null,

`✅ PRODUK BERHASIL DIBUAT

📦 Nama :
${session.data.name}

💰 Harga :
Rp${price.toLocaleString()}

🚀 Produk sudah tampil
di menu user`,
{
    reply_markup:
    Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "🏠 ADMIN PANEL",
                "admin_panel"
            )
        ]
    ]).reply_markup
}
        );

        return true;
    }

    return false;
}

module.exports = {
    startAddProduct,
    handleAddProduct
};