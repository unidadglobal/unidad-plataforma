import React, { useState } from 'react'
import './_header.scss'
import { FaBars } from 'react-icons/fa'
import { AiOutlineSearch } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import {
   searchVideos
} from '../../redux/actions/search.action'
import { useDispatch } from 'react-redux'

const Header = ({ handleToggleSidebar }) => {
   const navigate = useNavigate()
   const [text, setText] = useState('')
   const dispatch = useDispatch()

   return (
      <div className='header'>
         <FaBars
            className='header__menu'
            size={26}
            onClick={() => handleToggleSidebar()}
         />

         <img
            src='/logo.jpg'
            alt=''
            className='header__logo'
            onClick={() => {
               navigate(`/`)
            }}
            role="button"
         />

         <h5 className="font-weight-bold header__title d-none d-md-block">RED GLOBAL DE COMUNICADORES</h5>

         <form>
            <input type='text' id="input-search" style={{
               paddingLeft: "20px"
            }} placeholder='Buscar'
               value={text}
               onChange={e => setText(e.target.value)}
            />
            <button onClick={(e) => {
               e.preventDefault()
               if (text.trim().length) {
                  navigate({
                     pathname: "/buscar",
                  });
                  dispatch(searchVideos(text))
               }
            }}>
               <AiOutlineSearch size={22} />
            </button>
         </form>
      </div>
   )
}

export default Header