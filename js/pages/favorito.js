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

export function exibirFavoritos() {
  const container = document.getElementById("favoritos");
  if (!container) return;

  const favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];

  if (favoritos.length === 0) {
    container.innerHTML = "<p>No favorites yet.</p>";
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
      const cor = p.cor || coresCards[tipos[0]] || "#ffffff";
      const tiposHTML = tipos.map(t =>
        `<div class="tipo ${coresDosTipos[t] || 'tipo-normal'}">${t}</div>`
      ).join('');

      return `
        <div class="card" data-id="${p.id}" style="background-color: ${cor}">
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
    }).join("");
}

if (document.getElementById("favoritos")) {
  exibirFavoritos();
  inicializarFavoritos();
  inicializarAnimacoes();
}