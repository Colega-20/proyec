// ==========================================
// IMPORTACIONES
// ==========================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  updateDoc,
  limit,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDvuSzMlZzxDLnYFBDMQSlwcj11BQtx9jI',
  authDomain: 'database-4ed5a.firebaseapp.com',
  databaseURL: 'https://database-4ed5a-default-rtdb.firebaseio.com/',
  projectId: 'database-4ed5a',
  storageBucket: 'database-4ed5a.firebasestorage.app',
  messagingSenderId: '515978040414',
  appId: '1:515978040414:web:f3572d27f9ab24a7c6d0cf',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const db = getDatabase(app);
const db = getFirestore(app);

// ==========================================
// LÓGICA DEL ADMIN DASHBOARD
// ==========================================
// Variable para saber qué colección se vera
let currentCollection = 'partner_requests';
let lastVisibleDoc = null;
let isFetching = false;

window.applyDOMFilter = (filterType, element) => {
  if (element) {
    // Buscar todos los botones de filtro dentro del mismo contenedor
    const buttons = element.parentElement.querySelectorAll('.btn-filter');
    // Quitar la clase 'active' a todos
    buttons.forEach((btn) => btn.classList.remove('active'));
    // Poner la clase 'active' solo al botón clickeado
    element.classList.add('active');
  }
  // Obtener todas las tarjetas impresas en el contenedor actual
  const container = document.getElementById('admin-results') || document.getElementById('user-requests-list');
  const cards = Array.from(container.getElementsByClassName('request-card'));
  // === NUEVA LÓGICA DE CLASE ACTIVE ===
  if (filterType === 'all') {
    cards.forEach((card) => (card.style.display = 'block'));
    return;
  }

  // Lógica de filtrado/ordenado basada en el texto del HTML
  if (['pending', 'rejected', 'approved', 'resolved'].includes(filterType)) {
    // FILTRO POR ESTADO
    cards.forEach((card) => {
      const statusText = card.querySelector('.status-badge').textContent.toLowerCase().trim();
      card.style.display = statusText === filterType ? 'block' : 'none';
    });
  } else {
    // ORDENAMIENTO (Date o Rank)
    cards.sort((a, b) => {
      if (filterType === 'rank') {
        // Extrae el nivel de Rank: "Rank: BetaTester User" -> BetaTester User
        const rankA = a.querySelector('#rank').textContent.replace('Rank: ', '').trim();
        const rankB = b.querySelector('#rank').textContent.replace('Rank: ', '').trim();
        return rankA.localeCompare(rankB); // Orden alfabético de rango
      }
    });

    // Re-inyectar las tarjetas ordenadas al contenedor
    cards.forEach((card) => {
      card.style.display = 'block'; // Asegurar que sean visibles
      container.appendChild(card);
    });
  }
};

// Función global para cargar datos (se llama desde los botones del HTML)
// ==========================================
// CARGA DE DATOS CON PAGINACIÓN Y SCROLL
// ==========================================
window.loadCollection = async (collectionName, isNextPage = false) => {
  if (isFetching) return;
  isFetching = true;

  currentCollection = collectionName; // Sincronización crucial. no borrar ni mover
  const resultsContainer = document.getElementById('admin-results');

  if (!isNextPage) {
    resultsContainer.innerHTML = '<p style="text-align: center;">Loading...</p>';
    lastVisibleDoc = null;
  }

  // Estética de botones
  document.getElementById('btn-partners')?.classList.toggle('active', collectionName === 'partner_requests');
  document.getElementById('btn-support')?.classList.toggle('active', collectionName === 'support_tickets');

  try {
    let q = query(collection(db, collectionName), orderBy('createdAt', 'desc'), limit(20));

    if (isNextPage && lastVisibleDoc) {
      q = query(collection(db, collectionName), orderBy('createdAt', 'desc'), startAfter(lastVisibleDoc), limit(20));
    }

    const querySnapshot = await getDocs(q);
    if (!isNextPage) resultsContainer.innerHTML = '';

    if (querySnapshot.empty && !isNextPage) {
      resultsContainer.innerHTML = '<p style="text-align: center;">No hay registros.</p>';
      return;
    }

    lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;
      const userUid = data.uid;
      const dateStr = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : '---';

      const card = document.createElement('div');
      card.className = 'request-card';
      card.innerHTML = `
                <div class="request-header">
                    <div class="user-info">
                        <h3>${data.userName || 'Usuario'}</h3>
                        <span>${data.userEmail}</span>
                        <span id="rank">Rank: ${data.rank}</span>
                        <span id="ticketCode">TicketCode: ${data.ticketCode}</span>
                        <span id="userUid"">ID: ${userUid}</span>
                    </div>
                    
                    <div id="status_conteiner">
                        <span class="status-badge status-${data.status}">${data.status}</span>
                        <button onclick="window.deleteAdminRequest('${id}', '${userUid}')" class="btn-delete">🗑️</button>
                        <br><small style="color: var(--text-muted);">${dateStr}</small>
                    </div>
                </div>
                <div class="request-body" style="margin-top: 0.5rem; background: rgba(0,0,0,0.1); padding: 10px; border-radius: 4px;">
                <label style="font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; display: block;">User Request:</label>    
                <p id="justificacion-${id}">${data.justification}</p>
                </div>
                <div class="admin-response-area">
                <label style="font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; display: block;">Respuesta Admin:</label>
                    <textarea id="response-${id}" rows="2">${data.adminResponse || ''}</textarea>
                    <div class="action-buttons">
                        <button onclick="window.updateStatus('${id}', '${userUid}', 'rejected')" class="btn btn-admin-reject">Rechazar</button>
                        <button onclick="window.updateStatus('${id}', '${userUid}', '${
        currentCollection === 'partner_requests' ? 'approved' : 'resolved'
      }')" class="btn btn-admin-approve" >
                            ${currentCollection === 'partner_requests' ? 'Aprobar' : 'Resolver'}
                        </button>
                    </div>
                </div>
            `;
      resultsContainer.appendChild(card);
    });
  } catch (e) {
    console.error(e);
  } finally {
    isFetching = false;
  }
};

// Función global para actualizar estado y respuesta
// --- (ADMIN -> GLOBAL Y PRIVADO) ---
// ==========================================
// FUNCIÓN DE ACTUALIZACIÓN DOBLE
// ==========================================
window.updateStatus = async (docId, userUid, newStatus) => {
  const responseText = document.getElementById(`response-${docId}`).value;
  // CAPTURAMOS LA JUSTIFICACIÓN ORIGINAL DESDE EL HTML
  const originalJustification = document.getElementById(`justificacion-${docId}`).innerText;
  // esto usa currentCollection para evitar errores de ruta
  const globalRef = doc(db, currentCollection, docId);
  const userPrivateRef = doc(db, 'users', userUid, 'my_requests', docId);

  const updateData = {
    status: newStatus,
    adminResponse: responseText,
    justification: originalJustification,
    updatedAt: serverTimestamp(),
    // category: currentCollection,
    // ticketCode: data.ticketCode,
  };

  try {
    // 1. Actualizar global (para el Admin)
    await updateDoc(globalRef, updateData);

    // 2. Actualizar/Crear en la colección del usuario (Doble Escritura)
    // El merge: true es vital para no borrar la 'justification' original. no borrar
    await setDoc(userPrivateRef, updateData, { merge: true });

    showToast('¡Actualización exitosa! Mensaje enviado al Usuario.', 'success');
    window.loadCollection(currentCollection);
  } catch (error) {
    console.error('Error en update:', error);
    showToast('Error: Asegúrate de que el documento existe y tienes permisos.', 'error');
  }
};

// ==========================================
// FUNCIÓN DE ELIMINACIÓN PARA PARA EL ADMIN
// ==========================================
window.deleteAdminRequest = async (docId, userUid) => {
  if (!confirm('¿ESTÁS SEGURO? Esto eliminará la solicitud de forma General y permanente.')) return;

  try {
    // Referencia al documento en la colección global (ej: partner_requests)
    const globalRef = doc(db, currentCollection, docId);

    // Referencia al documento en la colección privada del usuario
    // const userPrivateRef = doc(db, 'users', userUid, 'my_requests', docId);

    // Ejecuta ambas eliminaciones
    await deleteDoc(globalRef);
    // await deleteDoc(userPrivateRef); // Opcional: Borra también el historial para el usuario

    showToast('Solicitud eliminada.', 'success');

    // Recargar la colección actual para actualizar la lista
    window.loadCollection(currentCollection);
  } catch (e) {
    console.error('Error al eliminar:', e);
    showToast('Error al eliminar: ', 'error' + e.message);
  }
};

// Cargar por defecto Partners al abrir la página admin
if (document.getElementById('admin-results')) {
  // Pequeño delay para asegurar que Firebase cargó
  setTimeout(() => {
    window.loadCollection('partner_requests');
  }, 500);
}

// ==========================================
// GESTIÓN DE USUARIOS (USER MANAGEMENT)
// ==========================================

let currentUserEditingId = null; // Variable para guardar ID  editando

// Cambiar entre vista de Logs y Vista de Usuarios
window.switchToUserManager = () => {
  // Ocultar logs
  document.getElementById('admin-results').style.display = 'none';
  document.querySelector('.filter-controls').style.display = 'none';

  // Mostrar panel de usuarios
  document.getElementById('user-manager-section').style.display = 'block';

  // Actualizar estado de botones
  document.querySelectorAll('.btn-outline').forEach((b) => b.classList.remove('active'));
  document.getElementById('btn-users').classList.add('active');
};

// Volver a la vista normal cuando se clickea Partners o Support
const originalLoadCollection = window.loadCollection;
window.loadCollection = (colName) => {
  document.getElementById('admin-results').style.display = 'grid'; // o block
  document.querySelector('.filter-controls').style.display = 'flex';
  document.getElementById('user-manager-section').style.display = 'none';
  document.getElementById('btn-users').classList.remove('active');

  // Llamar a la función original
  originalLoadCollection(colName);
};

// Buscar Usuario por UID
window.searchUserByUid = async () => {
  const uid = document.getElementById('search-uid-input').value.trim();

  if (!uid) return showToast('Por favor ingresa un UID', 'error');

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return showToast('Usuario no encontrado.', 'error');
    }
    const data = userSnap.data();
    currentUserEditingId = uid; // Guardar el ID globalmente

    // PROCESAR FECHA DE REGISTRO
    if (data.registeredAt) {
      const dateObj = data.registeredAt.toDate ? data.registeredAt.toDate() : new Date(data.registeredAt.seconds * 1000);
      const dateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      document.getElementById('edit-registeredAt').value = dateObj.toLocaleString('es-ES', dateOptions);
    } else {
      document.getElementById('edit-registeredAt').value = 'Sin fecha';
    }

    // Formatear Timestamp para visualización
    // Generar la fecha de HOY formateada para mostrar en el select y PROCESAR VIP REDEEMED
    const hoy = new Date();
    const fechaHoyTexto = hoy.toLocaleString('en-EN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const optionNow = document.getElementById('option-current-date');
    if (optionNow) optionNow.textContent = fechaHoyTexto;

    const selectVip = document.getElementById('edit-vip-redeemed');
    if (data.vipRedeemedAt === null || !data.vipRedeemedAt) {
      selectVip.value = 'null';
    } else {
      selectVip.value = 'now';
    }

    // Rellenar formulario
    document.getElementById('edit-fullname').value = data.fullName || '';
    document.getElementById('edit-email').value = data.email || '';
    // document.getElementById('edit-registeredAt').value = data.registeredAt || '';
    document.getElementById('edit-rank').value = data.rank || 'Standard User';
    document.getElementById('edit-gender').value = data.gender || 'Male';
    document.getElementById('edit-birthdate').value = data.birthDate || '';
    document.getElementById('edit-age').value = data.age || 0;
    document.getElementById('edit-isvip').checked = data.isVip || false;
    document.getElementById('edit-vip-exp').value = data.vip_exp_date || 'null';

    // Mostrar panel
    document.getElementById('user-editor-panel').style.display = 'block';
    showToast('Usuario cargado correctamente', 'success');

    // Cargar subcolecciones
    loadSubCollection(uid, 'my_requests', 'sub-requests-list');
    loadSubCollection(uid, 'orders', 'sub-orders-list');
  } catch (e) {
    console.error(e);
    showToast('Error al buscar usuario: ' + e.message, 'error');
  }
};

// Guardar Cambios del Usuario
window.saveUserChanges = async () => {
  if (!currentUserEditingId) return;

  if (!confirm('¿Estás seguro de modificar los datos de este usuario?')) return;

  const vipRedeemedSelect = document.getElementById('edit-vip-redeemed').value;

  let vipRedeemedValue;
  if (vipRedeemedSelect === 'now') {
    // Usa serverTimestamp para precisión de base de datos
    vipRedeemedValue = serverTimestamp();
  } else {
    vipRedeemedValue = null;
  }

  const updates = {
    fullName: document.getElementById('edit-fullname').value,
    rank: document.getElementById('edit-rank').value,
    gender: document.getElementById('edit-gender').value,
    age: parseInt(document.getElementById('edit-age').value) || 0,
    birthDate: document.getElementById('edit-birthdate').value || null,
    // Lógica del VIP Redeemed At
    // vipRedeemedAt: document.getElementById('edit-vip-redeemed').value === 'now' ? serverTimestamp() : null,
    isVip: document.getElementById('edit-isvip').checked,
    vip_exp_date: document.getElementById('edit-vip-exp').value, // "1 Year", etc.
    vipRedeemedAt: vipRedeemedValue, // Guardar el resultado del select
  };

  try {
    await updateDoc(doc(db, 'users', currentUserEditingId), updates);
    showToast('¡Datos del usuario actualizados!', 'success');
  } catch (e) {
    console.error(e);
    showToast('Error al guardar: ' + e.message, 'error');
  }
};

//  Función Auxiliar para leer subcolecciones
// saber el nombre exacto ('my_requests', 'orders')
async function loadSubCollection(uid, subColName, targetElementId) {
  const container = document.getElementById(targetElementId);
  container.innerHTML = 'Cargando...';

  try {
    // obtener los ultimos 10 items
    const q = query(collection(db, 'users', uid, subColName), limit(10));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = '<p>No hay registros.</p>';
      return;
    }

    let html = '';
    snapshot.forEach((doc) => {
      const d = doc.data();
      // Crear un resumen simple del documento
      const info = d.ticketCode ? `Ticket: ${d.ticketCode}` : d.id || doc.id;
      const status = d.status ? `<span class="status-badge status-${d.status}">${d.status}</span>` : '';

      html += `
                <div class="mini-item">
                    <strong>ID:</strong> ${doc.id.substring(0, 8)}... <br>
                    ${status} <small>${info}</small>
                </div>
            `;
    });
    container.innerHTML = html;
  } catch (e) {
    console.warn(`La subcolección ${subColName} podría no existir o estar vacía.`);
    container.innerHTML = '<p>Sin datos o sin acceso.</p>';
  }
}

// ==========================================
// LÓGICA DEL USER DASHBOARD
// ==========================================
const loadUserDashboard = async (user) => {
  const list = document.getElementById('user-requests-list');
  if (!list) return;

  // Consulta a la colección privada del usuario
  const q = query(collection(db, 'users', user.uid, 'my_requests'), orderBy('updatedAt', 'desc'));

  const snapshot = await getDocs(q);
  list.innerHTML = snapshot.empty ? '<p style="text-align:center;">No tienes solicitudes aún.</p>' : '';

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;
    // Convierte 'partner_requests' en 'SOLICITUD DE PARTNER'
    const categoryName = data.category === 'partner_requests' ? '🤝 Solicitud de Partner' : '🛠️ Ticket de Soporte';

    // FORMATEO DE FECHA (Igual al del Admin)
    let dateStr = 'Pendiente de revisión';
    if (data.updatedAt) {
      // Convert el Timestamp de Firebase a objeto Date de JS
      const date = new Date(data.updatedAt.seconds * 1000);

      // Formato: 26 de diciembre de 2025 a las 1:50:25 a.m. UTC-4
      dateStr =
        date.toLocaleString('en-En', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' UTC-4';
    }

    const card = document.createElement('div');
    card.className = 'request-card';
    card.innerHTML = `
          <div class="request-header">
              <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 5px;">
                    ${categoryName}
                  </div>
                  <span class="status-badge status-${data.status}">${data.status}</span>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">
                      <strong>Updated:</strong> ${dateStr}
                  </p>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">
                      <strong>TicketCode:</strong> ${data.ticketCode}
                  </p>
              </div>
              <button onclick="window.deleteMyRequest('${id}')" class="btn-delete">🗑️</button>
          </div>
          
          <div class="request-body" style="margin-top: 15px;">
              <p><strong>Tu Justificación:</strong></p>
              <p style="background: rgba(0,0,0,0.1); padding: 10px; border-radius: 4px; font-style: italic;">
                  "${data.justification || 'Sin descripción'}"
              </p>
          </div>

          <div class="admin-response-area" style="margin-top: 15px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 10px;">
              <strong style="color: var(--primary);">Respuesta del Personal Administrativo:</strong>
              <p style="margin-top: 5px;">${data.adminResponse || 'Aún no hay una respuesta oficial.'}</p>
          </div>
      `;
    list.appendChild(card);
  });
};

window.deleteMyRequest = async (docId) => {
  if (!confirm('¿Borrar esta solicitud de tu historial?')) return;
  const user = auth.currentUser;
  try {
    await deleteDoc(doc(db, 'users', user.uid, 'my_requests', docId));
    loadUserDashboard(user);
  } catch (e) {
    alert(e.message);
  }
};

// --- INICIALIZACIÓN ---
auth.onAuthStateChanged(async (user) => {
  if (user) {
    if (document.getElementById('user-requests-list')) loadUserDashboard(user);
  }
});

//////////////
// mode dark and light
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
//////////

// Show toast
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}
