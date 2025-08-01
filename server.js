const express = require("express");
const app = express();
const cors = require("cors"); // 👈 importar cors
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
); // 👈 permitir origen y headers
app.use(express.json());

const consumoRoutes = require("./routes/consumos");
const usuariosRoutes = require("./routes/usuarios");
const lecturasRoutes = require("./routes/lecturas");

// Ruta raíz
app.get("/", (req, res) => {
  res.send("¡Hola desde el backend de Node.js!");
});

// Importa la ruta consumos
app.use("/api/consumos", consumoRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/lecturas", lecturasRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
