// Dicionário de Cores
const coresDosTipos = {
  "Fire": "tipo-fogo",
  "Water": "tipo-agua",
  "Grass": "tipo-planta",
  "Electric": "tipo-eletrico",
  "Psychic": "tipo-psiquico",
  "Poison": "tipo-venenoso",
  "Normal": "tipo-normal"
};

const containerFavoritos = document.getElementById('favoritos');

// Se o container não existir, avisa no console para não quebrar o site
if (!containerFavoritos) {
  console.error("ERRO: A div com id 'favoritos' não foi encontrada no HTML!");
} else {
  let todasAsCartas = "";

  pokemons.forEach(pokemon => {
    const tipoPrincipal = pokemon.type[0]; 
    const classeCor = coresDosTipos[tipoPrincipal] || "tipo-normal";
    const idFormatado = String(pokemon.id).padStart(3, '0');

    todasAsCartas += `
      <div class="card">
        <div class="card-topo">
          <p class="Nome-principal">${pokemon.name}</p>
          <p>id ${idFormatado}</p>
        </div>
        <img src="${pokemon.image}" alt="${pokemon.name}">
        <div class="card-base">
          <div class="tipo ${classeCor}">${tipoPrincipal}</div>
          <div class="estrela">★</div>
        </div>
      </div>
    `;
  });

  // Joga os cards na tela
  containerFavoritos.innerHTML = todasAsCartas;
  console.log("Cartas geradas com sucesso!");

  // Aplica a animação
  const cardsCriados = document.querySelectorAll('.card');
  console.log(`Aplicando animação em ${cardsCriados.length} cartas...`);

  cardsCriados.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      card.classList.remove('reset'); 
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
    });

    card.addEventListener('mouseleave', () => {
      card.classList.add('reset');
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}