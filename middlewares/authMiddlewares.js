// middlewares/authMiddleware.js

// Definimos el token correcto
const TOKEN_SECRETO = "miTokenSecreto";

// Middleware de autorización
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]; // Buscamos el token en las cabeceras

  if (token === TOKEN_SECRETO) {
    // No hay login real todavía: se simula un usuario fijo para que el resto
    // de la app (historial, notificaciones) tenga a quién referenciar.
    req.usuario = { email: "admin@sistema.com" };
    next(); // Si el token es correcto, dejamos que la solicitud continúe
  } else {
    res
      .status(403)
      .send({ mensaje: "Acceso prohibido: Token inválido o ausente" }); // Si no es correcto, devolvemos un error 403
  }
};

module.exports = authMiddleware;
