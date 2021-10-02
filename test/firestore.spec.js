/* eslint-disable no-undef */
import MockFirebase from 'mock-cloud-firestore';
import {getAllPosts, deletePostFs, updatePost} from '../src/db/firestore.js'
//simulacion de la base de datos
const fixtureData = {
    __collection__: {
      posts: {
        __doc__: {
          abc123: {
            post: 'My first post',
          },
          cba321: {
            post: 'My second post',
          },
        },
      },
    },
  };
// Colocamos 'isNaiveSnapshotListenerEnabled: true' para que onSnapshot dea toda su informacion
global.firebase = new MockFirebase(fixtureData, { isNaiveSnapshotListenerEnabled: true });//muy importante snapshot es el obj que contiene la data de la base de datos
/* ----------getAllPosts---------- */
describe('getPost', () => {
    it('Debería poder obtener el post con id=acba321', () => getAllPosts('cba321')
    .then((dataPost) => {
      const result = dataPost.data();
      expect(result.post).toBe('My second post');
    }));
});
/* --------------deletePostFs---------------- */
describe('deletePostFs', () =>{
   it('it should delete posts', () =>{
       deletePostFs().then((postDoc)=>{
        expect(postDoc).toBe(undefined);
        getAllPosts()
       })
   })
})
/* -------------updatePost-------------- */
/* describe('updatePost',() =>{
  it('should update Post with id: abc123',(done)=>{
    updatePost('abc123',{post: 'test update post'}).then(()=>{
      const callback = (postDoc) =>{
        const result = postDoc.find(element => element.id === 'abc123');
        expect(result.post).toBe('test update post')
        done();
      };
      getAllPosts(callback);
    })
  })
})
 */
/* --------test------ */
describe('updatePost', () => {
  it('debería poder actualizar un post por su id', async () => {
    const posts = await getAllPosts();
    posts.forEach((doc) => {
      if (doc.id === 'abc125') {
        updatePost('abc125', { post: 'Post modificado' }).then(() => {
          const result = doc.data();
          expect(result.post).toBe('Post modificado');
        });
      }
    });
  });
});
