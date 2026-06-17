/**
 * ===================================
 * FILE : Order.js
 * FUNGSI :
 * - Menyimpan transaksi
 * ===================================
 */

const mongoose =
require("mongoose");

const OrderSchema =
new mongoose.Schema({

    invoice: {
        type:
        String,

        unique:
        true
    },

    userId: {
        type:
        Number,

        required:
        true
    },

    productId: {
        type:
        mongoose.Schema.Types.ObjectId,

        ref:
        "Product"
    },

    qty: {
        type:
        Number,

        default:
        1
    },

    total: {
        type:
        Number,

        default:
        0
    },

    status: {
        type:
        String,

        enum: [
            "pending",
            "paid",
            "success",
            "cancelled"
        ],

        default:
        "pending"
    }

},
{
    timestamps:
    true
});

module.exports =
mongoose.model(
    "Order",
    OrderSchema
);