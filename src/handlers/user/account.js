/**
 * ===================================
 * FILE : account.js
 * FUNGSI :
 * - Menampilkan profil user
 * ===================================
 */

const User =
require("../../models/User");

const Order =
require("../../models/Order");

const { Markup } =
require("telegraf");

async function showAccount(ctx)
{
    try
    {
        const telegramId =
        ctx.from.id;

        const user =
        await User.findOne({
            telegramId
        });

        if (!user)
        {
            return ctx.answerCbQuery(
                "User tidak ditemukan"
            );
        }

        const totalOrder =
        await Order.countDocuments({
            userId:
            telegramId
        });

        const successOrder =
        await Order.countDocuments({
            userId:
            telegramId,

            status:
            "success"
        });

        const activeOrder =
        await Order.countDocuments({
            userId:
            telegramId,

            status: {
                $in: [
                    "pending",
                    "paid"
                ]
            }
        });

        await ctx.editMessageText(
`┏━━━━━━━━━━━━━━━━━━┓
      👤 PROFILE
┗━━━━━━━━━━━━━━━━━━┛

👤 ${user.firstName}

🟢 VERIFIED MEMBER

🆔 ${telegramId}

━━━━━━━━━━━━━━━━━━

📦 Total Order   : ${totalOrder}
✅ Success Order : ${successOrder}
⏳ Active Order  : ${activeOrder}

━━━━━━━━━━━━━━━━━━

🚀 HOST EXPRESS BOT
💎 Premium Member`,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "🏠 MENU UTAMA",
                        "back_main_menu"
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

module.exports = {
    showAccount
};