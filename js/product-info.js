document.addEventListener("DOMContentLoaded", async () => {
    let productID = localStorage.getItem("productID");  // Recuperar el ID del producto
    let productInfo = document.getElementById("product-info");

    const responseID = await getJSONData(PRODUCT_INFO_URL + productID + EXT_TYPE);
    const responseComments = await getJSONData(PRODUCT_INFO_COMMENTS_URL + productID + EXT_TYPE);

    if (responseID.status === "ok" && responseComments.status === "ok") {
        let product = responseID.data;
        let productComments = responseComments.data;

        // Variable para almacenar las imágenes en un carrusel
        let imagesHTML = '';

        product.images.forEach((imageURL, index) => {
            imagesHTML += `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${imageURL}" class="d-block w-100" alt="${product.name}">
                </div>
            `;
        });

        // Mostrar los detalles del producto dentro de una tarjeta (card)
        productInfo.innerHTML = `
            <div class="card">
                <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        ${product.images.map((_, index) => `
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="true" aria-label="Slide ${index + 1}"></button>
                        `).join('')}
                    </div>
                    <div class="carousel-inner">
                        ${imagesHTML}
                    </div>
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
                </div>
            </div>
        `;

        // Agregar la sección de comentarios
        const commentsSection = document.createElement("div");
        commentsSection.classList.add("mt-4");
        commentsSection.innerHTML = `
            <h5 class= "comments-section">Comentarios:</h5>
            ${productComments.map(comment => `
                <div class="comment mb-3 comments-section">
                    <h6>${comment.user}</h6>
                    <div class="stars">${getStars(comment.score)}</div>
                    <p>${comment.description}</p>
                    <p><small class="text-muted">${new Date(comment.dateTime).toLocaleString()}</small></p>
                </div>
            `).join('')}
        `;
        
        productInfo.appendChild(commentsSection);
    } else {
        productInfo.innerHTML = `<p>Error al cargar la información del producto</p>`;
    }
});

// Función para generar estrellas según la calificación
function getStars(score) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        starsHTML += `<span class="fa fa-star ${i <= score ? 'checked' : ''}"></span>`;
    }
    return starsHTML;
}
