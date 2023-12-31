import React, { useEffect, useLayoutEffect } from 'react'
import RTCMultiConnection from 'rtcmulticonnection-react-js';
import {
   stopListening
} from '../../redux/actions/videos.action'

const WebcamPlayer = ({ broadcastId }) => {
    var connection = new RTCMultiConnection();

    useLayoutEffect(() => {
        return () => {
           
            connection.closeSocket()
            connection = null;
            stopListening();
        }
    }, [])


    useEffect(() => {
        var video2 = document.getElementById('stream-player');
        if (video2 && broadcastId) {
           connection.iceServers = [{
              'urls': [
                 'stun:stun.l.google.com:19302',
                 'stun:stun1.l.google.com:19302',
                 'stun:stun2.l.google.com:19302',
                 'stun:stun.l.google.com:19302?transport=udp',
              ]
           }];
  
           // its mandatory in v3
           connection.enableScalableBroadcast = true;
  
           // each relaying-user should serve only 1 users
           connection.maxRelayLimitPerUser = 1;
  
           // we don't need to keep room-opened
           // scalable-broadcast.js will handle stuff itself.
           connection.autoCloseEntireSession = true;
  
           // by default, socket.io server is assumed to be deployed on your own URL
           connection.socketURL = 'https://panel.unidadglobal.com:9001/';
  
           // comment-out below line if you do not have your own socket.io server
           //connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
  
           connection.socketMessageEvent = 'scalable-media-broadcast-demo';
  
           // document.getElementById('broadcast-id').value = connection.userid;
  
           // user need to connect server, so that others can reach him.
           connection.connectSocket(function (socket) {
              socket.on('logs', function (log) {
                 console.log(log)
              });
  
              // this event is emitted when a broadcast is already created.
              socket.on('join-broadcaster', function (hintsToJoinBroadcast) {
                 console.log('join-broadcaster', hintsToJoinBroadcast);
                 connection.session = hintsToJoinBroadcast.typeOfStreams;
                 connection.sdpConstraints.mandatory = {
                    OfferToReceiveVideo: !!connection.session.video,
                    OfferToReceiveAudio: !!connection.session.audio
                 };
                 connection.broadcastId = hintsToJoinBroadcast.broadcastId;
                 connection.join(hintsToJoinBroadcast.userid);
              });
  
              socket.on('rejoin-broadcast', function (broadcastId) {
                 console.log('rejoin-broadcast', broadcastId);
  
                 connection.attachStreams = [];
                 socket.emit('check-broadcast-presence', broadcastId, function (isBroadcastExists) {
                    if (!isBroadcastExists) {
                       // the first person (i.e. real-broadcaster) MUST set his user-id
                       connection.userid = broadcastId;
                    }
  
                    socket.emit('join-broadcast', {
                       broadcastId: broadcastId,
                       userid: connection.userid,
                       typeOfStreams: connection.session
                    });
                 });
              });
  
              socket.on('broadcast-stopped', function (broadcastId) {
                 console.error('broadcast-stopped', broadcastId);
              });
  
            //   // this event is emitted when a broadcast is absent.
            //   socket.on('start-broadcasting', function (typeOfStreams) {
            //      console.log('start-broadcasting', typeOfStreams);
  
            //      // host i.e. sender should always use this!
            //      connection.sdpConstraints.mandatory = {
            //         OfferToReceiveVideo: false,
            //         OfferToReceiveAudio: false
            //      };
            //      connection.session = typeOfStreams;
  
            //      // "open" method here will capture media-stream
            //      // we can skip this function always; it is totally optional here.
            //      // we can use "connection.getUserMediaHandler" instead
            //      //connection.open(connection.userid);
            //   });
           });
  
           var videoPreview = document.getElementById('stream-player');
  
           connection.onstream = function (event) {
              if (connection.isInitiator && event.type !== 'local') {
                 return;
              }
  
              connection.isUpperUserLeft = false;
              videoPreview.srcObject = event.stream;
              videoPreview.play();
  
              videoPreview.userid = event.userid;
  
              if (event.type === 'local') {
                 videoPreview.muted = true;
              }
  
              if (connection.isInitiator === false && event.type === 'remote') {
                 // he is merely relaying the media
                 connection.dontCaptureUserMedia = true;
                 connection.attachStreams = [event.stream];
                 connection.sdpConstraints.mandatory = {
                    OfferToReceiveAudio: false,
                    OfferToReceiveVideo: false
                 };
  
                 connection.getSocket(function (socket) {
                    socket.emit('can-relay-broadcast');
  
                    if (connection.DetectRTC.browser.name === 'Chrome') {
                       connection.getAllParticipants().forEach(function (p) {
                          if (p + '' !== event.userid + '') {
                             var peer = connection.peers[p].peer;
                             peer.getLocalStreams().forEach(function (localStream) {
                                peer.removeStream(localStream);
                             });
                             event.stream.getTracks().forEach(function (track) {
                                peer.addTrack(track, event.stream);
                             });
                             connection.dontAttachStream = true;
                             connection.renegotiate(p);
                             connection.dontAttachStream = false;
                          }
                       });
                    }
  
                    if (connection.DetectRTC.browser.name === 'Firefox') {
                       // Firefox is NOT supporting removeStream method
                       // that's why using alternative hack.
                       // NOTE: Firefox seems unable to replace-tracks of the remote-media-stream
                       // need to ask all deeper nodes to rejoin
                       connection.getAllParticipants().forEach(function (p) {
                          if (p + '' !== event.userid + '') {
                             connection.replaceTrack(event.stream, p);
                          }
                       });
                    }
  
                    // Firefox seems UN_ABLE to record remote MediaStream
                    // WebAudio solution merely records audio
                    // so recording is skipped for Firefox.
  
                 });
              }
           };
  
           connection.onstreamended = function () { };
  
           connection.onleave = function (event) {
              if (event.userid !== videoPreview.userid) return;
  
              connection.getSocket(function (socket) {
                 socket.emit('can-not-relay-broadcast');
  
                 connection.isUpperUserLeft = true;
  
               //   if (connection.currentRecorder) {
               //      var recorder = connection.currentRecorder;
               //      connection.currentRecorder = null;
               //      recorder.stopRecording(function () {
               //         if (!connection.isUpperUserLeft) return;
  
               //         videoPreview.src = URL.createObjectURL(recorder.getBlob());
               //         videoPreview.play();
               //      });
               //   }
  
               //   if (connection.currentRecorder) {
               //      connection.currentRecorder.stopRecording();
               //      connection.currentRecorder = null;
               //   }
              });
           };
           
           connection.extra.broadcastId = broadcastId;
  
         //   connection.session = {
         //      audio: true,
         //      video: true,
         //      oneway: true
         //   };
  
           connection.getSocket(function (socket) {
              socket.emit('check-broadcast-presence', broadcastId, function (isBroadcastExists) {
                 if (!isBroadcastExists) {
                    // the first person (i.e. real-broadcaster) MUST set his user-id
                    connection.userid = broadcastId;
                 }
  
                 console.log('check-broadcast-presence', broadcastId, isBroadcastExists);
  
               //   socket.emit('join-broadcast', {
               //      broadcastId: broadcastId,
               //      userid: connection.userid,
               //      typeOfStreams: connection.session
               //   });
              });
           });
        }
     }, []);

   return (
        <video id="stream-player" autoPlay="true" muted="true" style={{maxHeight: "80vh", background: "#000"}} controls loop>
        </video>
   )
}

export default WebcamPlayer