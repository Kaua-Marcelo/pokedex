import { coresDosTipos, coresCards } from '../utils/constants.js';
import { inicializarAnimacoes } from '../components/card-motion.js';

export function inicializarFavoritos() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const botaoEstrela = card.querySelector(".estrela");
    if (!botaoEstrela) return;

    const nome = card.querySelector(".Nome-principal")?.textContent;
    const id = card.getAttribute("data-id");
    const imagem = card.querySelector(".poke-gif").src;
    const tipos = [...card.querySelectorAll(".tipo")].map(el => el.textContent.trim());

    const favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];
    const jaFavoritado = favoritos.some((p) => p.id === id);
    if (jaFavoritado) botaoEstrela.style.color = "gold";

    botaoEstrela.replaceWith(botaoEstrela.cloneNode(true));
    const novoBotao = card.querySelector(".estrela");

    novoBotao.addEventListener("click", function () {
      let favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];

      if (novoBotao.style.color === "gold") {
        novoBotao.style.color = "";
        favoritos = favoritos.filter((p) => p.id !== id);
        if (document.getElementById("favoritos")) {
          card.remove();
        }
      } else {
        const jaExiste = favoritos.some((p) => p.nome === nome);
        if (!jaExiste) {
          novoBotao.style.color = "gold";
          favoritos.push({
            id,
            nome,
            imagem,
            tipos,
            cor: coresCards[tipos[0]] || "#ffffff",
          });
        }
      }

      localStorage.setItem("meusFavoritos", JSON.stringify(favoritos));
    });
  });
}

let tipoFavoritosAtivo = 'all';
let sortFavoritosAtivo = 'id-asc';

function obterFavoritosSalvos() {
  return JSON.parse(localStorage.getItem('meusFavoritos')) || [];
}

function obterFavoritosFiltrados() {
  const favoritos = obterFavoritosSalvos();
  const termo = document.getElementById('input-busca')?.value.toLowerCase().trim() || '';
  let resultado = favoritos;

  if (tipoFavoritosAtivo !== 'all') {
    resultado = resultado.filter(p => Array.isArray(p.tipos) && p.tipos.includes(tipoFavoritosAtivo));
  }

  if (termo) {
    resultado = resultado.filter(p =>
      p.nome.toLowerCase().includes(termo) || String(p.id).includes(termo)
    );
  }

  if (sortFavoritosAtivo === 'id-desc') {
    resultado.sort((a, b) => Number(b.id) - Number(a.id));
  } else if (sortFavoritosAtivo === 'nome-az') {
    resultado.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  } else if (sortFavoritosAtivo === 'nome-za') {
    resultado.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));
  } else {
    resultado.sort((a, b) => Number(a.id) - Number(b.id));
  }

  return resultado;
}

export function exibirFavoritos() {
  const container = document.getElementById('favoritos');
  if (!container) return;

  const favoritos = obterFavoritosFiltrados();

  if (favoritos.length === 0) {
    container.innerHTML = '<p>No favorites yet.</p>';
    return;
  }

  container.innerHTML = favoritos
    .map((p) => {
      const tipos = Array.isArray(p.tipos)
        ? p.tipos
        : p.tipos
          ? [p.tipos]
          : p.tipo
            ? [p.tipo]
            : [];
      const cor = p.cor || coresCards[tipos[0]] || '#ffffff';
      const tiposHTML = tipos.map(t =>
        `<div class="tipo ${coresDosTipos[t] || 'tipo-normal'}">${t}</div>`
      ).join('');

      return `
        <div class="card" data-id="${p.id}" data-poke-name="${p.nome.toLowerCase()}" style="background-color: ${cor}">
          <div class="card-topo">
            <p class="Nome-principal">${p.nome}</p>
            <p>id ${p.id}</p>
          </div>
          <img src="${p.imagem}" class="poke-gif">
          <div class="card-base">
            <div class="tipos">${tiposHTML}</div>
            <button class="estrela" style="color: gold">★</button>
          </div>
        </div>
      `;
    }).join('');
}

function inicializarFiltrosFavoritos() {
  const busca = document.getElementById('input-busca');
  const selectTipo = document.getElementById('filtro-tipo-fav');
  const selectSort = document.getElementById('select-sort-fav');

  const atualizar = () => {
    exibirFavoritos();
    inicializarFavoritos();
    inicializarAnimacoes();
    inicializarCliqueDetalhesFavoritos();
  };

  if (busca) {
    busca.addEventListener('input', atualizar);
  }

  if (selectTipo) {
    selectTipo.addEventListener('change', () => {
      tipoFavoritosAtivo = selectTipo.value;
      atualizar();
    });
  }

  if (selectSort) {
    selectSort.addEventListener('change', () => {
      sortFavoritosAtivo = selectSort.value;
      atualizar();
    });
  }
}

function inicializarCliqueDetalhesFavoritos() {
  const container = document.getElementById('favoritos');
  if (!container) return;
  if (container.dataset.clickInit === 'true') return;

  container.dataset.clickInit = 'true';
  container.addEventListener('click', (event) => {
    if (event.target.closest('.estrela')) return;

    const card = event.target.closest('.card');
    if (!card) return;

    const nomePokemon = card.dataset.pokeName;
    if (!nomePokemon) return;
    window.location.href = `poke.html?name=${encodeURIComponent(nomePokemon)}`;
  });
}

if (document.getElementById("favoritos")) {
  exibirFavoritos();
  inicializarFavoritos();
  inicializarAnimacoes();
  inicializarCliqueDetalhesFavoritos();
  inicializarFiltrosFavoritos();
}