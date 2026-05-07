const inputs = document.querySelectorAll(".form-register input")
const user = inputs[0]
const senha = inputs[1]
const confirma = inputs[2]

const botao = document.querySelector(".form-register button")

function mostrarErro(input, mensagem) {
    input.nextElementSibling.textContent = mensagem
}

function limparErros() {
    document.querySelectorAll(".erro").forEach(e => e.textContent = '')
}

botao.addEventListener('click', () => {
    limparErros()

    if (!user.value || !senha.value || !confirma.value) {
        mostrarErro(user, "Preencha todos os campos!")
        return
    }

    if (user.value.length < 2) {
        mostrarErro(user, "O usuário deve conter pelo menos 2 caracteres!")
        return
    }

    if (senha.value !== confirma.value) {
        mostrarErro(confirma, "As senhas não coincidem!")
        return
    }

    if (senha.value.length < 4) {
        mostrarErro(senha, "A senha deve conter pelo menos 4 caracteres")
        return
    }

    const usuario = {
        user: user.value,
        senha: senha.value
    }
    localStorage.setItem("usuario", JSON.stringify(usuario))

    alert("Conta criada com sucesso!")
    window.location.href= "login.html"

})