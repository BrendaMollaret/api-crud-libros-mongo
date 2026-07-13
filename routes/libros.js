const express = require("express");
const router = express.Router();
const ModelLibro = require("../models/libromodel"); //importar el modelo del libro

//importar el middleware de autorización
const authMiddleware = require("../middlewares/authMiddlewares");

// obtener todos los libros
// Obtener libros según filtro de búsqueda (autor, categoria, estado)
router.get("/libros", async (req, res) => {
  const { autor, categoria, estado } = req.query; // Obtener los parámetros de búsqueda desde la query string
  try {
    const filtros = {};
    if (autor) filtros.autor = autor;
    if (categoria) filtros.categoria = categoria;
    if (estado) filtros.estado = estado;

    const libros = await ModelLibro.find(filtros); // Buscar los libros según el filtro
    if (!libros.length) {
      return res.status(404).send({
        message: "No se encontraron libros con los criterios de búsqueda",
      });
    }
    res.status(200).json(libros); // Enviar los libros encontrados como respuesta en formato JSON
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al obtener los libros", error: error.message });
  }
});

router.get("/libros", async (req, res) => {
  try {
    const libros = await ModelLibro.find(); //Obtener todos los libros de la base de datos
    res.status(200).json(libros); //Enviar los libros como respuesta en formato JSON
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los libros" });
  }
});

// obtener un libro por su ID
router.get("/libros/:id", async (req, res) => {
  try {
    const libro = await ModelLibro.findById(req.params.id); //buscar el libro por su ID en la base de datos
    if (!libro) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.status(200).json(libro); //Enviar el libro como respuesta en formato JSON
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el libro" });
  }
});

//crear un nuevo libro
router.post("/libros", authMiddleware, async (req, res) => {
  const body = req.body; //Obtener los datos del libro desde el cuerpo de la solicitud
  try {
    const nuevoLibro = await ModelLibro.create(body); //Crear una nueva instancia del modelo del libro con los datos recibidos
    res.status(201).json(nuevoLibro); //Enviar el libro creado como respuesta en formato JSON
  } catch (error) {
    res.status(500).json({ message: "Error al crear el libro" });
  }
});

// actualizar un libro por su ID
router.put("/libros/:id", async (req, res) => {
  try {
    const libroActualizado = await ModelLibro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true }, // Devolver el libro actualizado y validar los datos
    );

    if (!libroActualizado) {
      return res.status(404).send({ message: "Libro no encontrado" });
    }

    res.status(200).json(libroActualizado); //Enviar el libro actualizado como respuesta en formato JSON
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al actualizar el libro", error: error.message });
  }
});

// eliminar un libro por su ID
router.delete("/libros/:id", async (req, res) => {
  try {
    const libroEliminado = await ModelLibro.findByIdAndDelete(req.params.id); //Eliminar el libro por su ID

    if (!libroEliminado) {
      return res.status(404).send({ message: "Libro no encontrado" });
    }

    res.status(200).send({ message: "Libro eliminado correctamente" }); //Enviar un mensaje de éxito como respuesta
  } catch (error) {
    res.status(500).send("Error al eliminar el libro", error.message);
  }
});

// -- Endpoints de negocio --
// Prestar un libro

// Actualizar el estado del libro a "prestado" y establecer la fecha de préstamo y devolución
router.put("/libros/:id/prestar", async (req, res) => {
  try {
    const libro = await ModelLibro.findById(req.params.id);
    if (!libro) {
      return res.status(404).send({ message: "Libro no encontrado" });
    }

    // Verificar si el libro ya está prestado o si está disponible para prestar
    if (libro.estado === "prestado") {
      return res.status(400).send({ message: "El libro ya está prestado" });
    }

    // Actualizar el estado del libro a "prestado" y establecer la fecha de préstamo y devolución
    libro.estado = "prestado";
    libro.fechaPrestamo = new Date();

    libro.fechaDevolucion = new Date();
    libro.fechaDevolucion.setDate(libro.fechaDevolucion.getDate() + 14);

    await libro.save(); // Guardar los cambios en la base de datos
    res.status(200).json(libro); //Enviar el libro actualizado como respuesta en formato JSON
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al prestar el libro", error: error.message });
  }
});

// Devolver un libro
// Actualizar el estado del libro a "disponible" y borrar las fechas de préstamo y devolución
router.put("/libros/:id/devolver", async (req, res) => {
  try {
    const libro = await ModelLibro.findById(req.params.id);
    if (!libro) {
      return res.status(404).send({ message: "Libro no encontrado" });
    }
    // Verificar si el libro está prestado antes de devolverlo
    if (libro.estado !== "prestado") {
      return res
        .status(400)
        .send({ message: "El libro no está prestado. No se puede devolver." });
    }

    libro.estado = "disponible";
    libro.fechaPrestamo = null;
    libro.fechaDevolucion = null;

    await libro.save(); // Guardar los cambios en la base de datos
    res.status(200).json(libro); //Enviar el libro actualizado como respuesta en formato JSON
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al devolver el libro", error: error.message });
  }
});

// exportar el router para que pueda ser utilizado en otros archivos
module.exports = router;
