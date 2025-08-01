const express = require("express");
const router = express.Router();
const db = require("../db");

// POST para agregar un solo usuario
router.post("/", async (req, res) => {
  const { nombre, puesto, cantidad_puestos, categoria } = req.body;

  // Validación estricta
  if (
    !nombre?.trim() ||
    !puesto?.trim() ||
    !cantidad_puestos ||
    !categoria?.trim()
  ) {
    return res
      .status(400)
      .json({ error: "Faltan campos obligatorios válidos" });
  }

  console.log("Insertando usuario:", {
    nombre: nombre.trim(),
    puesto: puesto.trim(),
    cantidad_puestos,
    categoria: categoria,
    categoriaTrim: categoria?.trim(),
  });

  try {
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, puesto, cantidad_puestos, categoria) VALUES (?, ?, ?, ?)",
      [nombre.trim(), puesto.trim(), cantidad_puestos, categoria.trim()]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      puesto,
      cantidad_puestos,
      categoria,
    });
  } catch (error) {
    console.error("Error al insertar usuario:", error);
    res.status(500).json({ error: "Error al insertar usuario" });
  }
});

// GET para obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const [usuarios] = await db.query("SELECT * FROM usuarios");
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// POST /usuarios/bulk para agregar varios usuarios desde Excel
router.post("/bulk", async (req, res) => {
  const usuarios = req.body;
  console.log("Usuarios recibidos en backend:");
  console.log(JSON.stringify(req.body, null, 2));

  if (!Array.isArray(usuarios) || usuarios.length === 0) {
    return res
      .status(400)
      .json({ error: "Debe enviar una lista de usuarios válida" });
  }

  const insertados = [];
  const errores = [];

  for (const usuario of usuarios) {
    const { nombre, puesto, cantidad_puestos, categoria } = usuario;

    // Validación estricta
    if (
      !nombre?.trim() ||
      !puesto?.trim() ||
      !cantidad_puestos ||
      !categoria?.trim()
    ) {
      errores.push({
        mensaje: "Campos obligatorios incompletos o inválidos",
        usuario,
      });
      continue;
    }

    try {
      // Verificar existencia previa
      const [existe] = await db.query(
        "SELECT 1 FROM usuarios WHERE nombre = ? AND puesto = ?",
        [nombre.trim(), puesto.trim()]
      );

      if (existe.length > 0) {
        errores.push({
          mensaje: "Usuario con el mismo nombre y puesto ya existe",
          usuario,
        });
        continue;
      }

      // Insertar usuario
      const [result] = await db.query(
        "INSERT INTO usuarios (nombre, puesto, cantidad_puestos, categoria) VALUES (?, ?, ?, ?)",
        [nombre.trim(), puesto.trim(), cantidad_puestos, categoria.trim()]
      );

      insertados.push({
        id: result.insertId,
        nombre: nombre.trim(),
        puesto: puesto.trim(),
        cantidad_puestos,
        categoria: categoria.trim(),
      });
    } catch (err) {
      errores.push({
        mensaje: "Error de servidor",
        usuario,
        error: err.message,
      });
    }
  }

  res.json({ insertados, errores });
});

// PUT /usuarios/:id para editar un usuario existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, puesto, cantidad_puestos, categoria } = req.body;

  // Validación de campos obligatorios
  if (
    !nombre?.trim() ||
    !puesto?.trim() ||
    !cantidad_puestos ||
    !categoria?.trim()
  ) {
    return res
      .status(400)
      .json({ error: "Faltan campos obligatorios válidos" });
  }

  try {
    const [resultado] = await db.query(
      `UPDATE usuarios
       SET nombre = ?, puesto = ?, cantidad_puestos = ?, categoria = ?
       WHERE id = ?`,
      [nombre.trim(), puesto.trim(), cantidad_puestos, categoria.trim(), id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Usuario actualizado correctamente",
      id,
      nombre: nombre.trim(),
      puesto: puesto.trim(),
      cantidad_puestos,
      categoria: categoria.trim(),
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// GET /usuarios/categorias
router.get("/categorias", async (req, res) => {
  try {
    const [categorias] = await db.execute(`
      SELECT DISTINCT categoria FROM usuarios ORDER BY categoria ASC
    `);
    res.json(categorias.map(row => row.categoria));
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

module.exports = router;
