async function safeEdit(
    ctx,
    text,
    keyboard = {}
)
{
    try
    {
        return await ctx.editMessageText(
            text,
            keyboard
        );
    }
    catch
    {
        return await ctx.reply(
            text,
            keyboard
        );
    }
}

module.exports = safeEdit;