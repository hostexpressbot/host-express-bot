const User =
require("../../models/User");

const Product =
require("../../models/Product");

const Stock =
require("../../models/Stock");

const Order =
require("../../models/Order");

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

        const successOrder =
        await Order.countDocuments({
            status: "success"
        });

        const pendingOrder =
        await Order.countDocuments({
            status: "pending"
        });

        const cancelledOrder =
        await Order.countDocuments({
            status: "cancelled"
        });

        await ctx.reply(
`📊 DASHBOARD

👥 User      : ${totalUser}

📦 Produk    : ${totalProduct}

📚 Stock     : ${totalStock}

💰 Order     : ${totalOrder}

✅ Success   : ${successOrder}

⏳ Pending   : ${pendingOrder}

❌ Cancelled : ${cancelledOrder}`
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