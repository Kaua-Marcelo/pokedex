const coresDosTipos = {
  "fire": "tipo-fogo",
  "water": "tipo-agua",
  "grass": "tipo-planta",
  "electric": "tipo-eletrico",
  "psychic": "tipo-psiquico",
  "poison": "tipo-venenoso",
  "normal": "tipo-normal",
  "ghost": "tipo-fantasma",
  "fighting": "tipo-lutador",
  "ground": "tipo-terra",
  "ice": "tipo-gelo",
  "dragon": "tipo-dragao",
  "bug": "tipo-inseto",
  "fairy": "tipo-fada" 
};

const containerFavoritos = document.getElementById('favoritos');

async function carregarPokemonsDoJSON() {
  try {
    // Lendo o arquivo JSON que você criou
    const resposta = await axios.get('./pokemons.json');
    const dados = resposta.data.results; // Pega o array que está dentro de "results"

    let todasAsCartas = "";

    // Agora fazemos um loop para buscar os detalhes de cada Pokémon na API oficial
    for (const p of dados) {
      // Usamos a URL que está dentro do seu JSON para pegar a imagem e o tipo!
      const detalhe = await axios.get(p.url);
      const poke = detalhe.data;

      const tipoPrincipal = poke.types[0].type.name;
      const classeCor = coresDosTipos[tipoPrincipal] || "tipo-normal";
      const idFormatado = String(poke.id).padStart(3, '0');
      const nomeCapitalizado = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
      
      // Link do GIF animado usando o ID que veio da URL do seu JSON
      const imagemAnimada = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${poke.id}.gif`;

      todasAsCartas += `
        <div class="card">
          <div class="card-topo">
            <p class="Nome-principal">${nomeCapitalizado}</p>
            <p>id ${idFormatado}</p>
          </div>
          <img src="${imagemAnimada}" alt="${nomeCapitalizado}" class="poke-gif">
          <div class="card-base">
            <div class="tipo ${classeCor}">${tipoPrincipal}</div>
            <div class="estrela">★</div>
          </div>
        </div>
      `;
    }

    document.getElementById('principal').innerHTML = todasAsCartas;
    inicializarAnimacoes(); // Chama o efeito de foil e 3D

  } catch (error) {
    console.error("Erro ao carregar o JSON ou a API:", error);
  }
}

carregarPokemonsDoJSON();

// ... manter a função inicializarAnimacoes() igual ...

// Transformei sua animação em uma função para ser chamada no momento certo
function inicializarAnimacoes() {
  const cardsCriados = document.querySelectorAll('.card');
  
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

// Inicia o processo
carregarPokedex();