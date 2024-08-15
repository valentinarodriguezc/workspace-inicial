document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (email === '' || password === '') {
        alert('Por favor, completa todos los campos.');
    } else {
        // Simulación de inicio de sesión exitoso para cualquier correo y contraseña
        localStorage.setItem('isLoggedIn', 'true'); // Guardar la sesión
        window.location.href = "index.html"; // Redirigir a la página principal
    }
});

window.onload = function() {
    let currentFile = window.location.pathname.split('/').pop();

    if (!localStorage.getItem('isLoggedIn')) {
        if (currentFile !== 'login.html') {
            // Si no ha iniciado sesión y no está en login.html, redirigir a login.html
            window.location.href = "login.html";
        }
    } else {
        // Mostrar el botón de cierre de sesión si el usuario está autenticado
        let userOptions = document.querySelector('.user-options');
        if (userOptions) {
            userOptions.innerHTML = `
                <a href="#" onclick="logout()">Cerrar Sesión</a>
            `;
        }
    }
};

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = "login.html";
}