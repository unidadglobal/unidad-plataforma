import React from 'react';
import './Form.css';
import { FaRegClock } from 'react-icons/fa'
import { Container, Row, Col } from 'react-bootstrap'
const FormSuccess = () => {
  return (
    <div className='form-awaiting d-flex justify-content-center pt-5 pb-5'>
      <Container style={{"height":"100%"}}>
      <Row className="mt-5">
        <Col className="text-center text-light">
          <FaRegClock size={80}/>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <h3 className='form-success'>Recibimos tu Formulario!</h3>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <h4 className='form-success2'>Te avisaremos cuando estés listo/a para Crear Contenido.</h4>
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default FormSuccess;