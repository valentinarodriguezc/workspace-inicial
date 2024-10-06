// Array para almacenar los productos
let listaProductos = [];
let productosFiltrados = [];
let minPrice = undefined;
let maxPrice = undefined;
let currentSortCriteria = undefined;

function setProductID(id) {
  localStorage.setItem("productID", id);  // Guardar el ID del producto
  window.location = "product-info.html";  // Redirigir a la página de detalles
}

// Función para aplicar el filtro de precio
function aplicarFiltroDePrecio(productos) {
  return productos.filter(producto => {
    let precio = parseFloat(producto.cost);
    return (isNaN(minPrice) || precio >= minPrice) && (isNaN(maxPrice) || precio <= maxPrice);
  });
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
  productos = aplicarFiltroDePrecio(productos);

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
      productosFiltrados = listaProductos.filter(producto => 
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

  // Verifica si categoryId está disponible
  if (!categoryId) {
    console.error("No se encontró el ID de categoría.");
    return;
  }

  getJSONData(PRODUCTS_URL + categoryId + EXT_TYPE).then(function(resultObj) {
    if (resultObj.status === "ok") {
      listaProductos = resultObj.data.products;
      productosFiltrados = [...listaProductos];  // Inicializa productosFiltrados con todos los productos
      document.getElementById("categoryname").innerHTML = resultObj.data.catName;

      // Verificar si hay productos disponibles
      if (listaProductos && listaProductos.length > 0) {
        mostrarProductos(productosFiltrados); // Mostrar todos los productos inicialmente
      } else {
        console.error("No hay productos cargados para filtrar.");
      }
      
      // Activa el filtrado en tiempo real
      filtrarProductos(); // Asegúrate de que esta línea esté aquí
    } else {
      console.error("Error al cargar los productos:", resultObj.status);
    }
  }).catch(function(error) {
    console.error('Error al obtener datos:', error);
  });
});

// Añadir evento al botón de filtrado de precios
document.getElementById('rangeFilterPrice').addEventListener('click', function() {
  let minPriceValue = document.getElementById('rangeFilterPriceMin').value;
  let maxPriceValue = document.getElementById('rangeFilterPriceMax').value;

  minPrice = minPriceValue ? parseFloat(minPriceValue) : undefined;
  maxPrice = maxPriceValue ? parseFloat(maxPriceValue) : undefined;

  if (isNaN(minPrice)) minPrice = undefined;
  if (isNaN(maxPrice)) maxPrice = undefined;

  // Aplicar filtro de precios sobre productos filtrados
  mostrarProductos(aplicarFiltroDePrecio(productosFiltrados));
});

// Añadir eventos a los botones de ordenamiento
document.getElementById('sortPriceAsc').addEventListener('click', function() {
  currentSortCriteria = 'priceAsc';
  mostrarProductos(productosFiltrados); // Ordena sobre los productos filtrados
});

document.getElementById('sortPriceDesc').addEventListener('click', function() {
  currentSortCriteria = 'priceDesc';
  mostrarProductos(productosFiltrados); // Ordena sobre los productos filtrados
});

document.getElementById('sortByRelevance').addEventListener('click', function() {
  currentSortCriteria = 'relevanceDesc';
  mostrarProductos(productosFiltrados); // Ordena sobre los productos filtrados
});

// Añadir evento al botón de limpiar filtro
document.getElementById('clearPriceFilter').addEventListener('click', function() {
  // Limpiar los campos de entrada de precios
  document.getElementById('rangeFilterPriceMin').value = '';
  document.getElementById('rangeFilterPriceMax').value = '';

  // Restablecer las variables de rango de precios
  minPrice = undefined;
  maxPrice = undefined;

  // Mostrar todos los productos (sin filtro)
  mostrarProductos(listaProductos);
});
