const User =
require("../../models/User");

const Product =
require("../../models/Product");

const Stock =
require("../../models/Stock");

const Order =
require("../../models/Order");

const { Markup } =
require("telegraf");

async function showDashboard(ctx)
{
    try
    {
        const totalUser =
        await User.countDocuments();

        const totalProduct =
        await Product.countDocuments();

        const totalStock =
        await Stock.countDocuments({
            sold: false
        });

        const totalOrder =
        await Order.countDocuments();

        await ctx.editMessageText(
`📊 DASHBOARD

👥 ${totalUser} User
📦 ${totalProduct} Produk
📚 ${totalStock} Stock
💰 ${totalOrder} Order

🚀 Host Express Bot`,
{
    reply_markup:
    Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "⬅️ KEMBALI",
                "admin_panel"
            )
        ]
    ]).reply_markup
}
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    showDashboard
};