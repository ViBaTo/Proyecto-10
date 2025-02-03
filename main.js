// Importamos las dependencias necesarias
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const usersRouter = require('./src/api/routes/users')
const librosRouter = require('./src/api/routes/libros')
require('dotenv').config() // Para cargar las variables de entorno

// Inicializamos Express
const app = express()

// Middleware para parsear JSON y habilitar CORS
app.use(express.json())
app.use(cors())

// Conexión a la base de datos MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('Conectado a la base de datos'))
  .catch((err) => console.error('Error al conectar con la base de datos:', err))

// Conectar rutas
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/books', librosRouter)

// Ruta para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error en el servidor' })
})

// Configuramos el puerto
const PORT = process.env.PORT

// Levantamos el servidor en el puerto local
app.listen(PORT, () => {
  console.log(`Servidor desplegado en http://localhost:${PORT}`)
})
