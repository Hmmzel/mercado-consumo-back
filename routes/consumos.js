const express = require("express");
const router = express.Router();
const { generarConsumos } = require("../controllers/consumoController");

router.get("/generar", generarConsumos);

module.exports = router;
