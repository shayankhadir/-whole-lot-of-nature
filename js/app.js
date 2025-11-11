// Shopping Cart functionality
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #2d7a3e;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Sample products data
const products = [
    { id: 1, name: 'Monstera Deliciosa', price: 29.99, category: 'indoor', icon: '🌿', description: 'Beautiful large-leafed indoor plant' },
    { id: 2, name: 'Snake Plant', price: 19.99, category: 'indoor', icon: '🌱', description: 'Low maintenance air purifier' },
    { id: 3, name: 'Succulent Trio', price: 15.99, category: 'succulents', icon: '🌵', description: 'Set of three hardy succulents' },
    { id: 4, name: 'Aloe Vera', price: 12.99, category: 'succulents', icon: '🪴', description: 'Medicinal and decorative plant' },
    { id: 5, name: 'Rose Bush', price: 24.99, category: 'outdoor', icon: '🌹', description: 'Classic garden rose' },
    { id: 6, name: 'Lavender Plant', price: 18.99, category: 'outdoor', icon: '💜', description: 'Fragrant garden herb' },
    { id: 7, name: 'Garden Tool Set', price: 39.99, category: 'tools', icon: '🛠️', description: 'Complete gardening toolkit' },
    { id: 8, name: 'Watering Can', price: 14.99, category: 'tools', icon: '💧', description: 'Durable metal watering can' }
];

// Initialize cart
const cart = new ShoppingCart();

// Load featured products on home page
function loadFeaturedProducts() {
    const grid = document.getElementById('featured-products-grid');
    if (!grid) return;

    const featured = products.slice(0, 4);
    grid.innerHTML = featured.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary" onclick="cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Load products on products page
function loadAllProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    const filteredProducts = category 
        ? products.filter(p => p.category === category)
        : products;

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary" onclick="cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Load cart items on cart page
function loadCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartContainer) return;

    if (cart.items.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }

    cartContainer.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-icon">${item.icon}</div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1}); loadCartItems()">-</button>
                <span>${item.quantity}</span>
                <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1}); loadCartItems()">+</button>
            </div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="btn-remove" onclick="cart.removeItem(${item.id}); loadCartItems()">Remove</button>
        </div>
    `).join('');

    if (cartTotal) {
        cartTotal.textContent = cart.getTotal().toFixed(2);
    }
}

// Initialize page content
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    loadAllProducts();
    loadCartItems();
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
