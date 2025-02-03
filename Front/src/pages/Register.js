// Importa la función `Login` desde el módulo "./Login"
// para mostrarla una vez registremos un nuevo usuario
import Login from './Login'

// Define una arrow function llamada `template` que devuelve una template string
const template = () => `
  <section id="register">
    <form>
      <input type="text" placeholder="Username" id="username"/>
      <input type="password" id="password" placeholder="Password" />
      <button id="registerbtn">Register</button>
    </form>
  </section>
`

// Define una función asíncrona llamada `registerSubmit` para procesar el envío del formulario de registro
const registerSubmit = async () => {
  // Obtiene los valores de nombre de usuario y contraseña desde los campos de entrada del formulario
  const username = document.querySelector('#username').value
  const password = document.querySelector('#password').value

  // Realiza una solicitud a la API para registrar un nuevo usuario
  const data = await fetch('http://localhost:3000/api/v1/users/register', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      userName: username,
      password: password
    })
  })

  // Muestra una alerta indicando que el registro fue exitoso y anima al usuario a iniciar sesión
  alert(`Please, log in with your credentials`)

  // Llama a la función `Login` para redirigir al usuario a la sección de inicio de sesión
  Login()
}

// Define una función llamada `Register` que actualiza el contenido de la sección de registro en el DOM
const Register = () => {
  // Selecciona el elemento 'main' en el DOM y asigna el HTML generado por la función `template`
  document.querySelector('main').innerHTML = template()

  // Agrega un event listener al botón de registro para procesar el evento de clic
  document.querySelector('#registerbtn').addEventListener('click', () => {
    registerSubmit() // Llama a la función `registerSubmit` para procesar el envío del formulario
  })
}

// Exporta la función `Register` como el valor predeterminado del módulo
export default Register
