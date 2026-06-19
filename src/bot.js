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

const {
    startChangeQris,
    handleChangeQris
} =
require(
"./handlers/admin/changeQris"
);

const {
    showStockProducts,
    showStockDetail,
    deleteAllStock
} =
require(
"./handlers/admin/stockManager"
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
 * CREATE ORDER
 * ===================================
 */

const {
    createOrder
} =
require(
"./handlers/user/createOrder"
);

const {
    showMyTransactions
} =
require(
"./handlers/user/myTransactions"
);

const {
    showTransactionDetail
} =
require(
"./handlers/user/transactionDetail"
);

const {
    viewQris
} =
require(
"./handlers/user/viewQris"
);

const {
    alreadyPaid
} =
require(
"./handlers/user/alreadyPaid"
);

const {
    acceptPayment,
    rejectPayment
} =
require(
"./handlers/admin/paymentApproval"
);

const {
    cancelOrder
} =
require(
"./handlers/user/cancelOrder"
);

const {
    showDashboard
} =
require(
"./handlers/admin/dashboard"
);

const {
    startEditProduct,
    chooseEditProduct,
    handleEditProduct
} =
require(
"./handlers/admin/editProduct"
);

const {
    startEditPrice,
    choosePrice,
    handleEditPrice
} =
require(
"./handlers/admin/editPrice"
);

const {
    startDeleteProduct,
    confirmDeleteProduct,
    executeDeleteProduct
} =
require(
"./handlers/admin/deleteProduct"
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

        bot.action(
    "admin_panel",
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

bot.action(
    "menu_transaksi",
    showMyTransactions
);

bot.action(
    /^trx_(.+)$/,
    showTransactionDetail
);

bot.action(
    /^view_qris_(.+)$/,
    viewQris
);

bot.action(
    /^already_paid_(.+)$/,
    alreadyPaid
);

bot.action(
    /^accept_payment_(.+)$/,
    acceptPayment
);

bot.action(
    /^reject_payment_(.+)$/,
    rejectPayment
);

bot.action(
    /^cancel_order_(.+)$/,
    cancelOrder
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

bot.action(
    /^pay_(.+)_(\d+)$/,
    createOrder
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

bot.action(
    "admin_delete_stock",
    showStockProducts
);

bot.action(
    "admin_change_qris",
    startChangeQris
);

bot.action(
    "admin_dashboard",
    showDashboard
);

bot.action(
    "admin_edit_product",
    startEditProduct
);

bot.action(
    /^edit_product_(.+)$/,
    chooseEditProduct
);

bot.action(
    "admin_edit_price",
    startEditPrice
);

bot.action(
    /^edit_price_(.+)$/,
    choosePrice
);

bot.action(
    "admin_delete_product",
    startDeleteProduct
);

bot.action(
    /^delprod_(.+)$/,
    confirmDeleteProduct
);

bot.action(
    /^confirm_del_(.+)$/,
    executeDeleteProduct
);

bot.action(
    /^stock_(.+)$/,
    showStockDetail
);

bot.action(
    /^delete_stock_(.+)$/,
    deleteAllStock
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

        const qrisHandled =
await handleChangeQris(
    ctx
);

if (qrisHandled)
{
    return;
}

const editProductHandled =
await handleEditProduct(
    ctx
);

if (editProductHandled)
{
    return;
}

const editPriceHandled =
await handleEditPrice(
    ctx
);

if (editPriceHandled)
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