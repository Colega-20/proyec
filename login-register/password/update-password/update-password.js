var firebaseConfig = {
  apiKey: 'AIzaSyDvuSzMlZzxDLnYFBDMQSlwcj11BQtx9jI',
  authDomain: 'database-4ed5a.firebaseapp.com',
  databaseURL: 'https://database-4ed5a-default-rtdb.firebaseio.com/',
  projectId: 'database-4ed5a',
  storageBucket: 'database-4ed5a.firebasestorage.app',
  messagingSenderId: '515978040414',
  appId: '1:515978040414:web:f3572d27f9ab24a7c6d0cf',
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Obtener parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get('oobCode');

// Referencias a la interfaz DOM
const loadingEl = document.getElementById('loading-reset');
const resetForm = document.getElementById('reset-form');
const errorMsg = document.getElementById('error-message');
const btnSave = document.getElementById('btn-save-pass');

// --- CORRECCIÓN IMPORTANTE AQUÍ ---
function showSection(section) {
  // 1. Ocultar todo primero
  loadingEl.style.display = 'none';
  resetForm.style.display = 'none';
  errorMsg.style.display = 'none';

  // 2. Mostrar SOLAMENTE la sección que recibimos como parámetro
  if (section) {
    section.style.display = 'block';
  }
}

// 1. Lógica al cargar la página
async function init() {
  // Si no hay código en la URL, mostrar error
  if (!oobCode) {
    showSection(errorMsg);
    return;
  }

  // Mostrar spinner
  loadingEl.style.display = 'block';

  try {
    // Verificar código con Firebase
    const email = await auth.verifyPasswordResetCode(oobCode);
    console.log('Restableciendo cuenta para:', email);

    // Si es válido, mostrar EL FORMULARIO
    showSection(resetForm);
  } catch (error) {
    console.error('Código inválido:', error);
    // Si falla, mostrar EL ERROR
    showSection(errorMsg);
  }
}

// Ejecutar al inicio
init();

// 2. Lógica del botón Guardar
btnSave.addEventListener('click', async () => {
  const newPass = document.getElementById('new-password').value;
  const confirmPass = document.getElementById('confirm-password').value;

  if (newPass !== confirmPass) {
    showToast('Las contraseñas no coinciden.', 'error');
    return;
  }

  if (newPass.length < 6) {
    showToast('La contraseña debe tener al menos 6 caracteres.', 'error');
    return;
  }

  try {
    btnSave.disabled = true;
    btnSave.innerText = 'Updating...';

    // Confirmar el cambio en Firebase
    await auth.confirmPasswordReset(oobCode, newPass);

    showToast('¡Contraseña actualizada correctamente!', 'success');

    // Redirigir después de un momento
    setTimeout(() => {
      window.location.href = '../../login-register.html';
    }, 2000);
  } catch (error) {
    showToast('Error al actualizar: ' + error.message, 'error');
    btnSave.disabled = false;
    btnSave.innerText = 'Save Password';
  }
});

// Función Toast (Notificación)
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 7000);
}
