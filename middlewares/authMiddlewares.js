// middlewares/authMiddleware.js

// Definimos el token correcto
const TOKEN_SECRETO = "miTokenSecreto";

// Middleware de autorización
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]; // Buscamos el token en las cabeceras

  if (token === TOKEN_SECRETO) {
    next(); // Si el token es correcto, dejamos que la solicitud continúe
  } else {
    res
      .status(403)
      .send({ mensaje: "Acceso prohibido: Token inválido o ausente" }); // Si no es correcto, devolvemos un error 403
  }
};

module.exports = authMiddleware;
