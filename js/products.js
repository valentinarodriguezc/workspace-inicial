// Array para almacenar los productos
const listaProductos = [];

// Función asincrónica para obtener los productos desde la API
async function obtenerProductos() {
  // URL de la API
  const apiUrl = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

  try {
    // Realizar la petición con fetch y esperar la respuesta
    const response = await fetch(apiUrl);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }

    // Convertir la respuesta a JSON y almacenarla en una constante
    const productosData = await response.json();

    // Almacenar los productos en el array listaProductos
    listaProductos.push(...productosData.products);

    // Mostrar los productos en el frontend
    mostrarProductos();
  } catch (error) {
    // Manejo de errores
    console.error('Hubo un problema con la solicitud:', error);
  }
}

// Función para mostrar los productos en el frontend como tarjetas
function mostrarProductos() {
  const contenedorProductos = document.querySelector('#listaProductos');
  contenedorProductos.innerHTML = ''; // Limpiar el contenedor

  // Recorrer cada producto y crear su tarjeta
  listaProductos.forEach(producto => {
    const tarjetaProducto = `
      <div class="col-md-4">
        <div class="cards" class="card mb-4 shadow-sm custom-card cursor-active">
          <img class="bd-placeholder-img card-img-top" src="${producto.image}" alt="${producto.name}">
          <h3 class="m-3">${producto.name}</h3>
          <div class="card-body">
            <p class="card-text">${producto.description}</p>
            <p class="card-text"><strong>Precio:</strong> ${producto.cost} ${producto.currency}</p>
            <p class="card-text"><strong>Vendidos:</strong> ${producto.soldCount}</p>
          </div>
        </div>
      </div>
    `;
    contenedorProductos.innerHTML += tarjetaProducto;
  });
}

// Llamar a la función para obtener y mostrar los productos
obtenerProductos();