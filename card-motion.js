var coresDosTipos = {
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
  "fairy": "tipo-fada", 
  "flying": "tipo-voador"
};

var coresCards = {
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
  "fairy": "#fbcfe8",
  "flying": "#9985d5"
};

const itensPorPagina = 20;
let resultadosAPI = [];
let paginaAtual = 0;
let estaCarregando = false;
let chegouNoFim = false;
const cacheDetalhes = new Map();

// --- FUNÇÃO 1: CARREGAR TUDO (USADA NA INDEX) ---
async function carregarPokemonsDoJSON() {
  const container = document.getElementById('principal');
  if (!container) return;

  try {
    const resposta = await axios.get('./pokemons.json');
    resultadosAPI = resposta.data.results;
    paginaAtual = 0;
    chegouNoFim = false;

    container.innerHTML = '';
    await carregarProximaPagina();
    inicializarBusca();
    inicializarSort();       // ← ativa o sort depois que a lista carrega
    inicializarFiltroTipo(); // ← ativa o filtro de tipo também
  } catch (error) {
    console.error("Erro ao carregar o JSON ou a API:", error);
  }
}

async function carregarProximaPagina() {
  const container = document.getElementById('principal');
  if (!container || estaCarregando || chegouNoFim) return;

  const start = paginaAtual * itensPorPagina;
  const end = start + itensPorPagina;
  const batch = resultadosAPI.slice(start, end);

  if (batch.length === 0) {
    chegouNoFim = true;
    return;
  }

  estaCarregando = true;

  try {
    const respostas = await Promise.all(batch.map(p => axios.get(p.url)));
    let htmlLote = "";

    for (let i = 0; i < respostas.length; i++) {
      const detalhe = respostas[i];
      const poke = detalhe.data;
      cacheDetalhes.set(batch[i].url, poke);
      const tipoPrincipal = poke.types[0].type.name;
      const corFundo = coresCards[tipoPrincipal] || "#ffffff";
      const classeCorTipo = coresDosTipos[tipoPrincipal] || "tipo-normal";
      const idFormatado = String(poke.id).padStart(3, '0');
      const nomeCapitalizado = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
      const imagemAnimada = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${poke.id}.gif`;

      htmlLote += `
      <div class="card" style="background-color: ${corFundo}" data-id="${idFormatado}">
        <div class="card-topo">
          <p class="Nome-principal">${nomeCapitalizado}</p>
          <p>id ${idFormatado}</p>
        </div>
        <img src="${imagemAnimada}" class="poke-gif">
        <div class="card-base">
          <div class="tipos">
            ${poke.types.map(t => `<div class="tipo ${coresDosTipos[t.type.name] || 'tipo-normal'}">${t.type.name}</div>`).join('')}
          </div>
          <button class="estrela">★</button>
        </div>
      </div>
    `;
    }

    container.innerHTML += htmlLote;
    paginaAtual += 1;
    if (end >= resultadosAPI.length) {
      chegouNoFim = true;
    }

    inicializarAnimacoes();
    inicializarFavoritos();
  } catch (error) {
    console.error("Erro ao carregar o lote de pokémons:", error);
  } finally {
    estaCarregando = false;
  }
}

function obterTermoBusca() {
  const inputBusca = document.getElementById('input-busca');
  return inputBusca ? inputBusca.value.toLowerCase().trim() : '';
}

function estaBuscando() {
  return obterTermoBusca().length > 0;
}

function temFiltroAtivo() {
  return tipoAtivo !== 'all';
}

function temSortPersonalizado() {
  return sortAtivo !== 'id-asc';
}

function onScrollCarregarMais() {
  if (estaCarregando || chegouNoFim || estaBuscando() || temFiltroAtivo() || temSortPersonalizado()) return;

  const distanciaRestante = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
  if (distanciaRestante < 400) {
    carregarProximaPagina();
  }
}

async function obterDetalhesPokemon(pokemon) {
  if (cacheDetalhes.has(pokemon.url)) {
    return cacheDetalhes.get(pokemon.url);
  }
  const resposta = await axios.get(pokemon.url);
  cacheDetalhes.set(pokemon.url, resposta.data);
  return resposta.data;
}

function criarHTMLCard(poke) {
  const tipoPrincipal = poke.types[0].type.name;
  const corFundo = coresCards[tipoPrincipal] || "#ffffff";
  const idFormatado = String(poke.id).padStart(3, '0');
  const nomeCapitalizado = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
  const imagemAnimada = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${poke.id}.gif`;

  // gera uma badge pra cada tipo
  const tiposHTML = poke.types.map(t => {
    const classe = coresDosTipos[t.type.name] || "tipo-normal";
    return `<div class="tipo ${classe}">${t.type.name}</div>`;
  }).join('');

  return `
    <div class="card" style="background-color: ${corFundo}" data-id="${idFormatado}">
      <div class="card-topo">
        <p class="Nome-principal">${nomeCapitalizado}</p>
        <p>id ${idFormatado}</p>
      </div>
      <img src="${imagemAnimada}" class="poke-gif">
      <div class="card-base">
        <div class="tipos">${tiposHTML}</div>
        <button class="estrela">★</button>
      </div>
    </div>
  `;
}

function renderizarPokemonsNoContainer(pokemons) {
  const container = document.getElementById('principal');
  if (!container) return;
  container.innerHTML = pokemons.map(criarHTMLCard).join('');
  inicializarAnimacoes();
  inicializarFavoritos();
}

async function renderizarPokemonsCarregados() {
  const carregados = resultadosAPI.slice(0, paginaAtual * itensPorPagina);
  const detalhes = await Promise.all(carregados.map(obterDetalhesPokemon));
  renderizarPokemonsNoContainer(detalhes);
}

// --- SORT ---
// Pega todos os pokémons que já foram carregados no cache,
// ordena conforme a opção escolhida e re-renderiza.
let tipoAtivo = 'all';
let sortAtivo = 'id-asc';

function inicializarSort() {
  const selectSort = document.getElementById('select-sort');
  if (!selectSort) return;

  selectSort.addEventListener('change', async () => {
    sortAtivo = selectSort.value;
    await aplicarFiltroESort();
  });
}

function inicializarFiltroTipo() {
  const selectTipo = document.getElementById('filtro-tipo');
  if (!selectTipo) return;

  selectTipo.addEventListener('change', async () => {
    tipoAtivo = selectTipo.value;
    await aplicarFiltroESort();
  });
}

async function aplicarFiltroESort() {
  const termo = obterTermoBusca();
  if (termo) {
    await buscarPokemons(termo);
    return;
  }

  if (!temFiltroAtivo() && !temSortPersonalizado()) {
    await renderizarPokemonsCarregados();
    return;
  }

  const detalhes = await Promise.all(resultadosAPI.map(obterDetalhesPokemon));
  const resultado = aplicarFiltroESortNosDetalhes(detalhes);
  if (resultado.length === 0) {
    document.getElementById('principal').innerHTML = '<p>Nenhum Pokémon encontrado para esse tipo.</p>';
    return;
  }

  renderizarPokemonsNoContainer(resultado);
}

function aplicarFiltroESortNosDetalhes(detalhes) {
  let resultado = tipoAtivo === 'all'
    ? [...detalhes]
    : detalhes.filter(poke => poke.types.some(t => t.type.name === tipoAtivo));

  if (sortAtivo === 'id-asc') {
    resultado.sort((a, b) => a.id - b.id);
  } else if (sortAtivo === 'id-desc') {
    resultado.sort((a, b) => b.id - a.id);
  } else if (sortAtivo === 'nome-az') {
    resultado.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortAtivo === 'nome-za') {
    resultado.sort((a, b) => b.name.localeCompare(a.name));
  }

  return resultado;
}

// --- FUNÇÃO 2: ANIMAÇÕES 3D E FOIL ---
function inicializarAnimacoes() {
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

// --- FUNÇÃO 3: ESCOLHA DE INICIAIS (USADA NO REGISTRO) ---
async function mostrarEscolhaInicial() {
    const tela = document.getElementById('tela-inicial');
    const container = document.getElementById('container-iniciais');
    
    if(!tela || !container) return;

    tela.classList.add('ativo');

    const iniciaisIds = [1, 4, 7];
    let htmlIniciais = "";

    for (let i = 0; i < iniciaisIds.length; i++) {
        const id = iniciaisIds[i];
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${String(id)}`);
        const poke = res.data;

        const tipo = poke.types[0].type.name;
        const corFundo = coresCards[tipo] || "#fff";
        const classeCorTipo = coresDosTipos[tipo] || "tipo-normal";
        const nome = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
        const imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;

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

    container.innerHTML = htmlIniciais;

    setTimeout(() => {
        inicializarAnimacoes();
       
    }, 500); 
}

// --- FUNÇÃO 4: SALVAR ESCOLHA ---
function escolherPokemon(nome, id, imagem, tipo) {
    console.log("1. Clicou no Pokémon:", nome);
    const idFormatado = String(id).padStart(3, '0');
    const inicial = [{ id: idFormatado, nome, imagem, tipo, cor: coresCards[tipo] || '#ffffff' }];
    localStorage.setItem("meusFavoritos", JSON.stringify(inicial));
    console.log("2. Salvo no LocalStorage com sucesso!");

    const caixaMensagem = document.getElementById('mensagem-sucesso');
    const textoMensagem = document.getElementById('texto-mensagem');

    if (caixaMensagem && textoMensagem) {
        console.log("3. Encontrou o HTML da mensagem. Subindo a caixa!");
        
        textoMensagem.innerHTML = `Ótima escolha!<br><span style="color: #fdf17a;">${nome}</span> agora é seu parceiro.`;
        caixaMensagem.classList.add('mostrar');

        setTimeout(() => {
            console.log("4. Fim dos 3 segundos, indo para o login...");
            window.location.href = "login.html";
        }, 3000);
    } else {
        console.error("ERRO: Não achei as divs 'mensagem-sucesso' e 'texto-mensagem' no HTML!");
        alert("Erro: HTML da mensagem não encontrado. Olhe o F12!");
    }
}

if (document.getElementById('principal')) {
    carregarPokemonsDoJSON();
    window.addEventListener('scroll', onScrollCarregarMais);
}
inicializarAnimacoes();
inicializarFavoritos();

// --- BUSCA ---
function inicializarBusca() {
    const inputBusca = document.getElementById('input-busca')
    if (!inputBusca) return

    inputBusca.addEventListener('input', async () => {
        const termo = inputBusca.value.toLowerCase().trim()
        await buscarPokemons(termo)
    })
}

async function buscarPokemons(termo) {
    const container = document.getElementById('principal');
    if (!container) return;

    const texto = termo.toLowerCase().trim();
    if (!texto) {
        await aplicarFiltroESort();
        return;
    }

    const resultados = resultadosAPI.filter(pokemon => {
        const nome = pokemon.name.toLowerCase();
        const idPokemon = String(pokemon.url.match(/\/(\d+)\/$/)[1] || "");
        return nome.includes(texto) || idPokemon.includes(texto);
    });

    if (resultados.length === 0) {
        container.innerHTML = '<p>Nenhum Pokémon encontrado.</p>';
        return;
    }

    const detalhes = await Promise.all(resultados.map(obterDetalhesPokemon));
    const resultadoFinal = aplicarFiltroESortNosDetalhes(detalhes);
    renderizarPokemonsNoContainer(resultadoFinal);
}

document.querySelector(".btn-voltar").addEventListener("click", function() {
    history.back(-1);
});
