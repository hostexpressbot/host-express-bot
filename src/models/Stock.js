/**
 * ===================================
 * FILE : Stock.js
 * FUNGSI :
 * - Menyimpan stock FIFO
 * ===================================
 */

const mongoose =
require("mongoose");

const StockSchema =
new mongoose.Schema({

    productId: {
        type:
        mongoose.Schema.Types.ObjectId,

        ref:
        "Product",

        required:
        true
    },

    data: {
        type:
        String,

        required:
        true
    },

    sold: {
        type:
        Boolean,

        default:
        false
    }

},
{
    timestamps:
    true
});

module.exports =
mongoose.model(
    "Stock",
    StockSchema
);