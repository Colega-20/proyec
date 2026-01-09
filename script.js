/** @format */

// State
let cart = [];
let selectedCategory = 'All';
let selectedProduct = null;
let productQuantity = 1;
let currentOrderId = null;
let date = null;
let itemsToShow = 20;
let currentFilteredItems = [];

// NEW HELPER FUNCTION: Combine local and VIP data
// Use it whenever you need to search, filter or list products.
// Assumes 'menuItems' exists globally in your file
function getAllProducts() {
  const vipItems = window.VIP_DATA && window.VIP_DATA.menuItems ? window.VIP_DATA.menuItems : [];
  const localItems = typeof menuItems !== 'undefined' ? menuItems : [];
  return [...localItems, ...vipItems];
}

// listening vip event data
window.addEventListener('vipDataReady', () => {
  console.log('Loanding logs...');
  renderMenu();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
});

// Set up auto-loading on scroll
function LoadMoreProducts() {
  const sentinel = document.createElement('div');
  // sentinel.id = 'infinite-scroll-sentinel';
  document.getElementById('menuGrid').after(sentinel);
  loadMoreItems();
  // { rootMargin: '200px' }
}

// btn more show items
function loadMoreItems() {
  if (itemsToShow < currentFilteredItems.length) {
    itemsToShow += 20;
    renderVisibleItems();
  }
}

// Scroll to section
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');
  mobileMenu.classList.toggle('active');
}

// Helper function to calculate discounted price
function calculateDiscountedPrice(price, offerPercent) {
  const discount = parseInt(offerPercent.replace('%', '')) / 100;
  return price * (1 - discount);
}

// Helper for VIP Badge
function getVipBadge(item) {
  if (!item.isVip) return '';
  return `
    <div class="vip-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        VIP
    </div>
  `;
}
// Render menu
function renderMenu() {
  const allItems = getAllProducts();

  // 1. Filtrar primero
  let filtered = selectedCategory === 'All' ? allItems : allItems.filter((item) => item.category === selectedCategory);

  // 2. ✅ MEZCLAR ALEATORIAMENTE
  currentFilteredItems = shuffleArray([...filtered]); // Usa [...] para no modificar el original

  // 3. Renderizar los primeros 20 de esa mezcla
  // itemsToShow = 20;
  renderVisibleItems();
}

function renderVisibleItems() {
  const itemsToDisplay = currentFilteredItems.slice(0, itemsToShow);
  displayMenuItems(itemsToDisplay);
}

// Open product panel
function openProductPanel(productId) {
  // Use getAllProducts() to find VIP products
  selectedProduct = getAllProducts().find((item) => String(item.id) === String(productId));

  if (!selectedProduct) {
    console.error('Producto no encontrado:', productId);
    return;
  }

  productQuantity = 1;
  document.body.classList.add('no-scroll');
  const panel = document.getElementById('productPanel');
  const content = document.getElementById('productPanelContent');
  const hasOffer = selectedProduct.isOffers === true && selectedProduct.offer;
  const displayPrice = hasOffer ? calculateDiscountedPrice(selectedProduct.price, selectedProduct.offer) : selectedProduct.price;
  content.innerHTML = `
      <div class="menu-card-image">
        <img src="${selectedProduct.image}" alt="${selectedProduct.name}" loading="lazy" class="product-detail-image">
        ${
          selectedProduct.isPopular
            ? `
            <div class="popular-badge" style="width: 20%; height: auto; top: auto; bottom: 0.75rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Popular
            </div>
        `
            : ''
        }
        ${
          hasOffer
            ? `
            <div class="offers-badge" style="right: auto;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                Sale ${selectedProduct.offer} Off
            </div>
        `
            : ''
        } ${getVipBadge(selectedProduct)}
      </div>
         <div class="product-detail-content">
            <div class="product-detail-header">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h2 class="product-title">${selectedProduct.name}</h2>
                        <span class="category-badge">${selectedProduct.category}</span>
                    </div>
                    <div class="price-container" style="text-align: right;">
                        ${hasOffer ? `<div class="original-price">$${selectedProduct.price.toFixed(2)}</div>` : ''}
                        <div class="${hasOffer ? 'discounted-price' : 'product-price'}">$${displayPrice.toFixed(2)}</div>
                    </div>
                </div>
                <div class="product-rating">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="color: var(--primary);">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span style="font-size: 1.125rem; font-weight: 600;">${selectedProduct.rating}</span>
                  </div>
                    <div><span style="color: var(--muted-foreground);"><button class="btn-open" onclick="toggleRatingModal(true)">Calificar Producto</button></span></div>
                </div>
            </div>
            
            <div class="product-section">
                <h3>Description</h3>
                <p style="color: var(--muted-foreground); line-height: 1.7;">${selectedProduct.description}</p>
            </div>
            
            <div class="product-details-box">
                <h3 style="margin-bottom: 0.75rem;">Details:</h3>
                <div class="product-detail-row">
                    <span style="color: var(--muted-foreground);">Preparation time:</span>
                    <span style="font-weight: 500;">4-24 Hour</span>
                </div>
                <div class="product-detail-row">
                    <span style="color: var(--muted-foreground);">Serves:</span>
                    <span style="font-weight: 500;">1-2 people</span>
                </div>
                <div class="product-detail-row">
                    <span style="color: var(--muted-foreground);">Warranty:</span>
                    <span style="font-weight: 500;">${selectedProduct.warranty}</span>
                </div>
                <div class="product-detail-row">                            
                    <span style="color: var(--muted-foreground);">Id product:</span>
                    <span style="font-weight: 500;">${selectedProduct.id}</span>
                </div>
            </div>
            
            <div class="product-section">
                <h3>Quantity</h3>
                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="decrementQuantity()" ${productQuantity === 1 ? 'disabled' : ''}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </button>
                    <span class="quantity-value" id="quantityValue">${productQuantity}</span>
                    <button class="quantity-btn" onclick="incrementQuantity()" ${productQuantity === 10 ? 'disabled' : ''}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <button class="add-to-cart-btn" onclick="addToCart()">
                Add to Cart - $${(displayPrice * productQuantity).toFixed(2)}
            </button>
         </div>
    `;

  panel.classList.add('active');
}

// Close product panel
function closeProductPanel() {
  document.getElementById('productPanel').classList.remove('active');
  document.body.classList.remove('no-scroll');
  selectedProduct = null;
}

// Quantity functions
function incrementQuantity() {
  if (productQuantity < 10) {
    productQuantity++;
    updateProductPanel();
  }
}
// btm sume more and fewer items
function decrementQuantity() {
  if (productQuantity > 1) {
    productQuantity--;
    updateProductPanel();
  }
}

// Update updateProductPanel to use discounted price
function updateProductPanel() {
  const hasOffer = selectedProduct.isOffers === true && selectedProduct.offer;
  const displayPrice = hasOffer ? calculateDiscountedPrice(selectedProduct.price, selectedProduct.offer) : selectedProduct.price;

  document.getElementById('quantityValue').textContent = productQuantity;
  document.querySelector('.add-to-cart-btn').textContent = `Add to Cart - $${(displayPrice * productQuantity).toFixed(2)}`;

  const decrementBtn = document.querySelector('.quantity-selector .quantity-btn:first-child');
  const incrementBtn = document.querySelector('.quantity-selector .quantity-btn:last-child');

  decrementBtn.disabled = productQuantity === 1;
  incrementBtn.disabled = productQuantity === 10;
}

// Add to cart
function addToCart() {
  const hasOffer = selectedProduct.isOffers === true && selectedProduct.offer;
  const finalPrice = hasOffer ? calculateDiscountedPrice(selectedProduct.price, selectedProduct.offer) : selectedProduct.price;

  // Ensure strict string comparison
  const existingItem = cart.find((item) => String(item.id) === String(selectedProduct.id));

  if (existingItem) {
    existingItem.quantity += productQuantity;
  } else {
    cart.push({ ...selectedProduct, price: finalPrice, quantity: productQuantity });
  }

  updateCartBadge();
  showToast(`${productQuantity}x ${selectedProduct.name} added to cart!`, 'success');
  closeProductPanel();
}

// Update cart badge
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Toggle checkout
function toggleCheckout() {
  const panel = document.getElementById('checkoutPanel');
  panel.classList.toggle('active');
  document.body.classList.add('no-scroll');
  if (panel.classList.contains('active')) {
    document.querySelector('#panel-close').style.top = '0px';
    renderCheckout();
  }
  document.querySelector('#panel-close').style.top = '0px';
}

// Close checkout
function closeCheckout() {
  document.getElementById('checkoutPanel').classList.remove('active');
  document.querySelector('.panel-close').style.top = '0.75rem';
  document.body.classList.remove('no-scroll');
  currentOrderId = null;
  date = null;
}

// Render checkout
function renderCheckout() {
  const content = document.getElementById('checkoutContent');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = cart.reduce((sum, item) => sum + (item.tax || 0) * item.quantity, 0);
  const delivery = subtotal > 0 ? 3.99 : 0;

  const total = subtotal + delivery + tax;

  if (cart.length === 0) {
    content.innerHTML = `
            <div class="empty-cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="8" cy="21" r="1"/>
                    <circle cx="19" cy="21" r="1"/>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
                <p style="color: var(--muted-foreground);">Your cart is empty</p>
            </div>
        `;
    return;
  } else if (!currentOrderId) {
    currentOrderId = generateOrderId();
    date = printDate();
  }

  content.innerHTML = `
        <div class="cart-items">
            <h3 style="margin-bottom: 1rem;">Order Summary</h3>
            ${cart
              .map(
                (item) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}:</div>
                        <div class="cart-item-warranty">warranty:</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                        <div class="cart-item-quantity">
                            <button class="cart-quantity-btn" onclick="updateCartQuantity('${item.id}'  , ${item.quantity - 1})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                            </button>
                            <span class="cart-quantity-value">${item.quantity}</span>
                            <button class="cart-quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="cart-item-warranty">${item.warranty}</div>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            `
              )
              .join('')}
        </div>
        
        <div class="price-summary">
            <div class="price-row">
                <span style="color: var(--muted-foreground);">Subtotal</span>
                <span style="font-weight: 500;">$${subtotal.toFixed(2)}</span>
            </div>
            <div class="price-row">
                <span style="color: var(--muted-foreground);">Tax</span>
                <span style="font-weight: 500;">$${tax.toFixed(2)}</span>
            </div>
            <div class="price-row">
                <span style="color: var(--muted-foreground);">Delivery</span>
                <span style="font-weight: 500;">$${delivery.toFixed(2)}</span>
            </div>
            <div class="price-row">
                <span class="price-total">Total</span>
                <span class="price-total">$${total.toFixed(2)}</span>
            </div>
            <div class="price-row">
                <span style="color: var(--muted-foreground);">Orden id</span>
                <span style="color: var(--muted-foreground);">${currentOrderId}</span>
            </div>
            <div class="price-row">
            <span class="date" style="color: var(--muted-foreground);">Date</span>
            <span class="date" style="color: var(--muted-foreground);">${date}</span>
            </div>
        </div>
        
        <form class="checkout-form" >
        <div class="form-section">
        <h3>Delivery Details</h3>
        <div class="form-group">
          <label class="form-label" for="name">Full Name</label>
          <input class="form-input" type="text" id="name" placeholder="John Doe" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input class="form-input" type="email" id="email" placeholder="john@example.com" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="phone">Phone Number</label>
          <input
            inputmode="numeric"
          
            class="form-input"
            type="tel"
            maxlength="18"
            id="phone"
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="address">Delivery Address</label>
          <input class="form-input" type="text" id="address" maxlength="64" placeholder="123 Main St, Apt 4B" required />
        </div>
      </div>
      
      <div class="form-section">
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          Payment Details
        </h3>
        <div class="form-group">
          <label class="form-label" for="cardNumber">Card Number</label>
          <input
            inputmode="numeric"
            pattern="[0-9]*"
            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
            class="form-input"
            type="text"
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxlength="16"
            required
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="expiryDate">Expiry Date</label>
            <input
            type="text"
            id="expiryDate"
            class="form-input"
            placeholder="MM/YY"
            inputmode="numeric"
            autocomplete="cc-exp"
            required
          />
          </div>
          <div class="form-group">
            <label class="form-label" for="cvv">CVV</label>
            <input
              inputmode="numeric"
              pattern="[0-9]*"
              oninput="this.value = this.value.replace(/[^0-9]/g, '')"
              class="form-input"
              type="text"
              id="cvv"
              placeholder="123"
              maxlength="4"
              required
            />
          </div>
        </div>
      </div>
      <button type="submit" class="submit-btn">Place Order - $${total.toFixed(2)}</button>
      </form>
    `;
  mm_yy_phone();
}

// MM/YY and Phone formatter and validator
function mm_yy_phone() {
  const expiryInput = document.getElementById('expiryDate');
  const phoneInput = document.getElementById('phone');

  /* ========= MM / YY FORMATTER ========= */
  if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2, 7);
      }

      e.target.value = value.slice(0, 7);
      expiryInput.setCustomValidity('');
    });

    /* ========= MM / YY VALIDATION ========= */
    expiryInput.addEventListener('blur', () => {
      const value = expiryInput.value;
      const match = value.match(/^(\d{2})\/(\d{2})$/);

      if (!match) {
        expiryInput.setCustomValidity('Invalid format (MM/YY)');
        return;
      }

      const month = parseInt(match[1], 10);
      const year = parseInt(match[2], 10);

      if (month < 1 || month > 12) {
        expiryInput.setCustomValidity('Month must be between 01 and 12');
      } else if (year > 41 || year > 2041) {
        expiryInput.setCustomValidity('Year must be 41 or less');
      } else {
        expiryInput.setCustomValidity('');
      }
    });
  }

  /* ========= PHONE FORMATTER ========= */
  if (phoneInput) {
    phoneInput.addEventListener('input', () => formatPhoneCountryFirst(phoneInput));
  }
}

// Phone number formatter: +1 (555) 123-4567
function formatPhoneCountryFirst(input) {
  let digits = input.value.replace(/\D/g, '');

  if (digits.length === 0) {
    input.value = '';
    return;
  }

  digits = digits.slice(0, 12);

  let formatted = '+';
  formatted += digits[0];

  if (digits.length > 1) {
    formatted += ' (' + digits.slice(1, 4);
  }

  if (digits.length > 4) {
    formatted += ') ' + digits.slice(4, 7);
  }

  if (digits.length > 7) {
    formatted += '-' + digits.slice(7, 12);
  }

  input.value = formatted;
}

// generate an Order ID
function generateOrderId() {
  const now = new Date();
  const date = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${date}-${random}`;
}
// function to print the current date
function printDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  console.log(`${day}/${month}/${year}`);
  return `${day}/${month}/${year}`;
}

// Update cart quantity
function updateCartQuantity(productId, newQuantity) {
  if (newQuantity === 0) {
    removeFromCart(productId);
  } else {
    const item = cart.find((item) => String(item.id) === String(productId));
    if (item) {
      item.quantity = newQuantity;
      updateCartBadge();
      renderCheckout();
    }
  }
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => String(item.id) !== String(productId));
  updateCartBadge();
  renderCheckout();
}

// Show toast
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');

  // 1. Crear el elemento del toast dinámicamente
  const toast = document.createElement('div');
  toast.className = `toast ${type} show`;
  toast.textContent = message;

  // 2. Añadirlo al contenedor
  container.appendChild(toast);

  // 3. Programar su eliminación
  setTimeout(() => {
    toast.classList.add('hide'); // Animación de salida
    // Esperar a que termine la animación antes de remover del DOM
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 7000);
}

// Add login modal function
function showLoginModal() {
  window.location.href = 'login-register/login-register.html';
}
// Función para redirigir al Dashboard
function goToDashboard() {
  window.location.href = 'user/user.html';
}

// Search functionality
function searchProducts(searchTerm) {
  const searchLower = searchTerm.toLowerCase().trim();

  if (searchLower === '') {
    renderMenu(); // Esto ya incluye el shuffle por defecto
    return;
  }

  // Al buscar, reinicia la paginación
  itemsToShow = 20;

  // 1. Filtra por nombre, descripción o categoría
  let filtered = getAllProducts().filter(
    (item) => item.name.toLowerCase().includes(searchLower) || item.description.toLowerCase().includes(searchLower) || item.category.toLowerCase().includes(searchLower)
  );

  // 2. Mezcla los resultados de la búsqueda
  currentFilteredItems = shuffleArray([...filtered]);

  // 3. Renderiza
  renderVisibleItems();
}

// Update displayMenuItems to be accessible
function displayMenuItems(items) {
  const menuGrid = document.getElementById('menuGrid');
  if (!menuGrid) return;

  if (items.length === 0) {
    menuGrid.innerHTML = '<div id="no-products"><p style="font-size: 1.25rem; margin-bottom: 0.5rem;">No products found</p><p>Try adjusting your search or filters</p></div>';
    return;
  }

  menuGrid.innerHTML = items
    .map((item) => {
      const hasOffer = item.isOffers === true && item.offer;
      const discountedPrice = hasOffer ? calculateDiscountedPrice(item.price, item.offer) : item.price;

      return `
      <div class="menu-card" onclick="openProductPanel('${item.id}')">
          <div class="menu-card-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy"/>
            ${
              item.isPopular
                ? `
                <div class="popular-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Popular
                </div>
            `
                : ''
            }
            ${
              hasOffer
                ? `
                <div class="offers-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    Sale ${item.offer} Off
                </div>
            `
                : ''
            }${getVipBadge(item)}
          </div>
          <div class="menu-card-content">
            <div class="menu-card-header">
              <h3 class="menu-card-title">${item.name}</h3>
              <div class="menu-card-rating">
                <span class="category-badge">${item.category}</span>
              </div>
            </div>
            <p class="menu-card-description">${item.description}</p>
            <div class="menu-card-footer">
            <div class="price-container">
            <span class="${hasOffer ? 'discounted-price' : 'menu-card-price'}">$${discountedPrice.toFixed(2)}</span>
            ${hasOffer ? `<span class="original-price">$${item.price.toFixed(2)}</span>` : ''}
             </div>
            <div class="menu-card-rating">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span>${item.rating}</span>
            </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

// Filter by Category (All, GPU, etc)
function filterMenu(category) {
  selectedCategory = category;
  resetFilterUI(window.event);

  const allItems = getAllProducts();

  // Filtrar por categoría
  let filtered = selectedCategory === 'All' ? allItems : allItems.filter((item) => item.category === selectedCategory);

  // Mezcla los resultados de esa categoría
  currentFilteredItems = shuffleArray([...filtered]);

  // Mostrar los primeros 20
  renderVisibleItems();
}

function filterVip() {
  selectedCategory = 'VIP';
  resetFilterUI(window.event);

  const filtered = getAllProducts().filter((item) => item.isVip === true);
  currentFilteredItems = shuffleArray([...filtered]); // Randomized
  renderVisibleItems();
}

function filterPopular() {
  selectedCategory = 'Popular';
  resetFilterUI(window.event);

  const filtered = getAllProducts().filter((item) => item.isPopular === true);
  currentFilteredItems = shuffleArray([...filtered]); // Randomized
  renderVisibleItems();
}

function filterOffers() {
  selectedCategory = 'Offers';
  resetFilterUI(window.event);

  const filtered = getAllProducts().filter((item) => item.isOffers === true);
  currentFilteredItems = shuffleArray([...filtered]); // Randomized
  renderVisibleItems();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Helper to reset visual state of filters
function resetFilterUI(event) {
  itemsToShow = 20; // Reset pagination to first 20
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
}

// Por seguridad, si el script modular cargó ANTES que este listener:
if (window.VIP_DATA) {
  renderMenu();
}

// mode light and dark btn
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// seve to load preference
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-theme');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-theme');

  // seve preference
  if (body.classList.contains('light-theme')) {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }
});

// Función para mostrar/ocultar la interfaz
function toggleRatingModal(show) {
  const modal = document.getElementById('ratingModal');
  if (show) {
    modal.style.display = 'block';
    setTimeout(() => (modal.style.opacity = '1'), 10);
  } else {
    modal.style.opacity = '0';
    setTimeout(() => (modal.style.display = 'none'), 300);
  }
}

function enviarCalificacion() {
  showToast('Tk for rating us!', 'info');
  toggleRatingModal(false);
}

////////////
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'en,es,fr,it',
      autoDisplay: false,
      multilanguagePage: true,
    },
    'google_translate_element'
  );
}

// 1. Mostrar/Ocultar tu menú al hacer clic en el SVG
const btn = document.getElementById('custom-translate-btn');
const menu = document.getElementById('my-custom-menu');

btn.addEventListener('click', () => {
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
});

// 2. Lógica para cambiar el idioma
document.querySelectorAll('.lang-option').forEach((option) => {
  option.addEventListener('click', function () {
    const lang = this.getAttribute('data-lang');

    // 1. Definimos el valor de la cookie (ej: /en/es)
    const cookieValue = `/en/${lang}`;

    // 2. Actualizamos la cookie directamente
    // Esto sobreescribe cualquier selección previa inmediatamente
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; domain=.${window.location.host}; path=/`;

    // 3. Recargamos para que el widget lea la nueva cookie
    location.reload();
  });
});

// Cerrar el menú si haces clic fuera
document.addEventListener('click', (e) => {
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }
});
