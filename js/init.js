// URLs del backend desarrollado
const BASE_URL = "https://backend-ecommerce-github-io.vercel.app"; // Cambia localhost por el dominio si despliegas el backend
const CATEGORIES_URL = `${BASE_URL}/categories`;
const PUBLISH_PRODUCT_URL = `${BASE_URL}/sell/publish`;
const PRODUCTS_URL = `${BASE_URL}/cats_products`;
const PRODUCT_INFO_URL = `${BASE_URL}/products`;
const PRODUCT_INFO_COMMENTS_URL = `${BASE_URL}/products_comments`;
const CART_INFO_URL = `${BASE_URL}/user_cart`;
const CART_BUY_URL = `${BASE_URL}/cart/buy`;

// Función para alerta
function showAlert(message) {
  let alertBox = document.getElementById('alert');
  alertBox.textContent = message;
  alertBox.style.display = 'block';
  alertBox.style.opacity = 1; 
      
  // Timer para que desaparezca
  setTimeout(() => {
    alertBox.style.opacity = 0; 
    setTimeout(() => {
      alertBox.style.display = 'none'; 
    }, 500); 
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
  const userDropdown = document.getElementById('userDropdown'); // Seleccionar el botón

  // Obtener el nombre del usuario desde localStorage
  const username = localStorage.getItem('username');

  if (username) {
      // Si hay un usuario logueado, mostrar su nombre
      userDropdown.textContent = username;
  } else {
      // Si no hay usuario logueado, mostrar "Usuario"
      userDropdown.textContent = "Usuario";
  }
});


let showSpinner = function() {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function() {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url) {
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
