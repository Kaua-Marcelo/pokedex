const inputs = document.querySelectorAll(".form-login input")
const user = inputs[0]
const senha = inputs[1]

const botao = document.querySelector(".form-login button")

function mostrarErro(input, mensagem) {
    input.nextElementSibling.textContent = mensagem
}

function limparErros() {
    document.querySelectorAll(".erro").forEach(e => e.textContent = '')
}


botao.addEventListener('click', () => {
    limparErros()

    if (!user.value || !senha.value) {
        mostrarErro(user, "Preencha todos os campos!")
        return
    }

    const contas = JSON.parse(localStorage.getItem("contas")) || []

    if (contas.length === 0) {
        alert("Nenhuma conta encontrada. Registre-se primeiro!")
        window.location.href = "register.html"
        return
    }

    const usuarioEncontrado = contas.find(conta => conta.user === user.value && conta.senha === senha.value)

    if (!usuarioEncontrado) {
        mostrarErro(senha, "Usuário ou senha incorretos!")
        return
    }

    const usuarioSessao = { user: usuarioEncontrado.user };
    sessionStorage.setItem("usuario", JSON.stringify(usuarioSessao));
    localStorage.removeItem("usuario");

    alert("Login realizado com sucesso!")
    window.location.href = "index.html"
})