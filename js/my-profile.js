document.addEventListener('DOMContentLoaded', function() {
    // Se selecciona el botón "Editar perfil" y el modal
    let editButton = document.querySelector('.edit-button');
    let modal = document.getElementById('editProfileModal');
    let closeModal = document.querySelector('.close');

    // Rellenar el formulario con los datos actuales (solo e-mail)
    document.getElementById('emailInput').value = localStorage.getItem('email') || '';

    // Cuando se haga clic en "Editar perfil"
    editButton.addEventListener('click', function() {
        modal.style.display = 'flex'; // Mostrar el modal
        // Rellenar el formulario con los datos actuales
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
        document.getElementById('telefonoUsuario').textContent = updatedTelefono;

        // Actualizar datos en la info-box (interfaz)
        document.getElementById('nombre-primero').textContent = 'Nombre: ' + updatedNombre;
        document.getElementById('segundo-nombre').textContent = 'Segundo nombre: ' + updatedSegNombre;
        document.getElementById('apellido-primero').textContent = 'Apellido: ' + updatedApellido;
        document.getElementById('segundo-apellido').textContent = 'Segundo apellido: ' + updatedSegApellido;
        document.getElementById('email-primero').textContent = 'E-mail: ' + updatedEmail;
        document.getElementById('telefono-primero').textContent = 'Teléfono: ' + updatedTelefono;

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
