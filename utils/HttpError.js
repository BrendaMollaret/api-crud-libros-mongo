// Error con status HTTP asociado, para que errorMiddlewares.js sepa qué código devolver
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = HttpError;
