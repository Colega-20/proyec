// ==========================================
// 1. IMPORTACIONES Y CONFIGURACIÓN FIREBASE
// ==========================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
// import { getDatabase, ref, push, set } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDvuSzMlZzxDLnYFBDMQSlwcj11BQtx9jI',
  authDomain: 'database-4ed5a.firebaseapp.com',
  databaseURL: 'https://database-4ed5a-default-rtdb.firebaseio.com/',
  projectId: 'database-4ed5a',
  storageBucket: 'database-4ed5a.firebasestorage.app',
  messagingSenderId: '515978040414',
  appId: '1:515978040414:web:f3572d27f9ab24a7c6d0cf',
};

// Inicializar
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// GESTIÓN DE USUARIO Y FORMULARIOS
// ==========================================
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const submitBtn = document.getElementById('submitBtn');
const warningBox = document.getElementById('auth-warning');

// Detectar qué formulario estamos usando
const partnerForm = document.getElementById('partnerForm');
const supportForm = document.getElementById('supportForm');

// Escuchar cambios en la autenticación
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Rellenar email
    if (emailInput) emailInput.value = user.email;

    try {
      // BUSCAR EL FULLNAME EN FIRESTORE
      // Acceder a users / {ID_DEL_USUARIO}
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        // 'fullName'
        if (nameInput) nameInput.value = userData.fullName || 'Inexistent ';
      } else {
        if (nameInput) nameInput.value = 'Perfil no encontrado';
      }
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      showToast('Error obteniendo datos:', 'error', error);

      if (nameInput) nameInput.value = 'Error al cargar';
    }

    // Habilitar formulario
    if (submitBtn) submitBtn.disabled = false;
    if (warningBox) warningBox.style.display = 'none';
  } else {
    // No logueado: deshabilitar y mostrar aviso
    if (submitBtn) submitBtn.disabled = true;
    if (warningBox) warningBox.style.display = 'block';
  }
});

// ==========================================
// ENVÍO A BASE DE DATOS
// ==========================================
// Función genérica de envío
async function submitForm(collectionName) {
  const justification = document.getElementById('justification').value;
  const user = auth.currentUser;

  if (!user || !justification) return;

  try {
    submitBtn.disabled = true;
    // Determinar prefijo según colección
    const prefix = collectionName === 'partner_requests' ? 'PART' : 'SUPP';
    const ticketCode = generateTicketCode(prefix);
    submitBtn.innerText = 'Enviando...';

    // Obtener datos del usuario para el rango
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data() || {};
    const rank = userData.rank || 'Standard User';

    // Preparar el objeto de datos
    const requestData = {
      ticketCode: ticketCode,
      uid: user.uid,
      userName: nameInput.value,
      userEmail: user.email,
      status: 'pending',
      rank: rank,
      justification: justification,
      category: collectionName, // Guardar la categoría para el panel del usuario
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(), // Inicializamos updatedAt
      adminResponse: '',
    };

    // ENVIAR A COLECCIÓN GLOBAL (Admin)
    // addDoc para obtener un ID automático
    const globalDocRef = await addDoc(collection(db, collectionName), requestData);
    const generatedId = globalDocRef.id; // Capturamos el ID generado

    // ENVIAR A COLECCIÓN PRIVADA DEL USUARIO (Doble Escritura)
    // setDoc con el MISMO ID generado arriba para que estén vinculados
    const userPrivateRef = doc(db, 'users', user.uid, 'my_requests', generatedId);
    await setDoc(userPrivateRef, requestData);

    showToast('Solicitud enviada correctamente. Puedes ver el estado en tu panel.', 'success');
    document.getElementById('justification').value = '';
    setTimeout(() => {
      window.location.href = '../../index.html';
    }, 6000);
  } catch (e) {
    console.error('Error al enviar:', e);
    showToast('Error al enviar. Intenta de nuevo.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = 'Enviar';
  }
}
// Listeners para los formularios
if (partnerForm) {
  partnerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm('partner_requests');
  });
}

if (supportForm) {
  supportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm('support_tickets');
  });
}

// generar un código aleatorio legible
function generateTicketCode(prefix) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `#${prefix}-${result}`;
}

// Show toast
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}
