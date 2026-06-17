/**
 * ===================================
 * FILE : sessionManager.js
 * FUNGSI :
 * - Mengelola session database
 * ===================================
 */

const Session =
require("../models/Session");

async function setSession(
    userId,
    mode,
    data = {}
)
{
    return await Session.findOneAndUpdate(
        { userId },
        {
            userId,
            mode,
            data
        },
        {
            upsert: true,
            new: true
        }
    );
}

async function getSession(
    userId
)
{
    return await Session.findOne({
        userId
    });
}

async function clearSession(
    userId
)
{
    return await Session.deleteOne({
        userId
    });
}

module.exports = {
    setSession,
    getSession,
    clearSession
};