const pessoa = {
  nome: "giovany",
  idade: 18
}

localStorage.setItem ("dados", JSON.stringify(pessoa))

const perfil = localStorage.getItem("dados")
const usuario = JSON.parse(perfil)

console.log(usuario.idade)