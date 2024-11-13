document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    let themeSwitch = document.getElementById("themeSwitch");
    const body = document.body;

    // Función para aplicar el tema
    function applyTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-mode");
            themeSwitch.checked = true; // Mantiene el switch activo
        } else {
            body.classList.remove("dark-mode");
            themeSwitch.checked = false; // Mantiene el switch desactivado
        }
    }

    // Recuperar preferencia del usuario desde localStorage
    const savedTheme = localStorage.getItem("theme") || "light"; // Default: Modo claro
    applyTheme(savedTheme);

    // Evento para cambiar el tema
    themeSwitch.addEventListener("change", () => {
        const theme = themeSwitch.checked ? "dark" : "light";
        applyTheme(theme);
        localStorage.setItem("theme", theme); // Guardar preferencia
    });
});
