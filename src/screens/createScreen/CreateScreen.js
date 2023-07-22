import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
   checkIfAuthorised
} from '../../redux/actions/auth.action'
import './createScreen.scss'
import Form from '../../forms/Form'
import LoginBox from '../../components/loginBox/LoginBox'

const CreateScreen = () => {
   const dispatch = useDispatch()
   useEffect(() => {
      dispatch(checkIfAuthorised())
   }, [dispatch])

   
   const {accessToken, loading} = useSelector(state => state.auth)
   return (
      <>{
      !accessToken ?
      <LoginBox/>
      :
      loading ?
      <Container className="h-100 d-flex align-items-center justify-content-center">
         <div className='spinner-border text-danger d-block mx-auto'></div>
      </Container>
      :
      <Form/>
      }
      </>
      
      
   )

   
}

export default CreateScreen

