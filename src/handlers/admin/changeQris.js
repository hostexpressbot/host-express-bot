/**
 * ===================================
 * FILE : changeQris.js
 * FUNGSI :
 * - Ubah Link QRIS
 * ===================================
 */

const Setting =
require("../../models/Setting");

const adminPanel =
require("./adminPanel");

const { Markup } =
require("telegraf");

const sessions = {};

/**
 * ===================================
 * MULAI UBAH QRIS
 * ===================================
 */

async function startChangeQris(ctx)
{
    try
    {
        sessions[
            ctx.from.id
        ] =
        {
            messageId:
            ctx.callbackQuery.message.message_id
        };

        await ctx.editMessageText(
`💳 UBAH QRIS

🔗 Kirim URL QRIS baru.

Contoh:
https://domain.com/qris.jpg

━━━━━━━━━━━━━━

Atau tekan tombol
❌ BATAL untuk keluar.`,
{
    reply_markup:
    Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "❌ BATAL",
                "cancel_qris"
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

/**
 * ===================================
 * BATAL UBAH QRIS
 * ===================================
 */

async function cancelQris(ctx)
{
    try
    {
        delete sessions[
            ctx.from.id
        ];

        return adminPanel(ctx);
    }
    catch(err)
    {
        console.error(err);
    }
}

/**
 * ===================================
 * SIMPAN QRIS
 * ===================================
 */

async function handleChangeQris(ctx)
{
    if (
        !sessions[
            ctx.from.id
        ]
    )
    {
        return false;
    }

    try
    {
        const url =
        ctx.message.text.trim();

        let setting =
        await Setting.findOne();

        if (!setting)
        {
            setting =
            await Setting.create({});
        }

        setting.qrisImageUrl =
        url;

        await setting.save();

        const messageId =
        sessions[
            ctx.from.id
        ].messageId;

        delete sessions[
            ctx.from.id
        ];

        try
        {
            await ctx.deleteMessage(
                ctx.message.message_id
            );
        }
        catch {}

        await ctx.telegram.editMessageText(
            ctx.chat.id,
            messageId,
            null,

`✅ QRIS BERHASIL DIUBAH

🔗 URL QRIS:

${url}

━━━━━━━━━━━━━━

🚀 QRIS berhasil diperbarui.`,
{
    reply_markup:
    Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "🏠 ADMIN PANEL",
                "admin_panel"
            )
        ]
    ]).reply_markup
}
        );

        return true;
    }
    catch(err)
    {
        console.error(err);

        try
        {
            await ctx.reply(
                "❌ Gagal mengubah QRIS."
            );
        }
        catch {}

        return true;
    }
}

module.exports = {
    startChangeQris,
    handleChangeQris,
    cancelQris
};