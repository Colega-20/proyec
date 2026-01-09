// npm install firebase
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Initialize Firebase

// Your web app's Firebase configuration
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
let isRegistering = false; // Variable de control

document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const forms = document.querySelectorAll('.form');
  const tabButtonsContainer = document.querySelector('.tab-buttons');
  const loginGradient = 'linear-gradient(90deg, #6a11cb, #2575fc)'; // Login / Sign In button colors
  const registerGradient = 'linear-gradient(90deg, #ff007f, #ff8c00)'; // Register / Create Account button colors

  // Function to handle the form switching logic
  function switchForm(targetFormId, isRegister) {
    forms.forEach((form) => form.classList.remove('active'));

    // Apply classes for CSS transition (slide/fade)
    forms.forEach((form) => form.classList.remove('active'));
    const targetForm = document.getElementById(targetFormId);
    if (targetForm) {
      targetForm.classList.add('active');
    }

    // Update active tab button classes
    tabButtons.forEach((btn) => {
      btn.classList.remove('active', 'login-active', 'register-active');
    });

    // Calculate indicator position
    const activeBtn = document.querySelector(`.tab-btn[data-form="${targetFormId.replace('-form', '')}"]`);

    if (activeBtn) {
      activeBtn.classList.add('active');

      // APLICAR CLASE DE COLOR SEGÚN EL FORMULARIO
      if (isRegister) {
        activeBtn.classList.add('register-active'); // Color rosa/naranja
      } else {
        activeBtn.classList.add('login-active'); // Color azul/morado
      }
    }

    // Calcular la posición del indicador (subrayado)
    const indicatorX = isRegister ? '50%' : '0%';
    tabButtonsContainer.style.setProperty('--indicator-x', indicatorX);

    const indicatorColor = isRegister ? registerGradient : loginGradient;
    tabButtonsContainer.style.setProperty('--indicator-color', indicatorColor);
    setTimeout(() => {}, 50);
  }

  // Set initial state
  switchForm('login-form', false);

  // Event listeners for tab switching
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const formName = button.getAttribute('data-form');
      const formId = formName + '-form';
      const isRegister = formName === 'register';
      switchForm(formId, isRegister);
    });
  });
  ///////////

  // Obtener el formulario
  const registerForm = document.getElementById('register-form');

  //  Escuchar el evento de envío
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Previene la recarga de la página

    // Obtener los valores de los inputs
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;
    const date = document.getElementById('reg-date').value;
    const age = document.getElementById('reg-age').value;
    const gender = document.getElementById('reg-gender').value;
    const rank = document.getElementById('reg-rank').value;

    // registro
    if (password !== confirmPassword) {
      showToast('the passwords do not match.', 'error');
      return;
    }
    toggleLoading(true);
    try {
      isRegistering = true;
      // Crear el usuario en Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log('Usuario registrado en Firebase Auth:', user);

      // Guardar información adicional en Cloud Firestore
      // Usaremos el UID del usuario como clave del documento para relacionar Auth con DB
      await db.collection('users').doc(user.uid).set({
        fullName: name,
        email: email,
        password: password,
        birthDate: date,
        age: age,
        rank: rank,
        gender: gender,
        registeredAt: firebase.firestore.FieldValue.serverTimestamp(), // Marca de tiempo del servidor
      });
      toggleLoading(false);
      // await auth.signOut(); close session
      console.log('Datos adicionales guardados en Firestore.');
      interf();
    } catch (error) {
      let errorMessage = 'Ocurrió un error desconocido.';
      toggleLoading(false);
      isRegistering = false;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Ese correo electrónico ya está registrado.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      }
      console.error('Error de registro:', error.message);
      showToast('Error al registrar: ' + errorMessage, 'error');
    }
  });
  // javaScript para el Inicio de Sesión
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      // Iniciar sesión con Firebase Authentication
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log('Usuario ha iniciado sesión:', user);
      showToast('Log in and Account created successfully!!', 'success');
      // window.location.href = '../index.html';
    } catch (error) {
      let errorMessage = 'Ocurrió un error.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Credenciales inválidas (Correo o Contraseña incorrectos).';
      }
      console.error('Error de inicio de sesión:', error.message);
      showToast('Error al iniciar sesión: ' + errorMessage + error.message, 'error');
    }
  });
});
// Escucha el estado de autenticación de Firebase
auth.onAuthStateChanged((user) => {
  if (user && !isRegistering) {
    window.location.href = '../index.html';
  } else {
    console.log('No hay sesión activa. Permitiendo el acceso al Login/Registro.');
  }
});
function interf() {
  // Show the interface
  document.getElementById('interface').classList.add('show');
  // document.getElementById('body').style.overflow = 'hidden';
  document.querySelectorAll('input').forEach((input) => {
    input.value = '';
  });
  setTimeout(() => {
    document.getElementById('interface').classList.remove('show');
    const loginButton = document.querySelector('.tab-btn[data-form="login"]');
    loginButton.click();
  }, 4000);
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 5800);
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
// Show toast
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
