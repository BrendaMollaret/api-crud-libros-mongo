const libroRepository = require("../repositories/libroRepository");
const HttpError = require("../utils/HttpError");

// Reglas de negocio: qué es válido, qué status corresponde a cada caso

const getLibros = async ({ autor, categoria, estado } = {}) => {
  const filtros = {};
  if (autor) filtros.autor = autor;
  if (categoria) filtros.categoria = categoria;
  if (estado) filtros.estado = estado;

  const libros = await libroRepository.findAll(filtros);
  if (!libros.length) {
    throw new HttpError(
      404,
      "No se encontraron libros con los criterios de búsqueda",
    );
  }
  return libros;
};

const getLibroById = async (id) => {
  const libro = await libroRepository.findById(id);
  if (!libro) throw new HttpError(404, "Libro no encontrado");
  return libro;
};

const crearLibro = (data) => libroRepository.create(data);

const actualizarLibro = async (id, data) => {
  try {
    const libro = await libroRepository.updateById(id, data);
    if (!libro) throw new HttpError(404, "Libro no encontrado");
    return libro;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    // Mantiene el comportamiento previo: datos inválidos -> 400
    throw new HttpError(400, error.message);
  }
};

const eliminarLibro = async (id) => {
  const libro = await libroRepository.deleteById(id);
  if (!libro) throw new HttpError(404, "Libro no encontrado");
  return libro;
};

const prestarLibro = async (id) => {
  const libro = await libroRepository.findById(id);
  if (!libro) throw new HttpError(404, "Libro no encontrado");
  if (libro.estado === "prestado") {
    throw new HttpError(400, "El libro ya está prestado");
  }

  libro.estado = "prestado";
  libro.fechaPrestamo = new Date();
  libro.fechaDevolucion = new Date();
  libro.fechaDevolucion.setDate(libro.fechaDevolucion.getDate() + 14);

  await libro.save();
  return libro;
};

const devolverLibro = async (id) => {
  const libro = await libroRepository.findById(id);
  if (!libro) throw new HttpError(404, "Libro no encontrado");
  if (libro.estado !== "prestado") {
    throw new HttpError(
      400,
      "El libro no está prestado. No se puede devolver.",
    );
  }

  libro.estado = "disponible";
  libro.fechaPrestamo = null;
  libro.fechaDevolucion = null;

  await libro.save();
  return libro;
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
