// Función template para la sección de favoritos
const template = () => {
  // Verifica si hay información del usuario en localStorage
  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    return `
      <section id="favs">
        <h3>Please, log in to see your favorites.</h3>
      </section>
    `
  }
  return `
    <section id="favs">
      <h3>Your Favorites</h3>
      <ul id="favsContainer"></ul>
    </section>
  `
}

// Función asíncrona para obtener los favoritos del usuario
const getFavorites = async () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      console.error('No user stored in localStorage.')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    // Se asume que la información tiene la estructura { token, user: { _id, userName, ... } }
    if (!parsedUser.token || !parsedUser.user || !parsedUser.user._id) {
      console.error('The user data structure is incorrect:', parsedUser)
      return
    }

    const userId = parsedUser.user._id
    const token = parsedUser.token

    // Realiza la llamada a la API para obtener el usuario (con favoritos poblados)
    const response = await fetch(
      `http://localhost:3000/api/v1/users/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      console.error('Error fetching user data:', response.statusText)
      return
    }

    const userData = await response.json()

    // Selecciona el contenedor de favoritos en el DOM
    const favsContainer = document.querySelector('#favsContainer')
    favsContainer.innerHTML = ''

    // Verifica si hay favoritos y los muestra
    if (userData.favoritos && userData.favoritos.length > 0) {
      userData.favoritos.forEach((book) => {
        const li = document.createElement('li')
        li.innerHTML = `
          <img src="${book.caratula}" alt="${book.titulo}" />
          <h3>${book.titulo}</h3>
          <h4>${book.autor}</h4>
          <h5>${book.valoracion}</h5>
          <h5>${book.precio}€</h5>
        `
        favsContainer.appendChild(li)
      })
    } else {
      favsContainer.innerHTML = `<li>You have no favorites.</li>`
    }
  } catch (error) {
    console.error('Error fetching favorites:', error)
  }
}

// Función principal que renderiza la vista de favoritos y carga los datos
const Favs = () => {
  document.querySelector('main').innerHTML = template()
  getFavorites()
}

export default Favs
