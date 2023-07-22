import React from 'react';
import './Form.css';
import { FaCheckCircle } from 'react-icons/fa'
import { Container, Row, Col } from 'react-bootstrap'
const FormGoToPanel = () => {
  return (
    <div className='form-gotopanel d-flex justify-content-center pt-5 pb-5'>
      <Container style={{"height":"100%"}}>
      <Row className="mt-5">
        <Col className="text-center text-light">
          <FaCheckCircle size={80}/>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <h3 className='form-success'>¡Tu Registro fue Aprobado!</h3>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <h4 className='form-success2'>Ya podés empezar a Crear Contenido.</h4>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col className="text-center">
          <button className="btn btn-primary font-weight-bold"
          onClick={()=> 
            { 
              window.open("https://unidadglobal.com.ar", "_blank")
            }
         }
          >IR AL PANEL DE CONTROL</button>
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default FormGoToPanel;