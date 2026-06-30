const express = require("express");
const app = express();
const dbconnect = require("./config/db.js");

// Importar las rutas de libros
const librosRoutes = require("./routes/libros.js");

app.use(express.json()); // Middleware para interpretar JSON

app.use(librosRoutes); // Usar las rutas de libros

// ruta de prueba
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de libros");
});

// Probar la conexión a la base de datos y arrancar el servidor
const PORT = process.env.PORT || 3000;

dbconnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1); // Salir del proceso con un código de error
  });
