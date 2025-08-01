const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: "https://consumo-energia-frontend.netlify.app/", // El dominio del frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const consumoRoutes = require("./routes/consumos");
const usuariosRoutes = require("./routes/usuarios");
const lecturasRoutes = require("./routes/lecturas");

app.get("/", (req, res) => {
  res.send("¡Hola desde el backend de Node.js!");
});

app.use("/api/consumos", consumoRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/lecturas", lecturasRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
