// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log(cart)

// Add to cart functionality
function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Item added to cart!');
    
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('.price').textContent,
                image: productCard.querySelector('img').src
            };
            addToCart(product);
        });
    });

    // If on cart page, display cart items
    if (document.getElementById('cart-items')) {
        displayCartItems();
    }

    // If on checkout page, display order summary
    if (document.getElementById('checkout-items')) {
        displayCheckoutSummary();
        setupCheckoutForm();
    }

    // Display user details if on account page
    if (window.location.pathname.includes('account.html')) {
        displayUserDetails();
    }

    // Check login status on page load
    checkLoginStatus();
});

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-container">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your Cart is Empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="index.html" class="shop-now-btn">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="price">${item.price}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    const shipping = 100;
    const total = subtotal + shipping;
    
    subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    totalElement.textContent = `₹${total.toLocaleString()}`;
}

// Update item quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

// Remove item from cart
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

// Display checkout summary
function displayCheckoutSummary() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const totalElement = document.getElementById('checkout-total');
    
    if (!checkoutItemsContainer) return;
    
    checkoutItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;
        
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <div class="checkout-item-details">
                <span>${item.name} x ${item.quantity}</span>
                <span>${item.price}</span>
            </div>
        `;
        checkoutItemsContainer.appendChild(checkoutItem);
    });
    
    const shipping = 100;
    const total = subtotal + shipping;
    
    subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    totalElement.textContent = `₹${total.toLocaleString()}`;
}

// Setup checkout form
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Here you would typically process the payment
        // For now, we'll just show a success message
        alert('Order placed successfully!');
        
        // Clear the cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// Check if user is logged in
function checkLoginStatus() {
    const loginStatus = document.getElementById('loginStatus');
    if (localStorage.getItem('currentUser')) {
        loginStatus.textContent = 'LOGOUT';
        loginStatus.href = '#';
        loginStatus.onclick = logout;
    } else {
        loginStatus.textContent = 'LOGIN';
        loginStatus.href = 'login.html';
        loginStatus.onclick = null;
    }
}

// Handle logout
function logout(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Handle registration
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Get existing users or initialize empty array
            let users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            if (users.some(user => user.email === email)) {
                alert('Email already registered!');
                return;
            }

            // Add new user
            users.push({
                name,
                email,
                password
            });

            // Save users to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto login after registration
            localStorage.setItem('currentUser', JSON.stringify({ name, email }));
            
            alert('Registration successful!');
            window.location.href = 'index.html';
        });
    }

    // Handle login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user
            const user = users.find(user => user.email === email && user.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password!');
            }
        });
    }

    // Check login status on page load
    checkLoginStatus();
});

// Display user details on account page
function displayUserDetails() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('account-name').textContent = currentUser.name;
        document.getElementById('account-email').textContent = currentUser.email;
    } else {
        window.location.href = 'login.html';
    }
}

// Handle edit profile
document.getElementById('editProfile')?.addEventListener('click', function() {
    // Implement edit profile functionality
    alert('Edit profile functionality coming soon!');
});

// Handle change password
document.getElementById('changePassword')?.addEventListener('click', function() {
    // Implement change password functionality
    alert('Change password functionality coming soon!');
});
