/**
 * ===================================
 * FILE : start.js
 * FUNGSI :
 * - Registrasi user baru
 * - Approval otomatis
 * ===================================
 */

const User =
require("../../models/User");

const { ADMIN_ID } =
require("../../config/config");

const { Markup } =
require("telegraf");

module.exports =
async (ctx) =>
{
    try
    {
        const telegramId =
        ctx.from.id;

        let user =
        await User.findOne({
            telegramId
        });

        console.log("LOGIN:", telegramId);
console.log("USER:", user);

        if (!user)
        {
            user =
            await User.create({
                telegramId,
                firstName:
                ctx.from.first_name || "",

                username:
                ctx.from.username || ""
            });
            console.log("USER BERHASIL DIBUAT");
            console.log(user);
            console.log("ADMIN ID:", ADMIN_ID);

           try
{
    await ctx.telegram.sendMessage(
        ADMIN_ID,

`🔔 USER BARU

👤 Nama : ${user.firstName}

📛 Username : @${user.username || "-"}

🆔 ID : ${user.telegramId}

Status : Pending Approval`,

        Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "✅ APPROVE",
                    `approve_${user.telegramId}`
                )
            ],
            [
                Markup.button.callback(
                    "❌ REJECT",
                    `reject_${user.telegramId}`
                )
            ]
        ])
    );

    console.log("NOTIF ADMIN BERHASIL");
}
catch(error)
{
    console.log("ERROR KIRIM ADMIN:");
    console.log(error);
}
        }

        if (
            user.status === "pending"
        )
        {
            return ctx.reply(
                "⏳ Akun Anda sedang menunggu persetujuan admin."
            );
        }

        if (
            user.status === "rejected"
        )
        {
            return ctx.reply(
                "❌ Pendaftaran Anda ditolak."
            );
        }

        return ctx.reply(
            "✅ Selamat datang di Host Express Bot"
        );
    }
    catch(err)
    {
        console.error(err);
    }
};