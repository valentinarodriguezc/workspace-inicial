// Verificar si el usuario está autenticado
document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem('isLoggedIn')) {
        console.log("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html"; // Redirigir al login si no está autenticado
    }
});
 // Cambiar el nombre de usuario en el botón desplegable
 const userLogged = localStorage.getItem('email');
 if (userLogged) {
     document.getElementById("userDropdown").textContent = userLogged;
 }

 // Cerrar sesión
 document.getElementById("logoutBtn").addEventListener("click", function() {
     // Eliminar la sesión y redirigir al login
     localStorage.removeItem('isLoggedIn');
     localStorage.removeItem('email');
     window.location.href = "login.html";
 });

// Resto del código que maneja los eventos de los elementos de la página
document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});