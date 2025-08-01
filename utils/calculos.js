function calcularConsumo(usuario, lecturasDelPuesto) {
  if (lecturasDelPuesto.length < 2) return null;

  lecturasDelPuesto.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const cantidadPuestos = usuario.cantidad_puestos;
  const lecturaActual = lecturasDelPuesto[0].lectura;
  const lecturaAnterior = lecturasDelPuesto[1].lectura;
  const diferencia = lecturaActual - lecturaAnterior;

  const energia = +(diferencia * 0.79).toFixed(2);
  const iluminacion = +(2.4 * cantidadPuestos).toFixed(2);
  const gastos_adm = +(0.3 * cantidadPuestos).toFixed(2);
  const toma_lectura = 1;
  const otros = +(0.5 * cantidadPuestos).toFixed(2);
  const igv = +((energia + iluminacion) * 0.18).toFixed(2);

  // ✅ CORREGIDO: redondear total al múltiplo más cercano de 0.10
  const bruto = energia + iluminacion + gastos_adm + toma_lectura + otros + igv;
  const total_mes = Math.round(bruto * 10) / 10;

  const fecha = lecturasDelPuesto[0].fecha;

  return {
    // Aquí agregamos explícitamente estos campos para que estén disponibles en frontend:
    id_usuario: usuario.id,
    nombre: usuario.nombre,
    puesto: usuario.puesto,
    categoria: usuario.categoria,
    cantidad_puestos: cantidadPuestos,
    lectura_anterior: lecturaAnterior,
    lectura_actual: lecturaActual,
    diferencia,
    energia,
    iluminacion,
    gastos_adm,
    toma_lectura,
    otros,
    igv,
    total_mes,
    fecha,
  };
}

module.exports = { calcularConsumo };
