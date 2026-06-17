/**
 * ===================================
 * FILE : approval.js
 * FUNGSI :
 * - Approve User
 * - Reject User
 * ===================================
 */

const User =
require("../../models/User");

/**
 * ===================================
 * BLOK : APPROVE USER
 * ===================================
 */

async function approveUser(ctx)
{
    try
    {
        const telegramId =
        Number(ctx.match[1]);

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

        user.status = "approved";

        await user.save();

        await ctx.telegram.sendMessage(
            telegramId,
            "✅ Akun Anda telah disetujui.\n\nSilakan ketik /start kembali."
        );

        await ctx.editMessageText(
            `✅ USER APPROVED\n\nID : ${telegramId}`
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

/**
 * ===================================
 * BLOK : REJECT USER
 * ===================================
 */

async function rejectUser(ctx)
{
    try
    {
        const telegramId =
        Number(ctx.match[1]);

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

        user.status = "rejected";

        await user.save();

        await ctx.telegram.sendMessage(
            telegramId,
            "❌ Pendaftaran Anda ditolak."
        );

        await ctx.editMessageText(
            `❌ USER REJECTED\n\nID : ${telegramId}`
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    approveUser,
    rejectUser
};