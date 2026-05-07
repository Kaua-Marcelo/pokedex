// Seleciona todos os cards
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  // Quando o mouse se move DENTRO da carta
  card.addEventListener('mousemove', (e) => {
    // Remove a classe de reset para o movimento ser rápido
    card.classList.remove('reset'); 

    // Pega as dimensões e a posição atual da carta na tela
    const rect = card.getBoundingClientRect();
    
    // Calcula a posição do mouse em relação ao centro da carta
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // --- LÓGICA DO 3D TILT ---
    // Define a intensidade da inclinação (15 graus é um bom valor)
    const maxRotation = 15;
    
    // A matemática para gerar o ângulo de rotação X e Y
    const rotateX = ((y - centerY) / centerY) * -maxRotation; 
    const rotateY = ((x - centerX) / centerX) * maxRotation;
    
    // Aplica a transformação com perspectiva para dar a ilusão de 3D
    // O scale3d(1.05) dá a sensação da carta pular em direção à tela
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    
    // Melhora a sombra baseada na inclinação
    card.style.boxShadow = `${-rotateY}px ${rotateX}px 20px rgba(0,0,0,0.2)`;

    // --- LÓGICA DO BRILHO DINÂMICO (FOIL) ---
    // Converte a posição do mouse em porcentagem (0 a 100%)
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    
    // Injeta a porcentagem nas variáveis CSS que usaremos no ::before
    card.style.setProperty('--luz-x', `${percentX}%`);
    card.style.setProperty('--luz-y', `${percentY}%`);
  });

  // Quando o mouse SAI da carta
  card.addEventListener('mouseleave', () => {
    // Adiciona a classe para a transição ficar mais suave ao voltar
    card.classList.add('reset');
    
    // Zera a rotação e a sombra
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.boxShadow = `0 4px 10px rgba(0,0,0,0.1)`;
    
    // O CSS já cuida de apagar a luz
  });
});