const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3001;

// Lista de orígenes permitidos
const allowedOrigins = [
  "https://mercado-lecturas.netlify.app", // si usas Netlify también
];

// Configurar CORS dinámicamente
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origen como curl, Postman o producción SSR
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Origen no permitido por CORS:", origin);
        callback(new Error("No permitido por CORS"));
      }
    },
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
