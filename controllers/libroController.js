const ModelLibro = require("../models/libromodel");

// Obtener libros según filtro de búsqueda (autor, categoria, estado)
const getLibros = async (req, res) => {
  const { autor, categoria, estado } = req.query;
  try {
    const filtros = {};
    if (autor) filtros.autor = autor;
    if (categoria) filtros.categoria = categoria;
    if (estado) filtros.estado = estado;

    const libros = await ModelLibro.find(filtros);
    if (!libros.length) {
      return res.status(404).send({
        message: "No se encontraron libros con los criterios de búsqueda",
      });
    }
    res.status(200).json(libros);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al obtener los libros", error: error.message });
  }
};

const getLibroById = async (req, res) => {
  try {
    const libro = await ModelLibro.findById(req.params.id);
    if (!libro) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.status(200).json(libro);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el libro" });
  }
};

const crearLibro = async (req, res) => {
  const body = req.body;
  try {
    const nuevoLibro = await ModelLibro.create(body);
    res.status(201).json(nuevoLibro);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el libro" });
  }
};

const actualizarLibro = async (req, res) => {
  try {
    const libroActualizado = await ModelLibro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true },
    );

    if (!libroActualizado) {
      return res.status(404).send({ message: "Libro no encontrado" });
    }

    res.status(200).json(libroActualizado);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error al actualizar el libro", error: error.message });
  }
};

const eliminarLibro = async (req, res) => {
  try {
    const libroEliminado = await ModelLibro.findByIdAndDelete(req.params.id);

    if (!libroEliminado) {
      return res.status(404).send({ message: "Libro no encontrado" });
    }

    res.status(200).send({ message: "Libro eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al eliminar el libro", error: error.message });
  }
};

// Actualizar el estado del libro a "prestado" y establecer la fecha de préstamo y devolución
const prestarLibro = async (req, res) => {
  try {
    const libro = await ModelLibro.findById(req.params.id);
    if (!libro) {
      return res.status(404).send({ message: "Libro no encontrado" });
    }

    if (libro.estado === "prestado") {
      return res.status(400).send({ message: "El libro ya está prestado" });
    }

    libro.estado = "prestado";
    libro.fechaPrestamo = new Date();

    libro.fechaDevolucion = new Date();
    libro.fechaDevolucion.setDate(libro.fechaDevolucion.getDate() + 14);

    await libro.save();
    res.status(200).json(libro);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al prestar el libro", error: error.message });
  }
};

// Actualizar el estado del libro a "disponible" y borrar las fechas de préstamo y devolución
const devolverLibro = async (req, res) => {
  try {
    const libro = await ModelLibro.findById(req.params.id);
    if (!libro) {
      return res.status(404).send({ message: "Libro no encontrado" });
    }
    if (libro.estado !== "prestado") {
      return res
        .status(400)
        .send({ message: "El libro no está prestado. No se puede devolver." });
    }

    libro.estado = "disponible";
    libro.fechaPrestamo = null;
    libro.fechaDevolucion = null;

    await libro.save();
    res.status(200).json(libro);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al devolver el libro", error: error.message });
  }
};

module.exports = {
  getLibros,
  getLibroById,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
  prestarLibro,
  devolverLibro,
};
