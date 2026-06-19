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
        "ADD_PRODUCT_NAME"
    );

    await ctx.reply(
`➕ TAMBAH PRODUK

Masukkan nama produk baru.`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "❌ BATAL",
                    "stop_session"
                )
            ]
        ])
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

    if (
        session.mode ===
        "ADD_PRODUCT_NAME"
    )
    {
        await setSession(
            ctx.from.id,
            "ADD_PRODUCT_PRICE",
            {
                name:
                ctx.message.text
            }
        );

        await ctx.reply(
`💰 MASUKKAN HARGA PRODUK

Contoh:
25000`,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "❌ BATAL",
                        "admin_panel"
                    )
                ]
            ])
        );

        return true;
    }

    if (
        session.mode ===
        "ADD_PRODUCT_PRICE"
    )
    {
        const price =
        Number(
            ctx.message.text
        );

        if (
            isNaN(price)
        )
        {
            await ctx.reply(
                "❌ Harga harus berupa angka."
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

        await ctx.reply(
`✅ PRODUK BERHASIL DIBUAT

📦 Nama:
${session.data.name}

💰 Harga:
Rp${price.toLocaleString()}`
        );

        return true;
    }

    return false;
}

module.exports = {
    startAddProduct,
    handleAddProduct
};