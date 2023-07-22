import React, { useEffect } from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideoHorizontal from '../../components/videoHorizontal/VideoHorizontal'
import Cards from '../../components/card/Cards'
import Chat from '../../components/chat/Chat'
import BannersPublicidad from '../../components/bannersPublicidad/BannersPublicidad'
import FormPassword from '../../forms/FormPassword';

import {
   getRelatedVideos,
   getVideoById,
} from '../../redux/actions/videos.action'
import {
   getCategorias
} from '../../redux/actions/noticias.action'
import {
   getRadioStreaming
} from '../../redux/actions/radio.action'
import {
   getBanners
} from '../../redux/actions/publicidad.action'

import './watchScreen.scss'
import 'video.js/dist/video-js.css';
import VideoPlayer from '../../components/video-js/videoplayer';
import WebcamPlayer from '../../components/webcamPlayer/WebcamPlayer'

const WatchScreen = () => {
   

   const { id } = useParams()
   const dispatch = useDispatch()

   useEffect(() => {
      dispatch(getVideoById(id))
      dispatch(getRadioStreaming())
      dispatch(getRelatedVideos(id))
      dispatch(getBanners())
      dispatch(getCategorias())
   }, [dispatch, id])

   const { videos } = useSelector(
      state => state.relatedVideos
   )

   const { status } = useSelector(
      state => state.channelPassword
   )

   const { video, loading } = useSelector(state => state.selectedVideo)

   const { categorias, loading: noticiasLoading } = useSelector(
      state => state.noticias
   )

   const { publicidad } = useSelector(
      state => state.publicidad
   )

   const { radio } = useSelector(
      state => state.radio
   )

   let source = "";
   let tipo = "";
   if (video) {
      if (video.video && !video.stream) {
         source = video.video;
         tipo = "video/mp4";
      }
      else if (video.stream && !video.video) {
         source = video.stream;
         tipo = 'application/x-mpegURL';
      }
   }

   const videoJsOptions = {
      autoplay: true,
      controls: true,
      sources: [{
         src: source,
         type: tipo
      }],
      responsive: true,
      muted: true
   }

   return (
      <Container style={{
         minHeight: "80vh"
      }}>
         <Row>
            <Col lg={8}>
               {
                  !video || (!video.stream && !video.video && !video.cameraStream) ?
                     <div className='watchScreen__player'>
                        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                           {
                              loading ? <img alt="" style={{ width: "100%", height: "100%" }} src={"/loading.jpg"}></img> :
                                 <div className="container">
                                    <div className="row mt-2">
                                       <div className="col text-center">
                                          <h6>CONTENIDO NO DISPONIBLE</h6>
                                       </div>
                                    </div>
                                 </div>
                           }
                        </div>
                     </div>
                     :
                     video.password && status !== "success" ? <FormPassword channelID={video.id} /> :
                        video.cameraStream ?
                        <>
                        <WebcamPlayer broadcastId={video.cameraStream}/>
                        <h5 className='mt-2'>{video.tituloTransmision && video.tituloTransmision.length ? video.tituloTransmision : "Transmisión en Vivo"}</h5>
                        </>
                           
                           :
                           <>
                              <VideoPlayer {...videoJsOptions} muted="true" />
                              
                           </>
                           
               }
               {
                  publicidad ? <BannersPublicidad banners={publicidad} /> : <></>
               }
               {
                  <Row className="mb-3 mt-3 d-block d-md-none">
                     <Col>
                        <RelatedChannels loading={loading} video={video} videos={videos} />
                     </Col>
                  </Row>
               }
               {
                  (video && video.radio === 0 && radio && radio.stream && radio.activa) || (video && video.radio && video.radio.toString().includes("http"))
                     ?
                     <>
                        <div className="container container-radio">
                           <div className="row">
                              <div className="col text-center">
                                 <h3 className="mt-3 mb-4 text-light">RADIO</h3>
                              </div>
                           </div>
                           <iframe title="Radio Streaming" src={video.radio === 0 ? radio.stream : video.radio} frameBorder="0" width="100%" height="70"></iframe>
                        </div>
                     </>
                     :
                     <></>
               }

               {noticiasLoading ?
                  <SkeletonTheme color='#343a40' highlightColor='#3c4147'>
                     <Skeleton width='100%' height='130px' count={1} />
                  </SkeletonTheme>
                  :
                  <Cards categorias={categorias} />
               }
            </Col>
            <Col lg={4} className="mb-5 d-none d-md-block">
               <RelatedChannels loading={loading} video={video} videos={videos} />
            </Col>
         </Row>
      </Container>
   )
}

export default WatchScreen

function RelatedChannels({ loading, video, videos }) {
   return (
      !loading ? (
         video && (video.cameraStream || video.stream) ?
            <>
               <Row>
                  <Col>
                     <Chat />
                  </Col>
               </Row>
               <Row><Col>{
                  videos
                     ?.filter(video => video.nombre)
                     .map(video => (
                        <VideoHorizontal video={video} key={video.id} />
                     ))
               }</Col>
               </Row>
            </>
            :

            <>
               <Row><Col>{
                  videos
                     ?.filter(video => video.nombre)
                     .map(video => (
                        <VideoHorizontal video={video} key={video.id} />
                     ))
               }
               </Col>
               </Row>
            </>
      ) : (
         <SkeletonTheme color='#343a40' highlightColor='#3c4147'>
            <Skeleton width='100%' height='130px' count={10} />
         </SkeletonTheme>
      )
   )
}