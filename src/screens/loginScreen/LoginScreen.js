import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './loginScreen.scss'
import LoginBox from '../../components/loginBox/LoginBox'

const LoginScreen = () => {
   const navigate = useNavigate()
   const {accessToken} = useSelector(state => state.auth)
   
   useEffect(() => {
      if (accessToken) {
         navigate('/')
      }
   }, [accessToken, navigate])
   
   return (
      <LoginBox/>
   )
}

export default LoginScreen
