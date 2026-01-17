const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Se esta escuchando este servicio"
  })
});

module.exports = router;