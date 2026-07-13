const corsOptions = {
  origin: 'http://localhost:5174', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

module.exports = corsOptions; //Exportar las opciones de CORS para que puedan ser utilizadas en otros archivos.