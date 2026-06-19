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
        ] = true;

        await ctx.editMessageText(
`💳 UBAH QRIS

Kirim URL gambar QRIS baru.

Contoh:
https://domain.com/qris.jpg`
        );
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

        delete sessions[
            ctx.from.id
        ];

        await ctx.reply(
`✅ QRIS BERHASIL DIUBAH

🔗 URL:
${url}`
        );

        return adminPanel(ctx);
    }
    catch(err)
    {
        console.error(err);

        await ctx.reply(
            "❌ Gagal mengubah QRIS."
        );

        return true;
    }
}

module.exports = {
    startChangeQris,
    handleChangeQris
};