const { isAuth } = require('../../middlewares/auth')
const {
  getUsers,
  getUserById,
  register,
  login,
  updateUser,
  addFavorite
} = require('../controllers/users')

const usersRouter = require('express').Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUserById)
usersRouter.post('/register', register)
usersRouter.post('/login', login)
usersRouter.put('/:id', isAuth, updateUser)
usersRouter.put('/:id/favoritos', isAuth, addFavorite)
module.exports = usersRouter
