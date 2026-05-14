// fav.js
var coresDosTipos = {
  fire: "tipo-fogo",
  water: "tipo-agua",
  grass: "tipo-planta",
  electric: "tipo-eletrico",
  psychic: "tipo-psiquico",
  poison: "tipo-venenoso",
  normal: "tipo-normal",
  ghost: "tipo-fantasma",
  fighting: "tipo-lutador",
  ground: "tipo-terra",
  ice: "tipo-gelo",
  dragon: "tipo-dragao",
  bug: "tipo-inseto",
  fairy: "tipo-fada",
};

var coresCards = {
  fire: "#ffcb9e",
  water: "#9dbdf5",
  grass: "#a3e0a1",
  electric: "#fdf17a",
  psychic: "#f9a8d4",
  poison: "#c084fc",
  normal: "#d1d1d1",
  ghost: "#a78bfa",
  fighting: "#f87171",
  ground: "#d9b382",
  ice: "#afeeee",
  dragon: "#a78bfa",
  bug: "#c1d063",
  fairy: "#fbcfe8",
};

  function inicializarFavoritos() {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const botaoEstrela = card.querySelector(".estrela");
      if (!botaoEstrela) return;

      const nome = card.querySelector(".Nome-principal")?.textContent;
      const id = card.getAttribute("data-id");
      const imagem = card.querySelector(".poke-gif").src;
      const tipo = card.querySelector(".tipo")?.textContent.trim();

      const favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];
      const jaFavoritado = favoritos.some((p) => p.id === id);
      if (jaFavoritado) botaoEstrela.style.color = "gold";

      botaoEstrela.addEventListener("click", function () {
        let favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];

        if (botaoEstrela.style.color === "gold") {
          botaoEstrela.style.color = "";
          favoritos = favoritos.filter((p) => String(p.id) !== String(id));
          if (document.getElementById("favoritos")) {
            card.remove();
          }
          localStorage.setItem("meusFavoritos", JSON.stringify (favoritos));
        } else {
          const jaExiste = favoritos.some((p) => p.nome === nome);
          if (!jaExiste) {
            botaoEstrela.style.color = "gold";
            favoritos.push({
              id,
              nome,
              imagem,
              tipo,
              cor: coresCards[tipo] || "#ffffff",
            });
          }
        }

        localStorage.setItem("meusFavoritos", JSON.stringify(favoritos));
      });
    });
  }

function exibirFavoritos() {
  const container = document.getElementById("favoritos");
  if (!container) return;

  const favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];

  if (favoritos.length === 0) {
    container.innerHTML = "<p>Nenhum favorito ainda.</p>";
    return;
  }

  container.innerHTML = favoritos
    .map(
      (p) => `
    <div class="card" data-id="${p.id}" style="background-color: ${p.cor}">
      <div class="card-topo">
        <p class="Nome-principal">${p.nome}</p>
        <p>id ${p.id}</p>
      </div>
      <img src="${p.imagem}" class="poke-gif">
      <div class="card-base">
        <div class="tipo">${p.tipo}</div>
        <button class="estrela" style="color: gold">★</button>
      </div>
    </div>
  `,
    )
    .join("");
}

if (document.getElementById("favoritos")) {
  exibirFavoritos();
  inicializarFavoritos();
}
