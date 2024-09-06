// Array para almacenar los productos
let listaProductos = [];

// Cargar y mostrar los productos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  let categoryId = localStorage.getItem("catID");

  getJSONData(PRODUCTS_URL + categoryId + EXT_TYPE).then(function(resultObj){

    if (resultObj.status === "ok"){
      mostrarProductos(resultObj.data.products);
    }
  })
});


function setProductID(id) {
  localStorage.setItem("productID", id);  // Guardar el ID del producto
  window.location = "product-info.html";  // Redirigir a la página de detalles
}



// Función para mostrar los productos como tarjetas
function mostrarProductos(productos) {
  let contenedorProductos = document.querySelector('#listaProductos');
  let contenedorHTML = '';

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
