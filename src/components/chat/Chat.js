import React, { useRef, useState, useEffect } from 'react';
import './Chat.css';
import { useSelector } from 'react-redux'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { IoSend } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'
import moment from 'moment';

const auth = firebase.auth();
const firestore = firebase.firestore();

function Chat() {
  const { user } = useSelector(state => state.auth)
  const { video } = useSelector(state => state.selectedVideo)
  //CHAT STATUS -> 0 = VISIBLE PERO NO SE PUED ESCRIBIR | 1 = HABILITADO Y VVISIBLE | -1 = OCULTO
  const [chatStatus, setChatStatus] = useState(1);
  const [banned, setBanned] = useState(false);

  const { status } = useSelector(
    state => state.channelPassword
  )

  const checkIfEnabled = async () => {
    if (video && video.id) {
      firestore.collection("canales")
        .doc(video.id)
        .onSnapshot((snapshot) => {
          if (snapshot.data() && snapshot.data().chatStatus !== undefined && snapshot.data().chatStatus !== null) {
            setChatStatus(snapshot.data().chatStatus)
          }
          else {
            setChatStatus(1)
          }
        })
      if (auth.currentUser && auth.currentUser.uid) {
        firestore.collection("canales")
          .doc(video.id)
          .collection("banned")
          .doc(auth.currentUser.uid)
          .onSnapshot((snapshot) => {
            if (snapshot.exists) {
              setBanned(true)
            }
            else {
              setBanned(false)
            }
          })
      }
    }
  }
  useEffect(() => {
    checkIfEnabled();
  })


  if (video && video.password && status !== "success") {
    return null;
  }
  else {
    return chatStatus !== -1 ? (
      <div className="Chat mb-3">
        <section>
          {!user ? <SignIn /> : (video && user && !video.password) || (video && user && video.password && status === "success") ? <ChatRoom status={chatStatus} /> : banned ? <Banned /> : null}
        </section>
      </div>
    ) : null;
  }

}

function SignIn() {
  const navigate = useNavigate()
  const handleLogin = () => {
    navigate(`/login`)
  }

  return (
    <>
      <button className="sign-in" onClick={handleLogin}>INICIAR SESIÓN</button>
      <p>Para ver el Chat, debes Iniciar Sesión</p>
    </>
  )
}

function Banned() {
  return (
    <>
      <p>Fuiste bloqueado del Chat</p>
    </>
  )
}

function ChatRoom({ status }) {
  const { video } = useSelector(state => state.selectedVideo)

  const [messages, setMessages] = useState([]);
  const [myMessages, setMyMessages] = useState([]);

  const fetchMessages = async () => {
    if (video && video.id) {
      firestore.collection("canales")
        .doc(video.id)
        .collection("messages")
        .orderBy('createdAt').limit(50)
        .onSnapshot((snapshot) => {
          let updatedData = snapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } })
          setMessages(updatedData)
          var target = document.getElementById("main");
          if (target && target.scrollTop > (target.scrollTop - (target.scrollHeight * 0.7))) {
            target.scrollTo(0, target.scrollHeight - target.clientHeight)
          }
        })
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [])

  const dummy = useRef();
  const messagesRef = firestore.collection("canales").doc(video.id).collection('messages');
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!video || !video.id) {
      return;
    }

    var puede = true;
    if (myMessages.length >= 5) {
      var d1 = new Date(parseInt(myMessages[0]));
      var d2 = new Date(parseInt(myMessages[4]));

      var a = moment(d1);
      if (a.diff(d2, 'seconds') < 10) {
        puede = false;
        alert("Esperá 10 segundos para volver a escribir")
        setTimeout(() => {
          if (myMessages.length === 5) {
            setMyMessages([])
            puede = true;
          }
        }, 10000);
      }
    }
    if (puede) {
      const { uid, photoURL, displayName } = auth.currentUser;
      var nombre;
      if (!displayName) {
        const storedUser = localStorage.getItem('ytc-user')
        if (storedUser && storedUser.length) {
          let arr = JSON.parse(storedUser);
          if (arr.name) {
            nombre = arr.name;
          }
        }
      }
      else {
        nombre = displayName;
      }

      const d3 = new Date();
      setMyMessages(msg => [...msg, d3.getTime()])

      let text = formValue;
      setFormValue('');

      await messagesRef.doc().set({
        text: text.length < 140 ? text : text.substring(0, 139),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: uid,
        nombre: nombre,
        photoURL: photoURL
      })

      var target = document.getElementById("main");
      if (target && target.scrollTop > (target.scrollTop - (target.scrollHeight * 0.7))) {
        target.scrollTo(0, target.scrollHeight - target.clientHeight)
      }
    }
  }

  return (<>
    <div className="chat-container">
      <div id="main">
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </div>
      {
        status === 1 ?
          <form onSubmit={sendMessage}>
            <input value={formValue} maxLength="140" onChange={(e) => setFormValue(e.target.value)} placeholder="Escribí un mensaje..." />
            <button type="submit" disabled={!formValue}><IoSend size={23}></IoSend></button>
          </form>
          :
          <></>
      }
    </div>
  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL, nombre, esAdmin } = props.message;
  const messageClass = esAdmin ? "esadmin" : uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img alt="avatar" src={photoURL || '/nophoto.png'} />
      <div className="msg-wrapper">
        {uid !== auth.currentUser.uid ?
          <span className="user-name"> {nombre && nombre.length <= 15 ? nombre : nombre && nombre.length > 15 ? nombre.substring(0, 15) : "Usuario"}</span> : null}
        <p>{text}</p>
      </div>
    </div>
  </>)
}

export default Chat;