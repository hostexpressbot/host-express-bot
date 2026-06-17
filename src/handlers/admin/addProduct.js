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
} = require("../../utils/sessionManager");

async function startAddProduct(ctx)
{
    await setSession(
        ctx.from.id,
        "ADD_PRODUCT_NAME"
    );

    await ctx.reply(
`➕ TAMBAH PRODUK

Masukkan nama produk.

Contoh:
AWS 5V

Ketik /cancel untuk batal.`
    );
}

async function handleAddProduct(ctx)
{
    const session =
    await getSession(
        ctx.from.id
    );

    if (!session) return false;

    if (
        session.mode ===
        "ADD_PRODUCT_NAME"
    )
    {
        await setSession(
            ctx.from.id,
            "ADD_PRODUCT_PRICE",
            {
                name: ctx.message.text
            }
        );

        await ctx.reply(
`💰 Masukkan harga produk

Contoh:
25000`
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
                "❌ Harga harus angka."
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
`✅ Produk berhasil dibuat

📦 ${session.data.name}
💰 Rp${price.toLocaleString()}`
        );

        return true;
    }

    return false;
}

module.exports = {
    startAddProduct,
    handleAddProduct
};