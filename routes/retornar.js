const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/resultado", async (req, res) => {
  try {
    resultado = res.status(200);
    console.log("escuchando" + resultado);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});