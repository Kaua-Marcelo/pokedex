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

const coresCards = {
  "fire": "#ffcb9e",
  "water": "#9dbdf5",
  "grass": "#a3e0a1",
  "electric": "#fdf17a",
  "psychic": "#f9a8d4",
  "poison": "#c084fc",
  "normal": "#d1d1d1",
  "ghost": "#a78bfa",
  "fighting": "#f87171",
  "ground": "#d9b382",
  "ice": "#afeeee",
  "dragon": "#a78bfa",
  "bug": "#c1d063",
  "fairy": "#fbcfe8"
};

// --- FUNÇÃO 1: CARREGAR TUDO (USADA NA INDEX) ---
async function carregarPokemonsDoJSON() {
  const container = document.getElementById('principal');
  if (!container) return;

  try {
    const resposta = await axios.get('./pokemons.json');
    const resultadosAPI = resposta.data.results;

    let todasAsCartas = "";

    for (const p of resultadosAPI) {
      const detalhe = await axios.get(p.url);
      const poke = detalhe.data;

      const tipoPrincipal = poke.types[0].type.name;
      const corFundo = coresCards[tipoPrincipal] || "#ffffff"; 
      const classeCorTipo = coresDosTipos[tipoPrincipal] || "tipo-normal";

      const idFormatado = String(poke.id).padStart(3, '0');
      const nomeCapitalizado = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
      const imagemAnimada = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${poke.id}.gif`;

      todasAsCartas += `
        <div class="card" style="background-color: ${corFundo}" data-id="${idFormatado}">
          <div class="card-topo">
            <p class="Nome-principal">${nomeCapitalizado}</p>
            <p>id ${idFormatado}</p>
          </div>
          <img src="${imagemAnimada}" class="poke-gif">
          <div class="card-base">
            <div class="tipo ${classeCorTipo}">${tipoPrincipal}</div>
            <div class="estrela">★</div>
          </div>
        </div>
      `;
    }

    container.innerHTML = todasAsCartas;
    inicializarAnimacoes();
    inicializarBusca()

  } catch (error) {
    console.error("Erro ao carregar o JSON ou a API:", error);
  }
}

// --- FUNÇÃO 2: ANIMAÇÕES 3D E FOIL ---
function inicializarAnimacoes() {
  const cardsCriados = document.querySelectorAll('.card');
  
  cardsCriados.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      card.classList.remove('reset'); 
      
      // --- O PULO DO GATO PRA DESTRAVAR O 3D ---
      // Isso desliga a animação de "entrada" do CSS para o JS poder girar o card livremente
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
      // Quando o mouse sai, ele volta pro estado normal perfeitamente
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      
      card.style.setProperty('--luz-x', `50%`);
      card.style.setProperty('--luz-y', `50%`);
      card.style.setProperty('--foil-x', `50%`);
      card.style.setProperty('--foil-y', `50%`);
    });
  });
}

// --- FUNÇÃO 3: ESCOLHA DE INICIAIS (USADA NO REGISTRO) ---
async function mostrarEscolhaInicial() {
    const tela = document.getElementById('tela-inicial');
    const container = document.getElementById('container-iniciais');
    
    if(!tela || !container) return;

    // 1. Primeiro faz o fundo aparecer suavemente
    tela.classList.add('ativo');

    const iniciaisIds = [1, 4, 7];
    let htmlIniciais = "";

    // 2. Busca os dados
    for (let i = 0; i < iniciaisIds.length; i++) {
        const id = iniciaisIds[i];
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const poke = res.data;

        const tipo = poke.types[0].type.name;
        const corFundo = coresCards[tipo] || "#fff";
        const classeCorTipo = coresDosTipos[tipo] || "tipo-normal";
        const nome = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
        const imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;

        // Note o animation-delay para eles subirem um depois do outro
        htmlIniciais += `
            <div class="card card-inicial-animado" 
                 style="background-color: ${corFundo}; animation-delay: ${0.4 + (i * 0.2)}s" 
                 onclick="escolherPokemon('${nome}', ${id}, '${imagem}', '${tipo}')">
                <div class="card-topo">
                    <p class="Nome-principal">${nome}</p>
                    <p>id ${String(id).padStart(3, '0')}</p>
                </div>
                <img src="${imagem}" class="poke-gif">
                <div class="card-base">
                    <div class="tipo ${classeCorTipo}">${tipo}</div>
                    <div class="estrela">★</div>
                </div>
            </div>
        `;
    }

    // 3. Injeta o HTML
    container.innerHTML = htmlIniciais;

    // 4. O segredo para o 3D funcionar em cards novos:
    // Esperamos um tempinho (milissegundos) para o navegador renderizar tudo
    setTimeout(() => {
        inicializarAnimacoes();
    }, 500); 
}
// --- FUNÇÃO 4: SALVAR ESCOLHA ---
function escolherPokemon(nome, id, imagem, tipo) {
    console.log("1. Clicou no Pokémon:", nome); // Rastreador 1

    // Salva no localStorage
    const inicial = [{ id, nome, imagem, tipo }];
    localStorage.setItem("meusFavoritos", JSON.stringify(inicial));
    console.log("2. Salvo no LocalStorage com sucesso!"); // Rastreador 2

    const caixaMensagem = document.getElementById('mensagem-sucesso');
    const textoMensagem = document.getElementById('texto-mensagem');

    if (caixaMensagem && textoMensagem) {
        console.log("3. Encontrou o HTML da mensagem. Subindo a caixa!"); // Rastreador 3
        
        textoMensagem.innerHTML = `Ótima escolha!<br><span style="color: #fdf17a;">${nome}</span> agora é seu parceiro.`;
        caixaMensagem.classList.add('mostrar');

        setTimeout(() => {
            console.log("4. Fim dos 3 segundos, indo para o login..."); // Rastreador 4
            window.location.href = "login.html";
        }, 3000);
    } else {
        // Se der erro, ele vai te avisar direto na tela em vez de pular de página
        console.error("ERRO: Não achei as divs 'mensagem-sucesso' e 'texto-mensagem' no HTML!");
        alert("Erro: HTML da mensagem não encontrado. Olhe o F12!");
    }
}

// Tem que ter isso no final do arquivo!
if (document.getElementById('principal')) {
    carregarPokemonsDoJSON();
}
// Se existirem cards fixos no HTML, ativa a animação neles
inicializarAnimacoes();


function buscarPokemons(termo) {
    const cards = document.querySelectorAll('.card')
    
    cards.forEach(card => {
        const nome = card.querySelector('.Nome-principal').textContent.toLowerCase()
        const id = card.dataset.id
        
        if (nome.includes(termo) || id.includes(termo)) {
            card.style.display = 'flex'
        } else {
            card.style.display = 'none'
        }
    })
}

function inicializarBusca() {
    const inputBusca = document.getElementById('input-busca')
    if (!inputBusca) return

    inputBusca.addEventListener('input', () => {
        const termo = inputBusca.value.toLowerCase().trim()
        buscarPokemons(termo)
    })
}