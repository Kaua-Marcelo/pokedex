// O export permite que outras páginas puxem essa função
export function inicializarAnimacoes() {
  const cardsCriados = document.querySelectorAll('.card');
  
  cardsCriados.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      card.classList.remove('reset'); 
      card.style.opacity = '1';
      card.style.animation = 'none';
      
      const rect = card.getBoundingClientRect();
      const mouseX = e.clientX - rect.left; 
      const mouseY = e.clientY - rect.top;  
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const maxRotation = 15;
      const rotateX = ((mouseY - centerY) / centerY) * -maxRotation; 
      const rotateY = ((mouseX - centerX) / centerX) * maxRotation;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      
      const percentX = (mouseX / rect.width) * 100;
      const percentY = (mouseY / rect.height) * 100;
      
      card.style.setProperty('--luz-x', `${percentX}%`);
      card.style.setProperty('--luz-y', `${percentY}%`);
      card.style.setProperty('--foil-x', `${percentX}%`);
      card.style.setProperty('--foil-y', `${percentY}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.classList.add('reset');
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.setProperty('--luz-x', `50%`);
      card.style.setProperty('--luz-y', `50%`);
      card.style.setProperty('--foil-x', `50%`);
      card.style.setProperty('--foil-y', `50%`);
    });
  });
}