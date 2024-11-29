document.addEventListener('DOMContentLoaded', function () { 
    let loginForm = document.getElementById('loginForm');
    let usernameField = document.getElementById('username');
    let passwordField = document.getElementById('password');

    if (loginForm && usernameField && passwordField) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let username = usernameField.value.trim(); // Eliminar espacios en blanco
            let password = passwordField.value.trim(); // Eliminar espacios en blanco

            if (username === '' || password === '') {
                alert('Por favor, completa todos los campos.');
            } else {
                // Guardar datos en localStorage
                localStorage.setItem('isLoggedIn', 'true'); // Indicar que el usuario está logueado
                localStorage.setItem('username', username); // Guardar el nombre del usuario
                console.log("Usuario logueado:", username); // Confirmar en la consola

                // Redirigir a la página principal
                window.location.href = "index.html";
            }
        });
    } else {
        console.error('No se encontraron los elementos necesarios en el DOM.');
    }

    // Redirigir al login si el usuario no está autenticado
    let currentFile = window.location.pathname.split('/').pop();
    if (!localStorage.getItem('isLoggedIn')) {
        if (currentFile !== 'login.html') {
            window.location.href = "login.html";
        }
    }
});

// Función de cierre de sesión
function logout() {
    localStorage.removeItem('isLoggedIn'); // Eliminar el estado de autenticación
    localStorage.removeItem('username'); // Eliminar el nombre del usuario
    window.location.href = "index.html"; // Redirigir al inicio
}
