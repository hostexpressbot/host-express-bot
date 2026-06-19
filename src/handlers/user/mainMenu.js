/**
 * ===================================
 * FILE : mainMenu.js
 * FUNGSI :
 * - Halaman utama user
 * ===================================
 */

const Product =
require("../../models/Product");

const Stock =
require("../../models/Stock");

const { Markup } =
require("telegraf");

async function renderHome(ctx)
{
    const products =
    await Product.find({
        active: true
    }).sort({
        createdAt: 1
    });

    let text =
`🚀 HOST EXPRESS BOT

╔════════════════════╗
      🔥 STORE ONLINE 🔥
╚════════════════════╝

📦 PRODUK TERSEDIA

`;

    const buttons = [];

    let row = [];

    for (
        let i = 0;
        i < products.length;
        i++
    )
    {
        const product =
        products[i];

        const stock =
        await Stock.countDocuments({
            productId:
            product._id,

            sold: false
        });

        text +=
`${i + 1}️⃣ ${product.name}
┣ 💰 Rp${product.price.toLocaleString()}
┗ 📦 Stock : ${stock}

━━━━━━━━━━━━━━━━━━

`;

        const nums =
        [
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣",
            "5️⃣",
            "6️⃣",
            "7️⃣",
            "8️⃣",
            "9️⃣",
            "🔟"
        ];

        row.push(
            Markup.button.callback(
                nums[i] ||
                `${i + 1}`,
                `product_${product._id}`
            )
        );

        if (
            row.length === 3
        )
        {
            buttons.push(row);
            row = [];
        }
    }

    if (row.length)
    {
        buttons.push(row);
    }

    text +=
`⚡ AUTO DELIVERY
⚡ STOCK REALTIME
⚡ PEMBAYARAN OTOMATIS

👇 PILIH NOMOR PRODUK 👇`;

    buttons.push([
        Markup.button.callback(
            "📄 TRANSAKSI SAYA",
            "menu_transaksi"
        )
    ]);

    return {
        text,
        keyboard:
        Markup.inlineKeyboard(
            buttons
        )
    };
}

async function backMainMenu(ctx)
{
    try
    {
        const home =
        await renderHome(ctx);

        await ctx.editMessageText(
            home.text,
            home.keyboard
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    backMainMenu,
    renderHome
};