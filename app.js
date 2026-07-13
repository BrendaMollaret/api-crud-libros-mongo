const express = require("express");
const app = express();
const dbconnect = require("./config/db");
const librosRoutes = require("./routes/libros");
const cors = require("cors");
const corsOptions = require("./config/corsOptions"); // Importamos las opciones de CORS desde el archivo de configuración


//Middleware
const loggingMiddleware = require("./middlewares/loggingMiddlewares");
const errorMiddleware = require("./middlewares/errorMiddlewares"); //Errores globles
const notFoundMiddleware = require("./middlewares/notFoundMiddlewares"); // Importamos el middleware de rutas no encontradas


app.use(cors(corsOptions)); //Usamos el middleware de CORS en toda la aplicación
app.use(loggingMiddleware); //Usamos el middleware de logging en toda la aplicación

app.use(express.json());
app.use(librosRoutes);

app.use(notFoundMiddleware); //Usamos el middleware de rutas no encontradas en toda la aplicación
app.use(errorMiddleware); //Usamos el middleware de error en toda la aplicación

dbconnect()
  .then(() => {
    app.listen(3000, () => {
      console.log("El servidor está corriendo en el puerto 3000");
    });
  })
  .catch((err) => {
    console.log(
      "No se pudo iniciar el servidor debido a un error en la base de datos",
    );
  });
