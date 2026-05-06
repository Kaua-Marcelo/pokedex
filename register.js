const inputs = document.querySelectorAll(".form-register input")
const user = inputs[0]
const senha = inputs[1]
const confirma = inputs[2]

const botao = document.querySelector(".form-register button")

botao.addEventListener('click', () => {
    if (!user.value || !senha.value || !confirma.value) {
        alert("Preencha todos os campos!")
        return
    }

    if (!user.value.length < 2) {
        alert("O usuário deve conter pelo menos 2 caracteres!")
        return
    }

    if (senha.value !== confirma.value) {
        alert("As senhas não coincidem!")
        return
    }

    if (senha.value.length < 4) {
        alert("A senha deve conter pelo menos 4 caracteres")
        return
    }

    const usuario = {
        user: user.value,
        senha: senha.value
    }
    localStorage.setItem("usuario", JSON.stringify(usuario))

    alert("Conta criada com sucesso!")
    window.location.href= "index.html"

})