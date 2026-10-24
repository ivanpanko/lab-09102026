const defaultProducts = [
    {
        title: 'Ігровий ПК LIBOR Extreme',
        description: 'Intel Core i5-12400F, RTX 3060 12GB, 16GB RAM, SSD 1TB. Чудовий вибір для Full HD ігор.',
        price: 28854,
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80'
    },
    {
        title: 'Ноутбук ASUS TUF Gaming',
        description: 'AMD Ryzen 7 6800H, RTX 3050 Ti, 16GB DDR5, 512GB SSD, 144Hz IPS екран.',
        price: 42500,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80'
    },
    {
        title: 'Монітор Samsung Odyssey G5 27"',
        description: '2560x1440 2K WQHD, 144 Hz, 1ms, VA вигнутий матричний дисплей для геймінгу.',
        price: 9999,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'
    },
    {
        title: 'Клавіатура HyperX Alloy FPS',
        description: 'Механічна ігрова клавіатура з RGB підсвіткою та перемикачами Cherry MX Red.',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80'
    }
];

const savedData = localStorage.getItem("products");
let products = savedData ? JSON.parse(savedData) : [];

if (!Array.isArray(products) || products.length === 0) {
    products = [...defaultProducts];
    saveProducts();
}

let editIndex = -1;
let cart = [];

const productsBlock = document.getElementById("products");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalSum = document.getElementById("total");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");

const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function showProducts() {
    productsBlock.innerHTML = "";

    products.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card";

        const imageBlock = document.createElement("div");
        imageBlock.className = "product-image";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.title;

        img.onerror = () => {
            img.src = "https://via.placeholder.com/300x200?text=Немає+зображення";
        };

        imageBlock.appendChild(img);

        const title = document.createElement("h2");
        title.className = "product-title";
        title.textContent = product.title;

        const description = document.createElement("p");
        description.className = "product-desc";
        description.textContent = product.description;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = `${product.price.toLocaleString("uk-UA")} ₴`;

        const addButton = document.createElement("button");
        addButton.className = "add-to-cart-btn";
        addButton.textContent = "Додати в кошик";
        addButton.onclick = () => {
            cart.push({
                title: product.title,
                price: product.price
            });
            showCart();
        };

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Редагувати";
        editButton.onclick = () => {
            titleInput.value = product.title;
            descriptionInput.value = product.description;
            priceInput.value = product.price;
            imageInput.value = product.image;

            editIndex = index;

            saveBtn.textContent = "Зберегти зміни";
            cancelBtn.style.display = "inline-block";

            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Видалити";
        deleteButton.onclick = () => {
            if (confirm(`Ви справді хочете видалити товар "${product.title}"?`)) {
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

    cart.forEach((item, index) => {
        sum += item.price;

        const row = document.createElement("p");
        row.textContent = `${item.title} — ${item.price.toLocaleString("uk-UA")} ₴ `;

        const removeButton = document.createElement("button");
        removeButton.className = "delete-btn";
        removeButton.textContent = "Видалити";
        removeButton.onclick = () => {
            cart.splice(index, 1);
            showCart();
        };

        row.appendChild(removeButton);
        cartItems.appendChild(row);
    });

    cartCount.textContent = cart.length;
    totalSum.textContent = sum.toLocaleString("uk-UA");
}

function resetForm() {
    titleInput.value = "";
    descriptionInput.value = "";
    priceInput.value = "";
    imageInput.value = "";

    editIndex = -1;

    saveBtn.textContent = "Додати товар";
    cancelBtn.style.display = "none";
}

saveBtn.onclick = () => {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const price = Number(priceInput.value);
    const image = imageInput.value.trim();

    if (!title || !description || !image || !Number.isFinite(price) || price <= 0) {
        alert("Заповніть усі поля та вкажіть правильну ціну!");
        return;
    }

    if (!/^https?:\/\//i.test(image)) {
        alert("Посилання на фото повинно починатися з http:// або https://");
        return;
    }

    const product = {
        title,
        description,
        price,
        image
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

cancelBtn.onclick = resetForm;

showProducts();
showCart();
