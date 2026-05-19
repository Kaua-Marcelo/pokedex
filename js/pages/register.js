// 1. IMPORTAÇÕES NECESSÁRIAS
import { coresDosTipos, coresCards } from '../utils/constants.js';
import { inicializarAnimacoes } from '../components/card-motion.js';

// =========================================================
// ETAPA 1: LÓGICA DO FORMULÁRIO DE REGISTRO
// =========================================================
const inputs = document.querySelectorAll(".form-register input");
const user = inputs[0];
const senha = inputs[1];
const confirma = inputs[2];
const botao = document.querySelector(".form-register button");

function mostrarErro(input, mensagem) {
    input.nextElementSibling.textContent = mensagem;
}

function limparErros() {
    document.querySelectorAll(".erro").forEach(e => e.textContent = '');
}

if (botao) {
    botao.addEventListener('click', () => {
        limparErros();

        const contas = JSON.parse(localStorage.getItem("contas")) || [];
        if (contas.some(conta => conta.user === user.value)) {
            mostrarErro(user, "Este usuário já existe!");
            return;
        }

        if (!user.value || !senha.value || !confirma.value) {
            mostrarErro(user, "Preencha todos os campos!");
            return;
        }

        if (user.value.length < 2) {
            mostrarErro(user, "O usuário deve conter pelo menos 2 caracteres!");
            return;
        }

        if (senha.value !== confirma.value) {
            mostrarErro(confirma, "As senhas não coincidem!");
            return;
        }

        if (senha.value.length < 4) {
            mostrarErro(senha, "A senha deve conter pelo menos 4 caracteres");
            return;
        }

        const usuario = {
            user: user.value,
            senha: senha.value
        };
        contas.push(usuario);
        localStorage.setItem("contas", JSON.stringify(contas));

        limparFormularioDeRegistro();
        mostrarEscolhaInicial(); 
    });
}

function limparFormularioDeRegistro() {
    const form = document.querySelector(".form-register");
    if(form) form.style.display = "none";
    const titulo = document.querySelector("h1");
    if(titulo) titulo.textContent = "BEM-VINDO, TREINADOR!";
}

// =========================================================
// ETAPA 2: LÓGICA DE ESCOLHA DOS POKÉMONS INICIAIS
// =========================================================
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

window.escolherPokemon = function(nome, id, imagem, tipo) {
    console.log("1. Clicou no Pokémon:", nome);
    const idFormatado = String(id).padStart(3, '0');
    const inicial = [{ id: idFormatado, nome, imagem, tipo, tipos: [tipo], cor: coresCards[tipo] || '#ffffff' }];
    localStorage.setItem("meusFavoritos", JSON.stringify(inicial));
    console.log("2. Salvo no LocalStorage com sucesso!");

    const caixaMensagem = document.getElementById('mensagem-sucesso');
    const textoMensagem = document.getElementById('texto-mensagem');

    if (caixaMensagem && textoMensagem) {
        console.log("3. Encontrou o HTML da mensagem. Subindo a caixa!");
        
        textoMensagem.innerHTML = `Great choice !<br><span style="color: #fdf17a;">${nome}</span> now is your partner.`;
        caixaMensagem.classList.add('mostrar');

        setTimeout(() => {
            console.log("4. Fim dos 3 segundos, indo para o login...");
            window.location.href = "index.html"; 
        }, 3000);
    } else {
        console.error("ERRO: Não achei as divs 'mensagem-sucesso' e 'texto-mensagem' no HTML!");
        alert("Erro: HTML da mensagem não encontrado. Olhe o F12!");
    }
}