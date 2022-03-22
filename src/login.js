import {Api} from "./Api.js"

const loginButton                   = document.getElementById("loginButton")

loginButton.addEventListener("click", function (event){
    event.preventDefault()
    Api.fazerLogin()
})