import { coresDosTipos, coresCards } from '../utils/constants.js';
import { inicializarAnimacoes } from '../components/card-motion.js';

function obterParametrosURL() {
  return new URLSearchParams(window.location.search);
}

function formatarNome(nome) {
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

function estaFavoritado(pokeId) {
  const favoritos = JSON.parse(localStorage.getItem('meusFavoritos')) || [];
  return favoritos.some((p) => p.id === pokeId);
}

function gravarFavorito(poke) {
  const favoritos = JSON.parse(localStorage.getItem('meusFavoritos')) || [];
  const existe = favoritos.some((p) => p.id === poke.id);
  if (!existe) {
    favoritos.push(poke);
    localStorage.setItem('meusFavoritos', JSON.stringify(favoritos));
  }
}

function removerFavorito(pokeId) {
  const favoritos = JSON.parse(localStorage.getItem('meusFavoritos')) || [];
  const atualizados = favoritos.filter((p) => p.id !== pokeId);
  localStorage.setItem('meusFavoritos', JSON.stringify(atualizados));
}

function criarHTMLDetalhes(poke) {
  const tipos = poke.types.map(t => `<span class="tipo ${coresDosTipos[t.type.name] || 'tipo-normal'}">${t.type.name}</span>`).join('');
  const habilidades = poke.abilities.map(a => `<li>${a.ability.name}</li>`).join('');
  const status = poke.stats.map(s => `<li><strong>${s.stat.name}:</strong> ${s.base_stat}</li>`).join('');
  const corFundo = coresCards[poke.types[0].type.name] || '#ffffff';
  const idFormatado = String(poke.id).padStart(3, '0');
  const imagemPrincipal = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${poke.id}.gif`;
  const favoritado = estaFavoritado(idFormatado);

  return `
    <div class="pokemon-detail-card" style="background-color: ${corFundo};">
      <div class="pokemon-detail-header">
        <div>
          <h2>${formatarNome(poke.name)}</h2>
          <span>id (${idFormatado})</span>
        </div>
        <div class="pokemon-detail-actions">
          <div class="pokemon-detail-types">${tipos}</div>
          <button class="estrela favorito-btn ${favoritado ? 'ativo' : ''}" data-poke-id="${idFormatado}" data-poke-name="${poke.name}">
            ★
          </button>
        </div>
      </div>
      <div class="pokemon-detail-body">
        <div class="pokemon-detail-image">
          <img class="pokemon-detail-gif" src="${imagemPrincipal}" alt="${formatarNome(poke.name)}">
        </div>
        <div class="pokemon-detail-info">
          <div class="pokemon-detail-section">
            <h3>Abilities</h3>
            <ul>${habilidades}</ul>
          </div>
          <div class="pokemon-detail-section">
            <h3>Stats</h3>
            <ul>${status}</ul>
          </div>
          <div class="pokemon-detail-section pokemon-detail-attributes">
            <div>
              <h3>Height</h3>
              <p>${poke.height / 10} m</p>
            </div>
            <div>
              <h3>Weight</h3>
              <p>${poke.weight / 10} kg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
} 

async function carregarDetalhesPokemon(nome) {
  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nome)}`);
  if (!resposta.ok) {
    throw new Error('Não foi possível carregar o Pokémon');
  }
  return resposta.json();
}

async function inicializarPaginaPoke() {
  const params = obterParametrosURL();
  const nome = params.get('name');
  const container = document.getElementById('principal');
  if (!container) return;

  if (!nome) {
    container.innerHTML = '<p>Nome do Pokémon não foi passado na URL.</p>';
    return;
  }

  container.innerHTML = '<p>Carregando...</p>';

  try {
    const poke = await carregarDetalhesPokemon(nome);
    container.innerHTML = criarHTMLDetalhes(poke);
    inicializarAnimacoes();
    inicializarBotaoFavorito(poke);
    inicializarBotaoVoltar();
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p>Erro ao carregar os detalhes do Pokémon.</p>';
  }
}

function inicializarBotaoVoltar() {
  const botaoVoltar = document.querySelector('.btn-voltar');
  if (!botaoVoltar) return;
  botaoVoltar.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'index.html';
    }
  });
}

function inicializarBotaoFavorito(poke) {
  const botao = document.querySelector('.favorito-btn');
  if (!botao) return;

  const idFormatado = botao.dataset.pokeId;
  const nome = botao.dataset.pokeName;
  const imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${poke.id}.gif`;
  const tipos = poke.types.map(t => t.type.name);
  const favorito = {
    id: idFormatado,
    nome: formatarNome(nome),
    imagem,
    tipos,
    cor: coresCards[tipos[0]] || '#ffffff'
  };

  botao.addEventListener('click', () => {
    if (estaFavoritado(idFormatado)) {
      removerFavorito(idFormatado);
      botao.classList.remove('ativo');
    } else {
      gravarFavorito(favorito);
      botao.classList.add('ativo');
    }
  });
}


if (document.getElementById('principal')) {
  inicializarPaginaPoke();
}