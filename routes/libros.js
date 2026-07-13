const express = require("express");
const router = express.Router();
const libroController = require("../controllers/libroController");
const authMiddleware = require("../middlewares/authMiddlewares");

router.get("/libros", libroController.getLibros);
router.get("/libros/:id", libroController.getLibroById);
router.post("/libros", authMiddleware, libroController.crearLibro);
router.put("/libros/:id", libroController.actualizarLibro);
router.delete("/libros/:id", libroController.eliminarLibro);

// -- Endpoints de negocio --
router.put("/libros/:id/prestar", libroController.prestarLibro);
router.put("/libros/:id/devolver", libroController.devolverLibro);

module.exports = router;
