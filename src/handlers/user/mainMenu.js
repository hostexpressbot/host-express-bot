/**
 * ===================================
 * FILE : mainMenu.js
 * FUNGSI :
 * - Handler menu utama
 * ===================================
 */

const mainMenu =
require("../../keyboards/mainMenu");

/**
 * ===================================
 * BLOK : KEMBALI KE MENU UTAMA
 * ===================================
 */

async function backMainMenu(ctx)
{
    try
    {
        await ctx.editMessageText(
`🏪 Host Express Bot

Silakan pilih menu di bawah.`,
            mainMenu()
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    backMainMenu
};