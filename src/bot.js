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

const connectMongo = require("./database/mongodb");

const {
    BOT_TOKEN,
    PORT
} = require("./config/config");

/**
 * ===================================
 * USER HANDLERS
 * ===================================
 */

const startHandler =
require("./handlers/user/start");

const {
    backMainMenu
} = require("./handlers/user/mainMenu");

/**
 * ===================================
 * ADMIN HANDLERS
 * ===================================
 */

const adminPanel =
require("./handlers/admin/adminPanel");

const {
    approveUser,
    rejectUser
} = require("./handlers/admin/approval");

const {
    startAddProduct,
    handleAddProduct
} = require("./handlers/admin/addProduct");

const {
    startRestock,
    chooseProduct,
    handleRestock,
    stopSession
} =
require(
"./handlers/admin/restock"
);

/**
 * ===================================
 * APP & BOT
 * ===================================
 */

const app = express();

if (!BOT_TOKEN)
{
    console.log("❌ BOT_TOKEN belum diisi");
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

/**
 * ===================================
 * PRODUCT MENU
 * ===================================
 */

const {
    showProducts
} =
require(
"./handlers/user/productMenu"
);

/**
 * ===================================
 * PRODUCT DETAIL
 * ===================================
 */

const {
    showProductDetail
} =
require(
"./handlers/user/productDetail"
);

/**
 * ===================================
 * SELECT QTY
 * ===================================
 */

const {
    selectQty
} =
require(
"./handlers/user/selectQty"
);

/**
 * ===================================
 * CHECKOUT
 * ===================================
 */

const {
    checkout
} =
require(
"./handlers/user/checkout"
);

/**
 * ===================================
 * START SYSTEM
 * ===================================
 */

(async () =>
{
    try
    {
        await connectMongo();

        /**
         * ===================================
         * COMMANDS
         * ===================================
         */

        bot.start(startHandler);

        bot.command(
            "admin",
            adminPanel
        );

        /**
         * ===================================
         * USER ACTIONS
         * ===================================
         */

        bot.action(
            "back_main_menu",
            backMainMenu
        );

        /**
 * ===================================
 * MENU PRODUK
 * ===================================
 */

bot.action(
    "menu_produk",
    showProducts
);

/**
 * ===================================
 * DETAIL PRODUK
 * ===================================
 */

bot.action(
    /product_(.+)/,
    showProductDetail
);

/**
 * ===================================
 * SELECT QTY
 * ===================================
 */

bot.action(
    /qty_(.+)_(\d+)/,
    selectQty
);

/**
 * ===================================
 * CHECKOUT
 * ===================================
 */

bot.action(
    /checkout_(.+)_(\d+)/,
    checkout
);


        /**
         * ===================================
         * APPROVAL ACTIONS
         * ===================================
         */

        bot.action(
            /approve_(\d+)/,
            approveUser
        );

        bot.action(
            /reject_(\d+)/,
            rejectUser
        );



        /**
         * ===================================
         * ADMIN PRODUCT ACTIONS
         * ===================================
         */

        bot.action(
            "admin_add_product",
            startAddProduct
        );

        bot.action(
    "admin_restock",
    startRestock
);

bot.action(
    /restock_(.+)/,
    chooseProduct
);

bot.action(
    "stop_session",
    stopSession
);


 /**
 * ===================================
 * TEXT HANDLER
 * ===================================
 */

bot.on(
    "text",
    async (ctx, next) =>
    {
        const addProductHandled =
        await handleAddProduct(
            ctx
        );

        if (addProductHandled)
        {
            return;
        }

        const restockHandled =
        await handleRestock(
            ctx
        );

        if (restockHandled)
        {
            return;
        }

        return next();
    }
);
        /**
         * ===================================
         * BOT LAUNCH
         * ===================================
         */

        await bot.launch();

        /**
         * ===================================
         * EXPRESS SERVER
         * ===================================
         */

        app.get("/", (req, res) =>
        {
            res.send(
                "Host Express Bot Running"
            );
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