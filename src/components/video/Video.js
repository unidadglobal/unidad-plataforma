import React from 'react'
import './_video.scss'

import { AiFillEye } from 'react-icons/ai'

import numeral from 'numeral'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useNavigate } from 'react-router-dom'
const Video = ({ video }) => {
   const {
      id,
      nombre, 
      thumbnail,
      duration,
      vistas,
      tipo
   } = video

   const navigate = useNavigate()

   const handleVideoClick = () => {
      navigate(`/watch/${id}`)
   }

   return (
      <div className='video' onClick={handleVideoClick}>
         <div className='video__top'>
            <LazyLoadImage src={thumbnail ? thumbnail : "/logoBN.jpg"} effect='blur' style={{width: "100%", height:"180px"}} />
            {
               tipo === "video" && duration ?
                  <span className='video__top__duration video__top__video'>{duration}</span> : 
               tipo === "canal" ?
                  <span className='video__top__duration video__top__live text-light'>VIVO</span> : <span></span>
            }
         </div>
         <div className='video__title'>{nombre}</div>
         
         {vistas ? <div className='video__details'>
            <span>
               <AiFillEye /> {numeral(vistas ? vistas : 0).format('0.a')} {duration ? "Vistas" : "Viendo"} 
            </span>
         </div> : ""
         }
         <div className='video__channel'>
            <p>Unidad Global</p>
         </div>
      </div>
   )
}

export default Video