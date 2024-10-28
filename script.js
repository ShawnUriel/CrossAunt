document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const trayCountElement = document.getElementById('tray-count');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const taxElement = document.getElementById('tax');
    const trayItemsDiv = document.getElementById('tray-items');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const TAX_AMOUNT = 12.00;

    hamburger.addEventListener('click', function () {
        mobileNav.classList.toggle('active');
        hamburger.classList.toggle('is-active');
    });

    // Function to update order summary
    function updateOrderSummary() {
        let subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        if (subtotalElement) {
            subtotalElement.textContent = `Subtotal: ₱${subtotal.toFixed(2)}`;
        }
        const shipping = 50.00;
        const total = subtotal + shipping + TAX_AMOUNT;
        if (totalElement) {
            totalElement.textContent = `Total: ₱${total.toFixed(2)}`;
        }
        if (taxElement) {
            taxElement.textContent = `Tax: ₱${TAX_AMOUNT.toFixed(2)}`;
        }
    }

    // Function to update tray count across pages
    function updateTrayCount() {
        const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
        if (trayCountElement) {
            trayCountElement.textContent = totalCount;
        }
    }

    // Initialize tray count on page load
    function initializeTrayCount() {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateTrayCount();
    }

    // Function to add item to cart
    function addToCart(productName, productPrice) {
        const productInCart = cart.find(item => item.name === productName);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.push({ name: productName, price: parseFloat(productPrice), quantity: 1 });
        }

        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update the UI immediately
        updateOrderSummary();
        updateTrayCount(); // Instant tray count update
    }

    // Function to display tray items
    function displayTrayItems() {
        if (trayItemsDiv) {
            trayItemsDiv.innerHTML = '';
            cart.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'tray-item';
                itemDiv.innerHTML = `
                    <span>${item.name} - ₱${item.price.toFixed(2)} (x${item.quantity})</span>
                    <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>
                `;
                trayItemsDiv.appendChild(itemDiv);
            });
            updateOrderSummary();
        }
        updateTrayCount();
    }

    // Function to delete an item from the tray
    window.deleteItem = function (index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayTrayItems();
        updateTrayCount();
    };

    // Add event listeners to each "add-to-tray" button
    const addToTrayButtons = document.querySelectorAll('.add-to-tray');
    addToTrayButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productName = this.getAttribute('data-product-name');
            const productPrice = this.getAttribute('data-product-price');
            addToCart(productName, productPrice);
        });
    });

    // Display items in tray on page load
    displayTrayItems();
    initializeTrayCount(); // Initialize tray count on page load
});
