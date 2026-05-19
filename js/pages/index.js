// Coloque os imports na primeira linha para ele achar as cores e a animação
import { coresDosTipos, coresCards } from '../utils/constants.js';
import { inicializarAnimacoes } from '../components/card-motion.js';
import { inicializarFavoritos } from './favorito.js';

// ATENÇÃO: Se a função inicializarFavoritos() estiver no arquivo favorito.js, 
// você também precisará importar ela aqui no topo!

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
    const resposta = await axios.get('./data/pokemons.json'); // Única mudança: ajustei o caminho do JSON para a pasta data/
    resultadosAPI = resposta.data.results;
    paginaAtual = 0;
    chegouNoFim = false;

    container.innerHTML = '';
    await carregarProximaPagina();
    inicializarBusca();
    inicializarSort();
    inicializarFiltroTipo();
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
        container.innerHTML = '<p>No pokemon found.</p>';
        return;
    }

    const detalhes = await Promise.all(resultados.map(obterDetalhesPokemon));
    const resultadoFinal = aplicarFiltroESortNosDetalhes(detalhes);
    renderizarPokemonsNoContainer(resultadoFinal);
}

const btnVoltar = document.querySelector(".btn-voltar");
if(btnVoltar) {
    btnVoltar.addEventListener("click", function() {
        history.back(-1);
    });
}