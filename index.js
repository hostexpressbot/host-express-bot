/**
 * ===================================
 * FILE : index.js
 * FUNGSI :
 * - Entry Point Aplikasi
 * ===================================
 */

require("./src/bot");

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});