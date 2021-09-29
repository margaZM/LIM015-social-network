import { getAllPosts } from '../../db/firestore.js';
// import { objectPosts } from '../profile/viewProfile.js';
const allPosts = () => {
        const objectPosts = [];
        const allUsers = JSON.parse(window.localStorage.getItem('allUsers')); //extraemos de local viewHeaderUser Linea 21
        const allCategoriesCourses = JSON.parse(window.localStorage.getItem('allCategories'));
        const idUserAuth = localStorage.getItem('iduser'); //Esto vien de la linea 58 del archivo eventLogin OBTENER EL ID USER
        return getAllPosts() //parametro el idUser
            .then(response => {
                response.forEach(doc => {
                    //console.log(doc.data().arrLikes.length, 'q')
                    const userprueba = allUsers.find(element => element.idUser === doc.data().idUser);
                    const categoryprueba = allCategoriesCourses.find(element => element.idCategory == doc.data().idCategory);
                    // console.log(doc.data().arrLikes,'esto es lo que renderizo')
                    objectPosts.push({
                        idPost: doc.id,
                        idUser: doc.data().idUser,
                        nameUser: userprueba.nameUser,
                        photoUser: userprueba.photoUser,
                        contentPost: doc.data().contentPost,
                        datePost: doc.data().datePost.toDate().toDateString(),
                        nameImage: doc.data().nameImage,
                        arrLikes: doc.data().arrLikes,
                        publicPosts: doc.data().publicPosts,
                        totalComments: doc.data().totalComents,
                        image: doc.data().image,
                        idCategory: doc.data().idCategory,
                        nameCategory: categoryprueba.nameCategory,
                        urlImage: doc.data().urlImage,
                        arrComments: doc.data().arrComments

                    })
                });
                const dataPublic = objectPosts.filter(element => element.publicPosts == 'true' || element.idUser == idUserAuth);
                window.localStorage.setItem('allPosts', JSON.stringify(dataPublic));
                return dataPublic;
            });
    }
    //Función inicial conectada en loadComponents
const getObjectAllPosts = async() => {
    const objectDataPosts = await allPosts().then(response => response);
    // objectPosts(objectDataPosts)
    const containerPost = document.querySelector('#container-posts');
    loadViewPost(objectDataPosts, containerPost);
}

const loadViewPost = (objectDataPosts, parentElement) => {
        const idUserAuth = localStorage.getItem('iduser'); //Esto vien de la linea 58 del archivo eventLogin OBTENER EL ID USER

        if (objectDataPosts != undefined) {

            objectDataPosts.forEach(element => {
                        const post = document.createElement('div');
                        post.classList.add('post');
                        post.id = `post-${element.idPost}`;
                        post.innerHTML = ` 
                <div class="post-header header">
                    <div class="header-left">
                        <span class="link-user" data-id="${element.idUser}">
                            ${(/^(http|https):\/\/[^ "]+$/.test(element.photoUser)) ? 
                            `<img src="${element.photoUser}" alt="" class="post-author-pic">` 
                            : `<img src="../images/profile/${element.photoUser}" class="post-author-pic">`} 
                        </span>
                        <div class="post-author author">
                            <span class="author-name link-user" data-id="${element.idUser}"> ${element.nameUser} </span>
                        </div>
                        <span id="span-date-${element.idPost}" class="post-date">${element.datePost}</span>
                        <span class="span-public" id="publicPost-${element.idPost}">${(element.publicPosts == 'true') ? `<i class="fas fa-globe-americas"></i>`: `<i class="fas fa-lock"></i>`} </span>

                    </div>
                    <div class="header-right">
                        <div class="post-category">
                            ${idUserAuth == element.idUser ? `<img class="btn btn-edit" width="22px" height="22px" data-id="${element.idPost}" src="../images/svg/edit.png">
                            <img class="btn btn-delete" data-id="${element.idPost}" src="https://user-images.githubusercontent.com/77282012/120018025-389c9c80-bfac-11eb-9d7d-0a68441eca20.png">`:``}

                            <span class="badge badge-secondary" id="span-category-${element.idPost}">${element.nameCategory}</span>
                        </div>          
                    </div>
                </div>
                <div class="post-content">
                    <p class="content-paragraph" id="paragraph-post-${element.idPost}"> ${element.contentPost} </p>
                    ${(element.image == true ) ? `<img id="image-post-${element.idPost}" src="${element.urlImage}" class="content-image" />` : `<img id="image-post-${element.idPost}"/>`}
                </div>
                <div class="post-footer footer">
                    <div class="footer-reactions reactions">
                        <img class="img-like likes" id="like-${element.idPost}" width="22px" height="22px" data-id="${element.idPost}"  src=" ${element.arrLikes.includes(idUserAuth) ? '../images/svg/like.png' : '../images/svg/notlike.png'}"  data-id="${element.idPost}"/>
                        <span class="count-reaction" id="count-like-${element.idPost}">${element.arrLikes.length}</span> 
                        
                        <button type="button" class="btn-post btn-notcomment"><i class="far fa-comment-dots"></i> <span class="count-reaction">${element.totalComments}</span></button>

                        <button type="button" class="btn-post btn-notsave"><i class="far fa-bookmark"></i> <span class="count-reaction"></span>  </span></button>
                    </div>
                    <div class="footer-comments comments"> </div>
                </div>     `
        const theFirstChild = parentElement.firstChild;
        parentElement.insertBefore(post, theFirstChild) //renderiza en el hijo anterior del primero 
        });

    } else {
        parentElement.innerHTML = `<p class="text-muted notResults"> No se encontraron posts para mostrar  <i class="fas fa-passport text-muted"></i> </p>`
    }
        
}

export { loadViewPost, allPosts, getObjectAllPosts }