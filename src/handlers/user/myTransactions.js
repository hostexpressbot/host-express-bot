/**
 * ===================================
 * FILE : myTransactions.js
 * FUNGSI :
 * - Menampilkan transaksi aktif user
 * ===================================
 */

const Order =
require("../../models/Order");

const { Markup } =
require("telegraf");

async function showMyTransactions(ctx)
{
    try
    {
        const orders =
        await Order.find({
            userId:
            ctx.from.id,

            status: {
                $in: [
                    "pending",
                    "paid"
                ]
            }
        })
        .sort({
            createdAt: -1
        });

        if (
            orders.length === 0
        )
        {
            return ctx.editMessageText(
`📄 TRANSAKSI SAYA

Tidak ada transaksi yang sedang berjalan.`,
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            "⬅️ KEMBALI",
                            "back_main_menu"
                        )
                    ]
                ])
            );
        }

        const buttons = [];

        for (const order of orders)
        {
            const status =
            order.status === "paid"
            ? "🟢"
            : "🟡";

            buttons.push([
                Markup.button.callback(
                    `${status} ${order.invoice}`,
                    `trx_${order._id}`
                )
            ]);
        }

        buttons.push([
            Markup.button.callback(
                "⬅️ KEMBALI",
                "back_main_menu"
            )
        ]);

        await ctx.editMessageText(
`📄 TRANSAKSI SAYA

Menampilkan transaksi yang masih aktif.`,
            Markup.inlineKeyboard(
                buttons
            )
        );
    }
    catch(err)
    {
        console.error(err);
    }
}

module.exports = {
    showMyTransactions
};