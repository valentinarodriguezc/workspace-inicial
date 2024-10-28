document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    if (!localStorage.getItem('isLoggedIn')) {
        alert('Por favor, inicia sesión para acceder a tu perfil.');
        window.location.href = 'login.html'; // Redirigir a la página de login si no está logueado
        return; // Detener la ejecución si no está logueado
    }

    // Función para cargar datos desde localStorage
    function loadFromLocalStorage() {
        let nombre = localStorage.getItem('nombre') || '';
        let segundoNombre = localStorage.getItem('segundo-nombre') || '';
        let apellido = localStorage.getItem('apellido') || '';
        let segundoApellido = localStorage.getItem('segundo-apellido') || '';
        let email = localStorage.getItem('email') || '';
        let telefono = localStorage.getItem('telefono') || '';

        // Actualizar la interfaz con los datos almacenados
        document.getElementById('nombre-primero').textContent = 'Nombre: ' + nombre;
        document.getElementById('segundo-nombre').textContent = 'Segundo nombre: ' + segundoNombre;
        document.getElementById('apellido-primero').textContent = 'Apellido: ' + apellido;
        document.getElementById('segundo-apellido').textContent = 'Segundo apellido: ' + segundoApellido;
        document.getElementById('email-primero').textContent = 'E-mail: ' + email;
        document.getElementById('telefono-primero').textContent = 'Teléfono: ' + telefono;

        // También actualiza la parte superior del perfil
        document.getElementById('nombreUsuario').textContent = nombre;
        document.getElementById('apellidoUsuario').textContent = apellido;
        document.getElementById('emailUsuario').textContent = email;
        document.getElementById('telefonoUsuario').textContent = telefono;
    }

    // Cargar los datos cuando la página se cargue
    loadFromLocalStorage();

    // Se selecciona el botón "Editar perfil" y el modal
    let editButton = document.querySelector('.edit-button');
    let modal = document.getElementById('editProfileModal');
    let closeModal = document.querySelector('.close');

    // obtener el email almacenado en localStorage para rellenar
    document.getElementById('emailInput').value = localStorage.getItem('email') || '';

    // Cuando se haga clic en "Editar perfil"
    editButton.addEventListener('click', function() {
        modal.style.display = 'flex'; 
        // Rellenar el formulario con los datos actuales (si existen)
        document.getElementById('nombreInput').value = localStorage.getItem('nombre') || '';
        document.getElementById('apellidoInput').value = localStorage.getItem('apellido') || '';
        document.getElementById('telefonoInput').value = localStorage.getItem('telefono') || '';
        document.getElementById('segundoNombreInput').value = localStorage.getItem('segundo-nombre') || '';
        document.getElementById('segundoApellidoInput').value = localStorage.getItem('segundo-apellido') || '';
    });

    // Cerrar modal al hacer click en "x"
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none'; // Ocultar el modal
    });

    // Cerrar modal al hacer click fuera del contenido del modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Ocultar modal
        }
    });

    // Envío del formulario de edición de perfil
    let editProfileForm = document.getElementById('editProfileForm');
    editProfileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obtener los valores del formulario
        let updatedNombre = document.getElementById('nombreInput').value;
        let updatedEmail = document.getElementById('emailInput').value;
        let updatedApellido = document.getElementById('apellidoInput').value;
        let updatedTelefono = document.getElementById('telefonoInput').value;
        let updatedSegNombre = document.getElementById('segundoNombreInput').value;
        let updatedSegApellido = document.getElementById('segundoApellidoInput').value;

        // Guardar los nuevos datos en localStorage
        localStorage.setItem('nombre', updatedNombre);
        localStorage.setItem('email', updatedEmail);
        localStorage.setItem('apellido', updatedApellido);
        localStorage.setItem('telefono', updatedTelefono);
        localStorage.setItem('segundo-nombre', updatedSegNombre);
        localStorage.setItem('segundo-apellido', updatedSegApellido);

        // Actualizar datos en la info (parte superior)
        document.getElementById('nombreUsuario').textContent = updatedNombre;
        document.getElementById('emailUsuario').textContent = updatedEmail;
        document.getElementById('apellidoUsuario').textContent = updatedApellido;
        //document.getElementById('telefonoUsuario').textContent = updatedTelefono;

        // Actualizar datos en la info-box (interfaz)
        document.getElementById('nombre-primero').textContent = 'Nombre: ' + updatedNombre;
        document.getElementById('segundo-nombre').textContent = 'Segundo nombre: ' + updatedSegNombre;
        document.getElementById('apellido-primero').textContent = 'Apellido: ' + updatedApellido;
        document.getElementById('segundo-apellido').textContent = 'Segundo apellido: ' + updatedSegApellido;
        document.getElementById('email-primero').textContent = 'E-mail: ' + updatedEmail;
        document.getElementById('telefono-primero').textContent = 'Teléfono: ' + updatedTelefono;

        // Mostrar la alerta 
        showAlert("Cambios guardados correctamente");

        // Ocultar el modal
        modal.style.display = 'none';
    });

    // Modo día y noche
    let modoDiaBtn = document.getElementById('modoDia');
    let modoNocheBtn = document.getElementById('modoNoche');
    let body = document.body;

    modoDiaBtn.addEventListener('click', () => {
        body.classList.add('dia');
        body.classList.remove('noche');
        modoDiaBtn.classList.add('active');
        modoNocheBtn.classList.remove('active');
    });

    modoNocheBtn.addEventListener('click', () => {
        body.classList.add('noche');
        body.classList.remove('dia');
        modoNocheBtn.classList.add('active');
        modoDiaBtn.classList.remove('active');
    });
});


