import {Api} from "./Api.js"

const signUpButton                  = document.querySelector("form")

signUpButton.addEventListener("submit", function(event){
    event.preventDefault()
    Api.cadastrarUsuario()
})