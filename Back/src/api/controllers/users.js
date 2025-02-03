//En este controlador vamos a tener los métodos para obtener todos los usuarios, obtener un usuario por su ID, registrar un usuario y actualizar un usuario.

// Implementaremos funciones extras como la comprobación de usuarios existentes, que la contraseña insertada en el login sea correspondiente a la encriptada e incluso insertar un rol por defecto a la hora de guardar un nuevo usuario en la base de datos:

const { generarLlave } = require('../../utils/jwt')
const User = require('../models/users')
const bcrypt = require('bcrypt')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('favoritos')
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json({ error: 'Error getting users' })
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).populate('favoritos')
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({ error: 'Error getting user' })
  }
}

const register = async (req, res, next) => {
  try {
    const userDuplicated = await User.findOne({ userName: req.body.userName })

    if (userDuplicated) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const newUser = new User({
      userName: req.body.userName,
      password: req.body.password,
      rol: 'user'
    })
    const user = await newUser.save()

    // Opcional: devolver una versión "segura" del usuario (sin password)
    const safeUser = {
      _id: user._id,
      userName: user.userName,
      favoritos: user.favoritos,
      rol: user.rol
    }
    return res.status(201).json(safeUser)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error registering user', details: error.message })
  }
}

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body
    const user = await User.findOne({ userName })

    if (!user) {
      // Retorna siempre un objeto con la propiedad "error"
      return res.status(400).json({ error: 'Incorrect user or password' })
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generarLlave(user._id)
      // Crea un objeto "seguro" sin la contraseña
      const safeUser = {
        _id: user._id,
        userName: user.userName,
        favoritos: user.favoritos,
        rol: user.rol
      }
      return res.status(200).json({ token, user: safeUser })
    } else {
      return res.status(400).json({ error: 'Incorrect user or password' })
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error making login', details: error.message })
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params

    if (req.user._id.toString() !== id) {
      return res.status(400).json({ error: 'Cannot modify other users' })
    }

    const oldUser = await User.findById(id)
    const newUser = new User(req.body)
    newUser._id = id
    newUser.favoritos = [...oldUser.favoritos, ...newUser.favoritos]
    const userUpdated = await User.findByIdAndUpdate(id, newUser, { new: true })

    return res.status(200).json(userUpdated)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error updating user', details: error.message })
  }
}

const addFavorite = async (req, res, next) => {
  try {
    const { id } = req.params // ID del usuario (de la URL)
    const { libroId } = req.body // ID del libro a agregar

    // Verifica que el usuario autenticado sea el mismo que se quiere modificar
    if (req.user._id.toString() !== id) {
      return res.status(400).json({ error: 'You cannot modify another user' })
    }

    // Actualiza el usuario agregando el libro a favoritos (sin duplicados)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $addToSet: { favoritos: libroId } },
      { new: true }
    )

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error adding favorite:', error)
    return res.status(400).json({
      error: 'Error adding favorite',
      details: error.message
    })
  }
}

module.exports = {
  getUsers,
  getUserById,
  register,
  updateUser,
  login,
  addFavorite
}
