let products = JSON.parse(localStorage.getItem("products")) || [
    {
        title: 'Ігровий ПК LIBOR',
        description: 'Intel Core i5-6500, GTX 1060 6GB, 16GB RAM, SSD 500GB. Комплект з монітором.',
        price: 28854,
        image: 'https://images.prom.ua/6605952182_w640_h640_6605952182.jpg'
    },
    {
        title: 'Ігровий ПК LIBOR',
        description: 'Ігровий комп’ютер з монітором.',
        price: 28854,
        image: 'https://images.prom.ua/6605952182_w640_h640_6605952182.jpg'
    },
    {
        title: 'Ігровий ПК LIBOR',
        description: 'Комплект для ігор у Full HD.',
        price: 28854,
        image: 'https://images.prom.ua/6605952182_w640_h640_6605952182.jpg'
    }
];

let editIndex = -1;
let cart = [];

let productsBlock = document.getElementById("products");
let cartItems = document.getElementById("cart-items");

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function showProducts() {
    productsBlock.innerHTML = "";

    products.forEach(function(product, index) {
        let card = document.createElement("div");
        card.className = "product-card";

        let imageBlock = document.createElement("div");
        imageBlock.className = "product-image";

        let img = document.createElement("img");
        img.src = product.image;
        img.alt = product.title;

        img.onerror = function() {
            img.style.display = "none";
        };

        imageBlock.appendChild(img);

        let title = document.createElement("h2");
        title.className = "product-title";
        title.textContent = product.title;

        let description = document.createElement("p");
        description.className = "product-desc";
        description.textContent = product.description;

        let price = document.createElement("p");
        price.className = "price";
        price.textContent =
            product.price.toLocaleString("uk-UA") + " ₴";

        let addButton = document.createElement("button");
        addButton.className = "add-to-cart-btn";
        addButton.textContent = "Додати в кошик";

        addButton.onclick = function() {
            cart.push({
                title: product.title,
                price: product.price
            });

            showCart();
        };

        let editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Редагувати";

        editButton.onclick = function() {
            document.getElementById("title").value = product.title;
            document.getElementById("description").value =
                product.description;
            document.getElementById("price").value = product.price;
            document.getElementById("image").value = product.image;

            editIndex = index;

            document.getElementById("save-btn").textContent =
                "Зберегти зміни";
            document.getElementById("cancel-btn").style.display =
                "inline-block";

            window.scrollTo(0, 0);
        };

        let deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Видалити";

        deleteButton.onclick = function() {
            if (confirm("Ви справді хочете видалити товар?")) {
                products.splice(index, 1);
                saveProducts();
                showProducts();
            }
        };

        card.append(
            imageBlock,
            title,
            description,
            price,
            addButton,
            editButton,
            deleteButton
        );

        productsBlock.appendChild(card);
    });
}

function showCart() {
    cartItems.innerHTML = "";

    let sum = 0;

    cart.forEach(function(item, index) {
        sum += item.price;

        let row = document.createElement("p");
        row.textContent =
            item.title + " — " +
            item.price.toLocaleString("uk-UA") + " ₴ ";

        let removeButton = document.createElement("button");
        removeButton.textContent = "Видалити";

        removeButton.onclick = function() {
            cart.splice(index, 1);
            showCart();
        };

        row.appendChild(removeButton);
        cartItems.appendChild(row);
    });

    document.getElementById("cart-count").textContent = cart.length;
    document.getElementById("total").textContent =
        sum.toLocaleString("uk-UA");
}

function resetForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";

    editIndex = -1;

    document.getElementById("save-btn").textContent = "Додати товар";
    document.getElementById("cancel-btn").style.display = "none";
}

document.getElementById("save-btn").onclick = function() {
    let title = document.getElementById("title").value.trim();
    let description =
        document.getElementById("description").value.trim();
    let price = Number(document.getElementById("price").value);
    let image = document.getElementById("image").value.trim();

    if (!title || !description || !image ||
        !Number.isFinite(price) || price <= 0) {
        alert("Заповніть усі поля та вкажіть правильну ціну!");
        return;
    }

    if (!/^https?:\/\//i.test(image)) {
        alert("Посилання на фото повинно починатися з http:// або https://");
        return;
    }

    let product = {
        title: title,
        description: description,
        price: price,
        image: image
    };

    if (editIndex === -1) {
        products.push(product);
    } else {
        products[editIndex] = product;
    }

    saveProducts();
    resetForm();
    showProducts();
};

document.getElementById("cancel-btn").onclick = resetForm;

showProducts();
showCart();