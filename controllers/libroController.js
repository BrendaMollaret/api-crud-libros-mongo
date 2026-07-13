const libroService = require("../services/libroService");

// Capa HTTP: traduce req/res <-> servicio. Sin reglas de negocio ni acceso a datos.

const getLibros = async (req, res, next) => {
  try {
    const libros = await libroService.getLibros(req.query);
    res.status(200).json(libros);
  } catch (error) {
    next(error);
  }
};

const getLibroById = async (req, res, next) => {
  try {
    const libro = await libroService.getLibroById(req.params.id);
    res.status(200).json(libro);
  } catch (error) {
    next(error);
  }
};

const crearLibro = async (req, res, next) => {
  try {
    const nuevoLibro = await libroService.crearLibro(req.body);
    res.status(201).json(nuevoLibro);
  } catch (error) {
    next(error);
  }
};

const actualizarLibro = async (req, res, next) => {
  try {
    const libro = await libroService.actualizarLibro(req.params.id, req.body);
    res.status(200).json(libro);
  } catch (error) {
    next(error);
  }
};

const eliminarLibro = async (req, res, next) => {
  try {
    await libroService.eliminarLibro(req.params.id);
    res.status(200).json({ mensaje: "Libro eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

const prestarLibro = async (req, res, next) => {
  try {
    const libro = await libroService.prestarLibro(req.params.id);
    res.status(200).json(libro);
  } catch (error) {
    next(error);
  }
};

const devolverLibro = async (req, res, next) => {
  try {
    const libro = await libroService.devolverLibro(req.params.id);
    res.status(200).json(libro);
  } catch (error) {
    next(error);
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
