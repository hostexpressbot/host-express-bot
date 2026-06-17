/**
 * ===================================
 * FILE : productDetail.js
 * FUNGSI :
 * - Detail Produk
 * ===================================
 */

const Product =
require("../../models/Product");

const qtyKeyboard =
require("../../keyboards/qtyKeyboard");

async function showProductDetail(ctx)
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

        await ctx.editMessageText(
`📦 ${product.name}

💰 Harga:
Rp${product.price.toLocaleString()}

Pilih jumlah pembelian.`,
            qtyKeyboard(product._id)
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    showProductDetail
};