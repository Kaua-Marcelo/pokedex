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

    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"))

    if (!usuarioSalvo) {
        alert("Nenhuma conta encontrada. Registre-se primeiro!")
        window.location.href = "register.html"
    }

    if (user.value !== usuarioSalvo.user || senha.value !== usuarioSalvo.senha) {
        mostrarErro(senha, "E-mail ou senha incorretos!")
        return
    }

    alert("Login realizado com sucesso!")
    window.location.href = "index.html"
})