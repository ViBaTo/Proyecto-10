const Libro = require('../models/libros')

const getLibros = async (req, res, next) => {
  try {
    const libros = await Libro.find()
    return res.status(200).json(libros)
  } catch (error) {
    return res.status(400).json('Error encontrando el libro')
  }
}

const getLibroById = async (req, res, next) => {
  try {
    const { id } = req.params
    const libro = await Libro.findById(id)
    return res.status(200).json(libro)
  } catch (error) {
    return res.status(400).son('Error encontrando el libro')
  }
}

const postLibro = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      // Si es un array, se usa insertMany para insertar todos los libros
      const libros = await Libro.insertMany(req.body)
      return res.status(201).json(libros)
    } else {
      // Si es un objeto, se crea y guarda un único libro
      const newLibro = new Libro(req.body)
      const libro = await newLibro.save()
      return res.status(201).json(libro)
    }
  } catch (error) {
    console.error('Error posteando el libro(s):', error)
    return res.status(400).json({
      error: 'Error posteando el libro(s)',
      details: error.message
    })
  }
}

const updateLibro = async (req, res, next) => {
  try {
    const { id } = req.params
    const newLibro = new Libro(req.body)
    newLibro._id = id
    const libroUpdated = await Libro.findByIdAndUpdate(id, newLibro, {
      new: true
    })
    return res.status(200).json(libroUpdated)
  } catch (error) {
    return res.status(400).json('Error actualizando el libro')
  }
}

const deleteLibro = async (req, res, next) => {
  try {
    const { id } = req.params
    const libro = await Libro.findByIdAndDelete(id)
    return res.status(200).json({
      mensaje: 'Ha sido eliminado con éxito',
      libroEliminado: libro
    })
  } catch (error) {
    return res.status(400).json('Error eliminando el libro')
  }
}

module.exports = {
  getLibros,
  getLibroById,
  postLibro,
  updateLibro,
  deleteLibro
}
