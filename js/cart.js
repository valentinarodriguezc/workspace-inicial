document.addEventListener("DOMContentLoaded", () => {
  let cartItemsContainer = document.getElementById("cartItems");
  let cartTotalContainer = document.getElementById("cartTotal");

  let currencySwitch = document.getElementById("currencySwitch");
  const changeToDollars = 40; //Precio aprox de un 1 dolar en uy

  let emptyCartBtn = document.getElementById("emptyCartBtn");
  let cartBadge = document.getElementById("cart-badge");

  // Guardar el carrito actualizado en localStorage
  const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };
  // Actualizar el badge del carrito
  const updateCartBadge = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartBadge.textContent = cart.reduce(
      (total, product) => total + product.quantity,
      0
    );
  };

  // Actualizar la visualización del carrito
  const updateCartDisplay = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;
    let subtotal = 0; // Inicializar subtotal
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
      subtotalContainer.innerHTML = "";
      cartTotalContainer.innerHTML = "";
      // Limpiar subtotal si no hay productos
    } else {
      cart.forEach((product, index) => {
        const subtotal = product.cost * product.quantity; // Calcular subtotal por producto
        total += subtotal; // Sumar al total general

        const productHTML = `
                    <div class="cart-item mb-3">
                        <img src="${
                          product.image
                        }" class="cart-item-image" alt="${product.name}">
                        <div class="cart-item-info">
                            <h5>${product.name}</h5>
                            <p class="price">Precio: ${product.cost} UYU</p>
                            <div class="quantity-control d-flex align-items-center">
                                <button class="btn btn-sm btn-secondary decrease-quantity" data-index="${index}">-</button>
                                <span class="quantity mx-2">${
                                  product.quantity
                                }</span>
                                <button class="btn btn-sm btn-secondary increase-quantity" data-index="${index}">+</button>
                            </div>
                            <p><strong>Subtotal: ${subtotal.toFixed(
                              2
                            )} UYU</strong></p>
                           
                        </div>
                    </div>
                `;
        cartItemsContainer.innerHTML += productHTML;
      });
      updateTotalDisplay(total);
    }
    // Actualizar el badge después de mostrar el carrito
    updateCartBadge();
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
        cart.splice(index, 1); // Eliminar el producto si la cantidad es 0
      }
    } else if (e.target.classList.contains("remove-product")) {
      cart.splice(index, 1); // Eliminar el producto específico
    }

    

    saveCart(cart); // Guardar carrito actualizado
    updateCartDisplay(); // Actualizar visualización del carrito
  });

  
  // Función para actualizar el total según la moneda seleccionada
  const updateTotalDisplay = (total) => {
    const selectedCurrency = currencySwitch.value;
    let displayTotal;

    if (selectedCurrency === "UYU") {
      displayTotal = total;
      cartTotalContainer.innerHTML = `<h4>Total: ${displayTotal.toFixed(
        2
      )} UYU</h4>`;
    } else {
      displayTotal = total / changeToDollars;
      cartTotalContainer.innerHTML = `<h4>Total: ${displayTotal.toFixed(
        2
      )} USD</h4>`;
    }
  };

  // Escuchar cambios en el switch de moneda
  currencySwitch.addEventListener("change", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce(
      (acc, product) => acc + product.cost * product.quantity,
      0
    );
    updateTotalDisplay(total);
  });
  // Inicializar la visualización del carrito y el badge
  updateCartDisplay();
  updateCartBadge();

  // Función para vaciar el carrito
  emptyCartBtn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    updateCartDisplay();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const shippingType = document.getElementById("shippingType");
  const paymentMethod = document.getElementById("paymentMethod");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // Función para calcular el total con envío
  const calculateTotalWithShipping = (total) => {
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

    const shippingCost = total * shippingCostPercentage;
    return total + shippingCost;
  };

  // Actualiza el total cada vez que se cambia el tipo de envío
  shippingType.addEventListener("change", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce(
      (acc, product) => acc + product.cost * product.quantity,
      0
    );
    updateTotalDisplay(calculateTotalWithShipping(total));
  });

  // Función para finalizar compra

  checkoutBtn.addEventListener("click", () => {
  const street = document.getElementById("street").value;
  const department = document.getElementById("department").value;
  const zipcode = document.getElementById("zipcode").value;
  const paymentMethod = document.getElementById("paymentMethod"); // Cambiado para obtener el select de la forma de pago
  const selectedPaymentMethod = paymentMethod.value; // Obtener el valor seleccionado
  const shippingSelected = shippingType.value;

  // Verificación de los valores
  console.log("Calle: ", street);
  console.log("Departamento: ", department);
  console.log("Código Postal: ", zipcode);
  console.log("Método de Pago seleccionado: ", selectedPaymentMethod);

  // Verificación de los campos de dirección  
  if (!street || !department || !zipcode) {
    showAlert("Por favor, completa todos los campos de dirección antes de continuar.");
    return;  // Detiene el flujo de ejecución si falta algún campo
  }

  if (!shippingSelected) {
    showAlert("Por favor, selecciona una forma de envío.");
    return;
  }
  
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0 || cart.some(product => product.quantity <= 0)) {
    showAlert("Debes tener productos con cantidad mayor a 0 en tu carrito.");
    return;
  }
  
  // Validar que se haya seleccionado una forma de pago válida
  if (!selectedPaymentMethod || selectedPaymentMethod === "") {
    showAlert("Por favor, selecciona una forma de pago válida.");
    return;
  }

  showAlert("Compra finalizada con éxito. ¡Gracias por tu compra!");
  localStorage.removeItem("cart");
  updateCartDisplay();
  });

  // Inicializar la visualización del carrito y el badge
  updateCartDisplay();
  updateCartBadge();
});

document.addEventListener("DOMContentLoaded", () => {
  let cartItemsContainer = document.getElementById("cartItems");
  let cartTotalContainer = document.getElementById("cartTotal");
  let subtotalContainer = document.getElementById("subtotal");
  let shippingType = document.getElementById("shippingType");
  let currencySwitch = document.getElementById("currencySwitch");
  const changeToDollars = 40; // Precio aproximado de 1 dólar en UYU

  // Guardar el carrito actualizado en localStorage
  const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // Actualizar el subtotal, costo de envío y total en la moneda seleccionada
  const updateCostsDisplay = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = cart.reduce(
      (acc, product) => acc + product.cost * product.quantity,
      0
    );

    // Calcular costo de envío basado en el tipo de envío
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
    let shippingCost = subtotal * shippingCostPercentage;
    let total = subtotal + shippingCost;

    // Obtener la moneda seleccionada
    const selectedCurrency = currencySwitch.value;

    // Convertir subtotal y costo de envío a dólares si la moneda seleccionada es USD
    let displaySubtotal =
      selectedCurrency === "UYU" ? subtotal : subtotal / changeToDollars;
    let displayShippingCost =
      selectedCurrency === "UYU"
        ? shippingCost
        : shippingCost / changeToDollars;
    let displayTotal =
      selectedCurrency === "UYU" ? total : total / changeToDollars;

    // Mostrar el subtotal, costo de envío y total en la moneda seleccionada
    const currencySymbol = selectedCurrency === "UYU" ? "UYU" : "USD";
    subtotalContainer.innerHTML = `<h4>Subtotal: ${displaySubtotal.toFixed(
      2
    )} ${currencySymbol}</h4>`;
    document.getElementById(
      "envioDomicilio"
    ).innerHTML = `<strong><p>Costo de envío: ${displayShippingCost.toFixed(
      2
    )} ${currencySymbol}</p></strong>`;
    updateTotalDisplay(displayTotal);
  };

  // Actualizar la visualización del total en la moneda seleccionada
  const updateTotalDisplay = (total) => {
    const selectedCurrency = currencySwitch.value;
    const currencySymbol = selectedCurrency === "UYU" ? "UYU" : "USD";
    cartTotalContainer.innerHTML = `<h4 class="total">Total: ${total.toFixed(
      2
    )} ${currencySymbol}</h4>`;
  };

 // Modal para confirmar la eliminación de un producto
 let selectedIndex = null; // Almacena el índice del producto a eliminar
 // Mostrar el modal
   const showConfirmModal = (message, onConfirm) => {
 const modal = document.getElementById("confirmModal");
 const confirmYes = document.getElementById("confirmYes");
 const confirmNo = document.getElementById("confirmNo");
 const confirmMessage = document.getElementById("confirmMessage");

 confirmMessage.textContent = message; // Configurar el mensaje
 modal.style.display = "flex"; // Mostrar el modal

 // Confirmar acción
 const confirmHandler = () => {
   onConfirm(); // Ejecutar acción confirmada
   closeModal(); // Cerrar modal
 };

 // Cerrar modal
 const closeModal = () => {
   modal.style.display = "none";
   confirmYes.removeEventListener("click", confirmHandler);
   confirmNo.removeEventListener("click", closeModal);
 };

 confirmYes.addEventListener("click", confirmHandler);
 confirmNo.addEventListener("click", closeModal);
 };


  // Evento para actualizar costos cuando se cambia el tipo de envío
  shippingType.addEventListener("change", updateCostsDisplay);

  // Evento para actualizar costos cuando se cambia la moneda
  currencySwitch.addEventListener("change", updateCostsDisplay);
  

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
        const productSubtotal = product.cost * product.quantity;

        const productHTML = `
                      <div class="cart-item mb-3">
                          <img src="${
                            product.image
                          }" class="cart-item-image" alt="${product.name}">
                          <div class="cart-item-info">
                              <h5>${product.name}</h5>
                              <p class="price">Precio: ${product.cost} UYU</p>
                              <div class="quantity-control d-flex align-items-center">
                                  <button class="btn btn-sm btn-secondary decrease-quantity" data-index="${index}">-</button>
                                  <span class="quantity mx-2">${
                                    product.quantity
                                  }</span>
                                  <button class="btn btn-sm btn-secondary increase-quantity" data-index="${index}">+</button>
                              </div>
                              <p><strong>Subtotal: ${productSubtotal.toFixed(
                                2
                              )} UYU</strong></p>
                          </div>
                      </div>
                  `;
        cartItemsContainer.innerHTML += productHTML;
      });
    }
    // Actualizar el costo total
    updateCostsDisplay();
  };

  // Evento para aumentar, reducir o eliminar productos del carrito
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
  });

  // Inicializar la visualización del carrito y costos
  updateCartDisplay();
  updateCartBadge();
});