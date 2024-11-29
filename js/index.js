// Verificar si el usuario está autenticado
document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem('isLoggedIn')) {
        console.log("No has iniciado sesión. Redirigiendo al login...");
        window.location.href = "login.html"; // Redirigir al login si no está autenticado
    }

    // Cambiar el nombre de usuario en el botón desplegable
    const userLogged = localStorage.getItem('email');
    if (userLogged) {
        const userDropdown = document.getElementById("userDropdown");
        if (userDropdown) {
            userDropdown.textContent = userLogged;
        } else {
            console.error("No se encontró el elemento con ID 'userDropdown'.");
        }
    }

    // Actualizar el badge del carrito
    const cartBadge = document.getElementById("cart-badge");
    if (cartBadge) {
        const updateCartBadge = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cartBadge.textContent = cart.reduce((total, product) => total + product.quantity, 0);
        };
        updateCartBadge();
    } else {
        console.error("No se encontró el elemento con ID 'cart-badge'.");
    }

    localStorage.removeItem("catName"); // Eliminar cualquier categoría seleccionada previamente

    // Asignar eventos a las categorías usando el nombre de la categoría
    const categories = {
        autos: "Autos",
        juguetes: "Juguetes",
        muebles: "Muebles"
    };

    for (const [categoryId, categoryName] of Object.entries(categories)) {
        const categoryElement = document.getElementById(categoryId);
        if (categoryElement) {
            categoryElement.addEventListener("click", function () {
                localStorage.setItem("catName", categoryName); // Guardar el nombre de la categoría
                window.location.href = "products.html"; // Redirigir a la página de productos
            });
        } else {
            console.error(`No se encontró el elemento con ID '${categoryId}'.`);
        }
    }

    // Cerrar sesión
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            // Eliminar la sesión y redirigir al login
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('email');
            window.location.href = "login.html";
        });
    } else {
        console.error("No se encontró el elemento con ID 'logoutBtn'.");
    }
});
