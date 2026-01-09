document.addEventListener('keyup', (e) => {
  if (e.target.matches('.search-input')) {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.category-card');

    cards.forEach((card) => {
      // Buscar dentro del título y los párrafos de cada tarjeta
      const content = card.textContent.toLowerCase();

      if (content.includes(query)) {
        card.style.display = 'block';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
      }
    });
  }
});

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
