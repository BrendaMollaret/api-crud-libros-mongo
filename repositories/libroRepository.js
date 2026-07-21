const ModelLibro = require("../models/libromodel");

// Acceso a datos puro: solo llamadas a Mongoose, sin reglas de negocio

const findAll = (filtros = {}) => ModelLibro.find(filtros);

const findById = (id) => ModelLibro.findById(id);

const existsByIsbn = (isbn) => ModelLibro.exists({ isbn });

const create = (data) => ModelLibro.create(data);

const updateById = (id, data) =>
  ModelLibro.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  });

const deleteById = (id) => ModelLibro.findByIdAndDelete(id);

module.exports = {
  findAll,
  findById,
  existsByIsbn,
  create,
  updateById,
  deleteById,
};
