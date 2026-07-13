// middlewares/loggingMiddleware.js

const loggingMiddleware = (req, res, next) => {
    const method = req.method; // Método HTTP (GET, POST, PUT, etc.)
    const url = req.url; // URL solicitada
    const time = new Date().toLocaleString(); // Fecha y hora de la solicitud
  
    console.log(`[${time}] ${method} ${url}`); // Registramos la información en la consola
  
    next(); // Pasamos al siguiente middleware o ruta
  };
  
  module.exports = loggingMiddleware;
  