const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /lecturas - listar todas las lecturas con nombre y puesto
router.get("/", async (req, res) => {
  const [lecturas] = await db.query(`
    SELECT l.*, u.nombre, u.puesto 
    FROM lecturas l
    JOIN usuarios u ON l.id_usuario = u.id
  `);
  res.json(lecturas);
});

// GET /lecturas/por-fecha?fecha=2025-07-01
router.get("/por-fecha", async (req, res) => {
  const { fecha } = req.query;
  if (!fecha) {
    return res.status(400).json({ error: "Fecha no proporcionada" });
  }

  try {
    const [lecturas] = await db.query(`
      SELECT l.*, u.nombre, u.puesto, u.categoria
      FROM lecturas l
      JOIN usuarios u ON l.id_usuario = u.id
      WHERE l.fecha = ?
    `, [fecha]);

    res.json(lecturas);
  } catch (error) {
    console.error("Error al obtener lecturas por fecha:", error);
    res.status(500).json({ error: "Error al obtener lecturas" });
  }
});


// POST /lecturas - agregar lectura nueva
router.post("/", async (req, res) => {
  const { fecha, año, mes, lectura, id_usuario } = req.body;

  if (!fecha || !año || !mes || lectura == null || !id_usuario) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    await db.query(
      "INSERT INTO lecturas (fecha, año, mes, lectura, id_usuario) VALUES (?, ?, ?, ?, ?)",
      [fecha, año, mes, lectura, id_usuario]
    );
    res.status(201).json({ mensaje: "Lectura registrada correctamente" });
  } catch (error) {
    console.error("Error al registrar lectura:", error);
    res.status(500).json({ error: "Error al registrar lectura" });
  }
});


// En tu archivo de rutas de lecturas
router.put("/", async (req, res) => {
  const { fecha, id_usuario, nuevaLectura } = req.body;

  if (!fecha || !id_usuario || nuevaLectura == null) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    await db.query(
      "UPDATE lecturas SET lectura = ? WHERE fecha = ? AND id_usuario = ?",
      [nuevaLectura, fecha, id_usuario]
    );
    res.json({ mensaje: "Lectura actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar lectura:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// src/routes/lecturas.js
router.put("/actualizar", async (req, res) => {
  const { id_usuario, fecha, lectura } = req.body;

  if (!id_usuario || !fecha || !lectura) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    // Verificamos si existe la lectura del usuario en esa fecha
    const [verificar] = await db.execute(`
      SELECT lecturas.id 
      FROM lecturas 
      INNER JOIN usuarios ON usuarios.id = lecturas.id_usuario 
      WHERE lecturas.id_usuario = ? AND lecturas.fecha = ?
    `, [id_usuario, fecha]);

    if (verificar.length === 0) {
      return res.status(404).json({ error: "No se encontró la lectura para actualizar" });
    }
    // Actualizamos la lectura
    const [result] = await db.execute(`
      UPDATE lecturas 
      SET lectura = ? 
      WHERE id_usuario = ? AND fecha = ?
    `, [lectura, id_usuario, fecha]);

    res.json({ mensaje: "Lectura actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar lectura:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// GET /lecturas/por-fecha-categoria?fecha=2025-07-01&categoria=MANZANA%20A
router.get("/por-fecha-categoria", async (req, res) => {
  const { fecha, categoria } = req.query;

  if (!fecha || !categoria) {
    return res.status(400).json({ error: "Fecha y categoría son requeridas" });
  }

  try {
    const [resultados] = await db.execute(`
      SELECT 
        lecturas.id AS id_lectura,
        lecturas.fecha,
        lecturas.lectura,
        usuarios.id AS id_usuario,
        usuarios.nombre,
        usuarios.categoria,
        usuarios.puesto
      FROM lecturas
      INNER JOIN usuarios ON lecturas.id_usuario = usuarios.id
      WHERE lecturas.fecha = ? AND usuarios.categoria = ?
      ORDER BY usuarios.puesto ASC
    `, [fecha, categoria]);

    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener lecturas por fecha y categoría:", error);
    res.status(500).json({ error: "Error al obtener lecturas" });
  }
});


module.exports = router;
