import Books from './pages/Books.js'
import Favs from './pages/Favs.js'
import Login from './pages/Login.js'
import Register from './pages/Register.js'

const logout = () => {
  // Elimina la información del usuario del localStorage
  localStorage.removeItem('user')
  // Opcional: puedes redirigir al login o actualizar la interfaz
  // Por ejemplo, llamar a Login() para mostrar el formulario de inicio de sesión:
  Login()
  // O recargar la página:
  // window.location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
  const booksLink = document.getElementById('bookslink')
  const loginLink = document.getElementById('loginlink')
  const registerLink = document.getElementById('registerlink')
  const favsLink = document.getElementById('favslink')
  const logoutLink = document.getElementById('logoutlink')

  // Agrega event listeners a cada enlace para mostrar la vista correspondiente
  if (booksLink) {
    booksLink.addEventListener('click', (ev) => {
      ev.preventDefault()
      Books()
    })
  }

  if (loginLink) {
    loginLink.addEventListener('click', (ev) => {
      ev.preventDefault()
      Login()
    })
  }

  if (registerLink) {
    registerLink.addEventListener('click', (ev) => {
      ev.preventDefault()
      Register()
    })
  }

  if (favslink) {
    favsLink.addEventListener('click', (ev) => {
      ev.preventDefault()
      Favs()
    })
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', (ev) => {
      ev.preventDefault()
      logout()
    })
  }

  // Carga una vista por defecto (por ejemplo, Books)
  Books()
})
