import {
   RELATED_VIDEO_FAIL,
   RELATED_VIDEO_REQUEST,
   RELATED_VIDEO_SUCCESS,
   SELECTED_VIDEO_FAIL,
   SELECTED_VIDEO_REQUEST,
   SELECTED_VIDEO_SUCCESS,
   HOME_VIDEOS_FAIL,
   HOME_VIDEOS_REQUEST,
   HOME_VIDEOS_SUCCESS,

} from '../actionType'


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const db = firebase.firestore();

let unsubscribe;

export const getPopularVideos = () => async (dispatch, getState) => {
   try {
      dispatch({
         type: HOME_VIDEOS_REQUEST,
      })
      var canales = []
      var querySnapshot = await db.collection("canales")
         .limit(20)
         .get();
      if (querySnapshot.docs !== undefined && querySnapshot.docs !== null && querySnapshot.docs.length > 0) {
         querySnapshot.forEach((doc) => {
            canales.push({
               id: doc.id,
               nombre: doc.data().nombre,
               thumbnail: doc.data().thumbnail
            })
         });
      }

      dispatch({
         type: HOME_VIDEOS_SUCCESS,
         payload: {
            videos: canales,
            category: 'All',
         },
      })
   } catch (error) {
      console.log(error.message)
      dispatch({
         type: HOME_VIDEOS_FAIL,
         payload: error.message,
      })
   }
}


export const getRelatedVideos = id => async dispatch => {
   try {
      dispatch({
         type: RELATED_VIDEO_REQUEST,
      })
      let canales = [];

      if (!id || (id && !id.includes("cat-"))) {
         const snapshotCanales = await db.collection("canales")
            .where("activo", "==", true)
            .orderBy("orden", "asc")
            .get();

         if (snapshotCanales.docs && snapshotCanales.docs.length) {
            snapshotCanales.docs.forEach((doc) => {
               if ((id && id !== doc.id) || !id) {
                  canales.push({
                     id: doc.id,
                     nombre: doc.data().nombre,
                     thumbnail: doc.data().thumbnail,
                     video: doc.data().stream,
                     tipo: "canal"
                  })
               }
            });
         }

         const snapshotVideos = await db.collection("videos").orderBy("fecha", "desc").limit(10)
            .get();
         if (snapshotVideos.docs && snapshotVideos.docs.length) {
            snapshotVideos.docs.forEach((doc) => {
               if ((id && id !== doc.id) || !id) {
                  canales.push({
                     id: doc.id,
                     nombre: doc.data().nombre,
                     thumbnail: doc.data().thumbnail,
                     video: doc.data().video,
                     duration: doc.data().duration,
                     vistas: doc.data().vistas,
                     tipo: "video"
                  })
               }
            });
         }
      }
      else { // ES UNA CATEGORIA
         const snapshotCanales = await db.collection("canales")
            .where("categoria", "==", id.replace("cat-", ""))
            .where("activo", "==", true)
            .orderBy("orden", "asc")
            .get();

         if (snapshotCanales.docs && snapshotCanales.docs.length) {
            snapshotCanales.docs.forEach((doc) => {
               canales.push({
                  id: doc.id,
                  nombre: doc.data().nombre,
                  thumbnail: doc.data().thumbnail,
                  video: doc.data().stream,
                  tipo: "canal"
               })
            });
         }

         const snapshotVideos = await db.collection("videos")
            .where("categoria", "==", id.replace("cat-", ""))
            .orderBy("fecha", "desc")
            .limit(10)
            .get();
         if (snapshotVideos.docs && snapshotVideos.docs.length) {
            snapshotVideos.docs.forEach((doc) => {
               canales.push({
                  id: doc.id,
                  nombre: doc.data().nombre,
                  thumbnail: doc.data().thumbnail,
                  video: doc.data().video,
                  duration: doc.data().duration,
                  vistas: doc.data().vistas,
                  tipo: "video"
               })
            });
         }
      }

      dispatch({
         type: RELATED_VIDEO_SUCCESS,
         payload: canales,
      })
   } catch (error) {
      console.log(error)
      dispatch({
         type: RELATED_VIDEO_FAIL,
         payload: error,
      })
   }
}

export const getVideoById = id => async dispatch => {
   try {
      dispatch({
         type: SELECTED_VIDEO_REQUEST,
      })
      let data;
      let query;

      if (id) {
         if (!id.includes("cat-")) { // ESTOY VIENDO UN VIDEO O CANAL ESPECIFICO
            query = await
               db.collection("videos")
                  .doc(id)
                  .get();
            if (query && query.id && query.data()) { // ES UN VIDEO
               const doc = query.data();
               data = {
                  id: query.id,
                  nombre: doc.nombre,
                  stream: doc.video ? doc.video : null,
               }
               let sfDocRef = db.collection("videos").doc(id);

               db.runTransaction((transaction) => {
                  return transaction.get(sfDocRef).then((sfDoc) => {
                     if (sfDoc.exists) {
                        let newVistas = sfDoc.data().vistas ? sfDoc.data().vistas + 1 : 1;
                        transaction.update(sfDocRef, { vistas: newVistas });
                     }
                  });
               });
            }
            else {
               const canalRef = db.collection("canales").doc(id); // ES UN CANAL
               query = await
                  canalRef
                     .get();
               if (query && query.id && query.data() && query.data().activo) {
                  const doc = query.data();
                  data = {
                     id: query.id,
                     nombre: doc.nombre,
                     stream: doc.stream ? doc.stream : null,
                     cameraStream: doc.cameraStream ? doc.cameraStream : null,
                     password: doc.password ? doc.password : null,
                     radio: doc.radio,
                     tituloTransmision: doc.tituloTransmision
                  }
                  listenForChanges(canalRef, doc.cameraStream, doc.password)
               }
            }
         }
         else { //ESTOY VIENDO UNA CATEGORIA ESPECIFICA
            const snap = await
               db.collection("canales")
                  .where("categoria", "==", id.replace("cat-", ""))
                  .where("activo", "==", true)
                  .limit(1)
                  .get();

            if (snap.docs && snap.docs.length) {
               const doc = snap.docs[0].data();
               
               data = {
                  id: snap.docs[0].id,
                  nombre: doc.nombre,
                  stream: doc.stream ? doc.stream : null,
                  cameraStream: doc.cameraStream ? doc.cameraStream : null,
                  radio: doc.radio,
                  password: doc.password ? doc.password : null,
                  tituloTransmision: doc.tituloTransmision
               }
               listenForChanges(snap.docs[0].ref, doc.cameraStream, doc.password)
            }
            else { // NO SE ENCONTRO LA CATEGORIA, PONE CUALQUIER VIDEO PARA RELLENAR
               query = await
                  db.collection("videos")
                     .where("categoria", "==", id.replace("cat-", ""))
                     .orderBy("fecha", "desc")
                     .limit(1)
                     .get();
               if (query.docs && query.docs.length) {
                  const doc = query.docs[0].data();
                  
                  data = {
                     id: query.docs[0].id,
                     nombre: doc.nombre,
                     stream: doc.video ? doc.video : null
                  }
                  let sfDocRef = db.collection("videos").doc(query.docs[0].id);
                  db.runTransaction((transaction) => {
                     return transaction.get(sfDocRef).then((sfDoc) => {
                        if (sfDoc.exists) {
                           let newVistas = sfDoc.data().vistas ? sfDoc.data().vistas + 1 : 1;
                           transaction.update(sfDocRef, { vistas: newVistas });
                        }
                     });
                  });
               }
            }
         }
      }
      else { //VIENDO VIDEOS O CANALES EN GENERAL
         query = await
            db.collection("canales")
               .orderBy("orden", "asc")
               .limit(1)
               .get();
         if (query && query.docs && query.docs.length && query.docs[0].data()) {
            const doc = query.docs[0].data();
            
            
            data = {
               id: query.id,
               nombre: doc.nombre,
               stream: doc.stream ? doc.stream : null,
               cameraStream: doc.cameraStream ? doc.cameraStream : null,
               radio: doc.radio,
               tituloTransmision: doc.tituloTransmision
            }
            listenForChanges(query.docs[0].ref, doc.cameraStream)
         }
         else {
            query = await
               db.collection("videos")
                  .limit(1)
                  .get();
            if (query && query.docs && query.docs.length) {
               const doc = query.docs[0].data();
               data = {
                  id: query.id,
                  nombre: doc.nombre,
                  stream: doc.video ? doc.video : null
               }
            }
         }
      }
      dispatch({
         type: SELECTED_VIDEO_SUCCESS,
         payload: data,
      })
   } catch (error) {
      console.log(error.message)
      dispatch({
         type: SELECTED_VIDEO_FAIL,
         payload: error.message,
      })
   }
}

function listenForChanges(ref, cameraStream, password) {
   let initState = true;
   unsubscribe = ref.onSnapshot((docSnapshot) => {
      if (initState) {
         initState = false;
      } else {
         const newCameraStream = docSnapshot.data().cameraStream;
         if (newCameraStream !== cameraStream) {
            window.location.reload();
         }

         const newPassword = docSnapshot.data().password;
         if (newPassword !== password) {
            window.location.reload();
         }
      }
   });
}

export function stopListening(){
   unsubscribe();
   unsubscribe = null;
}