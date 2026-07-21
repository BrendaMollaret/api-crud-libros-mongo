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

// Precio base según antigüedad: cuanto más viejo, más económico
const calcularPrecioBase = (anio) => {
  const antiguedad = new Date().getFullYear() - anio;
  if (antiguedad > 20) return 5000;
  if (antiguedad > 5) return 8000;
  return 12000;
};

// Efectos posteriores a la creación (placeholders hasta tener esos módulos)
const registrarEnHistorial = async (libroId, usuario) => {
  console.log(`Historial: libro ${libroId} creado por ${usuario?.email ?? "desconocido"}`);
};

const enviarNotificacionNuevoLibro = async (libro) => {
  console.log(`Notificación: nuevo libro "${libro.titulo}" disponible`);
};

const crearLibro = async (data, usuario) => {
  try {
    const yaExiste = await libroRepository.existsByIsbn(data.isbn);
    if (yaExiste) throw new HttpError(409, "El ISBN ya existe");

    let precio = calcularPrecioBase(data.anio);
    if (data.coleccion === "clasicos") precio *= 0.9;

    const nuevoLibro = await libroRepository.create({ ...data, precio });

    await registrarEnHistorial(nuevoLibro._id, usuario);
    await enviarNotificacionNuevoLibro(nuevoLibro);

    return nuevoLibro;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    // Mantiene el comportamiento previo: datos inválidos -> 400
    throw new HttpError(400, error.message);
  }
};

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
