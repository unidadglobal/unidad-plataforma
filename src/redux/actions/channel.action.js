
import swal from 'sweetalert';
import {
   CHANNELPASSWORD_FAIL,
   CHANNELPASSWORD_REQUEST,
   CHANNELPASSWORD_SUCCESS,
} from '../actionType'


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const db = firebase.firestore();

export const checkChannelPassword = (password, channelID) => async dispatch => {
   try {
      dispatch({
         type: CHANNELPASSWORD_REQUEST,
      })

      const doc = await db.collection("canales").doc(channelID).get();
      if (doc.exists && (doc.data().password === password)) {
         localStorage.setItem('ytc-password', password)   
         
         dispatch({
            type: CHANNELPASSWORD_SUCCESS,
            payload: password,
         })
      }
      else{
         dispatch({
            type: CHANNELPASSWORD_FAIL,
            payload: "incorrect-pass",
         })
         swal("La contraseña es incorrecta!", "", "error");
      }

   } catch (error) {
      console.log(error.message)
      dispatch({
         type: CHANNELPASSWORD_FAIL,
         payload: error.code,
      })
   }
}
