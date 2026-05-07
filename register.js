const inputs = document.querySelectorAll(".form-register input")
const user = inputs[0]
const senha = inputs[1]
const confirma = inputs[2]

const botao = document.querySelector(".form-register button")

function mostrarErro(mensagem) {
    const erro = document.querySelector(".erro")
    erro.textContent = mensagem
}

// função que limpa o erro
function limparErro() {
    document.querySelector(".erro").textContent = ''
}

botao.addEventListener('click', () => {
    limparErro()

    if (!user.value || !senha.value || !confirma.value) {
        mostrarErro("Preencha todos os campos!")
        return
    }

    if (user.value.length < 2) {
        mostrarErro("O usuário deve conter pelo menos 2 caracteres!")
        return
    }

    if (senha.value !== confirma.value) {
        mostrarErro("As senhas não coincidem!")
        return
    }

    if (senha.value.length < 4) {
        mostrarErro("A senha deve conter pelo menos 4 caracteres")
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