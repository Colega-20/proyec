// script.js
import * as VIP from './vip_products.js';

//  web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyDvuSzMlZzxDLnYFBDMQSlwcj11BQtx9jI',
  authDomain: 'database-4ed5a.firebaseapp.com',
  databaseURL: 'https://database-4ed5a-default-rtdb.firebaseio.com/',
  projectId: 'database-4ed5a',
  storageBucket: 'database-4ed5a.firebasestorage.app',
  messagingSenderId: '515978040414',
  appId: '1:515978040414:web:f3572d27f9ab24a7c6d0cf',
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Ensure Firebase is initialized before this (firebase.initializeApp and firebase.auth)
document.addEventListener('DOMContentLoaded', () => {
  // References to buttons
  const loginBtn = document.getElementById('Login_Register');
  const dashboardBtn = document.getElementById('Dashboard_Btn');

  // Listen to auth state in real time
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log('Usuario detectado', user.email);

      // Initial UI cleanup
      const loginReg1 = document.getElementById('Login_Register');
      const loginReg2 = document.getElementById('Login_Register2');
      if (loginReg1) loginReg1.remove();
      if (loginReg2) loginReg2.remove();

      loginBtn.style.display = 'none';
      dashboardBtn.style.display = 'inherit';

      try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) return;

        const userData = userDoc.data();
        let rank = userData.rank || 'Standard User';
        const registeredAtTimestamp = userData.registeredAt;

        // --- TIME VALIDATION LOGIC ---
        if (rank === 'Vip User (free trial) 5min' && registeredAtTimestamp) {
          const dateObj = registeredAtTimestamp.toDate();
          const now = new Date();
          const diffInMinutes = (now - dateObj) / (1000 * 60);

          // Changed 294 to 20
          if (diffInMinutes > 5) {
            console.log(`Trial expired. Minutes: ${diffInMinutes.toFixed(2)}`);

            // 1. Update DB
            await db.collection('users').doc(user.uid).update({
              rank: 'Standard User',
            });

            // 2. Update local variable
            rank = 'Standard User';
            showToast('Your VIP free trial has ended.', 'info');
          }
        }
        // --- LÓGICA DE VALIDACIÓN VIP DINÁMICA ---
        if (userData.vip_exp_date && userData.vipRedeemedAt) {
          const now = new Date();
          const redeemedAt = userData.vipRedeemedAt.toDate(); // Convertir Timestamp a Fecha JS

          // Función para convertir "3 Min", "30 Days", "1 year" a milisegundos
          const getDurationMs = (durationStr) => {
            const val = parseInt(durationStr);
            if (durationStr.includes('Min')) return val * 60 * 1000;
            if (durationStr.includes('Days')) return val * 24 * 60 * 60 * 1000;
            if (durationStr.includes('Year')) return val * 365 * 24 * 60 * 60 * 1000;
            return 0;
          };

          const durationMs = getDurationMs(userData.vip_exp_date);
          const expirationTime = redeemedAt.getTime() + durationMs;

          if (now.getTime() > expirationTime) {
            console.log('VIP Expired. Reverting to old rank...');

            // Si caducó, volvemos al old_rank o Standard User por defecto
            const fallbackRank = userData.old_rank || 'Standard User';

            await db.collection('users').doc(user.uid).update({
              rank: fallbackRank,
              isVip: false,
              vip_exp_date: null,
              vipRedeemedAt: null,
              old_rank: null,
            });

            rank = fallbackRank;
            showToast('Your VIP subscription has expired.', 'info');
          }
        }

        // --- PRODUCTS LOGIC (Based on updated rank) ---
        const isVipTrial = rank === 'Vip User (free trial) 5min';
        const isVip = userData.isVip === true;

        if (isVip || isVipTrial) {
          // IF VIP: Show vip products
          window.VIP_DATA = { menuItems: VIP.menuItems };
          const vipFilter = document.getElementById('vip-filter');
          vipFilter.style.display = 'flex';
          if (isVip) {
            showToast('You are VIP Member.', 'info');
          }
          if (isVipTrial) {
            showToast('You are using your 20min VIP trial.', 'info');
          }
        } else {
          // NOT VIP: Ensure VIP features are hidden
          const vipFilter = document.getElementById('vip-filter');
          vipFilter.style.display = 'none';
          document.getElementById('vip-filter').remove();
          window.VIP_DATA = null;
        }
      } catch (error) {
        console.error('Error cargando datos de rango:', error);
      } finally {
        window.dispatchEvent(new CustomEvent('vipDataReady'));
      }
    } else {
      // GUEST MODE
      console.log('Modo invitado');
      window.dispatchEvent(new CustomEvent('vipDataReady'));
      const dashBtn = document.getElementById('Dashboard_Btn');
      if (dashBtn) dashBtn.remove();
      if (dashboardBtn) dashboardBtn.style.display = 'none';
    }
  });
});

document.addEventListener('submit', async (e) => {
  // 1. Verify event comes from our dynamic form
  const registerForm = e.target.closest('.checkout-form');
  document.querySelector('.submit-btn').textContent = 'Prossing Order...';
  // If the form doesn't exist in the DOM or isn't the checkout form, do nothing
  if (!registerForm) return;

  e.preventDefault(); // Prevent page reload

  // 2. Verify authentication
  const user = auth.currentUser;
  if (!user) {
    showToast('You must be logged in to place an order.', 'error');
    return;
  }

  try {
    // Capture values directly from the active form
    const formData = {
      fullName: registerForm.querySelector('#name').value,
      email: registerForm.querySelector('#email').value,
      phone: registerForm.querySelector('#phone').value,
      address: registerForm.querySelector('#address').value,
      // Only store last 4 digits
      last4: registerForm.querySelector('#cardNumber').value.slice(-4),
    };

    // 4. Prepare invoice calculations (global cart variables)
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = cart.reduce((sum, item) => sum + (item.tax || 0) * item.quantity, 0);
    const delivery = subtotal > 0 ? 3.99 : 0;
    const total = subtotal + delivery + tax;

    // 5. Send to Firestore (subcollection 'orders')
    // Use .add() so Firebase generates a unique ID for each order
    await db
      .collection('users')
      .doc(user.uid)
      .collection('orders')
      .add({
        orderId: currentOrderId,
        date: date,
        customer: formData,
        items: cart.map((item) => ({
          name: item.name,
          qty: item.quantity,
          price: item.price,
        })),
        totals: {
          subtotal: subtotal,
          tax: tax,
          delivery: delivery,
          total: total,
        },
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    console.log('Factura generada en Firestore para el usuario:', user.uid);
    showToast('Order placed successfully! Your Order will arrive in soon', 'success');
    setTimeout(() => {
      cart = [];
      updateCartBadge();
      closeCheckout();
      currentOrderId = null;
    }, 1000);
  } catch (error) {
    console.error('Error al procesar factura:', error);
    showToast('Error processing your order. Please try again.', 'error', error);
  }
});

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
