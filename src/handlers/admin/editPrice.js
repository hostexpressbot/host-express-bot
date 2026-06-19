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

async function startEditPrice(ctx)
{
    try
    {
        const products =
        await Product.find();

        const buttons = [];

        for (const product of products)
        {
            buttons.push([
                Markup.button.callback(
                    `${product.name} - Rp${product.price.toLocaleString()}`,
                    `edit_price_${product._id}`
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
            "💰 PILIH PRODUK",
            Markup.inlineKeyboard(buttons)
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

async function choosePrice(ctx)
{
    try
    {
        const productId =
        ctx.match[1];

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

        await setSession(
            ctx.from.id,
            "EDIT_PRODUCT_PRICE",
            {
                productId
            }
        );

        await ctx.reply(
`💰 UBAH HARGA

Produk:
${product.name}

Harga lama:
Rp${product.price.toLocaleString()}

Masukkan harga baru.`
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

async function handleEditPrice(ctx)
{
    const session =
    await getSession(
        ctx.from.id
    );

    if (
        !session ||
        session.mode !==
        "EDIT_PRODUCT_PRICE"
    )
    {
        return false;
    }

    try
    {
        const price =
        Number(
            ctx.message.text
        );

        if (isNaN(price))
        {
            await ctx.reply(
                "❌ Harga harus angka."
            );

            return true;
        }

        await Product.findByIdAndUpdate(
            session.data.productId,
            {
                price
            }
        );

        await clearSession(
            ctx.from.id
        );

        await ctx.reply(
`✅ HARGA BERHASIL DIUBAH

Harga baru:
Rp${price.toLocaleString()}`
        );

        return true;
    }
    catch(err)
    {
        console.error(err);
        return true;
    }
}

module.exports = {
    startEditPrice,
    choosePrice,
    handleEditPrice
};