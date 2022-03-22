class Api {
    static async cadastrarUsuario(){

        let createdUsername         = usernameCreation.value;
        let createdEmail            = emailCreation.value;
        let chosenProfilePicture    = profilePictureCreation.value
        let createdPassword         = passwordCreation.value;

        const data = {
            "username": `${createdUsername}`,
            "email": `${createdEmail}`,
            "avatarUrl": `${chosenProfilePicture}`,
            "password": `${createdPassword}`
        }
        
        fetch("https://api-blog-m2.herokuapp.com/user/register/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        // .then(setTimeout(() => {window.location.href = "./Login.html"}, 2000))
        .catch((err) => console.log(err));
    }

    static async fazerLogin(){
        let email       = emailLogin.value;
        let password    = passwordLogin.value;
    
        const data = {
            "email": `${email}`,
            "password": `${password}`
        }

        fetch("https://api-blog-m2.herokuapp.com/user/login/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((res) => {
            localStorage.setItem('token', `${res.token}`)
            localStorage.setItem('userId', `${res.userId}`)
            Api.loadUserInfo()
            res
        })
        .then(setTimeout(() => {window.location.href = "./index.html"}, 2000))
        .catch((error) => console.log(error));
    }

    static async loadUserInfo (){
        let userId           = localStorage.getItem('userId');
        let token            = localStorage.getItem('token');
        fetch(`https://api-blog-m2.herokuapp.com/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then((res) => res.json())
        .then((res) => {
            localStorage.setItem('username', `${res.username}`)
            localStorage.setItem('avatarUrl', `${res.avatarUrl}`)
            res
        })
    }

    static async loadAllPosts(page){
        pageBody.appendChild(allPostsDiv);
        let token            = localStorage.getItem('token');
        let userId           = localStorage.getItem('userId');
        fetch(`https://api-blog-m2.herokuapp.com/post?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then((res) => res.json())
        .then((res) => {
            res.data.forEach((post) => {
                              
                let wholePostDiv = document.createElement("div");
                wholePostDiv.setAttribute("class", "wholePostDiv");
                allPostsDiv.appendChild(wholePostDiv);
                    
                let postOwnerImageDiv = document.createElement("div");
                postOwnerImageDiv.setAttribute("class", "postOwnerImageDiv");
                wholePostDiv.appendChild(postOwnerImageDiv);
                    
                let postOwnerImg = document.createElement("div");
                postOwnerImg.setAttribute("class", "postOwnerImg");
                postOwnerImg.innerHTML = `<img src=${post.owner.avatarUrl}>`
                postOwnerImageDiv.appendChild(postOwnerImg);
            
                let postInfo = document.createElement("div");
                postInfo.setAttribute("class", "postInfo");
                wholePostDiv.appendChild(postInfo);
                
                let postOwnerUsername       = document.createElement("h4")
                postOwnerUsername.innerText = `${post.owner.username}`
                postInfo.appendChild(postOwnerUsername)
                
                let postText                = document.createElement("p")
                postText.innerText          = `${post.post}`
                postInfo.appendChild(postText)

                let postDetails             = document.createElement("div");
                postDetails.setAttribute("class", "postDetails");
                wholePostDiv.appendChild(postDetails);

                if (post.owner.id === userId) {
                    let editPostLink = document.createElement("h5")
                    postDetails.appendChild(editPostLink)
                    editPostLink.setAttribute("class", "editPostLink")
                    editPostLink.innerText = "Editar"
                    editPostLink.addEventListener("click", function (){
                        Api.editPost(post.id)
                    })

                    let deletePostLink = document.createElement("h5")
                    postDetails.appendChild(deletePostLink)
                    deletePostLink.setAttribute("class", "deletePostLink")
                    deletePostLink.innerText = "Apagar"
                    deletePostLink.addEventListener("click", function (){
                        Api.deletePost(post.id)
                    })
                }

                let postCreatedAt = document.createElement("h5")
                postDetails.appendChild(postCreatedAt)
                postCreatedAt.setAttribute("class", "postCreatedAt")
                postCreatedAt.innerText = `${post.createdAt}`
            })
        })
    }

    static async createPost(){
        let token            = localStorage.getItem('token');
        const content        = {
            content: createPostInput.value
        }

        fetch(`https://api-blog-m2.herokuapp.com/post/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(content)
        })
        .then((res) => res.json())
        .then((res) => res)
        .then(createPostInput.value = "")
        .then(setTimeout(() => {allPostsDiv.innerHTML = ""}, 1000))
        .then(setTimeout(() => {Api.loadAllPosts(1)}, 1500))
    }

    static async loadPost(postId){
        let token               = localStorage.getItem('token');
        fetch(`https://api-blog-m2.herokuapp.com/post/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then ((res) => res.json())
        .then ((res) => {
            return res.post
        })
    }

    static async editPost(postId){

        let token               = localStorage.getItem('token');
        const editText          = window.prompt("Editar postagem")
        const newContent = {
            "newContent": `Editado: ${editText}`
        }
        
        fetch(`https://api-blog-m2.herokuapp.com/post/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newContent)
        })
        .then(setTimeout(() => {allPostsDiv.innerHTML = ""}, 1000))
        .then(setTimeout(() => {Api.loadAllPosts(1)}, 1500))
    }

    static async deletePost(postId){
        let token               = localStorage.getItem('token');
        const confirmDeletion = window.confirm("Você tem certeza?")
        if (confirmDeletion){
            fetch(`https://api-blog-m2.herokuapp.com/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(setTimeout(() => {allPostsDiv.innerHTML = ""}, 1000))
            .then(setTimeout(() => {Api.loadAllPosts(1)}, 1500))
        }
    }
}

const emailLogin                    = document.querySelector('input[name="emailLogin"]')
const passwordLogin                 = document.querySelector('input[name="passwordLogin"]')
const usernameCreation              = document.querySelector('input[name="usernameCreation"]')
const emailCreation                 = document.querySelector('input[name="emailCreation"]')
const profilePictureCreation        = document.querySelector('input[name="profilePictureCreation"]')
const passwordCreation              = document.querySelector('input[name="passwordCreation"]')
const pageBody                      = document.getElementById("pageBody")
const createPostInput               = document.getElementById('createPostInput')
const allPostsDiv                   = document.createElement("div");

export {Api}