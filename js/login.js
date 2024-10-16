document.addEventListener('DOMContentLoaded', function() { 
    let loginForm = document.getElementById('loginForm');
    let usernameField = document.getElementById('username');
    let passwordField = document.getElementById('password');

    if (loginForm && usernameField && passwordField) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let username = usernameField.value;
            let password = passwordField.value;

            if (username === '' || password === '') {
                alert('Por favor, completa todos los campos.');
            } else {
                // Simulación de inicio de sesión exitoso para cualquier correo y contraseña
                localStorage.setItem('isLoggedIn', 'true'); // Guardar la sesión
                localStorage.setItem('email', username); // Guardar el nombre de usuario
                window.location.href = "index.html"; // Redirigir a la página principal
            }
        });
    } else {
        console.error('No se encontraron los elementos necesarios en el DOM.');
    }

    // Código para la redirección basada en el estado de autenticación
    let currentFile = window.location.pathname.split('/').pop();
    if (!localStorage.getItem('isLoggedIn')) {
        if (currentFile !== 'login.html') {
            window.location.href = "login.html";
        }
    } 
});

// Función de cierre de sesión
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    window.location.href = "index.html";
}