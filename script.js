// Very simplified cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart functionality
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = button.closest('.item');
            if (!item) return;
            
            const name = item.querySelector('h2') ? item.querySelector('h2').textContent : (item.querySelector('h3') ? item.querySelector('h3').textContent : 'Product');
            const price = parseFloat(item.querySelector('.item-price').textContent.replace(/[^0-9.]/g, '')) || 20.00;
            const img = item.querySelector('img') ? item.querySelector('img').src : '';
            
            // Simple cart structure
            const cartItem = {
                name: name,
                price: price,
                image: img,
                quantity: 1
            };
            
            // Get existing cart
            let cart = [];
            const existingCart = localStorage.getItem('cart');
            if (existingCart) {
                try {
                    cart = JSON.parse(existingCart);
                } catch (e) {
                    console.error("Error parsing cart:", e);
                }
            }
            
            // Add item to cart
            cart.push(cartItem);
            
            // Save cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show confirmation
            alert(name + " added to cart!");
        });
    });
    
    // Display cart items
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        let cartItems = [];
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cartItems = JSON.parse(savedCart);
            }
        } catch (e) {
            console.error("Error loading cart:", e);
        }
        
        if (cartItems.length === 0) {
            cartContainer.innerHTML = `
                <h1>Your Cart</h1>
                <p>Your cart is empty.</p>
                <a href="index.html" class="checkout-btn">Continue Shopping</a>
            `;
        } else {
            let cartHTML = '<h1>Your Cart</h1><div class="cart-items">';
            let total = 0;
            
            cartItems.forEach((item, index) => {
                const itemTotal = item.price * (item.quantity || 1);
                total += itemTotal;
                
                cartHTML += `
                    <div class="cart-item" data-index="${index}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <span class="cart-item-name">${item.name}</span>
                            <div class="cart-qty-controls">
                                <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                                <span class="cart-item-qty">${item.quantity || 1}</span>
                                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                            </div>
                            <span class="cart-item-price">₹${itemTotal.toFixed(2)}</span>
                            <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                        </div>
                    </div>
                `;
            });
            
            cartHTML += `</div>
                <p class="cart-total">Total: ₹${total.toFixed(2)}</p>
                <button class="place-order-btn">Place Order</button>
                <button onclick="clearCart()">Clear Cart</button>
                <a href="index.html" class="checkout-btn">Continue Shopping</a>
            `;
            
            cartContainer.innerHTML = cartHTML;

            // Add event listener for Place Order button
            const placeOrderBtn = document.querySelector('.place-order-btn');
            if (placeOrderBtn) {
                placeOrderBtn.addEventListener('click', function() {
                    if (cartItems.length > 0) {
                        alert('Order placed successfully!');
                        localStorage.removeItem('cart');
                        location.reload();
                    }
                });
            }
        }
    }
});

// Helper functions
function removeItem(index) {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload(); // Refresh the page
    } catch (e) {
        console.error("Error removing item:", e);
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    location.reload(); // Refresh the page
}

function updateQuantity(index, change) {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (!cart[index]) return;
        cart[index].quantity = (cart[index].quantity || 1) + change;
        if (cart[index].quantity < 1) {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload();
    } catch (e) {
        console.error("Error updating quantity:", e);
    }
}