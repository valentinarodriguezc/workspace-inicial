// Función para mostrar una alerta personalizada
function showCustomAlert(message, type = "success") {
    const alertContainer = document.getElementById("custom-alert");
    if (!alertContainer) return;

    // Aplicar estilos según el tipo de alerta
    alertContainer.className = `custom-alert ${type} visible`;
    alertContainer.textContent = message;

    // Ocultar después de 3 segundos
    setTimeout(() => {
        alertContainer.classList.remove("visible");
        alertContainer.classList.add("hidden");
    }, 3000);
}
