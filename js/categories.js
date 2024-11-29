const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

let cartBadge = document.getElementById("cart-badge");

// Función para actualizar el badge del carrito
const updateCartBadge = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartBadge.textContent = cart.reduce((total, product) => total + product.quantity, 0);
};

// Función para ordenar categorías
function sortCategories(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort((a, b) => b.name.localeCompare(a.name));
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort((a, b) => b.productCount - a.productCount);
    }
    return result;
}

// Función para guardar el nombre de la categoría en localStorage y redirigir
function setCategoryName(categoryName) {
    localStorage.setItem("catName", categoryName); // Guardar el nombre de la categoría
    window.location = "products.html"; // Redirigir a la página de productos
}

// Mostrar las categorías
function showCategoriesList() {
    let htmlContentToAppend = "";
    for (let category of currentCategoriesArray) {
        if (
            ((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))
        ) {
            htmlContentToAppend += `
            <div onclick="setCategoryName('${category.name}')" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `;
        }
    }
    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

// Ordenar y mostrar categorías
function sortAndShowCategories(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria;

    if (categoriesArray != undefined) {
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    // Mostrar las categorías ordenadas
    showCategoriesList();
}

// Función que se ejecuta una vez que el documento está completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    getJSONData(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCategoriesArray = resultObj.data;
            showCategoriesList();
            updateCartBadge(); // Actualizar el badge al cargar la página
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if (minCount && parseInt(minCount) >= 0) {
            minCount = parseInt(minCount);
        } else {
            minCount = undefined;
        }

        if (maxCount && parseInt(maxCount) >= 0) {
            maxCount = parseInt(maxCount);
        } else {
            maxCount = undefined;
        }

        showCategoriesList();
    });
});
