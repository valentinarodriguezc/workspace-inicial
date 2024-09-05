// Array para almacenar los productos
let listaProductos = [];

// Función para mostrar los productos como tarjetas
function mostrarProductos(productos) {
  let contenedorProductos = document.querySelector('#listaProductos');
  let contenedorHTML = ''; // Construye el HTML en un solo string

  // Recorrer cada producto y crear su tarjeta
  productos.forEach(producto => {
    contenedorHTML += `
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
  });
  contenedorProductos.innerHTML = contenedorHTML;
}

// Función para filtrar productos en tiempo real
function filtrarProductos() {
  const searchInput = document.querySelector('#searchInput'); // Seleccionar el input de búsqueda
  
   // Verificar que el campo de búsqueda exista
   if (searchInput) {
    searchInput.addEventListener('input', function(event) {
      const searchTerm = event.target.value.toLowerCase(); // Convertir a minúsculas para búsqueda case-insensitive

    // Filtrar productos que coincidan con el término de búsqueda en nombre o descripción
    const productosFiltrados = listaProductos.filter(producto => 
      producto.name.toLowerCase().includes(searchTerm) || 
      producto.description.toLowerCase().includes(searchTerm)
    );

    // Mostrar los productos filtrados
    mostrarProductos(productosFiltrados);
  });
} else {
  console.error("Campo de búsqueda no encontrado");
  }
}
// Cargar y mostrar los productos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  let categoryId = localStorage.getItem("catID");

  getJSONData(PRODUCTS_URL + categoryId + EXT_TYPE).then(function(resultObj){
    if (resultObj.status === "ok"){
      listaProductos = resultObj.data.products; // Asignar los productos obtenidos al array global
      mostrarProductos(listaProductos); // Mostrar todos los productos inicialmente
      filtrarProductos(); // Activar el filtrado en tiempo real
    }
  })
});