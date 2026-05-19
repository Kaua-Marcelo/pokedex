document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const btnMenu = document.getElementById('sidebarToggle');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const btnLogout = document.getElementById('btnLogout');
  let overlay = document.querySelector('.sidebar-overlay');

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }
  
  if (userNameDisplay) {
    userNameDisplay.innerHTML = `<i class="bi bi-person-circle"></i> ${usuario.user}`;
  }
  
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      alert('Logout realizado!');
      window.location.href = 'login.html';
    });
  }
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop().toLowerCase();
    if (linkPath === currentPath || (linkPath === 'index.html' && currentPath === '')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  btnMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    }
  });
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const href = link.getAttribute('href');
      const page = link.dataset.page;
      
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      console.log('📱 Navegando para:', href, page);
      
      if (href && href !== '#') {
        window.location.href = href;
      } else {
        if (page === 'favoritos') {
          document.querySelector('.header-title').textContent = 'FAVORITOS';
          if (typeof loadFavoritos === 'function') loadFavoritos();
        }
      }
    });
  });
});