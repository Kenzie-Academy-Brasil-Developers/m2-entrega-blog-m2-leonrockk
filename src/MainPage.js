import {Api} from "./Api.js"

const displayUsername           = document.getElementById('displayUsername')
const username                  = localStorage.getItem('username')
const profilePicture            = localStorage.getItem('avatarUrl')
const logoutButton              = document.getElementById('logoutButton')
const createPostButton          = document.getElementById('createPostButton')
const userProfilePicture        = document.getElementById('userProfilePicture')
displayUsername.innerText       = username
let page                        = 1
userProfilePicture.innerHTML    = `<img src="${profilePicture}" alt="User Profile Picture">`

logoutButton.addEventListener("click", function(){
    localStorage.clear();
    window.location.href = "./Login.html"
})

createPostButton.addEventListener("click", Api.createPost)

Api.loadAllPosts(page)

document.addEventListener('scroll', () => {
    if (window.pageYOffset >= document.body.offsetHeight - window.innerHeight) {
        page +=1
        Api.loadAllPosts(page)
    }
});