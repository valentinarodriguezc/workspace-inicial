document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalContainer = document.getElementById("cartTotal");
    const emptyCartBtn = document.getElementById("emptyCartBtn");
    
    const updateCartDisplay = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || []; // Recuperar el carrito
        let total = 0;
        cartItemsContainer.innerHTML = ''; // Limpiar contenedor
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
            cartTotalContainer.innerHTML = ''; // Limpiar total si no hay productos
        } else {
            cart.forEach(product => {
                total += product.price * product.quantity; // Calcular total
                cartItemsContainer.innerHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">Precio: ${product.price} USD</p>
                                <p class="card-text">Cantidad: ${product.quantity}</p>
                                <p class="card-text"><strong>Subtotal: ${(product.price * product.quantity).toFixed(2)} USD</strong></p>
                            </div>
                        </div>
                    </div>
                `;
            });
            // Mostrar total del carrito
            cartTotalContainer.innerHTML = `<h4>Total: ${total.toFixed(2)} USD</h4>`;
        }
    };

    // Inicializar la visualización del carrito
    updateCartDisplay();

    // Función para vaciar el carrito
    emptyCartBtn.addEventListener("click", () => {
        localStorage.removeItem("cart"); // Eliminar el carrito de localStorage
        updateCartDisplay(); // Actualizar la visualización
    });
});
