const mongoose = require("mongoose");

//Definir el esquema del libro
const libroSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    categoria: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    precio: { type: Number, required: true },
    estado: {
      type: String,
      enum: ["disponible", "prestado", "vencido"],
      default: "disponible",
    },
    fechaPrestamo: { type: Date },
    fechaDevolucion: { type: Date },
  },
  { timestamps: true }, // Agregar timestamps para createdAt y updatedAt
);

// Crear el modelo del libro
const ModelLibro = mongoose.model("libros", libroSchema);
module.exports = ModelLibro;
