import React, { useEffect } from 'react'
import validate from './validateInfoLogin';
import useForm from './useFormLogin';
import './Form.css';

import "react-datepicker/dist/react-datepicker.css";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Button, Col, Row } from 'react-bootstrap'


const FormLogin = ({ submitForm }) => {
  useEffect(() => {
    document.getElementById("formEmail").focus();
  }, []); // <-- empty array means 'run onc

  const { handleChange, handleSubmit, values, errors, loginError, handlePasswordRecovery } = useForm(
    submitForm,
    validate
  );
  
  return (
    <Container className="form-login">
      <Row>
        <Col>
        <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label className="label">E-Mail</Form.Label>
          <Form.Control
            type="text"
            name="email"
            maxLength="50"
            placeholder='Ingresá tu E-Mail'
            value={values.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className='form-inputs'>{errors.email}</p>}
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label className="label">Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            maxLength="50"
            placeholder='Ingresá tu Contraseña'
            value={values.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className='form-inputs'>{errors.password}</p>}
        </Form.Group>
      </Form>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          {loginError && <p className='form-inputs'>{loginError}</p>}
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button variant="primary" className="btn-submit" onClick={handleSubmit}>INGRESAR</Button>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <a href="#" onClick={handlePasswordRecovery}><h6>¿Olvidaste tu Contraseña?</h6></a>
        </Col>
      </Row>
    </Container>
  )
};

export default FormLogin;
