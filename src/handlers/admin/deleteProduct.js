const Product =
require("../../models/Product");

const Stock =
require("../../models/Stock");

const { Markup } =
require("telegraf");

/**
 * STEP 1 - LIST PRODUK
 */
async function startDeleteProduct(ctx)
{
    try
    {
        const products =
        await Product.find({
            active: true
        });

        const buttons = [];

        for (const product of products)
        {
            buttons.push([
                Markup.button.callback(
                    `❌ ${product.name}`,
                    `delprod_${product._id}`
                )
            ]);
        }

        buttons.push([
    Markup.button.callback(
        "⬅️ KEMBALI",
        "admin_panel"
    )
]);

        return ctx.editMessageText(
            "🗑 PILIH PRODUK YANG AKAN DIHAPUS",
            Markup.inlineKeyboard(buttons)
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

/**
 * STEP 2 - KONFIRMASI
 */
async function confirmDeleteProduct(ctx)
{
    try
    {
        const productId =
        ctx.match[1];

        const product =
        await Product.findById(productId);

        if (!product)
        {
            return ctx.answerCbQuery(
                "Produk tidak ditemukan"
            );
        }

        return ctx.editMessageText(
`⚠️ KONFIRMASI HAPUS

Produk:
${product.name}

⚠️ Semua stock juga akan dihapus`,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "❌ YA HAPUS",
                        `confirm_del_${product._id}`
                    )
                ],
                [
                   Markup.button.callback(
    "⬅️ KEMBALI",
    "admin_panel"
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

/**
 * STEP 3 - EKSEKUSI HAPUS
 */
async function executeDeleteProduct(ctx)
{
    try
    {
        const productId =
        ctx.match[1];

        const product =
        await Product.findById(productId);

        if (!product)
        {
            return ctx.answerCbQuery(
                "Produk tidak ditemukan"
            );
        }

        // hapus stock
        await Stock.deleteMany({
            productId
        });

        // hapus product
        await Product.findByIdAndDelete(
            productId
        );

        return ctx.editMessageText(
`✅ PRODUK BERHASIL DIHAPUS

Nama:
${product.name}

📦 Stock juga ikut dihapus`
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    startDeleteProduct,
    confirmDeleteProduct,
    executeDeleteProduct
};