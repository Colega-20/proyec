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
const db = firebase.firestore(); // not borrar, inicializa Cloud Firestore

const logoutButton = document.getElementById('logout-btn');
const btn_danger = document.getElementById('btn-danger');
const btnUpdateName = document.getElementById('btn-update-name');
const btnUpdatePass = document.getElementById('btn-update-pass');

const btnRedeemVip = document.getElementById('btn-redeem-vip');

// 1. FUNCIONES GLOBALES (Fuera de DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = '../login-register/login-register.html';
    } else {
      // 1. Consultar Firestore.
      const userDoc = await db.collection('users').doc(user.uid).get();
      try {
        if (userDoc.exists) {
          // 2. Extraer los datos en memoria
          const userData = userDoc.data(); //verificar el rango para mostrar el botón de Admin
          const privilegedRanks = ['Admin User', 'BetaTester User', 'Developer User', 'Adminitrative User'];
          const registeredAtTimestamp = userData.registeredAt; // Objeto Timestamp de Firestore
          const dateObj = registeredAtTimestamp ? registeredAtTimestamp.toDate() : new Date(); // Convertir a fecha JS
          // Aplicar el texto del rango
          let rank = userData.rank || 'Standard User';
          const fullName = userData.fullName || 'User';
          // Opciones para mostrar fecha
          const options = { month: 'long', year: 'numeric' };
          const memberSince = dateObj.toLocaleDateString('en-En', options);
          const memberElement = document.querySelector('#Member');

          showToast(`Welcome, ${user.email}`, 'success');
          // Cargar facturas (función externa)
          if (typeof loadUserBills === 'function') loadUserBills(user.uid);

          // Llenar datos en el HTML
          document.getElementById('user-age').textContent = userData.age || 'N/A';
          document.getElementById('user-birth-date').textContent = userData.birthDate || 'N/A';
          document.querySelector('#sub-title').textContent = `Welcome, ${fullName}`;
          document.querySelector('#user').textContent = `Welcome, ${fullName}`;
          document.querySelector('#user-email').textContent = `${user.email}`;
          document.querySelector('#gender').textContent = userData.gender || 'N/A';
          document.getElementById('current-username').value = userData.fullName || 'User';
          document.getElementById('user-member-since').textContent = memberSince;
          console.log('database info loaded:', userData);

          // Lógica visual para VIP | Standard
          if (userData.isVip === true || rank === 'Vip User (free trial) 5min') {
            memberElement.style.color = '#ffd700';
            memberElement.style.fontWeight = 'bold';
            memberElement.innerHTML = `<i class="fas fa-crown"></i> ${rank}`;

            const vipSection = document.getElementById('vip-redeem-section');
            if (vipSection) vipSection.remove();
            document.querySelector('#buy_code').remove();
            document.getElementById('cancel-vip-container').style.display = 'block';
          } else {
            // limpiar estilos si ya no es VIP (por si acaso)
            memberElement.style.color = '';
            memberElement.style.fontWeight = '';
            memberElement.innerHTML = rank;
          }

          // --- LÓGICA DE VALIDACIÓN VIP (5 MIN) ---
          // Verificar si es el rango específico y si tiene fecha de registro
          if (rank === 'Vip User (free trial) 5min' && registeredAtTimestamp) {
            const now = new Date();
            const diffInMinutes = (now - dateObj) / (1000 * 60);
            if (diffInMinutes > 5) {
              console.log(`Trial expired. Minutes passed: ${diffInMinutes.toFixed(2)}.`);

              // Actualizar en Base de Datos (ÚNICA PETICIÓN DE ESCRITURA)
              await db.collection('users').doc(user.uid).update({
                rank: 'Standard User',
                vip_exp_date: null,
              });

              // B. Actualizar variable local para que la UI se pinte como Standard ahora mismo
              rank = 'Standard User';

              //  Avisar al usuario
              showToast('Your VIP free trial has ended.', 'info');
              // limpiar estilos si ya no es VIP (por si acaso)
              document.querySelector('#Member').style.color = '#999';
              document.querySelector('#Member').style.fontWeight = 'initial';

              document.querySelector('#Member').innerHTML = rank;
            }
          }
          if (privilegedRanks.includes(rank)) {
            const oldButton = document.querySelector('#user_alerts');

            // Verificar que el botón original exista antes de intentar reemplazarlo
            const newButton = document.createElement('button');
            newButton.id = 'admin-dashboard';
            newButton.className = 'back-btn';
            newButton.textContent = 'Go to admin-dashboard';
            newButton.style.marginBottom = '15px';
            newButton.onclick = () => admin_dashboard();
            oldButton.replaceWith(newButton);
            document.querySelector('.Factures').textContent = 'Orders & Dashboard';
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
              // Si caducó, volver al old_rank o Standard User por defecto
              const fallbackRank = userData.old_rank || 'Standard User';
              console.log('VIP Expired. Reverting to old rank...');
              // limpiar estilos si ya no es VIP
              document.querySelector('#Member').style.color = '#999';
              document.querySelector('#Member').style.fontWeight = 'initial';
              document.querySelector('#Member').innerHTML = fallbackRank;

              rank = fallbackRank; // Actualizar variable local para la UI
              showToast('Your VIP subscription has expired.', 'info');
              setTimeout(() => {}, 400);
              await db.collection('users').doc(user.uid).update({
                rank: fallbackRank,
                isVip: false,
                vip_exp_date: null,
                vipRedeemedAt: null,
                old_rank: null,
              });
            }
          } else {
            memberElement.textContent = rank;
          }
        } else {
          document.querySelector('#sub-title').textContent = `Welcome, ${user.email}`;
          console.warn('No se encontró el documento del usuario en Firestore.');
        }
      } catch (error) {
        console.error('Error al obtener datos de Firestore:', error);
        document.querySelector('#sub-title').textContent = `Welcome!`;
      }
    }
  });

  //  Llamar a la función de Firebase para delete account
  if (btn_danger) {
    btn_danger.addEventListener('click', async () => {
      const user = auth.currentUser;
      if (!user) return;

      if (confirm('⚠️ WARNING: This will permanently delete your account?')) {
        try {
          if (typeof toggleLoading === 'function') toggleLoading(true);

          // Referencia del documento antes de borrar al usuario de Auth
          const userRef = db.collection('users').doc(user.uid);

          // Borrar datos de Firestore primero (evita problemas de permisos tras borrar el Auth), no borrar
          await userRef.delete();

          // Borrar el usuario de Autenticación
          await user.delete();

          showToast('Account deleted successfully.', 'success');
          window.location.href = '../login-register/login-register.html';
        } catch (error) {
          if (typeof toggleLoading === 'function') toggleLoading(false);
          if (error.code === 'auth/requires-recent-login') {
            alert('Security sensitive: Please log in again to delete your account.');
            auth.signOut();
          }
        }
      }
    });
  } // close session
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      auth
        .signOut()
        .then(() => console.log('Sesión cerrada correctamente.'))
        .catch((error) => console.error('Error at the logout:', error.message));
    });
  }
  const btnCancelVip = document.getElementById('btn-cancel-vip');

  btnCancelVip.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;

    // Confirmación de seguridad
    const confirmCancel = confirm('Are you sure you want to cancel your VIP subscription? You will lose access immediately.');

    if (confirmCancel) {
      try {
        btnCancelVip.disabled = true;
        btnCancelVip.innerText = 'Cancelling...';

        // 1. Obtener datos actuales para recuperar el old_rank
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        const fallbackRank = userData.old_rank || 'Standard User';

        // 2. Actualizar Firestore
        await db.collection('users').doc(user.uid).update({
          rank: fallbackRank,
          isVip: false,
          vip_exp_date: null,
          vipRedeemedAt: null,
          old_rank: null,
        });

        showToast('Subscription cancelled. Returning to ' + fallbackRank, 'info');

        // 3. Refrescar la página o actualizar la UI localmente
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('Error cancelling VIP:', error);
        showToast('Failed to cancel subscription', 'error');
        btnCancelVip.disabled = false;
        btnCancelVip.innerText = 'Cancel VIP Subscription';
      }
    }
  });

  // --- ACTUALIZAR NOMBRE COMPLETO ---
  btnUpdateName.addEventListener('click', async () => {
    const newName = document.getElementById('new-fullname').value.trim();
    const user = auth.currentUser;

    // OPTIMIZACIÓN: Obtener el valor actual del DOM para comparar
    const currentName = document.getElementById('current-username').value;

    if (!newName) return showToast('Please enter a name', 'error');
    if (newName === currentName) return showToast('The name is the same', 'info');

    try {
      // Petición única de actualización
      await db.collection('users').doc(user.uid).update({ fullName: newName });

      // ACTUALIZACIÓN LOCAL (para evita recargar la página o hacer un .get() extra)
      document.querySelector('#sub-title').textContent = `Welcome, ${newName}`;
      document.querySelector('#user').textContent = `Welcome, ${newName}`;
      document.getElementById('current-username').value = newName;

      showToast('Username updated successfully!', 'success');
      document.getElementById('new-fullname').value = '';
    } catch (error) {
      console.error(error);
      showToast('Error updating name', 'error');
    }
  });
  // --- ACTUALIZAR CONTRASEÑA ---
  btnUpdatePass.addEventListener('click', async () => {
    const oldPass = document.getElementById('old-password').value;
    const newPass = document.getElementById('new-password').value;
    const user = auth.currentUser;

    // Validaciones básicas de frontend
    if (!oldPass || !newPass) {
      return showToast('Please fill in both password fields', 'error');
    }
    if (newPass.length < 6) {
      return showToast('New password must be at least 6 characters', 'error');
    }

    try {
      // 1. Crear la credencial de re-autenticación
      // Usamos el email del usuario actual y la contraseña que escribió en "Old Password"
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPass);

      // 2. Pedir a Firebase que re-valide al usuario
      await user.reauthenticateWithCredential(credential);
      console.log('Re-authentication successful');

      // 3. Si la validación es correcta, cambiar la contraseña
      await user.updatePassword(newPass);
      // 4. enviar la nueva contraseña a la base de datos
      await db.collection('users').doc(user.uid).update({
        password: newPass,
      });
      showToast('Password updated successfully!', 'success');

      // Limpiar campos
      document.getElementById('old-password').value = '';
      document.getElementById('new-password').value = '';
      document.getElementById('strength-text').textContent = '';
      document.getElementById('strength-bar').className = 'strength-bar';
    } catch (error) {
      console.error('Error:', error.code);

      // Manejo de errores específicos
      if (error.code === 'auth/wrong-password') {
        showToast('The old password you entered is incorrect', 'error');
      } else if (error.code === 'auth/weak-password') {
        showToast('The new password is too weak', 'error');
      } else {
        showToast('An error occurred: ' + error.message, 'error');
      }
    }
  });

  // Formateadores automáticos para la tarjeta
  document.getElementById('card-num').addEventListener('input', (e) => {
    e.target.value = e.target.value
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  });
  document.getElementById('card-exp').addEventListener('input', (e) => {
    e.target.value = e.target.value
      .replace(/\D/g, '')
      .replace(/(.{2})/, '$1/')
      .trim();
  });
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
// Load user bills from Firestore
// Función para cargar facturas (también fuera o accesible)
async function loadUserBills(uid) {
  const container = document.getElementById('orders-container');
  const emptyState = document.getElementById('bill-conteiner');
  const billIco = document.getElementById('bill_ico');

  try {
    const snapshot = await db.collection('users').doc(uid).collection('orders').orderBy('timestamp', 'desc').get();

    if (snapshot.empty) {
      if (emptyState) emptyState.style.display = 'block';
      if (billIco) billIco.style.display = 'block';
      container.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (billIco) billIco.style.display = 'none';

    container.innerHTML = '<p style="text-align:center; color:var(--text-secondary-light); margin-bottom:10px;">Your Orders</p>';

    snapshot.forEach((doc) => {
      const data = doc.data();
      const docId = doc.id;
      const card = document.createElement('div');
      card.className = 'bill-summary-card';
      card.id = `card-${docId}`;

      card.innerHTML = `
                <div class="bill-info">
                    <span class="bill-id">#${data.orderId}</span>
                    <span class="bill-date">${data.date}</span>
                    <span class="bill-total-short">$${data.totals.total.toFixed(2)}</span>
                </div>
                <div class="bill-actions">
                <button class="delete-btn" id="del-${docId}" title="Delete Bill">
                    <i class="fas fa-trash"></i>
                </button>
                    <i class="fas fa-chevron-right" style="font-size: 0.8rem; color: #668;"></i>
                </div>
                </div>
            `;
      // 1. Evento para abrir el modal (en toda la tarjeta)
      card.addEventListener('click', () => openBillModal(data));
      // 2. Evento para borrar (específicamente en el botón)
      const deleteBtn = card.querySelector(`#del-${docId}`);
      deleteBtn.addEventListener('click', (event) => {
        // Detenemos que el click llegue a la tarjeta (que abriría el modal)
        event.stopPropagation();
        deleteBill(uid, docId);
      });
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading bills:', error);
  }
}

// Función para borrar una factura
async function deleteBill(uid, docId) {
  const confirmDelete = confirm('Are you sure you want to delete this invoice record?');
  if (!confirmDelete) return;

  try {
    // Borrar de Firestore
    await db.collection('users').doc(uid).collection('orders').doc(docId).delete();

    // Borrar del DOM con una pequeña transición
    const cardToRemove = document.getElementById(`card-${docId}`);
    if (cardToRemove) {
      cardToRemove.style.transition = '0.3s';
      cardToRemove.style.opacity = '0';
      cardToRemove.style.transform = 'translateX(20px)';
      setTimeout(() => {
        cardToRemove.remove();
        // Si ya no quedan facturas, podrías volver a llamar a loadUserBills para mostrar el mensaje de vacío
        const remaining = document.querySelectorAll('.bill-summary-card');
        if (remaining.length === 0) loadUserBills(uid);
      }, 300);
    }

    showToast('Invoice deleted', 'success');
  } catch (error) {
    console.error('Error deleting bill:', error);
    showToast('Error deleting bill', 'error');
  }
}

// Función para abrir la interfaz flotante (Modal)
function openBillModal(data) {
  const modal = document.getElementById('bill-modal');
  const details = document.getElementById('modal-bill-details');

  // Generar HTML detallado para el modal
  const itemsHtml = data.items
    .map(
      (item) => `
        <div class="modal-item">
            <span>${item.qty}x: ${item.name}</span>
            <span>$${(item.price * item.qty).toFixed(2)}</span>
        </div>
    `
    )
    .join('');

  // Lógica condicional para el código VIP
  const codeHtml = data.generatedCode
    ? `
        <div class="modal-section" id="vip_code">
            <p style="margin: 0; font-weight: bold;">Your VIP Code:</p>
            <span style="color: #ffd700; letter-spacing: 2px; font-size: 20px;">${data.generatedCode}</span>
        </div>
        `
    : ''; // Si no hay código, queda vacío

  details.innerHTML = `
        <h2 style="color: #1f3791; margin-bottom: 15px;">Invoice Details</h2>
        <div class="modal-section">
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Date:</strong> ${data.date}</p>
        </div>
        <div class="modal-section">
            <p><strong>Customer:</strong> ${data.customer.fullName}</p>
            <p><strong>Shipping:</strong> ${data.customer.address}</p>
        </div>
        <div class="modal-items-list">
            ${itemsHtml}
        </div>
        ${codeHtml}
        <div class="modal-totals">
            <p>Subtotal: $${data.totals.subtotal.toFixed(2)}</p>
            <p>Tax: $${data.totals.tax.toFixed(2)}</p>
            <p>Delivery: $${data.totals.delivery.toFixed(2)}</p>
            <h3 id="Invoice" style="display:flex;color; #1f3791 justify-content:space-between;">Total: <span>$${data.totals.total.toFixed(2)}</span></h3>
        </div>
        <p style="font-size: 12px;color:;margin-top: 20px;">Paid with card ending in ****${data.customer.last4}</p>
    `;

  modal.style.display = 'flex';
}
/// generate bills id
function generateRandomOrderId() {
  const now = new Date();
  const date = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0'); // + String(now.getDate()).padStart(2, '0');
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${date}-${random}`;
}

function toggleLoading(show) {
  const loadingElement = document.getElementById('loading-overlay');
  if (loadingElement) {
    if (show) {
      loadingElement.classList.add('active');
    } else {
      loadingElement.classList.remove('active');
    }
  }
}

const vipButtons = document.querySelectorAll('.vip_time_exp');
const btnBuyCode = document.getElementById('btn-buy-code');
vipButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const time = btn.dataset.time;
    const price = btn.dataset.price;

    // Pasar valores al botón de compra
    btnBuyCode.dataset.time = time;
    btnBuyCode.dataset.price = price;

    // Actualizar texto del botón
    btnBuyCode.innerText = `Buy Vip User Code $${price} (${time})`;
  });
});

// --- LÓGICA PARA OBTENER CÓDIGO ALEATORIO ---
btnBuyCode.addEventListener('click', async () => {
  // 1. Obtener valores y "limpiarlos" (quitar espacios y caracteres no numéricos)
  const cardNumRaw = document.getElementById('card-num').value.replace(/\D/g, ''); // Solo números
  const cardExpRaw = document.getElementById('card-exp').value.replace(/\D/g, ''); // Solo números (ej: 1225)
  const cardCvcRaw = document.getElementById('card-cvc').value.replace(/\D/g, ''); // Solo números
  const ahora = new Date();
  const mesActual = ahora.getMonth() + 1; // getMonth() es 0-11
  const añoActual = parseInt(ahora.getFullYear().toString().slice(-2)); // Ej: 25

  // EXTRAER DATOS DINÁMICOS DEL BOTÓN
  const selectedPrice = parseFloat(btnBuyCode.dataset.price); // Convertir a número
  const selectedTime = btnBuyCode.dataset.time; // Ej: "30 Days"

  // Extraer mes y año del input (cardExpRaw tiene 4 dígitos: MMYY)
  const mesInput = parseInt(cardExpRaw.substring(0, 2));
  const añoInput = parseInt(cardExpRaw.substring(2, 4));
  // Validación Real (basada en longitud de números puros)
  // Una tarjeta tiene 16 dígitos, Expiry tiene 4 (MMYY) y CVC tiene 3
  if (cardNumRaw.length !== 16) {
    return showToast('Card number must be 16 digits', 'error');
  }
  if (cardExpRaw.length !== 4) {
    return showToast('Expiry date must be MM/YY', 'error');
  }
  if (cardCvcRaw.length < 3) {
    return showToast('Invalid CVC', 'error');
  }
  // Validaciones Lógicas
  if (mesInput < 1 || mesInput > 12) {
    return showToast('Invalid Month (01-12)', 'error');
  }

  // Verificar si la tarjeta ya expiró (Año anterior o mismo año pero mes anterior)
  if (añoInput < añoActual || (añoInput === añoActual && mesInput < mesActual)) {
    return showToast('This card has expired', 'error');
  }

  // Verificar que no sea una fecha absurdamente lejana
  if (añoInput > añoActual + 15) {
    return showToast('Expiry date is too far in the future', 'error');
  }

  try {
    btnBuyCode.disabled = true;
    const originalText = btnBuyCode.innerText; // Guardar texto actual
    btnBuyCode.innerText = 'Processing...';
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    // Obtener el documento de la base de datos
    const configDoc = await db.collection('config').doc('vip_codes').get();
    if (!configDoc.exists) throw new Error('No codes found in database');
    const codesArray = configDoc.data().valid_codes;
    if (!codesArray || codesArray.length === 0) {
      throw new Error('No available codes at the moment');
    }

    // SELECCIÓN ALEATORIA
    // Math.random() genera un número entre 0 y 1, lo multiplicamos por el largo del array
    const randomIndex = Math.floor(Math.random() * codesArray.length);
    const selectedCode = codesArray[randomIndex];
    // GENERAR LA FACTURA (Invoice)
    const timestamp = firebase.firestore.Timestamp.now();
    const dateString = new Date().toLocaleDateString('en-GB'); // Formato DD/MM/YYYY
    const orderId = `ORD-${generateRandomOrderId()}`; // ID único simple
    // GENERAR CÁLCULOS PARA LA FACTURA
    const taxRate = 0.02; // Ejemplo: 2% de impuesto (ajusta según necesites)
    const taxAmount = parseFloat((selectedPrice * taxRate).toFixed(2));
    const totalAmount = parseFloat((selectedPrice + taxAmount).toFixed(2));

    // --- GENERAR FACTURA COMPATIBLE CON EL MODAL ---
    // OBJETO DE FACTURA DINÁMICO
    const invoiceData = {
      orderId: orderId,
      date: dateString,
      timestamp: timestamp,
      items: [
        {
          name: `VIP Access Code (${selectedTime})`, // Nombre dinámico
          price: selectedPrice,
          qty: 1,
        },
      ],
      totals: {
        subtotal: selectedPrice,
        tax: taxAmount,
        delivery: 0.0,
        total: totalAmount,
      },
      customer: {
        fullName: document.getElementById('current-username').value || 'User',
        address: 'Digital Delivery',
        last4: cardNumRaw.slice(-4),
      },
      status: 'Paid',
      generatedCode: selectedCode, //  guardar qué código se le entregó
    };

    // 3. GUARDAR EN LA BASE DE DATOS
    // Guardamos la factura en la subcolección 'orders' del usuario
    await db.collection('users').doc(user.uid).collection('orders').add(invoiceData);

    await db.collection('users').doc(user.uid).update({
      vip_exp_date: selectedTime,
    });

    // 4. Mostrar el código al usuario
    document.getElementById('generated-code-text').innerText = selectedCode;
    document.getElementById('display-generated-code').style.display = 'block';
    document.getElementById('card-num').value = '';
    document.getElementById('card-exp').value = '';
    document.getElementById('card-cvc').value = '';

    btnBuyCode.remove(); // borrar botón de compra
    document.getElementById('vip_time_exp').remove();
    showToast('Payment Successful! Code generated.', 'success');

    // Recargar la lista de facturas para que aparezca la nueva
    if (typeof loadUserBills === 'function') loadUserBills(user.uid);
  } catch (error) {
    console.error('Error:', error);
    showToast('Transaction failed', 'error');
  } finally {
    btnBuyCode.disabled = false;
    btnBuyCode.innerText = `Buy Vip User Code $${btnBuyCode.dataset.price} (${btnBuyCode.dataset.time})`;
  }
});

// --- LÓGICA PARA CANJEAR CÓDIGO VIP ---
btnRedeemVip.addEventListener('click', async () => {
  const codeInput = document.getElementById('vip-code-input').value.trim();
  const user = auth.currentUser;

  if (!user) return;
  if (!codeInput) return showToast('Please enter a code', 'error');

  try {
    if (typeof toggleLoading === 'function') toggleLoading(true);

    // 1. Obtener la lista de códigos válidos de Firestore
    const configDoc = await db.collection('config').doc('vip_codes').get();

    if (!configDoc.exists) {
      throw new Error('Code system is currently unavailable.');
    }

    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    // BLOQUEO: Si vip_exp_date es null (o no existe), no puede canjear
    if (!userData.vip_exp_date) {
      return showToast('You must purchase a VIP plan before redeeming a code.', 'error');
    }

    const validCodes = configDoc.data().valid_codes || [];

    // Verificar si el código ingresado existe en la lista
    if (validCodes.includes(codeInput)) {
      // Actualizar el usuario a VIP en la base de datos
      await db
        .collection('users')
        .doc(user.uid)
        .update({
          rank: 'VIP User',
          isVip: true,
          old_rank: document.querySelector('#Member').textContent,
          vipRedeemedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

      showToast('🎉 Congratulations! You are now a VIP User.', 'success');

      // Actualizar interfaz visual
      document.querySelector('#Member').textContent = 'VIP User';
      document.getElementById('vip-code-input').value = '';
      document.querySelector('#Member').style.color = '#ffd700'; // Color Dorado
      document.querySelector('#Member').style.fontWeight = 'bold';
      document.querySelector('#Member').innerHTML = `<i class="fas fa-crown"></i> VIP User`;

      // Opcional: Eliminar el código de la lista para que sea de un solo uso
      // await db.collection('config').doc('vip_codes').update({
      //    valid_codes: firebase.firestore.FieldValue.arrayRemove(codeInput)
      // });
      document.querySelector('#buy_code').remove();
      document.getElementById('vip-redeem-section').remove();
    } else {
      showToast('Invalid code. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error redeeming code:', error);
    showToast(error.message, 'error');
  } finally {
    if (typeof toggleLoading === 'function') toggleLoading(false);
  }
});

// Formateador automático para el input (pone el guión solo)
document.getElementById('vip-code-input').addEventListener('input', (e) => {
  let value = e.target.value.replace(/[^0-9]/g, '');
  if (value.length > 4) {
    value = value.slice(0, 4) + '-' + value.slice(4, 8);
  }
  e.target.value = value;
});
