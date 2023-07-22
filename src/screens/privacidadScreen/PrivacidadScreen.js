import React from 'react'
import './privacidadScreen.scss'
import { Container } from 'react-bootstrap'
import Iubenda from 'react-iubenda-policy'

const PrivacidadScreen = () => {
   const myPolicy = 32260879;
   return (
      <Container style={{
         minHeight: "80vh"}}>
         <div className='row'>
            <div className="col">
            <Iubenda id={myPolicy} type='privacy' styling='white'>
               Haz click para abrir la Política de Privacidad
            </Iubenda>
            </div>
         </div>
      </Container>
   )


}

export default PrivacidadScreen