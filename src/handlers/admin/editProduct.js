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

async function startEditProduct(ctx)
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
                    product.name,
                    `edit_product_${product._id}`
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
            "✏️ PILIH PRODUK",
            Markup.inlineKeyboard(buttons)
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

async function chooseEditProduct(ctx)
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
            "EDIT_PRODUCT_NAME",
            {
                productId
            }
        );

        await ctx.reply(
`✏️ UBAH NAMA PRODUK

Nama lama:
${product.name}

Ketik nama baru.`
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

async function handleEditProduct(ctx)
{
    const session =
    await getSession(
        ctx.from.id
    );

    if (
        !session ||
        session.mode !==
        "EDIT_PRODUCT_NAME"
    )
    {
        return false;
    }

    try
    {
        const newName =
        ctx.message.text;

        await Product.findByIdAndUpdate(
            session.data.productId,
            {
                name: newName
            }
        );

        await clearSession(
            ctx.from.id
        );

        await ctx.reply(
`✅ NAMA PRODUK BERHASIL DIUBAH

Nama baru:
${newName}`
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
    startEditProduct,
    chooseEditProduct,
    handleEditProduct
};