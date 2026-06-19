/**
 * ===================================
 * FILE : stockManager.js
 * ===================================
 */

const Product =
require("../../models/Product");

const Stock =
require("../../models/Stock");

const { Markup } =
require("telegraf");

/**
 * ===================================
 * PILIH PRODUK
 * ===================================
 */

async function showStockProducts(ctx)
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
                product.name,
                `stock_${product._id}`
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
        "📦 PILIH PRODUK",
        Markup.inlineKeyboard(
            buttons
        )
    );
}

/**
 * ===================================
 * DETAIL STOCK
 * ===================================
 */

async function showStockDetail(ctx)
{
    const productId =
    ctx.match[1];

    const product =
    await Product.findById(
        productId
    );

    const stockCount =
    await Stock.countDocuments({
        productId,
        sold: false
    });

    await ctx.editMessageText(
`📦 ${product.name}

📊 Stock tersedia:
${stockCount}

Pilih aksi.`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "🗑 HAPUS SEMUA STOCK",
                    `delete_stock_${product._id}`
                )
            ],
            [
                Markup.button.callback(
                    "⬅️ KEMBALI",
                    "admin_delete_stock"
                )
            ]
        ])
    );
}

/**
 * ===================================
 * HAPUS SEMUA STOCK
 * ===================================
 */

async function deleteAllStock(ctx)
{
    try
    {
        const productId =
        ctx.match[1];

        const product =
        await Product.findById(
            productId
        );

        await Stock.deleteMany({
            productId
        });

        await ctx.editMessageText(
`✅ STOCK BERHASIL DIHAPUS

📦 Produk:
${product.name}`
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    showStockProducts,
    showStockDetail,
    deleteAllStock
};