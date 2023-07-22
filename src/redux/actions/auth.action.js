import swal from 'sweetalert';

import {
   LOAD_PROFILE,
   LOGIN_FAIL,
   LOGIN_REQUEST,
   LOGIN_SUCCESS,
   LOG_OUT,
   AUTH_CHECKING,
   AUTH_CHECKED,
   AUTH_FAILED,
   AUTH_DENIED,
   AUTH_AWAITING_APPROVAL,
   AUTH_SENDING_FORM
} from '../actionType'

import firebase from '../../firebase';


const db = firebase.firestore();

const storage = firebase.storage();

const auth = firebase.auth();

export const login = (loginType, args) => async dispatch => {
   try {
      dispatch({
         type: LOGIN_REQUEST,
      })

      if (loginType === "google") {
         const provider = new firebase.auth.GoogleAuthProvider()
         const res = await auth.signInWithPopup(provider)
         const accessToken = res.credential.accessToken

         const profile = {
            name: res.additionalUserInfo.profile.name,
            photoURL: res.additionalUserInfo.profile.picture,
            uid: res.user.uid
         }

         const doc = await db.collection("usuarios").doc(res.user.uid).get();
         if (!doc.exists) {
            await db.collection("usuarios").doc(res.user.uid).set({
               formulario: null,
               nombre: res.additionalUserInfo.profile.name,
               fecha_registro: new Date(),
               autorizado: false
            })
         }

         localStorage.setItem('ytc-access-token', accessToken)
         localStorage.setItem('ytc-user', JSON.stringify(profile))

         dispatch({
            type: LOGIN_SUCCESS,
            payload: accessToken,
         })
         dispatch({
            type: LOAD_PROFILE,
            payload: profile,
         })
      }
      else if (loginType === "email") {
         const res = await auth.signInWithEmailAndPassword(args.email.toLowerCase(), args.password);
         var accessToken = await res.user.getIdToken();

         var name = "Usuario";

         const doc = await db.collection("usuarios").doc(res.user.uid).get();
         if (!doc.exists) {
            await db.collection("usuarios").doc(res.user.uid).set({
               formulario: null,
               fecha_registro: new Date(),
               autorizado: false,
               email: args.email.toLowerCase()
            })
         }
         else {
            name = doc.data().nombre ? doc.data().nombre : "Usuario";
         }

         const profile = {
            name: name,
            photoURL: null,
            uid: res.user.uid
         }

         localStorage.setItem('ytc-access-token', accessToken)
         localStorage.setItem('ytc-user', JSON.stringify(profile))

         dispatch({
            type: LOGIN_SUCCESS,
            payload: accessToken,
         })
         dispatch({
            type: LOAD_PROFILE,
            payload: profile,
         })
      }

   } catch (error) {
      console.log(error.message)
      dispatch({
         type: LOGIN_FAIL,
         payload: error.code,
      })
   }
}

export const signUpWithEmailAndPassword = (email, password, nombre) => async dispatch => {
   try {
      dispatch({
         type: LOGIN_REQUEST,
      })

      const res = await auth.createUserWithEmailAndPassword(email.toLowerCase(), password);
      var accessToken = await res.user.getIdToken();

      const profile = {
         name: nombre,
         photoURL: null,
         uid: res.user.uid
      }

      await db.collection("usuarios").doc(res.user.uid).set({
         formulario: null,
         nombre: nombre,
         fecha_registro: new Date(),
         autorizado: false,
         email: email
      })

      localStorage.setItem('ytc-access-token', accessToken)
      localStorage.setItem('ytc-user', JSON.stringify(profile))

      dispatch({
         type: LOGIN_SUCCESS,
         payload: accessToken,
      })
      dispatch({
         type: LOAD_PROFILE,
         payload: profile,
      })
   } catch (error) {
      console.log(error.message)
      dispatch({
         type: LOGIN_FAIL,
         payload: error.code,
      })
   }
}

export const log_out = () => async dispatch => {
   await auth.signOut()
   dispatch({
      type: LOG_OUT,
   })

   localStorage.removeItem('ytc-access-token')
   localStorage.removeItem('ytc-user')
}

export const checkIfAuthorised = () => async (dispatch, getState) => {
   try {
      dispatch({
         type: AUTH_CHECKING,
      })

      const storedUser = localStorage.getItem('ytc-user')
      let user;
      if (storedUser && storedUser.length) {
         let arr = JSON.parse(storedUser);
         if (arr.uid) {
            user = arr.uid;
         }
      }

      const usuario = user ? user : auth.currentUser && auth.currentUser.uid ? auth.currentUser.uid : null;

      if (usuario) {
         const doc = await db.collection("usuarios")
            .doc(usuario)
            .get();
         if (doc.exists) {
            doc.data().formulario && doc.data().autorizado === true ?
               dispatch({
                  type: AUTH_CHECKED,
                  payload: {
                     autorizado: true,
                     loading: false
                  },
               })
               :
               doc.data().formulario && doc.data().autorizado !== true ?
                  dispatch({
                     type: AUTH_AWAITING_APPROVAL,
                     payload: {
                        autorizado: false,
                        esperando_aprobacion: true,
                        loading: false
                     },
                  })
                  :
                  dispatch({
                     type: AUTH_DENIED,
                     payload: {
                        autorizado: false,
                        loading: false
                     },
                  })
         }
         else {
            dispatch({
               type: AUTH_DENIED,
               payload: {
                  autorizado: false,
                  loading: false
               },
            })
         }
      }
      else {
         log_out()
      }
   } catch (error) {
      console.log(error)
      dispatch({
         type: AUTH_FAILED,
         loading: false,
         payload: error,
      })
   }
}

export const sendForm = (form) => async dispatch => {
   try {
      dispatch({
         type: AUTH_SENDING_FORM,
         payload: {
            loading: true
         }
      })

      const usuario = auth.currentUser.uid;

      if (form) {
         const { nombre, nacimiento, nacionalidad, documento, whatsapp, nombrecanal, tipocontenido, descripcion, logo, firma } = form;
         const ref = storage.ref(`/img_formularios/${usuario}`);
         const uploadTask = ref.put(logo.file);
         uploadTask.on("state_changed", console.log, console.error, () => {
            ref
               .getDownloadURL()
               .then((url) => {
                  db.collection("usuarios").doc(usuario).update({
                     formulario: {
                        nombre: nombre.toUpperCase(),
                        fecha_nacimiento: nacimiento,
                        nacionalidad: nacionalidad.toUpperCase(),
                        documento: documento,
                        whatsapp: whatsapp,
                        canal_nombre: nombrecanal.toUpperCase(),
                        canal_contenido: tipocontenido.toUpperCase(),
                        canal_descripcion: descripcion.toUpperCase(),
                        canal_imagen: url,
                        estado: 0,
                        fecha: new Date(),
                        firma: firma
                     }
                  }).then(() => {
                     dispatch({
                        type: AUTH_AWAITING_APPROVAL,
                        payload: {
                           autorizado: false,
                           esperando_aprobacion: true,
                           loading: false
                        },
                     })
                  }).catch((error) => {
                     console.log(error)
                     dispatch({
                        type: AUTH_DENIED,
                        payload: {
                           autorizado: false,
                           loading: false
                        },
                     })
                  })
               });
         });
      }
   } catch (error) {
      dispatch({
         type: AUTH_DENIED,
         payload: {
            autorizado: false,
            loading: false
         },
      })
   }
}

export const passwordRecovery = (email) => async dispatch => {
   auth.languageCode = 'es';
   auth.sendPasswordResetEmail(email).then(function () {
      // Email sent.
      swal("Te enviamos un e-mail para reestablecer tu contraseña", "Ingresá a tu correo " + email, "success");
   }).catch(function (error) {
      console.log(error.message)
   });
}
