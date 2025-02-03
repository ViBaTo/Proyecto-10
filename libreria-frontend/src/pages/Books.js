// Agrega esta función para manejar el clic en el corazón y llamar a la API para añadir a favoritos.
const handleAddToFavorites = async (bookId) => {
  try {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      console.error('No hay usuario almacenado. Por favor, inicia sesión.')
      return
    }

    let parsedUser
    try {
      parsedUser = JSON.parse(storedUser)
    } catch (parseError) {
      console.error('Error parseando el usuario almacenado:', parseError)
      return
    }

    // Verifica que parsedUser sea un objeto con la estructura esperada
    if (
      typeof parsedUser !== 'object' ||
      !parsedUser.token ||
      !parsedUser.user ||
      !parsedUser.user._id
    ) {
      console.error('La información del usuario no es válida:', parsedUser)
      return
    }

    const userId = parsedUser.user._id
    const token = parsedUser.token

    const response = await fetch(
      `http://localhost:3000/api/v1/users/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          favoritos: [bookId] // Puedes ajustar la estructura según lo que espere tu API.
        })
      }
    )
    console.log(response)
    if (response.ok) {
      console.log('Libro añadido a favoritos exitosamente')
    } else {
      console.error('Error al añadir libro a favoritos')
    }
  } catch (error) {
    console.error('Error inesperado', error)
  }
}

// Arrow function que devuelve el template de la sección de libros
const template = () => {
  const storedUser = localStorage.getItem('user')
  let welcomeMsg = ''

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser)
      welcomeMsg = `Welcome ${parsedUser.user.userName}`
    } catch (error) {
      welcomeMsg = 'Welcome User'
    }
  } else {
    welcomeMsg = 'Please, log in'
  }

  return `
    <section id="books">
      <h3>${welcomeMsg}</h3>
      <ul id="bookscontainer"></ul>
    </section>
  `
}

// Función asíncrona que obtiene los libros desde la API y los muestra en el DOM
const getBooks = async () => {
  try {
    // Realiza la solicitud a la API
    const booksData = await fetch('http://localhost:3000/api/v1/books')
    // Convierte la respuesta a JSON
    const books = await booksData.json()
    // Selecciona el contenedor donde se mostrarán los libros
    const booksContainer = document.querySelector('#bookscontainer')

    // Limpia el contenedor en caso de recargas
    booksContainer.innerHTML = ''

    // Recorre cada libro y crea un elemento <li> para mostrar sus datos
    for (const book of books) {
      const li = document.createElement('li')
      li.innerHTML = `
        <img src="${book.caratula}" alt="${book.titulo}" />
        <h3>${book.titulo}</h3>
        <h4>${book.autor}</h4>
        <h5>${book.valoracion}</h5>
        <h5>${book.precio}€</h5>
        <button class="favorite-btn" data-book-id="${book._id}">❤️</button>
      `
      booksContainer.appendChild(li)

      // Asigna el event listener al botón de favoritos para cada libro
      const favoriteBtn = li.querySelector('.favorite-btn')
      if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
          const bookId = favoriteBtn.getAttribute('data-book-id')
          handleAddToFavorites(bookId)
        })
      }
    }
  } catch (error) {
    console.error('Error fetching books:', error)
  }
}

// Función que actualiza el contenido de la sección principal con el template y carga los libros
const Books = () => {
  // Inserta el template en el elemento <main>
  document.querySelector('main').innerHTML = template()
  // Llama a la función para obtener y mostrar los libros
  getBooks()
}

// Exporta la función Books como valor por defecto del módulo
export default Books
