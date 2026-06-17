/**
 * ===================================
 * BLOK : MAIN MENU HANDLER
 * ===================================
 */

const {
    backMainMenu
} = require(
    "./handlers/user/mainMenu"
);

/**
 * ===================================
 * BLOK : APPROVAL HANDLER
 * ===================================
 */

const {
    approveUser,
    rejectUser
} =
require("./handlers/admin/approval");

/**
 * ===================================
 * BLOK : USER START HANDLER
 * FUNGSI :
 * - Menangani perintah /start
 * ===================================
 */

const startHandler =
require("./handlers/user/start");

/**
 * ===================================
 * FILE : bot.js
 * FUNGSI :
 * - Menjalankan Bot
 * - Menjalankan Express
 * ===================================
 */

const express = require("express");

const { Telegraf } = require("telegraf");

const connectMongo =
require("./database/mongodb");

const {
    BOT_TOKEN,
    PORT
} = require("./config/config");

const app = express();

if (!BOT_TOKEN)
{
    console.log("❌ BOT_TOKEN belum diisi");
    return;
}

const bot = new Telegraf(BOT_TOKEN);

(async () =>
{
    try
    {
        await connectMongo();

       /**
 * ===================================
 * BLOK : COMMAND START
 * FUNGSI :
 * - Registrasi user
 * - Approval otomatis
 * ===================================
 */

bot.start(startHandler);
/**
 * ===================================
 * BLOK : APPROVE ACTION
 * ===================================
 */

bot.action(
    /approve_(\d+)/,
    approveUser
);

/**
 * ===================================
 * BLOK : REJECT ACTION
 * ===================================
 */

bot.action(
    /reject_(\d+)/,
    rejectUser
);
/**
 * ===================================
 * BLOK : BACK TO MAIN MENU
 * ===================================
 */

bot.action(
    "back_main_menu",
    backMainMenu
);

        await bot.launch();

        app.get("/", (req, res) =>
        {
            res.send("Host Express Bot Running");
        });

        app.listen(PORT, () =>
        {
            console.log(
                `🌐 Server Running : ${PORT}`
            );
        });

        console.log(
            "🤖 Telegram Bot Running"
        );
    }
    catch(err)
    {
        console.error(err);
    }
})();