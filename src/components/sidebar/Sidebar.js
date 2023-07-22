import React, { useEffect } from 'react'
import './_sidebar.scss'
import { useNavigate } from 'react-router-dom'

import {
   MdSubscriptions,
   MdThumbUp,
   MdHome,
} from 'react-icons/md'

import {
   AiFillInstagram
} from 'react-icons/ai'

import { FaSmile, FaFacebook, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux'
import { log_out } from '../../redux/actions/auth.action'
import { getWebInfo } from '../../redux/actions/webinfo.action'

const Sidebar = ({ sidebar, handleToggleSidebar }) => {
   const navigate = useNavigate()
   
   const dispatch = useDispatch()
   const { accessToken } = useSelector(state => state.auth)

   useEffect(() => {
      dispatch(getWebInfo())
   }, [dispatch])

   const { webinfo } = useSelector(
      state => state.webinfo
   )

   const logOutHandler = () => {
      dispatch(log_out())
   }

   const handleLogin = () => {
      navigate(`/login`)
      //dispatch(login())
   }

   return (
      <nav
         className={sidebar ? 'sidebar open' : 'sidebar'}
         onClick={() => handleToggleSidebar(false)}>
         <li onClick={() => {
            navigate(`/`)
         }}>
            <MdHome size={23} />
            <span>Inicio</span>
         </li>
         <li onClick={() => {
            navigate(`/crear`)
         }}>
            <MdSubscriptions size={23} />
            <span>Creá Contenido</span>
         </li>

         <li>
            <MdThumbUp size={23} />
            <span>Favoritos</span>
         </li>

         <li onClick={()=> 
            { 
               if (webinfo && webinfo.instagram){
                  window.open(webinfo.instagram, "_blank")
               }
            }
         }>
            <AiFillInstagram size={25}/>
            <span>Instagram</span>
         </li>

         <li onClick={()=> 
            { 
               if (webinfo && webinfo.facebook){
                  window.open(webinfo.facebook, "_blank")
               }
            }
         }>
            <FaFacebook size={23} />
            <span>Facebook</span>
         </li>
         <li onClick={()=> 
            { 
               if (webinfo && webinfo.donaciones){
                  window.open(webinfo.donaciones, "_blank")
               }
            }
         }>
            <FaSmile size={23} />
            <span>Donaciones</span>
         </li>

         <hr />

         {
            !accessToken ?
            <li onClick={handleLogin}>
            <FaSignInAlt size={23} />
            <span>Iniciar Sesión</span>
            </li>
            :
            <li onClick={logOutHandler}>
            <FaSignOutAlt size={23} />
            <span>Cerrar Sesión</span>
            </li>
         }

         <hr />
      </nav>
   )
}

export default Sidebar
