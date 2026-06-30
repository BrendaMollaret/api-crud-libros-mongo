const mongoose = require("mongoose");

// Conexión a la base de datos MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/dbGestorLibros");
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1); // Salir del proceso con un código de error
  }
};

module.exports = connectDB;
