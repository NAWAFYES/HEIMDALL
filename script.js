// ============================================
// HEIMDALL LUXURY FRAGRANCES - JAVASCRIPT
// ============================================

// Cart Management
let cart = [];
let cartTotal = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    initializeMobileMenu();
    initializeContactForm();
    loadCartFromStorage();
    updateCartDisplay();
});

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Cart Functions
function initializeCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartClose = document.getElementById('cartClose');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cartSidebar) {
                cartSidebar.classList.add('open');
            }
        });
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', function() {
            if (cartSidebar) {
                cartSidebar.classList.remove('open');
            }
        });
    }
    
    // Close cart when clicking outside
    if (cartSidebar) {
        cartSidebar.addEventListener('click', function(e) {
            if (e.target === cartSidebar) {
                cartSidebar.classList.remove('open');
            }
        });
    }
}

function addToCart(productName, price) {
    const product = {
        name: productName,
        price: price,
        quantity: 1
    };
    
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    saveCartToStorage();
    updateCartDisplay();
    
    // Show notification
    showNotification(`${productName} added to cart!`);
    
    // Open cart sidebar
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('open');
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartDisplay();
    showNotification('Item removed from cart');
}

function updateCartQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCartToStorage();
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="updateCartQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${index}, 1)">+</button>
                        <button class="cart-remove" onclick="removeFromCart(${index})">×</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
}

function saveCartToStorage() {
    localStorage.setItem('heimdallCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('heimdallCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function buyNow(productName, price) {
    addToCart(productName, price);
    // In a real implementation, this would redirect to checkout
    showNotification('Redirecting to checkout...');
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // In a real implementation, this would send data to a server
            console.log('Form submitted:', formData);
            
            // Show success message
            showNotification('Thank you! Your message has been sent.');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Notification System
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #1a237e;
        color: white;
        padding: 16px 24px;
        border-radius: 4px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .cart-item-info h4 {
        font-size: 1rem;
        margin-bottom: 4px;
        color: #1a1a1a;
    }
    
    .cart-item-info p {
        font-size: 0.9rem;
        color: #666;
    }
    
    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .cart-item-controls button {
        background: #1a237e;
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .cart-item-controls button:hover {
        background: #0d47a1;
    }
    
    .cart-item-controls .cart-remove {
        background: #dc3545;
        font-size: 1.5rem;
    }
    
    .cart-item-controls .cart-remove:hover {
        background: #c82333;
    }
    
    .cart-item-controls span {
        min-width: 30px;
        text-align: center;
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Category Filter (if on categories page)
if (window.location.pathname.includes('categories.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');
    
    if (category) {
        setTimeout(() => {
            const targetSection = document.getElementById(category + 's');
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }
}
