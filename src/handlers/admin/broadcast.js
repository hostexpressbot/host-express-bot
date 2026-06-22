const User =
require("../../models/User");

const {
    setSession,
    getSession,
    clearSession
} =
require("../../utils/sessionManager");

const { Markup } =
require("telegraf");

async function startBroadcast(ctx)
{
    try
    {
      
        await setSession(
    ctx.from.id,
    "BROADCAST",
    {
        panelMessageId:
        ctx.callbackQuery.message.message_id
    }
);

        await ctx.editMessageText(
`📢 BROADCAST

Kirim pesan yang ingin disebarkan ke seluruh user.

Tekan batal jika tidak jadi.`,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "❌ BATAL",
                        "admin_panel"
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

async function handleBroadcast(ctx)
{
    const session =
    await getSession(
        ctx.from.id
    );

    if (
        !session ||
        session.mode !==
        "BROADCAST"
    )
    {
        return false;
    }

    try
    {
        const message =
        ctx.message.text;

        const {
    ADMIN_ID
} =
require("../../config/config");

const users =
await User.find({
    telegramId: {
        $ne: ADMIN_ID
    }
});

        let success = 0;

        for (const user of users)
        {
            try
            {
                await ctx.telegram.sendMessage(
                    user.telegramId,
                    `📢 PENGUMUMAN

${message}`
                );

                success++;
            }
            catch(err)
            {
                console.log(
                    `Gagal kirim ke ${user.telegramId}`
                );
            }
        }

        await clearSession(
            ctx.from.id
        );
try
{
    await ctx.deleteMessage(
        ctx.message.message_id
    );
}
catch {}

await clearSession(
    ctx.from.id
);

await ctx.telegram.editMessageText(
    ctx.chat.id,
    session.data.panelMessageId,
    null,

`✅ BROADCAST SELESAI

📨 Berhasil terkirim:
${success} user`,
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
        return true;
    }
}

module.exports = {
    startBroadcast,
    handleBroadcast
};