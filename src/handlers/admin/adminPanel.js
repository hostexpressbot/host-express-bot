/**
 * ===================================
 * FILE : adminPanel.js
 * FUNGSI :
 * - Command /admin
 * ===================================
 */

const adminMenu =
require("../../keyboards/adminMenu");

const {
    ADMIN_ID
} = require("../../config/config");

async function adminPanel(ctx)
{
    try
    {
        if (
            ctx.from.id !== ADMIN_ID
        )
        {
            return ctx.reply(
                "⛔ Anda tidak memiliki akses."
            );
        }

   const safeEdit =
require("../../utils/safeEdit");

await safeEdit(
    ctx,
`⚙️ ADMIN PANEL

Host Express Bot`,
adminMenu()
);
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = adminPanel;