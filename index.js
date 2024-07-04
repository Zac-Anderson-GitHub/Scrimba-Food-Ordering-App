import { menuArray } from "./data.js";

const menuContainer = document.getElementById("menu-container");
const orderContainer = document.getElementById("order-container");
const modalContainer = document.getElementById("modal-container");
const closeModalBtn = document.querySelector(".close-btn");
const paymentForm = document.getElementById("payment-form");
const thankYouMessage = document.getElementById("thank-you-message");
let orderItems = [];

// Function to clear form fields
function clearFormFields() {
    document.getElementById("name").value = '';
    document.getElementById("card-number").value = '';
    document.getElementById("expiry").value = '';
    document.getElementById("cvv").value = '';
}

// Render menu items
menuArray.forEach(item => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-items");

    menuItem.innerHTML = `
        <div class="item-image">${item.emoji}</div>
        <div class="item-details">
            <p class="item-title">${item.name}</p>
            <p class="item-ingredients">${item.ingredients.join(', ')}</p>
            <p class="item-price">$${item.price}</p>
        </div>
        <button class="add-btn">+</button>
    `;

    menuContainer.appendChild(menuItem);

    const addBtn = menuItem.querySelector(".add-btn");
    addBtn.addEventListener('click', () => addToOrder(item));
});

// Add item to order
function addToOrder(item) {
    orderItems.push(item);
    renderOrder();
}

// Render order items
function renderOrder() {
    if (orderItems.length === 0) {
        orderContainer.innerHTML = '';
        return;
    }

    if (orderItems.length > 0) {
        thankYouMessage.style.display = 'none';
    }

    orderContainer.innerHTML = `
        <p class="order-header">Your Order</p>
        ${orderItems.map((item, index) => `
            <div class="order-item">
                <div class="item-info">
                    <span>${item.name}</span>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
                <span class="order-price">$${item.price}</span>
            </div>
        `).join('')}
        <hr>
        <div class="order-total">
            <span class="total-price">Total Price:</span>
            <span class="price-sum">$${orderItems.reduce((total, item) => total + item.price, 0)}</span>
        </div>
        <button class="complete-order-btn">Complete Order</button>
    `;

    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            orderItems.splice(index, 1);
            renderOrder();
        });
    });

    const completeOrderBtn = document.querySelector(".complete-order-btn");
    completeOrderBtn.addEventListener('click', () => {
        modalContainer.style.display = 'flex';
    });
}

closeModalBtn.addEventListener('click', () => {
    modalContainer.style.display = 'none';
    clearFormFields(); // Clear form fields when modal is closed
});

window.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
        modalContainer.style.display = 'none';
    }
});

paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Custom validation
    const cardNumber = document.getElementById("card-number").value;
    const expiry = document.getElementById("expiry").value;
    const cvv = document.getElementById("cvv").value;

    if (!/^\d{16}$/.test(cardNumber)) {
        alert("Please enter a valid 16-digit card number.");
        return;
    }
    if (!/^\d{2}\/\d{4}$/.test(expiry)) {
        alert("Please enter a valid expiry date in mm/yyyy format.");
        return;
    }
    if (!/^\d{3}$/.test(cvv)) {
        alert("Please enter a valid 3-digit CVV.");
        return;
    }

    const name = document.getElementById("name").value;

    orderItems.length = 0;
    modalContainer.style.display = 'none';
    orderContainer.innerHTML = '';
    thankYouMessage.style.display = 'block';
    thankYouMessage.innerHTML = `
        <p>Thanks, ${name}! Your order is on the way!</p>
    `;

    clearFormFields(); // Clear form fields after form submission
});
