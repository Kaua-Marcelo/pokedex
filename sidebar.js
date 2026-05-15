document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const btnMenu = document.getElementById('sidebarToggle');
  let overlay = document.querySelector('.sidebar-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }
  
  // Toggle sidebar
  btnMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  
  // Fecha overlay
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
  
  // ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    }
  });
  
  // 🔥 NAVEgação MELHORADA
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Impede navegação padrão
      
      const href = link.getAttribute('href');
      const page = link.dataset.page;
      
      // Fecha sidebar
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      
      // Ativa link atual
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      console.log('📱 Navegando para:', href, page);
      
      // Navega para página externa
      if (href && href !== '#') {
        window.location.href = href;
      } else {
        // Ações internas (se necessário)
        if (page === 'favoritos') {
          document.querySelector('.header-title').textContent = 'FAVORITOS';
          if (typeof loadFavoritos === 'function') loadFavoritos();
        }
      }
    });
  });
});