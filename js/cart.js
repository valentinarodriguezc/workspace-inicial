document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalContainer = document.getElementById("cartTotal");
  const subtotalContainer = document.getElementById("subtotal");
  const shippingType = document.getElementById("shippingType");
  const currencySwitch = document.getElementById("currencySwitch");

  const cartBadge = document.getElementById("cart-badge");
  const changeToDollars = 40; // Tasa de conversión de 1 USD a UYU

  // Mostrar el modal con el mensaje
  const showModal = (message) => {
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message;
    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
  };

  // Guardar el carrito actualizado en localStorage
  const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // Actualizar el badge del carrito
  const updateCartBadge = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQuantity = cart.reduce((total, product) => total + product.quantity, 0);
    cartBadge.textContent = totalQuantity;
  };

  // Actualizar el subtotal y total basado en moneda y tipo de envío
  const updateCostsDisplay = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = 0;

    cart.forEach((product) => {
      const productCost =
        product.currency === "USD" ? product.cost * changeToDollars : product.cost;
      subtotal += productCost * product.quantity;
    });

    let shippingCostPercentage;
    switch (shippingType.value) {
      case "premium":
        shippingCostPercentage = 0.15;
        break;
      case "express":
        shippingCostPercentage = 0.07;
        break;
      default:
        shippingCostPercentage = 0.05;
    }
    const shippingCost = subtotal * shippingCostPercentage;
    const total = subtotal + shippingCost;

    const selectedCurrency = currencySwitch.value;
    const currencySymbol = selectedCurrency === "UYU" ? "UYU" : "USD";
    const displaySubtotal =
      selectedCurrency === "UYU" ? subtotal : subtotal / changeToDollars;
    const displayShippingCost =
      selectedCurrency === "UYU"
        ? shippingCost
        : shippingCost / changeToDollars;
    const displayTotal =
      selectedCurrency === "UYU" ? total : total / changeToDollars;

    subtotalContainer.innerHTML = `<h4>Subtotal: ${displaySubtotal.toFixed(
      2
    )} ${currencySymbol}</h4>`;
    document.getElementById(
      "envioDomicilio"
    ).innerHTML = `<strong><p>Costo de envío: ${displayShippingCost.toFixed(
      2
    )} ${currencySymbol}</p></strong>`;
    cartTotalContainer.innerHTML = `<h4 class="total">Total: ${displayTotal.toFixed(
      2
    )} ${currencySymbol}</h4>`;
  };

  // Actualizar la visualización del carrito
  const updateCartDisplay = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
      subtotalContainer.innerHTML = "";
      cartTotalContainer.innerHTML = "";
    } else {
      cart.forEach((product, index) => {
        const productCost =
          product.currency === "USD" ? product.cost * changeToDollars : product.cost;
        const productSubtotal = productCost * product.quantity;

        const productHTML = `
          <div class="cart-item mb-3">
              <img src="${product.image}" class="cart-item-image" alt="${product.name}">
              <div class="cart-item-info">
                  <h5>${product.name}</h5>
                  <p class="price">Precio: ${productCost.toFixed(2)} UYU</p>
                  <div class="quantity-control d-flex align-items-center">
                      <button class="btn btn-sm btn-secondary decrease-quantity" data-index="${index}">-</button>
                      <span class="quantity mx-2">${product.quantity}</span>
                      <button class="btn btn-sm btn-secondary increase-quantity" data-index="${index}">+</button>
                  </div>
                  <p><strong>Subtotal: ${productSubtotal.toFixed(2)} UYU</strong></p>
              </div>
          </div>
        `;
        cartItemsContainer.innerHTML += productHTML;
      });
    }
    updateCostsDisplay();
  };

  // Manejar eventos de aumento o reducción de cantidad
  cartItemsContainer.addEventListener("click", (e) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = e.target.dataset.index;

    if (e.target.classList.contains("increase-quantity")) {
      cart[index].quantity += 1;
    } else if (e.target.classList.contains("decrease-quantity")) {
      cart[index].quantity -= 1;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
    }

    saveCart(cart);
    updateCartDisplay();
    updateCartBadge();
  });

  // Evento para cambiar la moneda
  currencySwitch.addEventListener("change", updateCostsDisplay);

  // Evento para cambiar el tipo de envío
  shippingType.addEventListener("change", updateCostsDisplay);

  // Función para finalizar compra
  const checkoutBtn = document.getElementById("checkoutBtn");
  checkoutBtn.addEventListener("click", () => {
    const street = document.getElementById("street").value;
    const department = document.getElementById("department").value;
    const zipcode = document.getElementById("zipcode").value;
    const paymentMethod = document.getElementById("paymentMethod"); // Cambiado para obtener el select de la forma de pago
    const selectedPaymentMethod = paymentMethod.value; // Obtener el valor seleccionado
    const shippingSelected = shippingType.value;

    // Verificación de los campos de dirección  
    if (!street || !department || !zipcode) {
      showModal("Por favor, completa todos los campos de dirección antes de continuar.");
      return;  // Detiene el flujo de ejecución si falta algún campo
    }

    if (!shippingSelected) {
      showModal("Por favor, selecciona una forma de envío.");
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0 || cart.some(product => product.quantity <= 0)) {
      showModal("Debes tener productos con cantidad mayor a 0 en tu carrito.");
      return;
    }
    
    // Validar que se haya seleccionado una forma de pago válida
    if (!selectedPaymentMethod || selectedPaymentMethod === "") {
      showModal("Por favor, selecciona una forma de pago válida.");
      return;
    }

    showModal("Compra finalizada con éxito. ¡Gracias por tu compra!");
    localStorage.removeItem("cart");
    updateCartDisplay();
  });

  // Inicializar la visualización
  updateCartDisplay();
  updateCartBadge();
});