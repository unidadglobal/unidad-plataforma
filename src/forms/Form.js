import React from 'react';
import './Form.css';
import FormChannel from './FormChannel';
import FormSuccess from './FormSuccess';
import FormGoToPanel from './FormGoToPanel';
import { useSelector } from 'react-redux'
const Form = () => {
  
  const estado = useSelector(state => state.auth)
  const {autorizado } = useSelector(state => state.auth)
  
  return (
    <>
      <div className='form-container'>
        {!autorizado && !estado.esperando_aprobacion ? (
          <FormChannel/> //RELLENAR FORMULARIO - NO ESTA REGISTRADO
        ) :
        estado.esperando_aprobacion ?
         (
          <FormSuccess /> //YA ENVIÓ EL FORMULARIO - ESPERANDO APROBACIÓN
         )
        :
        <FormGoToPanel />
        }
      </div>
    </>
  );
};

export default Form;