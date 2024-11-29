
document.addEventListener("DOMContentLoaded", async () => {
    let productID = localStorage.getItem("productID"); // Recuperar el ID del producto
    let productInfo = document.getElementById("product-info");
    let relatedProductsContainer = document.getElementById("listaProductosRelacionados"); // Contenedor de productos relacionados
    let commentsSection = document.getElementById("comments-section"); // Sección de comentarios

    if (!productID) {
        console.error("No se encontró el ID del producto en localStorage.");
        document.getElementById("product-info").innerHTML = "<p>Error: No se puede cargar la información del producto.</p>";
        return;
    }
    console.log("ID del producto recuperado:", productID); // Asegúrate de que este log muestre el ID correcto
    
    if (!productID) {
        console.error("No se encontró el ID del producto.");
        productInfo.innerHTML = "<p>Error: No se puede cargar la información del producto.</p>";
        return;
    }

    let loggedInUser = localStorage.getItem("username") || "Invitado";
    console.log("Usuario logueado:", loggedInUser);

    // Solicitar datos del producto y comentarios desde el backend
    const responseID = await getJSONData(`${PRODUCT_INFO_URL}/${productID}`);
    const responseComments = await getJSONData(`${PRODUCT_INFO_COMMENTS_URL}/${productID}`);

    if (responseID.status === "ok" && responseComments.status === "ok") {
        let product = responseID.data;
        let productComments = responseComments.data;

        // Generar el carrusel de imágenes
        let imagesHTML = product.images.map((imageURL, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${imageURL}" class="d-block w-100" alt="${product.name}">
            </div>
        `).join('');

        // Mostrar los detalles del producto
        productInfo.innerHTML = `
        <div class="card">
            <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    ${product.images.map((_, index) => `
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="true" aria-label="Slide ${index + 1}"></button>
                    `).join('')}
                </div>
                <div class="carousel-inner">${imagesHTML}</div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text"><strong>Descripción:</strong> ${product.description}</p>
                <p class="card-text"><strong>Categoría:</strong> ${product.category}</p>
                <p class="card-text"><strong>Vendidos:</strong> ${product.soldCount}</p>
                <p class="card-text"><strong>Precio:</strong> ${product.currency}: ${product.cost}</p>
                <button id="buyButton" class="btn btn-primary">Comprar</button>
                <button id="addToCart" class="btn btn-primary">Añadir al Carrito</button>
            </div>
        </div>
        `;

        // Función para añadir al carrito
        const addToCart = () => {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingProductIndex = cart.findIndex(item => item.id === product.id);

            if (existingProductIndex > -1) {
                // Si el producto ya está en el carrito, incrementa la cantidad
                cart[existingProductIndex].quantity += 1;
            } else {
                // Si el producto no está en el carrito, añádelo
                cart.push({
                    id: product.id,
                    name: product.name,
                    cost: product.cost,
                    currency: product.currency,
                    quantity: 1,
                    image: product.images[0]
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
        };

        // Función para comprar
        const buyNow = () => {
            addToCart(); // Añade el producto al carrito
            window.location.href = "cart.html"; // Redirige al carrito
        };

        // Mostrar una alerta al añadir al carrito
        document.getElementById("addToCart").addEventListener("click", () => {
            addToCart();
            showCustomAlert("Producto añadido al carrito.", "success");
        });

        // Mostrar una alerta al comprar
        document.getElementById("buyButton").addEventListener("click", () => {
            buyNow();
            showCustomAlert("¡Gracias por tu compra! Redirigiendo al carrito...", "info");
        });

        // Mostrar productos relacionados
        if (product.relatedProducts && product.relatedProducts.length > 0) {
            relatedProducts = product.relatedProducts; // Almacenar los productos relacionados
            relatedProductsContainer.innerHTML = relatedProducts.map(relatedProduct => `
                <div class="col-md-3">
                    <div class="card mb-4 shadow-sm cursor-active" onclick="setProductID(${relatedProduct.id})">
                        <img src="${relatedProduct.image}" alt="${relatedProduct.name}" class="card-img-top img-fluid" />
                        <div class="card-body">
                            <h5 class="card-title">${relatedProduct.name}</h5>
                            <p class="card-text"><strong>Precio:</strong> ${relatedProduct.currency || ''} ${relatedProduct.cost || 'N/A'}</p>
                            <p class="card-text"><strong>Vendidos:</strong> ${relatedProduct.soldCount || 0}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            relatedProductsContainer.innerHTML = "<p>No hay productos relacionados disponibles.</p>";
        }

        // Procesar comentarios existentes
        commentsSection.innerHTML = `
        <h5>Comentarios:</h5>
        ${productComments.map(comment => `
            <div class="comment mb-3">
                <h6>${comment.user}</h6>
                <div class="stars">${getStars(comment.score)}</div>
                <p>${comment.description}</p>
                <p><small class="text-muted">${new Date(comment.dateTime).toLocaleString()}</small></p>
            </div>
        `).join('')}`;

        // Manejar el envío del formulario de comentarios
        const opinionForm = document.getElementById("opinion-form");
        opinionForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevenir recarga de la página

            // Obtener datos del formulario
            const rating = document.querySelector('input[name="rating"]:checked'); // Calificación seleccionada
            const commentText = document.getElementById("comentarios").value.trim();

            if (!rating || !commentText) {
                showCustomAlert("Por favor selecciona una calificación y escribe un comentario.", "error");
                return;
            }

            // Crear el nuevo comentario
            const newComment = {
                user: loggedInUser, // Usar el usuario logueado
                score: parseInt(rating.value),
                description: commentText,
                dateTime: new Date().toISOString()
            };

            // Actualizar la sección de comentarios dinámicamente
            const commentHTML = `
                <div class="comment mb-3">
                    <h6>${newComment.user}</h6>
                    <div class="stars">${getStars(newComment.score)}</div>
                    <p>${newComment.description}</p>
                    <p><small class="text-muted">${new Date(newComment.dateTime).toLocaleString()}</small></p>
                </div>
            `;
            commentsSection.insertAdjacentHTML("beforeend", commentHTML);

            // Limpiar el formulario
            opinionForm.reset();
        });
    } else {
        productInfo.innerHTML = `<p>Error al cargar la información del producto</p>`;
    }
});

// Función para redirigir al producto seleccionado
function setProductID(id) {
    console.log("Guardando productID:", id); // Verifica que el ID sea correcto
    localStorage.setItem("productID", id);
    window.location = "product-info.html";
}

// Función para generar estrellas según la calificación
function getStars(score) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        starsHTML += `<span class="fa fa-star ${i <= score ? 'checked' : ''}"></span>`;
    }
    return starsHTML;
}
