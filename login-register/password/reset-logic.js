// Import config firebase (auth)
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
// metter, inicializa Cloud Firestore
const db = firebase.firestore();

const btnReset = document.getElementById('btn-send-reset');
const emailInput = document.getElementById('reset-email');

btnReset.addEventListener('click', async () => {
  const email = emailInput.value.trim();

  if (!email) {
    showToast('Please enter your email address.', 'error');
    return;
  }

  try {
    // sent email
    // Check if the user exists in your Firestore 'users' collection
    const userRef = db.collection('users');
    const snapshot = await userRef.where('email', '==', email).get();
    if (snapshot.empty) {
      showToast('No user found with this email address.', 'error' + error);
      return; // Stop here if no user is found
    }
    await auth.sendPasswordResetEmail(email);

    alert('Success! A password reset link has been sent to your email.');

    // Redirigir al login después de enviar
    window.location.href = '../login-register.html';
  } catch (error) {
    console.error('Error sending reset email:', error.code);

    // Manejo de errores comunes
    switch (error.code) {
      case 'auth/user-not-found':
        showToast('No user found with this email address.', 'error');
        break;
      case 'auth/invalid-email':
        showToast('The email address is not valid.', 'error');
        break;
      default:
        showToast('An error occurred: ' + error.message, 'error');
    }
  }
});
// Show toast
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 7000);
}
