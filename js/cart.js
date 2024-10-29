document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalContainer = document.getElementById("cartTotal");
    
    const emptyCartBtn = document.getElementById("emptyCartBtn");

    // Guardar el carrito actualizado en localStorage
    const saveCart = (cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    // Actualizar la visualización del carrito
    const updateCartDisplay = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let total = 0;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
            cartTotalContainer.innerHTML = '';
        } else {
            cart.forEach((product, index) => {
                const subtotal = product.cost * product.quantity; // Calcular subtotal por producto
                total += subtotal; // Sumar al total general

                const productHTML = `
                    <div class="cart-item mb-3">
                        <img src="${product.image}" class="cart-item-image" alt="${product.name}">
                        <div class="cart-item-info">
                            <h5>${product.name}</h5>
                            <p class="price">Precio: ${product.cost} USD</p>
                            <div class="quantity-control d-flex align-items-center">
                                <button class="btn btn-sm btn-secondary decrease-quantity" data-index="${index}">-</button>
                                <span class="quantity mx-2">${product.quantity}</span>
                                <button class="btn btn-sm btn-secondary increase-quantity" data-index="${index}">+</button>
                            </div>
                            <p><strong>Subtotal: ${(subtotal).toFixed(2)} USD</strong></p>
                           
                        </div>
                    </div>
                `;
                cartItemsContainer.innerHTML += productHTML;
            });
            cartTotalContainer.innerHTML = `<h4>Total: ${total.toFixed(2)} USD</h4>`;
        }
    };

    // Evento para aumentar, reducir o eliminar productos del carrito
    cartItemsContainer.addEventListener("click", (e) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const index = e.target.dataset.index;

        if (e.target.classList.contains("increase-quantity")) {
            cart[index].quantity += 1; // Aumentar cantidad
        } else if (e.target.classList.contains("decrease-quantity")) {
            cart[index].quantity -= 1; // Reducir cantidad
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);  // Eliminar el producto si la cantidad es 0
            }
        } else if (e.target.classList.contains("remove-product")) {
            cart.splice(index, 1);  // Eliminar el producto específico
        }

        saveCart(cart); // Guardar carrito actualizado
        updateCartDisplay(); // Actualizar visualización del carrito
    });

    // Inicializar la visualización del carrito
    updateCartDisplay();

    // Función para vaciar el carrito
    emptyCartBtn.addEventListener("click", () => {
        localStorage.removeItem("cart");
        updateCartDisplay();
    });
});
