/**
 * ===================================
 * FILE : stopKeyboard.js
 * FUNGSI :
 * - Tombol stop session
 * ===================================
 */

const { Markup } =
require("telegraf");

function stopKeyboard()
{
    return Markup.inlineKeyboard([
        [
            Markup.button.callback(
                "🛑 STOP",
                "stop_session"
            )
        ]
    ]);
}

module.exports =
stopKeyboard;