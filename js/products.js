// Array para almacenar los productos
let listaProductos = [];
let minPrice = undefined;
let maxPrice = undefined;
let currentSortCriteria = undefined;



function setProductID(id) {
  localStorage.setItem("productID", id);  // Guardar el ID del producto
  window.location = "product-info.html";  // Redirigir a la página de detalles
}


// Función para ordenar productos
function ordenarProductos(productos, criterio) {
  if (criterio === 'priceAsc') {
    return productos.sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));
  } else if (criterio === 'priceDesc') {
    return productos.sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost));
  } else if (criterio === 'relevanceDesc') {
    return productos.sort((a, b) => b.soldCount - a.soldCount);
  }
  return productos;
}

// Función para mostrar los productos como tarjetas
function mostrarProductos(productos) {
  let contenedorProductos = document.querySelector('#listaProductos');
  let contenedorHTML = '';

   // Filtrar productos basado en el rango de precios
   productos = productos.filter(producto => {
    let precio = parseFloat(producto.cost);
    return (isNaN(minPrice) || precio >= minPrice) && (isNaN(maxPrice) || precio <= maxPrice);
  });

  // Ordenar productos basado en el criterio actual
  productos = ordenarProductos(productos, currentSortCriteria);


  // Recorrer cada producto y crear su tarjeta
  productos.forEach(producto => {
    contenedorHTML += `
      <div class="col-md-4">
        <div class="cards" class="card mb-4 shadow-sm custom-card cursor-active" onclick="setProductID(${producto.id})">
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
// Añadir evento al botón de filtrado
document.getElementById('filterButton').addEventListener('click', function() {
  minPrice = parseFloat(document.getElementById('minPrice').value);
  maxPrice = parseFloat(document.getElementById('maxPrice').value);
  mostrarProductos(listaProductos);
});



  // Añadir eventos a los botones de ordenamiento
  document.getElementById('sortAscPrice').addEventListener('click', function() {
    currentSortCriteria = "PRICE_ASC";
    mostrarProductos(listaProductos);
  });

  document.getElementById('sortPriceDesc').addEventListener('click', function() {
    currentSortCriteria = 'priceDesc';
    mostrarProductos(listaProductos);
  });

  document.getElementById('sortRelevanceDesc').addEventListener('click', function() {
    currentSortCriteria = 'relevanceDesc';
    mostrarProductos(listaProductos);
  });

