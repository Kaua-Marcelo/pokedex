const inputs = document.querySelectorAll(".form-register input")
const email = inputs[0]
const senha = inputs[1]
const confirma = inputs[2]

const botao = document.querySelector(".form-register button")

botao.addEventListener('click', () => {
    if (!email.value || !senha.value || !confirma.value) {
        alert("Preencha todos os campos!")
        return
    }

    if (!email.value.includes("@")) {
        alert("Email Inválido!")
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
        email: email.value,
        senha: senha.value
    }
    localStorage.setItem("usuario", JSON.stringify(usuario))

    alert("Conta criada com sucesso!")
    window.location.href= "index.html"

})