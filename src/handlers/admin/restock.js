/**
 * ===================================
 * FILE : restock.js
 * ===================================
 */

const Product =
require("../../models/Product");

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
            "back_main_menu"
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
            productId
        }
    );

    await ctx.reply(
`📦 MODE RESTOCK AKTIF

Kirim stock satu per satu.

Contoh:

email@gmail.com|password

atau

akun1

Ketik terus sebanyak yang diinginkan.`,
        stopKeyboard()
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

    await ctx.reply(
        "✅ Stock berhasil ditambahkan",
        stopKeyboard()
    );

    return true;
}

/**
 * ===================================
 * STOP SESSION
 * ===================================
 */

async function stopSession(ctx)
{
    await clearSession(
        ctx.from.id
    );

    await ctx.editMessageText(
`✅ MODE RESTOCK DIHENTIKAN`
    );
}

module.exports = {
    startRestock,
    chooseProduct,
    handleRestock,
    stopSession
};