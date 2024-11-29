// Variables globales
let listaProductos = [];
let productosFiltrados = [];
let minPrice = undefined;
let maxPrice = undefined;
let currentSortCriteria = undefined;

const cartBadge = document.getElementById("cart-badge");

// Función principal para cargar los productos al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  let categoryName = localStorage.getItem("catName"); // Recuperar el nombre de la categoría

  if (!categoryName) {
    console.error("No se encontró el nombre de la categoría.");
    return;
  }

  // Solicitar productos desde el backend usando el nombre de la categoría como filtro
  getJSONData(`https://backend-ecommerce-github-io.vercel.app/products?category=${encodeURIComponent(categoryName)}`)
    .then(function (resultObj) {
      if (resultObj.status === "ok") {
        listaProductos = resultObj.data; // Productos filtrados por la categoría
        productosFiltrados = [...listaProductos]; // Inicializar productos filtrados

        // Mostrar el nombre de la categoría en el título
        document.getElementById("categoryname").innerHTML = categoryName;

        if (listaProductos.length > 0) {
          mostrarProductos(productosFiltrados);
        } else {
          console.error("No hay productos disponibles para esta categoría.");
        }

        // Habilitar el filtrado en tiempo real
        activarFiltroEnTiempoReal();
      } else {
        console.error("Error al cargar los productos:", resultObj.status);
      }
    })
    .catch(function (error) {
      console.error("Error al obtener datos del backend:", error);
    });
});

// Función para mostrar los productos en la página
function mostrarProductos(productos) {
  const contenedorProductos = document.querySelector('#listaProductos');
  let contenedorHTML = '';

  // Filtrar y ordenar productos
  productos = aplicarFiltroDePrecio(productos);
  productos = ordenarProductos(productos, currentSortCriteria);

  // Crear tarjetas para cada producto
  productos.forEach(producto => {
    const imageUrl = producto.images?.[0] || "img/default.jpg"; // Usa la primera imagen o una predeterminada
    contenedorHTML += `
      <div class="col-md-4">
        <div class="card mb-4 shadow-sm cursor-active" onclick="setProductID(${producto.id})">
          <img class="bd-placeholder-img card-img-top" src="${imageUrl}" alt="${producto.name}">
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
  updateCartBadge(); // Actualizar el badge del carrito
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
    return productos.sort((a, b) => a.cost - b.cost);
  } else if (criterio === 'priceDesc') {
    return productos.sort((a, b) => b.cost - a.cost);
  } else if (criterio === 'relevanceDesc') {
    return productos.sort((a, b) => b.soldCount - a.soldCount);
  }
  return productos;
}

// Función para actualizar el badge del carrito
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartBadge.textContent = cart.reduce((total, product) => total + product.quantity, 0);
}

// Función para activar el filtro en tiempo real
function activarFiltroEnTiempoReal() {
  const searchInput = document.querySelector('#searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function (event) {
      const searchTerm = event.target.value.toLowerCase();
      productosFiltrados = listaProductos.filter(producto =>
        producto.name.toLowerCase().includes(searchTerm) || producto.description.toLowerCase().includes(searchTerm)
      );
      mostrarProductos(productosFiltrados);
    });
  } else {
    console.error("Campo de búsqueda no encontrado.");
  }
}

// Configurar eventos de los botones de filtrado
document.getElementById('rangeFilterPrice').addEventListener('click', function () {
  const minPriceValue = parseFloat(document.getElementById('rangeFilterPriceMin').value);
  const maxPriceValue = parseFloat(document.getElementById('rangeFilterPriceMax').value);
  minPrice = isNaN(minPriceValue) ? undefined : minPriceValue;
  maxPrice = isNaN(maxPriceValue) ? undefined : maxPriceValue;
  mostrarProductos(productosFiltrados);
});

document.getElementById('sortPriceAsc').addEventListener('click', () => {
  currentSortCriteria = 'priceAsc';
  mostrarProductos(productosFiltrados);
});

document.getElementById('sortPriceDesc').addEventListener('click', () => {
  currentSortCriteria = 'priceDesc';
  mostrarProductos(productosFiltrados);
});

document.getElementById('sortByRelevance').addEventListener('click', () => {
  currentSortCriteria = 'relevanceDesc';
  mostrarProductos(productosFiltrados);
});

document.getElementById('clearPriceFilter').addEventListener('click', () => {
  document.getElementById('rangeFilterPriceMin').value = '';
  document.getElementById('rangeFilterPriceMax').value = '';
  minPrice = maxPrice = undefined;
  mostrarProductos(listaProductos);
});

// Función para redirigir al producto seleccionado
function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location.href = "product-info.html";
}
