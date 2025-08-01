const db = require("../db");
const { calcularConsumo } = require("../utils/calculos");

async function generarConsumos(req, res) {
  try {
    // Limpia la tabla para evitar duplicados
    await db.query("DELETE FROM consumos");

    // Obtener usuarios
    const [usuarios] = await db.query("SELECT * FROM usuarios");

    // Obtener lecturas con JOIN para incluir el puesto y nombre del usuario
    const [lecturas] = await db.query(`
      SELECT l.*, u.nombre, u.puesto, u.cantidad_puestos, u.categoria
      FROM lecturas l
      JOIN usuarios u ON l.id_usuario = u.id
    `);
    const consumosCalculados = [];

    for (const usuario of usuarios) {
      // Filtra lecturas de este usuario usando su ID
      const lecturasUsuario = lecturas
        .filter((l) => l.id_usuario === usuario.id)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      const consumo = calcularConsumo(usuario, lecturasUsuario);

      if (consumo) {
        consumosCalculados.push(consumo);

        await db.query(
          `INSERT INTO consumos (
            id_usuario, lectura_anterior, lectura_actual, diferencia,
            energia, iluminacion, gastos_adm, toma_lectura,
            otros, igv, total_mes, fecha
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            consumo.id_usuario,
            consumo.lectura_anterior,
            consumo.lectura_actual,
            consumo.diferencia,
            consumo.energia,
            consumo.iluminacion,
            consumo.gastos_adm,
            consumo.toma_lectura,
            consumo.otros,
            consumo.igv,
            consumo.total_mes,
            consumo.fecha,
          ]
        );
      }
    }

    res.json({
      mensaje: "Consumos generados y guardados",
      consumos: consumosCalculados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando consumos" });
  }
}

module.exports = { generarConsumos };
