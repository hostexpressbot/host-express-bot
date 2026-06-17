/**
 * ===================================
 * FILE : Session.js
 * FUNGSI :
 * - Menyimpan mode admin
 * ===================================
 */

const mongoose =
require("mongoose");

const SessionSchema =
new mongoose.Schema({

    userId: {
        type:
        Number,

        unique:
        true
    },

    mode: {
        type:
        String,

        default:
        null
    },

    data: {
        type:
        Object,

        default:
        {}
    }

},
{
    timestamps:
    true
});

module.exports =
mongoose.model(
    "Session",
    SessionSchema
);