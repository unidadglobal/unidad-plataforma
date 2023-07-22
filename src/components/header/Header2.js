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
            src='/argentinaaprende.jpg'
            alt=''
            className='header__logo'
            onClick={() => {
               navigate(`/`)
            }}
            role="button"
         />

         
      </div>
   )
}

export default Header