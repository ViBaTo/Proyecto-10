// Importa la función `Books` desde el módulo "./Books" para poder mostrarla
// una vez hayamos iniciado sesión
import Books from './Books'

// Define una función arrow llamada `template` que devuelve un tempalte string
const template = () => `
  <section id="login">
    ${
      // Utiliza un ternario para mostrar un mensaje de bienvenida si ya hay un usuario en el localStorage,
      // de lo contrario, muestra un formulario de inicio de sesión
      localStorage.getItem('user')
        ? `<h2>You are already logged<h2>`
        : `<form>
          <input type="text" placeholder="Username" id="username"/>
          <input type="password" id="password" placeholder="Password" />
          <button id="loginbtn">Login</button>
        </form>`
    }
  </section>
`

// Define una función asincrónica llamada `loginSubmit` para procesar el envío del formulario de inicio de sesión
const loginSubmit = async () => {
  const username = document.querySelector('#username').value
  const password = document.querySelector('#password').value

  const response = await fetch('http://localhost:3000/api/v1/users/login', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName: username, password: password })
  })

  const dataRes = await response.json()
  console.log('Respuesta del login:', dataRes)

  if (dataRes && dataRes.token && dataRes.user && dataRes.user._id) {
    localStorage.setItem('user', JSON.stringify(dataRes))
    alert(`Welcome ${dataRes.user.userName}`)
    Books()
  } else {
    // No se almacena en localStorage si hay error
    localStorage.removeItem('user')
    alert('Error: ' + (dataRes.error || 'Login failed.'))
    console.error('Estructura incorrecta:', dataRes)
  }
}

// Define una función llamada `Login` que actualiza el contenido de la sección de inicio de sesión en el DOM
const Login = () => {
  // Selecciona el elemento 'main' en el DOM y asigna el HTML generado por la función `template`
  document.querySelector('main').innerHTML = template()

  // Agrega un event listener al botón de inicio de sesión para procesar el evento de clic
  document.querySelector('#loginbtn').addEventListener('click', (ev) => {
    ev.preventDefault() // Evita que el formulario recargue la página
    loginSubmit() // Llama a la función `loginSubmit` para procesar el envío del formulario
  })
}

// Exporta la función `Login` como el valor predeterminado del módulo
export default Login
const logout = () => {
  // Elimina la información del usuario del localStorage
  localStorage.removeItem('user')

  // Opcional: Actualiza la interfaz para reflejar que ya no hay usuario logueado
  // Por ejemplo, puedes redirigir al login o recargar la página
  // window.location.reload();
  // O, si usas tus funciones de navegación:
  Login() // Si ya tienes importada la función Login para mostrar el formulario de login
}
